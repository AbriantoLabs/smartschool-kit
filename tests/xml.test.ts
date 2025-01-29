// tests/xml.test.ts
import { assertEquals } from "jsr:@std/assert";

import { parseXMLResponse, generateXML } from "../src/xml.ts";

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

Deno.test("parseXMLResponse - handles SOAP response", () => {
  const soapResponse = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <return>{"status":"success"}</return>
      </soap:Body>
    </soap:Envelope>`;

  const result = parseXMLResponse(soapResponse);
  assertEquals(result.status, "success");
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

Deno.test("parseXMLResponse - handles base64 responses", () => {
  const base64Response = btoa(`<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <return>{"value":"test"}</return>
      </soap:Body>
    </soap:Envelope>`);

  const result = parseXMLResponse(base64Response);
  assertEquals(result.value, "test");
});
