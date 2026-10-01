// tests/client.test.ts
import { assertEquals, assertRejects, assertThrows } from "jsr:@std/assert";
import {
  SMARTSCHOOL_ERROR_CODE_TABLE,
  SmartschoolClient,
  SmartschoolError,
  SmartschoolErrorCode,
  SmartschoolRole,
} from "../src/mod.ts";

/**
 * Mock of what the live `returnJsonErrorCodes` endpoint returns.
 * Kept complete (all 57 codes) so it doubles as documentation of the
 * Smartschool error codes and stays a faithful stand-in for the API.
 */
const ERROR_CODES = {
  "1": "De naam dient minimaal uit 2 karakters te bestaan.",
  "2": "De voornaam dient uit minimaal 2 karakters te bestaan.",
  "3": "De gebruikersnaam dient minimaal uit 2 karakters bestaan.",
  "4":
    "Het nieuwe wachtwoord is niet complex genoeg.&lt;br&gt;Bekijk de voorwaarden voor een wachtwoord of wachtzin in de handleiding (Profiel &gt; Gebruikersnaam en wachtwoord).",
  "5": "Er is geen groep geselecteerd.",
  "6": "De gebruikersnaam bestaat reeds.",
  "7": "De wachtwoorden zijn niet identiek.",
  "8": "Het opgegeven webserviceswachtwoord is niet correct.",
  "9": "Deze gebruiker bestaat niet",
  "10":
    "Er is een fout gebeurd tijdens het verwerken van de gegevens. Er is niets toegepast.",
  "11": "Er is een fout opgetreden tijdens het bewaren van de klasgegevens.",
  "12": "Deze gebruiker bestaat niet",
  "13":
    "Er is een fout opgetreden tijdens het kopiëren/verplaatsen van de gebruikers naar de opgegeven klas.",
  "14": "Onvoldoende gegeven aangeleverd.",
  "15": "Dubbele gebruikersnaam",
  "16": "Dubbele interne nummer",
  "17":
    "Er is een fout opgetreden tijdens het bewaren van één of meerdere profielvelden.",
  "18": "Er is een fout opgetreden bij het versturen van het bericht",
  "19": "Parent-ID bestaat niet !",
  "20": "Cursus toevoegen mislukt.",
  "21": "Cursus met zelfde naam aanwezig.",
  "22": "Cursus niet gevonden.",
  "23": "Er is een onbekende fout opgetreden tijdens de verwerking.",
  "24":
    "Er is reeds een gebruiker aanwezig met dit intern nummer. Gelieve een ander nummer in te geven.",
  "25":
    "Opgelet, de gebruiker kon niet worden gewijzigd, omdat deze niet bestaat in Smartschool.",
  "26":
    "Opgelet, de gebruiker kon niet worden toegevoegd, omdat deze reeds bestaat in Smartschool.",
  "27":
    "Opgelet, het instellingsnummer komt niet voor in Smartschool. Gelieve eerst de instelling toe te voegen.",
  "28": "Het selecteren van een basisrol is verplicht.",
  "29": "U mag de basisrol van deze account niet meer wijzigen.",
  "30":
    "Enkel leerlingen (basisrol leerling) mogen lid zijn van officiële klassen.",
  "31": "De leerling mag maar lid zijn van één officiële klas.",
  "32": "Een leerling dient lid te zijn van één officiële klas.",
  "33": "Het registeren van de klasbeweging is mislukt.",
  "34":
    "De leerling kan niet worden geactiveerd omdat hij geen lid is van een officiële klas.",
  "35": "Het instellingsnummer is verplicht bij een officiële klas.",
  "36": "U mag het type van een officiële klas niet wijzigen.",
  "37":
    "U mag het type van deze klas of groep niet wijzigen omdat sommige leden van deze groep of klas niet de basisrol leerling hebben.",
  "38":
    "U mag het type van deze klas of groep niet wijzigen omdat sommige leden van deze groep of klas reeds lid zijn van een andere officiële klas.",
  "39": "U dient een vormingscomponent te selecteren.",
  "40": "U mag de naam van een klas niet meer wijzigen.",
  "41": "U mag het administratiefnummer niet meer wijzigen.",
  "42": "U mag het instellingsnummer niet meer wijzigen.",
  "43": "U mag de vormingscomponent niet meer wijzigen.",
  "44": "De vormingscomponent is verplicht op te geven.",
  "45": "U mag het type van een klas niet wijzigen.",
  "46": "U dient het type van de groep te selecteren.",
  "47": "Er bestaat reeds een klas met dezelfde unieke klas- of groepcode",
  "48": "Het intern nummer bestaat reeds.",
  "49": "De datum is niet geldig",
  "50": "De module 'Skore' is niet geactiveerd",
  "51": "Er is een fout opgetreden tijdens het uitschrijven van de leerling",
  "52":
    "Dit wachtwoord werd niet toegestaan. Gelieve een ander wachtwoord te kiezen.",
  "53": "De bovenliggende groep werd niet gevonden.",
  "54": "De bovenliggende groep mag geen officiële klas zijn.",
  "55": "Een officiële klas kan geen subgroepen bevatten.",
  "56": "Gelieve een geldige datum op te geven voor het schooljaar",
  "57":
    "De 'Roostercode' dient uniek te zijn. De waarde die u invulde is reeds in gebruik.",
};

