// fault.test.ts — SOAP faults, HTTP errors and request logging
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { SmartschoolClient, SmartschoolError } from "../src/mod.ts";
import type { SaveUser } from "../src/types.ts";

const ENDPOINT = "https://test.smartschool.be/Webservices/V3";

const soapReturn = (value: string) =>
  `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><ns1:Response><return>${value}</return></ns1:Response></SOAP-ENV:Body></SOAP-ENV:Envelope>`;

const soapFault = (message: string) =>
  `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><SOAP-ENV:Fault><faultcode>SOAP-ENV:Client</faultcode><faultstring>${message}</faultstring></SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>`;

/**
 * Run `fn` with fetch answering `body` (status `status`) for every method
 * except the error-code lookup the client does on first use.
 */
async function withFetch(
  body: string,
  status: number,
  fn: (client: SmartschoolClient) => Promise<void>,
) {
  const original = globalThis.fetch;
  globalThis.fetch = (async (_url: string, options: RequestInit) => {
    const xml = String(options.body);
    if (xml.includes("returnJsonErrorCodes")) {
      return new Response(
        soapReturn(JSON.stringify({ "12": "Deze gebruiker bestaat niet" })),
      );
    }
    return new Response(body, { status });
  }) as typeof fetch;
  try {
    await fn(
      new SmartschoolClient({
        apiEndpoint: ENDPOINT,
        accesscode: "secret-code",
      }),
    );
  } finally {
    globalThis.fetch = original;
  }
}

// The client adds the access code itself; the request types still declare it.
const user = {
  username: "john.doe",
  name: "John",
  surname: "Doe",
  basisrol: "leerling",
  passwd1: "p&ss<word>",
} as unknown as SaveUser;

Deno.test("SOAP fault is thrown as SmartschoolError with the fault message", async () => {
  await withFetch(soapFault("Invalid XML"), 500, async (client) => {
    const error = await assertRejects(
      () => client.saveUser(user),
      SmartschoolError,
    );
    assertEquals(error.message.endsWith("was rejected: Invalid XML"), true);
    assertEquals(error.code, "SOAP_FAULT");
  });
});

Deno.test("non-2xx response without fault is thrown as HTTP error", async () => {
  await withFetch("Bad gateway", 502, async (client) => {
    const error = await assertRejects(
      () => client.saveUser(user),
      SmartschoolError,
    );
    assertEquals(error.code, "HTTP_502");
  });
});

Deno.test("requests are not logged (access code and passwords stay out of logs)", async () => {
  const logged: unknown[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => logged.push(...args);
  try {
    await withFetch(soapReturn("0"), 200, async (client) => {
      assertEquals(await client.saveUser(user), true);
    });
  } finally {
    console.log = originalLog;
  }
  const text = logged.map(String).join("\n");
  assertEquals(text.includes("secret-code"), false);
  assertEquals(text.includes("p&ss"), false);
});

Deno.test("passwords with XML special characters are escaped in the envelope", async () => {
  let sent = "";
  const original = globalThis.fetch;
  globalThis.fetch = (async (_url: string, options: RequestInit) => {
    const xml = String(options.body);
    if (xml.includes("returnJsonErrorCodes")) {
      return new Response(soapReturn("{}"));
    }
    sent = xml;
    return new Response(soapReturn("0"));
  }) as typeof fetch;
  try {
    const client = new SmartschoolClient({
      apiEndpoint: ENDPOINT,
      accesscode: "x",
    });
    await client.saveUser(user);
  } finally {
    globalThis.fetch = original;
  }
  assertEquals(sent.includes("<passwd1>p&amp;ss&lt;word&gt;</passwd1>"), true);
});
