/**
 * SOAP/XML helpers for the Smartschool Webservices V3 API.
 *
 * The Smartschool API is a SOAP service that embeds JSON, plain values or
 * base64-encoded payloads inside its envelopes. These helpers build the
 * request envelopes and parse the responses without requiring a DOM or an
 * XML parser dependency, keeping the client runtime agnostic (Deno, Node,
 * browsers).
 *
 * @module
 */

/** Escapes the five predefined XML entities in a string value. */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

/**
 * Decodes the most common XML/HTML entities to plain text.
 * `&amp;` is decoded last so double-encoded entities survive correctly.
 */
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(
      /&#(\d+);/g,
      (_, code: string) => String.fromCharCode(parseInt(code, 10)),
    )
    .replace(/&amp;/g, "&")
    .replace(/<br\s*\/?>/gi, "\n");
}

/** Builds the SOAP envelope for an API method call. */
export function generateXML(
  methodName: string,
  params: Record<string, unknown>,
): string {
  const xmlParts: string[] = [];
  xmlParts.push('<?xml version="1.0" encoding="utf-8"?>');
  xmlParts.push(
    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tns="https://example.smartschool.be/Webservices/V3">',
  );
  xmlParts.push("  <soap:Body>");
  xmlParts.push(`    <tns:${methodName}>`);

  // Add parameters
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      let stringValue = typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
      stringValue = escapeXml(stringValue);
      xmlParts.push(`      <${key}>${stringValue}</${key}>`);
    }
  }

  xmlParts.push(`    </tns:${methodName}>`);
  xmlParts.push("  </soap:Body>");
  xmlParts.push("</soap:Envelope>");

  return xmlParts.join("\n");
}

/**
 * Extracts the first balanced JSON object or array from `text`.
 *
 * Unlike a naive regex, this tracks string literals and bracket depth, so
 * nested structures (e.g. `{"items": [1, 2]}`) are not truncated at the
 * first closing bracket. Returns the matched slice, or null if no balanced
 * JSON value is present.
 */
function extractBalancedJson(text: string): string | null {
  const start = text.search(/[{[]/);
  if (start === -1) return null;
  const open = text[start] as string;
  const close = open === "{" ? "}" : "]";

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i] as string;
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === open) {
      depth++;
    } else if (ch === close) {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }
  return null;
}

/** Attempts `JSON.parse`, returning a discriminated result instead of throwing. */
function tryParseJson(text: string): { ok: boolean; value?: unknown } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false };
  }
}

/**
 * Decodes `text` as base64 only when it is unambiguously a base64 payload
 * wrapping XML or JSON markup (as returned by e.g. `getAllAccounts`).
 *
 * Plain alphanumeric strings that merely fit the base64 alphabet ("OK",
 * "12345678", access tokens) are left alone and null is returned.
 */
