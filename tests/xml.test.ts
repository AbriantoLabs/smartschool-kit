// tests/xml.test.ts
import { assertEquals, assertThrows } from "jsr:@std/assert";

import {
  decodeHtmlEntities,
  generateXML,
  parseXMLResponse,
} from "../src/xml.ts";

// ---------------------------------------------------------------------------
// generateXML
// ---------------------------------------------------------------------------

Deno.test("generateXML - creates valid SOAP envelope", () => {
  const methodName = "saveUser";
  const params = {
    username: "john.doe",
    passwd1: "password123",
    name: "John",
    surname: "Doe",
  };

  const xml = generateXML(methodName, params);

  // Check essential parts of the XML structure
  assertEquals(xml.includes('<?xml version="1.0" encoding="utf-8"?>'), true);
  assertEquals(xml.includes("<soap:Envelope"), true);
  assertEquals(xml.includes("<soap:Body>"), true);
  assertEquals(xml.includes(`<tns:${methodName}>`), true);
  assertEquals(xml.includes("<username>john.doe</username>"), true);
  assertEquals(xml.includes("<passwd1>password123</passwd1>"), true);
  assertEquals(xml.includes("<name>John</name>"), true);
  assertEquals(xml.includes("<surname>Doe</surname>"), true);
});

Deno.test("generateXML - handles empty optional parameters", () => {
  const methodName = "saveUser";
  const params = {
    username: "john.doe",
    email: undefined,
    phone: null,
  };

  const xml = generateXML(methodName, params);

  // Should only include defined parameters
  assertEquals(xml.includes("<username>john.doe</username>"), true);
  assertEquals(xml.includes("email"), false);
  assertEquals(xml.includes("phone"), false);
});

Deno.test("generateXML - escapes special characters", () => {
  const methodName = "saveUser";
  const params = {
    username: "john & doe",
    description: "<test>",
  };

  const xml = generateXML(methodName, params);

  // Check XML escaping
  assertEquals(xml.includes("john &amp; doe"), true);
  assertEquals(xml.includes("&lt;test&gt;"), true);
});

Deno.test("generateXML - escapes quotes and apostrophes", () => {
  const xml = generateXML("sendMsg", { body: `He said "hi" and it's fine` });

  assertEquals(xml.includes("&quot;hi&quot;"), true);
  assertEquals(xml.includes("it&apos;s"), true);
});

Deno.test("generateXML - serializes object parameters as JSON", () => {
  const xml = generateXML("saveClassList", { list: { a: 1, b: [2, 3] } });

  assertEquals(
    xml.includes("<list>{&quot;a&quot;:1,&quot;b&quot;:[2,3]}</list>"),
    true,
  );
});

// ---------------------------------------------------------------------------
// decodeHtmlEntities
// ---------------------------------------------------------------------------

Deno.test("decodeHtmlEntities - decodes named entities", () => {
  assertEquals(decodeHtmlEntities("Ben &amp; Jerry &lt;3"), "Ben & Jerry <3");
  assertEquals(decodeHtmlEntities("&quot;q&quot; &apos;a&apos;"), "\"q\" 'a'");
});

Deno.test("decodeHtmlEntities - decodes numeric entities", () => {
  assertEquals(decodeHtmlEntities("&#65;&#66;"), "AB");
});

Deno.test("decodeHtmlEntities - ampersand decoded last", () => {
  // "&amp;lt;" must become "&lt;" (a literal "&lt;" text), not "<"
  assertEquals(decodeHtmlEntities("&amp;lt;"), "&lt;");
});

Deno.test("decodeHtmlEntities - converts <br> variants to newlines", () => {
  assertEquals(decodeHtmlEntities("line1<br>line2"), "line1\nline2");
  assertEquals(decodeHtmlEntities("line1<br/>line2"), "line1\nline2");
  assertEquals(decodeHtmlEntities("line1<BR />line2"), "line1\nline2");
});