const CONFIG = {
  apiEndpoint: "https://test.smartschool.be/Webservices/V3",
  accesscode: "test123",
};

/** Wraps content in a minimal SOAP envelope (SOAP-ENV prefixed, like the real API). */
function soapReturn(content: string): Response {
  return new Response(
    `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><tns:response><return>${content}</return></tns:response></SOAP-ENV:Body></SOAP-ENV:Envelope>`,
    { status: 200, headers: { "Content-Type": "text/xml" } },
  );
}

/** Puts raw content directly inside the SOAP body (no <return> wrapper). */
function soapBody(content: string): Response {
  return new Response(
    `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body>${content}</SOAP-ENV:Body></SOAP-ENV:Envelope>`,
    { status: 200, headers: { "Content-Type": "text/xml" } },
  );
}

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function httpError(status: number, body = ""): Response {
  return new Response(body, { status });
}

type Handler = (
  body: string,
  init: RequestInit,
  call: number,
) => Response | Promise<Response>;

interface MockFetch {
  /** Request bodies in call order. */
  bodies: string[];
  restore: () => void;
}

/** Replaces globalThis.fetch; records every request body. */
function mockFetch(handler: Handler): MockFetch {
  const bodies: string[] = [];
  const original = globalThis.fetch;
  globalThis.fetch = ((_url: unknown, init?: RequestInit) => {
    const body = String(init?.body ?? "");
    bodies.push(body);
    return Promise.resolve(handler(body, init as RequestInit, bodies.length));
  }) as typeof fetch;
  return {
    bodies,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

/** Serves the error-code table for returnJsonErrorCodes, `responder` for the rest. */
function api(
  responder: (body: string, call: number) => Response | Promise<Response>,
): Handler {
  return (body, _init, call) => {
    if (body.includes("returnJsonErrorCodes")) {
      return jsonResponse(ERROR_CODES);
    }
    return responder(body, call);
  };
}

/** Runs `fn` with a client whose fetch is mocked; always restores. */
async function withClient(
  handler: Handler,
  config: Record<string, unknown> | undefined,
  fn: (client: SmartschoolClient, bodies: string[]) => Promise<void>,
): Promise<void> {
  const mock = mockFetch(handler);
  try {
    const client = new SmartschoolClient({ ...CONFIG, ...config });
    await fn(client, mock.bodies);
  } finally {
    mock.restore();
  }
}

const okResponder = () => soapReturn("0");

// ---------------------------------------------------------------------------
// Constructor validation
// ---------------------------------------------------------------------------

Deno.test("SmartschoolClient - requires apiEndpoint and accesscode", () => {
  assertThrows(
    () => new SmartschoolClient({ accesscode: "x" } as never),
    TypeError,
  );
  assertThrows(
    () => new SmartschoolClient({ apiEndpoint: "https://x" } as never),
    TypeError,
  );
});

// ---------------------------------------------------------------------------
// Happy paths
// ---------------------------------------------------------------------------

Deno.test('SmartschoolClient - saveUser returns true on success ("0")', async () => {
  await withClient(api(okResponder), undefined, async (client, bodies) => {
    const result = await client.saveUser({
      username: "john.doe",
      name: "John",
      surname: "Doe",
      basisrol: "leerkracht",
      passwd1: "password123",
      passwd2: "password123",
      passwd3: "password123",
    });

    assertEquals(result, true);
    // Auth is injected from the config into the SOAP body
    const saveCall = bodies.find((b) => b.includes("saveUser"));
    assertEquals(saveCall?.includes("<accesscode>test123</accesscode>"), true);
  });
});

Deno.test("SmartschoolClient - getUserDetails flattens nested XML return", async () => {
  const responder = (body: string) =>
    body.includes("getUserDetails")
      ? soapReturn(
        "<username>john.doe</username><name>John</name><surname>Doe</surname>",
      )
      : soapReturn("0");

  await withClient(api(responder), undefined, async (client) => {
    const result = await client.getUserDetails({ userIdentifier: "john.doe" });
    assertEquals<unknown>(result, {
      username: "john.doe",
      name: "John",
      surname: "Doe",
    });
  });
});

Deno.test("SmartschoolClient - nested JSON in SOAP body is parsed intact", async () => {
  const responder = (body: string) =>
    body.includes("getAllAccountsExtended")
      ? soapBody(
        `{"total":2,"accounts":[{"username":"a","roles":["x","y"]},{"username":"b","roles":[]}]}`,
      )
      : soapReturn("0");

  await withClient(api(responder), undefined, async (client) => {
    const result = await client.getAllAccountsExtended({
      code: "1A",
      recursive: "0",
    });
    assertEquals<unknown>(result, {
      total: 2,
      accounts: [
        { username: "a", roles: ["x", "y"] },
        { username: "b", roles: [] },
      ],
    });
  });
});

Deno.test("SmartschoolClient - base64-wrapped XML response is decoded", async () => {
  const responder = (body: string) =>
    body.includes("getAllAccounts")
      ? new Response(
        btoa(`<return>{"users":[{"name":"john"}]}</return>`),
        { status: 200 },
      )
      : soapReturn("0");

  await withClient(api(responder), undefined, async (client) => {
    const result = await client.getAllAccounts({ code: "1A", recursive: "0" });
    assertEquals<unknown>(result, { users: [{ name: "john" }] });
  });
});

// ---------------------------------------------------------------------------
// API error codes
// ---------------------------------------------------------------------------

Deno.test("SmartschoolClient - translates API error codes", async () => {
  const responder = () => soapReturn("12");

  await withClient(api(responder), undefined, async (client) => {
    const error = await assertRejects(
      () => client.getUserDetails({ userIdentifier: "gone" }),
      SmartschoolError,
    );
    assertEquals(error.code, "12");
    assertEquals(error.message, ERROR_CODES["12"]);
  });
});

Deno.test("SmartschoolClient - decodes entities in translated error messages", async () => {
  const responder = () => soapReturn("4");

  await withClient(api(responder), undefined, async (client) => {
    const error = await assertRejects(
      () =>
        client.saveUser({
          username: "john.doe",
          name: "John",
          surname: "Doe",
          basisrol: "leerkracht",
        }),
      SmartschoolError,
    );
    assertEquals(error.code, "4");
    // &lt;br&gt; became a newline, no raw entities remain
    assertEquals(error.message.includes("\n"), true);
    assertEquals(error.message.includes("&lt;"), false);
  });
});

Deno.test("SmartschoolClient - API error codes are never retried", async () => {
  let calls = 0;
  const responder = () => {
    calls++;
    return soapReturn("12");
  };

  await withClient(
    api(responder),
    { maxRetries: 3, retryDelayMs: 1 },
    async (client) => {
      await assertRejects(
        () => client.getUserDetails({ userIdentifier: "gone" }),
        SmartschoolError,
      );
      assertEquals(calls, 1);
    },
  );
});

// ---------------------------------------------------------------------------
// HTTP-level failures
// ---------------------------------------------------------------------------

Deno.test("SmartschoolClient - HTTP 500 with HTML body becomes a clear error", async () => {
  let calls = 0;
  const responder = () => {
    calls++;
    return httpError(500, "<html><body>Internal Server Error</body></html>");
  };

  await withClient(api(responder), undefined, async (client) => {
    const error = await assertRejects(
      () =>
        client.saveUser({
          username: "john.doe",
          name: "John",
          surname: "Doe",
          basisrol: "leerkracht",
        }),
      SmartschoolError,
    );
    assertEquals(error.code, "HTTP_500");
    assertEquals(error.message.includes("saveUser"), true);
    assertEquals(error.message.includes("500"), true);
    assertEquals(error.message.includes("Internal Server Error"), true);
    // No retries by default
    assertEquals(calls, 1);
  });
});

Deno.test("SmartschoolClient - HTTP 400 is not retried even with maxRetries", async () => {
  let calls = 0;
  const responder = () => {
    calls++;
    return httpError(400, "Bad Request");
  };

  await withClient(
    api(responder),
    { maxRetries: 5, retryDelayMs: 1 },
    async (client) => {
      const error = await assertRejects(
        () =>
          client.saveUser({
            username: "john.doe",
            name: "John",
            surname: "Doe",
            basisrol: "leerkracht",
          }),
        SmartschoolError,
      );
      assertEquals(error.code, "HTTP_400");
      assertEquals(calls, 1);
    },
  );
});

Deno.test("SmartschoolClient - HTTP 503 is retried and can succeed", async () => {
  let calls = 0;
  const responder = () => {
    calls++;
    return calls <= 2 ? httpError(503) : soapReturn("0");
  };

  await withClient(
    api(responder),
    { maxRetries: 2, retryDelayMs: 1 },
    async (client) => {
      const result = await client.saveUser({
        username: "john.doe",
        name: "John",
        surname: "Doe",
        basisrol: "leerkracht",
      });
      assertEquals(result, true);
      assertEquals(calls, 3);
    },
  );
});

Deno.test("SmartschoolClient - HTTP 503 fails after exhausting retries", async () => {
  let calls = 0;
  const responder = () => {
    calls++;
    return httpError(503, "Service Unavailable");
  };

  await withClient(
    api(responder),
    { maxRetries: 1, retryDelayMs: 1 },
    async (client) => {
      const error = await assertRejects(
        () =>
          client.saveUser({
            username: "john.doe",
            name: "John",
            surname: "Doe",
            basisrol: "leerkracht",
          }),
        SmartschoolError,
      );
      assertEquals(error.code, "HTTP_503");
      assertEquals(calls, 2);
    },
  );
});

Deno.test("SmartschoolClient - HTTP 429 is retried", async () => {
  let calls = 0;
  const responder = () => {
    calls++;
    return calls === 1 ? httpError(429) : soapReturn("0");
  };

  await withClient(
    api(responder),
    { maxRetries: 1, retryDelayMs: 1 },
    async (client) => {
      const result = await client.checkStatus({ serviceId: "test-service" });
      assertEquals(result, true);
      assertEquals(calls, 2);
    },
  );
});

// ---------------------------------------------------------------------------
// Network errors and timeouts
// ---------------------------------------------------------------------------

Deno.test("SmartschoolClient - network error is retried and can succeed", async () => {
  let calls = 0;
  const handler: Handler = (body, _init, call) => {
    if (body.includes("returnJsonErrorCodes")) {
      return jsonResponse(ERROR_CODES);
    }
    calls++;
    if (calls === 1) {
      return Promise.reject(new TypeError("fetch failed"));
    }
    return soapReturn("0");
  };

  await withClient(
    handler,
    { maxRetries: 1, retryDelayMs: 1 },
    async (client) => {
      const result = await client.checkStatus({ serviceId: "test-service" });
      assertEquals(result, true);
      assertEquals(calls, 2);
    },
  );
});

Deno.test("SmartschoolClient - network error without retries yields NETWORK code", async () => {
  const handler: Handler = (body) => {
    if (body.includes("returnJsonErrorCodes")) {
      return jsonResponse(ERROR_CODES);
    }
    return Promise.reject(new TypeError("fetch failed"));
  };

  await withClient(handler, undefined, async (client) => {
    const error = await assertRejects(
      () => client.checkStatus({ serviceId: "test-service" }),
      SmartschoolError,
    );
    assertEquals(error.code, "NETWORK");
    assertEquals(error.message.includes("checkStatus"), true);
  });
});

Deno.test("SmartschoolClient - hanging fetch is aborted by timeoutMs", async () => {
  const handler: Handler = (body, init) => {
    if (body.includes("returnJsonErrorCodes")) {
      return jsonResponse(ERROR_CODES);
    }
    // Honors the abort signal like a real fetch: never resolves otherwise.
    return new Promise<Response>((_resolve, reject) => {
      const signal = (init as { signal?: AbortSignal }).signal;
      const abort = () => {
        const err = new Error("The operation was aborted.");
        err.name = "AbortError";
        reject(err);
      };
      if (signal) {
        if (signal.aborted) {
          abort();
        } else {
          signal.addEventListener("abort", abort, { once: true });
        }
      }
    });
  };

  await withClient(handler, { timeoutMs: 50 }, async (client) => {
    const error = await assertRejects(
      () => client.checkStatus({ serviceId: "test-service" }),
      SmartschoolError,
    );
    assertEquals(error.code, "TIMEOUT");
    assertEquals(error.message.includes("50ms"), true);
  });
});

Deno.test("SmartschoolClient - timeout is retried when maxRetries allows", async () => {
  let calls = 0;
  const handler: Handler = (body, init) => {
    if (body.includes("returnJsonErrorCodes")) {
      return jsonResponse(ERROR_CODES);
    }
    calls++;
    if (calls === 1) {
      return new Promise<Response>((_resolve, reject) => {
        const signal = (init as { signal?: AbortSignal }).signal;
        const abort = () => {
          const err = new Error("The operation was aborted.");
          err.name = "AbortError";
          reject(err);
        };
        signal?.addEventListener("abort", abort, { once: true });
      });
    }
    return soapReturn("0");
  };

  await withClient(
    handler,
    { timeoutMs: 30, maxRetries: 1, retryDelayMs: 1 },
    async (client) => {
      const result = await client.checkStatus({ serviceId: "test-service" });
      assertEquals(result, true);
      assertEquals(calls, 2);
    },
  );
});

// ---------------------------------------------------------------------------
// Retry pacing
// ---------------------------------------------------------------------------

Deno.test("SmartschoolClient - retries use exponential backoff", async () => {
  let calls = 0;
  const responder = () => {
    calls++;
    return calls <= 2 ? httpError(503) : soapReturn("0");
  };

  await withClient(
    api(responder),
    { maxRetries: 2, retryDelayMs: 40 },
    async (client) => {
      const start = Date.now();
      await client.checkStatus({ serviceId: "test-service" });
      const elapsed = Date.now() - start;
      // 40ms before retry 1, 80ms before retry 2
      assertEquals(calls, 3);
      if (elapsed < 110) {
        throw new Error(`expected >=110ms of backoff, took ${elapsed}ms`);
      }
    },
  );
});

// ---------------------------------------------------------------------------
// Initialization (error-code table)
// ---------------------------------------------------------------------------

Deno.test("SmartschoolClient - concurrent first requests share one error-code fetch", async () => {
  let initCalls = 0;
  const handler: Handler = (body) => {
    if (body.includes("returnJsonErrorCodes")) {
      initCalls++;
      return jsonResponse(ERROR_CODES);
    }
    return soapReturn("0");
  };

  await withClient(handler, undefined, async (client, bodies) => {
    const [a, b, c] = await Promise.all([
      client.checkStatus({ serviceId: "test-service" }),
      client.checkStatus({ serviceId: "test-service" }),
      client.checkStatus({ serviceId: "test-service" }),
    ]);
    assertEquals([a, b, c], [true, true, true]);
    assertEquals(initCalls, 1);
    assertEquals(bodies.length, 4); // 1 init + 3 requests
  });
});

Deno.test("SmartschoolClient - failed error-code fetch does not break requests", async () => {
  const handler: Handler = (body) => {
    if (body.includes("returnJsonErrorCodes")) {
      return httpError(500, "boom");
    }
    return soapReturn("0");
  };

  // Silence the expected soft-fail warning
  const originalError = console.error;
  console.error = () => {};
  try {
    await withClient(handler, undefined, async (client) => {
      const result = await client.checkStatus({ serviceId: "test-service" });
      assertEquals(result, true);
    });
  } finally {
    console.error = originalError;
  }
});

// ---------------------------------------------------------------------------
// Credential handling
// ---------------------------------------------------------------------------

Deno.test("SmartschoolClient - never logs the request body (credential leak regression)", async () => {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };

  try {
    await withClient(api(okResponder), undefined, async (client) => {
      await client.saveUser({
        username: "john.doe",
        name: "John",
        surname: "Doe",
        basisrol: "leerkracht",
      });
    });
  } finally {
    console.log = originalLog;
  }

  assertEquals(logs.length, 0);
});

Deno.test("SmartschoolClient - needsAuth=false omits the accesscode", async () => {
  await withClient(
    api(() => soapReturn("1;2\n3;4")),
    undefined,
    async (client, bodies) => {
      await client.returnCsvErrorCodes();
      const csvCall = bodies.find((b) => b.includes("returnCsvErrorCodes"));
      assertEquals(csvCall !== undefined, true);
      assertEquals(csvCall?.includes("accesscode"), false);
    },
  );
});

Deno.test("SmartschoolClient - per-request accesscode overrides the config", async () => {
  await withClient(api(okResponder), undefined, async (client, bodies) => {
    await client.saveUser({
      username: "john.doe",
      name: "John",
      surname: "Doe",
      basisrol: "leerkracht",
      accesscode: "other-code",
    });
    const saveCall = bodies.find((b) => b.includes("saveUser"));
    assertEquals(
      saveCall?.includes("<accesscode>other-code</accesscode>"),
      true,
    );
    assertEquals(saveCall?.includes("test123"), false);
  });
});

// ---------------------------------------------------------------------------
// Error reasons and safe helpers
// ---------------------------------------------------------------------------

Deno.test("SmartschoolErrorCode - every API error code maps to a reason", () => {
  for (const code of Object.keys(ERROR_CODES)) {
    assertEquals(
      new SmartschoolError("x", code).reason !== undefined,
      true,
      `code ${code} has no reason`,
    );
  }
  assertEquals(new SmartschoolError("x", "999").reason, undefined);
});

Deno.test("SmartschoolError - reason mapping and is()", () => {
  const e = new SmartschoolError("x", "12");
  assertEquals(e.reason, "USER_NOT_FOUND");
  assertEquals(e.code, "12");
  assertEquals(e.is(SmartschoolErrorCode.USER_NOT_FOUND), true);
  assertEquals(e.is(SmartschoolErrorCode.USERNAME_EXISTS), false);
  assertEquals(new SmartschoolError("x", "9").reason, "USER_NOT_FOUND");
  assertEquals(new SmartschoolError("x", "15").reason, "USERNAME_EXISTS");
  assertEquals(new SmartschoolError("x", "TIMEOUT").reason, "TIMEOUT");
  assertEquals(new SmartschoolError("x", "NETWORK").reason, "NETWORK");
  assertEquals(new SmartschoolError("x", "SOAP_FAULT").reason, "SOAP_FAULT");
  assertEquals(new SmartschoolError("x", "HTTP_503").is("HTTP_503"), true);
});

Deno.test("SmartschoolClient - API errors expose reason", async () => {
  await withClient(api(() => soapReturn("12")), undefined, async (client) => {
    const error = await assertRejects(
      () => client.getUserDetails({ userIdentifier: "gone" }),
      SmartschoolError,
    );
    assertEquals(error.reason, "USER_NOT_FOUND");
  });
  await withClient(
    api(() => httpError(500, "boom")),
    { maxRetries: 0 },
    async (client) => {
      const error = await assertRejects(
        () => client.getUserDetails({ userIdentifier: "x" }),
        SmartschoolError,
      );
      assertEquals(error.reason, "HTTP_500");
    },
  );
});

Deno.test("SmartschoolClient - findUserByUsername returns details when found", async () => {
  await withClient(
    api(() => soapReturn('{"username":"john.doe"}')),
    undefined,
    async (client) => {
      const user = await client.findUserByUsername("john.doe");
      assertEquals<unknown>(user, { username: "john.doe" });
    },
  );
});

Deno.test("SmartschoolClient - findUserByUsername returns null when not found", async () => {
  await withClient(api(() => soapReturn("12")), undefined, async (client) => {
    assertEquals(await client.findUserByUsername("ghost"), null);
  });
});

Deno.test("SmartschoolClient - findUserByUsername rethrows other errors", async () => {
  await withClient(api(() => soapReturn("8")), undefined, async (client) => {
    const error = await assertRejects(
      () => client.findUserByUsername("john.doe"),
      SmartschoolError,
    );
    assertEquals(error.reason, "INVALID_ACCESS_CODE");
  });
});

const NEW_USER = {
  username: "john.doe",
  name: "John",
  surname: "Doe",
  basisrol: "leerkracht",
} as const;

Deno.test("SmartschoolClient - createUser refuses an existing username", async () => {
  await withClient(
    api(() => soapReturn('{"username":"john.doe"}')),
    undefined,
    async (client, bodies) => {
      const error = await assertRejects(
        () => client.createUser(NEW_USER),
        SmartschoolError,
      );
      assertEquals(error.is(SmartschoolErrorCode.USERNAME_EXISTS), true);
      assertEquals(error.code, "6");
      assertEquals(bodies.some((b) => b.includes("saveUser")), false);
    },
  );
});

Deno.test("SmartschoolClient - createUser saves a new user and returns details", async () => {
  let lookups = 0;
  const responder = (body: string) => {
    if (body.includes("getUserDetailsByUsername")) {
      lookups++;
      return lookups === 1
        ? soapReturn("12")
        : soapReturn('{"username":"john.doe"}');
    }
    return soapReturn("0");
  };
  await withClient(api(responder), undefined, async (client, bodies) => {
    const user = await client.createUser(NEW_USER);
    assertEquals<unknown>(user, { username: "john.doe" });
    assertEquals(bodies.some((b) => b.includes("saveUser")), true);
  });
});

Deno.test("SmartschoolClient - saveUser/createUser reject an invalid basisrol without a request", async () => {
  await withClient(api(okResponder), undefined, async (client, bodies) => {
    for (const bad of ["teacher", "1", "", undefined]) {
      for (
        const call of [
          () => client.saveUser({ ...NEW_USER, basisrol: bad } as never),
          () => client.createUser({ ...NEW_USER, basisrol: bad } as never),
        ]
      ) {
        const error = await assertRejects(call, SmartschoolError);
        assertEquals(error.code, "INVALID_ROLE");
        assertEquals(error.is(SmartschoolErrorCode.INVALID_ROLE), true);
        assertEquals(
          error.message,
          `Ongeldige basisrol '${bad}' — gebruik leerkracht, leerling, directie of andere.`,
        );
      }
    }
    assertEquals(bodies.length, 0);
  });
});

Deno.test("SmartschoolClient - saveUser accepts every SmartschoolRole", async () => {
  await withClient(api(okResponder), undefined, async (client) => {
    for (const role of Object.values(SmartschoolRole)) {
      assertEquals(
        await client.saveUser({ ...NEW_USER, basisrol: role }),
        true,
      );
    }
  });
});

Deno.test("SMARTSCHOOL_ERROR_CODE_TABLE - covers exactly the fixture codes", () => {
  const tableCodes = Object.values(SMARTSCHOOL_ERROR_CODE_TABLE).flat()
    .map(String);
  const fixtureCodes = Object.keys(ERROR_CODES);
  assertEquals(fixtureCodes.length, 57);
  assertEquals(
    tableCodes.filter((c) => !fixtureCodes.includes(c)),
    [],
    "table codes missing from fixture",
  );
  assertEquals(
    fixtureCodes.filter((c) => !tableCodes.includes(c)),
    [],
    "fixture codes without a reason name",
  );
  assertEquals(new Set(tableCodes).size, tableCodes.length, "duplicate code");
});