function tryDecodeBase64Markup(text: string): string | null {
  const compact = text.replace(/\s+/g, "");
  if (compact.length < 8 || compact.length % 4 !== 0) return null;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(compact)) return null;
  try {
    const decoded = atob(compact);
    // Only treat it as an encoded envelope when the decoded bytes look like markup.
    if (!/[<{\[]/.test(decoded)) return null;
    return decoded;
  } catch {
    return null;
  }
}

/** Strips a wrapping `<![CDATA[ ... ]]>` section, if present. */
function stripCdata(value: string): string {
  return value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

/** Parses a scalar tag value: JSON primitives stay typed, text is entity-decoded. */
function parseScalarValue(value: string): unknown {
  const parsed = tryParseJson(value);
  if (parsed.ok) {
    return parsed.value;
  }
  return decodeHtmlEntities(value);
}

// Optional namespace prefix on both opening and closing tag, kept consistent
// through a backreference (e.g. <SOAP-ENV:Body>...</SOAP-ENV:Body>).
const SOAP_BODY_RE = /<([\w.-]*:)?Body[^>]*>([\s\S]*?)<\/\1Body>/i;
const RETURN_TAG_RE = /<([\w.-]*:)?return[^>]*>([\s\S]*?)<\/\1return>/i;

interface ParseOutcome {
  matched: boolean;
  value?: unknown;
}

/**
 * Parses a SOAP/JSON/base64 response body.
 *
 * Strategies, in order:
 *  1. JSON embedded inside the SOAP Body (extracted with bracket balancing),
 *  2. the entire payload being JSON,
 *  3. the entire payload being base64-encoded markup (decoded, then retried),
 *  4. the content of a `<return>` tag (JSON, number or entity-decoded text),
 *  5. a shallow flatten of simple tags (repeated tags become arrays).
 *
 * @param depth Guards against chained base64 decoding (only one layer).
 */
function parseSoapText(text: string, depth: number): ParseOutcome {
  // 1. JSON embedded in the SOAP body
  const bodyMatch = text.match(SOAP_BODY_RE);
  if (bodyMatch) {
    const extracted = extractBalancedJson(bodyMatch[2] as string);
    if (extracted !== null) {
      const parsed = tryParseJson(extracted);
      if (parsed.ok) {
        return { matched: true, value: parsed.value };
      }
    }
  }

  // 2. Entire response is JSON
  const whole = tryParseJson(text);
  if (whole.ok) {
    return { matched: true, value: whole.value };
  }

  // 3. Entire response is base64-encoded markup
  if (depth === 0) {
    const decoded = tryDecodeBase64Markup(text);
    if (decoded !== null) {
      const inner = parseSoapText(decoded, depth + 1);
      if (inner.matched) {
        return inner;
      }
    }
  }

  // 4. Content of the <return> tag
  const returnMatch = text.match(RETURN_TAG_RE);
  if (returnMatch) {
    const content = (returnMatch[2] as string).trim();
    const asJson = tryParseJson(content);
    if (asJson.ok) {
      return { matched: true, value: asJson.value };
    }
    if (/^-?\d+$/.test(content)) {
      return { matched: true, value: parseInt(content, 10) };
    }
    // The return payload may itself be XML (e.g. nested user details):
    // parse it recursively so its fields are flattened into an object.
    if (/<[A-Za-z]/.test(content)) {
      const inner = parseSoapText(content, depth);
      if (inner.matched) {
        return inner;
      }
    }
    return { matched: true, value: decodeHtmlEntities(content) };
  }

  // 5. Shallow flatten of simple tags (repeated tags are collected into arrays)
  const result: Record<string, unknown> = {};
  const tagRe = /<([^>\s/]+)>([\s\S]*?)<\/\1>/g;
  for (const match of text.matchAll(tagRe)) {
    const key = (match[1] as string).replace(/^.*:/, "");
    const value = parseScalarValue(stripCdata((match[2] as string).trim()));
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const existing = result[key];
      result[key] = Array.isArray(existing)
        ? [...(existing as unknown[]), value]
        : [existing, value];
    } else {
      result[key] = value;
    }
  }
  if (Object.keys(result).length > 0) {
    return { matched: true, value: result };
  }

  return { matched: false };
}

/**
 * Parses a Smartschool API response into a plain JavaScript value.
 *
 * Accepts strings (SOAP envelopes, raw JSON, base64-encoded markup) and
 * passes already-parsed objects and arrays through unchanged.
 *
 * @throws {Error} When the input is not an object/string, is empty, or has
 * an unrecognized format. This function never silently returns `undefined`.
 */
export function parseXMLResponse(
  response: string | Record<string, unknown> | unknown[],
): unknown {
  // If response is already an object (including arrays), return it directly
  if (typeof response === "object" && response !== null) {
    return response;
  }

  if (typeof response !== "string") {
    throw new Error("Response must be either an object or a string");
  }

  const trimmed = response.trim();
  if (!trimmed) {
    throw new Error("Failed to parse response: empty response");
  }

  const outcome = parseSoapText(trimmed, 0);
  if (outcome.matched) {
    return outcome.value;
  }

  throw new Error(
    `Failed to parse response: unrecognized format (first 100 characters: ${
      JSON.stringify(trimmed.slice(0, 100))
    })`,
  );
}
