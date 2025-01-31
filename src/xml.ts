// src/xml.ts
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

export function generateXML(
  methodName: string,
  params: Record<string, any>,
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
      let stringValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      stringValue = escapeXml(stringValue);
      xmlParts.push(`      <${key}>${stringValue}</${key}>`);
    }
  }

  xmlParts.push(`    </tns:${methodName}>`);
  xmlParts.push("  </soap:Body>");
  xmlParts.push("</soap:Envelope>");

  return xmlParts.join("\n");
}

export function parseXMLResponse(response: string): any {
  try {
    // If response is already an object (including arrays), return it directly
    if (typeof response === "object" && response !== null) {
      return response;
    }

    // Ensure we're working with a string from this point
    if (typeof response !== "string") {
      throw new Error("Response must be either an object or a string");
    }

    // Check for JSON within SOAP-ENV:Body first
    const soapBodyMatch = response.match(
      /<SOAP-ENV:Body[^>]*>([\s\S]*?)<\/SOAP-ENV:Body>/i,
    );
    if (soapBodyMatch) {
      const bodyContent = soapBodyMatch[1].trim();
      // Try to extract JSON (both objects and arrays) from the body content
      const jsonMatch = bodyContent.match(/[\[{][\s\S]*?[\]}]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    // If no JSON found in SOAP body, try parsing entire response as JSON
    return JSON.parse(response);
  } catch {
    // If not JSON, continue with XML processing
    try {
      // Handle base64 encoded responses
      if (response.match(/^[A-Za-z0-9+/=]+$/)) {
        response = atob(response);
      }

      // Extract content from SOAP envelope using regex
      const returnMatch = response.match(/<return[^>]*>([\s\S]*?)<\/return>/i);
      if (returnMatch) {
        const returnContent = returnMatch[1].trim();

        // Try parsing return content as JSON
        try {
          return JSON.parse(returnContent);
        } catch {
          // If not JSON, check if it's a number
          if (/^\d+$/.test(returnContent)) {
            return parseInt(returnContent, 10);
          }
          // Otherwise return as string
          return returnContent;
        }
      }

      // If no return tag found, extract all tags
      const matches = response.matchAll(/<([^>\s]+)>([\s\S]*?)<\/\1>/g);
      const result: Record<string, any> = {};

      for (const match of matches) {
        const [, key, value] = match;
        const cleanKey = key.replace(/^.*:/, "");
        try {
          result[cleanKey] = JSON.parse(value);
        } catch {
          result[cleanKey] = value.trim();
        }
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse response: ${error.message}`);
      }
    }
  }
}