// ---------------------------------------------------------------------------
// parseXMLResponse: pass-through and basic shapes
// ---------------------------------------------------------------------------

Deno.test("parseXMLResponse - passes objects and arrays through", () => {
  const obj = { a: 1 };
  const arr = [1, 2];
  assertEquals(parseXMLResponse(obj), obj);
  assertEquals(parseXMLResponse(arr), arr);
});

Deno.test("parseXMLResponse - handles JSON response", () => {
  const jsonResponse = '{"status":"success","data":{"id":123}}';
  const result = parseXMLResponse(jsonResponse);

  assertEquals(result, {
    status: "success",
    data: {
      id: 123,
    },
  });
});

Deno.test("parseXMLResponse - handles a bare JSON array response", () => {
  assertEquals(parseXMLResponse(`[{"a":1},{"b":2}]`), [{ a: 1 }, { b: 2 }]);
});

Deno.test("parseXMLResponse - handles a bare numeric response", () => {
  assertEquals(parseXMLResponse("42"), 42);
});

Deno.test("parseXMLResponse - handles SOAP response", () => {
  const soapResponse = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <return>{"status":"success"}</return>
      </soap:Body>
    </soap:Envelope>`;

  const result = parseXMLResponse(soapResponse);
  assertEquals(result, { status: "success" });
});

Deno.test("parseXMLResponse - handles numeric return codes", () => {
  const soapResponse = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <return>0</return>
      </soap:Body>
    </soap:Envelope>`;

  const result = parseXMLResponse(soapResponse);
  assertEquals(result, 0);
});

// ---------------------------------------------------------------------------
// parseXMLResponse: nested JSON inside SOAP bodies (regression tests)
// ---------------------------------------------------------------------------

Deno.test("parseXMLResponse - nested JSON in SOAP body is not truncated", () => {
  const soapResponse = `<?xml version="1.0" encoding="utf-8"?>
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Body>
        {"status":"success","data":{"items":[1,2,3]}}
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;

  assertEquals(parseXMLResponse(soapResponse), {
    status: "success",
    data: { items: [1, 2, 3] },
  });
});

Deno.test("parseXMLResponse - JSON array with nested brackets in SOAP body", () => {
  const soapResponse =
    `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Body>[{"name":"a","roles":["x","y"]},{"name":"b","roles":[]}]</SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;

  assertEquals(parseXMLResponse(soapResponse), [
    { name: "a", roles: ["x", "y"] },
    { name: "b", roles: [] },
  ]);
});

Deno.test("parseXMLResponse - brackets inside JSON strings do not break extraction", () => {
  const soapResponse = `<SOAP-ENV:Envelope><SOAP-ENV:Body>
      {"message":"hello ] world [ inside strings","ok":true}
    </SOAP-ENV:Body></SOAP-ENV:Envelope>`;

  assertEquals(parseXMLResponse(soapResponse), {
    message: "hello ] world [ inside strings",
    ok: true,
  });
});

// ---------------------------------------------------------------------------
// parseXMLResponse: <return> payloads
// ---------------------------------------------------------------------------

Deno.test("parseXMLResponse - return tag with JSON payload", () => {
  const soap =
    `<soap:Envelope><soap:Body><resp><return>{"a":1}</return></resp></soap:Body></soap:Envelope>`;
  assertEquals(parseXMLResponse(soap), { a: 1 });
});

Deno.test("parseXMLResponse - namespaced return tag (tns:return)", () => {
  const soap =
    `<soap:Envelope><soap:Body><resp><tns:return>{"a":1}</tns:return></resp></soap:Body></soap:Envelope>`;
  assertEquals(parseXMLResponse(soap), { a: 1 });
});

Deno.test("parseXMLResponse - return tag with entity-encoded text", () => {
  const soap =
    `<soap:Envelope><soap:Body><resp><return>Ben &amp; Jerry &lt;3</return></resp></soap:Body></soap:Envelope>`;
  assertEquals(parseXMLResponse(soap), "Ben & Jerry <3");
});

Deno.test("parseXMLResponse - return tag with nested XML is flattened", () => {
  const soap = `<soap:Envelope><soap:Body>
      <getUserDetailsResponse>
        <return>
          <username>john.doe</username>
          <name>John</name>
          <surname>Doe</surname>
        </return>
      </getUserDetailsResponse>
    </soap:Body></soap:Envelope>`;

  assertEquals(parseXMLResponse(soap), {
    username: "john.doe",
    name: "John",
    surname: "Doe",
  });
});

// ---------------------------------------------------------------------------
// parseXMLResponse: base64 handling
// ---------------------------------------------------------------------------

Deno.test("parseXMLResponse - handles base64 responses", () => {
  const base64Response = btoa(`<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <return>{"value":"test"}</return>
      </soap:Body>
    </soap:Envelope>`);

  const result = parseXMLResponse(base64Response);
  assertEquals(result, { value: "test" });
});

Deno.test("parseXMLResponse - handles base64-encoded JSON", () => {
  assertEquals(parseXMLResponse(btoa(`{"ok":true,"list":[1,2]}`)), {
    ok: true,
    list: [1, 2],
  });
});

Deno.test("parseXMLResponse - tolerates whitespace in base64 responses", () => {
  const encoded = btoa(`<r><return>7</return></r>`);
  assertEquals(parseXMLResponse(`\n  ${encoded}  \n`), 7);
});

Deno.test("parseXMLResponse - plain alphanumeric text is not base64-decoded", () => {
  // "abcdefgh" fits the base64 alphabet and length rules, but decodes to
  // binary garbage without markup: it must be treated as an opaque value,
  // not decoded (and not silently swallowed either).
  assertThrows(
    () => parseXMLResponse("abcdefgh"),
    Error,
    "Failed to parse response",
  );
});

// ---------------------------------------------------------------------------
// parseXMLResponse: fallback tag flattening
// ---------------------------------------------------------------------------

Deno.test("parseXMLResponse - repeated sibling tags become arrays", () => {
  const xml = `<item>1</item><item>2</item><item>3</item>`;
  assertEquals(parseXMLResponse(xml), { item: [1, 2, 3] });
});

Deno.test("parseXMLResponse - mixed repeated and single tags", () => {
  const xml = `<name>John</name><role>admin</role><role>teacher</role>`;
  assertEquals(parseXMLResponse(xml), {
    name: "John",
    role: ["admin", "teacher"],
  });
});

Deno.test("parseXMLResponse - CDATA sections are unwrapped", () => {
  const xml = `<msg><![CDATA[hello <world>]]></msg>`;
  assertEquals(parseXMLResponse(xml), { msg: "hello <world>" });
});

Deno.test("parseXMLResponse - namespaced tags lose their prefix", () => {
  const xml = `<ns:name>John</ns:name><soap:surname>Doe</soap:surname>`;
  assertEquals(parseXMLResponse(xml), { name: "John", surname: "Doe" });
});

Deno.test("parseXMLResponse - entity-decoded values in flattened tags", () => {
  assertEquals(parseXMLResponse(`<fullName>John &amp; Joe</fullName>`), {
    fullName: "John & Joe",
  });
});

// ---------------------------------------------------------------------------
// parseXMLResponse: error paths (never silently undefined)
// ---------------------------------------------------------------------------

Deno.test("parseXMLResponse - rejects non-string non-object input", () => {
  assertThrows(
    () => parseXMLResponse(42 as unknown as string),
    Error,
    "Response must be either an object or a string",
  );
});

Deno.test("parseXMLResponse - rejects empty responses", () => {
  assertThrows(
    () => parseXMLResponse("   "),
    Error,
    "empty response",
  );
});

Deno.test("parseXMLResponse - throws on unrecognizable payloads", () => {
  assertThrows(
    () => parseXMLResponse(">>> this is not a known format <<<"),
    Error,
    "Failed to parse response: unrecognized format",
  );
});
