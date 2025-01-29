import { assertEquals, assertThrows } from "jsr:@std/assert";
import { parse } from "https://deno.land/std/flags/mod.ts";

// Mock stdin/stdout for testing interactive mode
class MockStdin {
  private responses: string[];

  constructor(responses: string[]) {
    this.responses = [...responses];
  }

  read(_buf: Uint8Array): number | null {
    if (this.responses.length === 0) return null;
    const response = this.responses.shift()! + "\n";
    const encoder = new TextEncoder();
    const bytes = encoder.encode(response);
    _buf.set(bytes);
    return bytes.length;
  }
}

class MockStdout {
  output: string = "";

  write(data: Uint8Array): number {
    this.output += new TextDecoder().decode(data);
    return data.length;
  }
}

Deno.test("CLI - parses command line arguments", () => {
  const args = parse([
    "--method=saveUser",
    "--username=john.doe",
    "--firstName=John",
    "--lastName=Doe",
  ]);

  assertEquals(args.method, "saveUser");
  assertEquals(args.username, "john.doe");
  assertEquals(args.firstName, "John");
  assertEquals(args.lastName, "Doe");
});

Deno.test("CLI - handles interactive mode", () => {
  const mockStdout = new MockStdout();
  const mockStdin = new MockStdin([
    "saveUser",
    "john.doe",
    "John",
    "Doe",
    "leerkracht",
  ]);

  // Replace stdin/stdout
  const originalStdin = Deno.stdin;
  const originalStdout = Deno.stdout;
  (Deno as any).stdin = mockStdin;
  (Deno as any).stdout = mockStdout;

  try {
    // Run CLI in interactive mode
    parse(["--interactive"]);
    // Simulate user input
    const mockStdout = new MockStdout();
    const mockStdin = new MockStdin(["saveUser", "john.doe", "John", "Doe"]);

    // Replace stdin/stdout
    const originalStdin = Deno.stdin;
    const originalStdout = Deno.stdout;
    (Deno as any).stdin = mockStdin;
    (Deno as any).stdout = mockStdout;

    try {
      // Run CLI in interactive mode
      const args = parse(["--interactive"]);
      validateArgs(args);

      // Verify output contains prompts
      assertEquals(mockStdout.output.includes("Enter method:"), true);
      assertEquals(mockStdout.output.includes("Enter username:"), true);
      assertEquals(mockStdout.output.includes("Enter first name:"), true);
      assertEquals(mockStdout.output.includes("Enter last name:"), true);

      // Verify parsed arguments
      assertEquals(args.method, "saveUser");
      assertEquals(args.username, "john.doe");
      assertEquals(args.firstName, "John");
      assertEquals(args.lastName, "Doe");
    } finally {
      // Restore original stdin/stdout
      (Deno as any).stdin = originalStdin;
      (Deno as any).stdout = originalStdout;
    }

    // Verify output contains prompts
    assertEquals(mockStdout.output.includes("Enter method:"), true);
    assertEquals(mockStdout.output.includes("Enter username"), true);
  } finally {
    // Restore original stdin/stdout
    (Deno as any).stdin = originalStdin;
    (Deno as any).stdout = originalStdout;
  }
});

function validateArgs(args: { [key: string]: any }) {
  const requiredParams = ["method", "username", "firstName", "lastName"];
  for (const param of requiredParams) {
    if (!args[param]) {
      throw new Error(`Missing required parameter: ${param}`);
    }
  }
}

Deno.test("CLI - validates required parameters", () => {
  const args = parse(["--method=saveUser"]);

  // Should throw error for missing required parameters
  assertThrows(
    () => {
      validateArgs(args);
    },
    Error,
    "Missing required parameter: username",
  );
});

Deno.test("CLI - handles config file", async () => {
  // Create temporary config file
  const config = {
    apiEndpoint: "https://test.smartschool.be/Webservices/V3",
    accessCode: "test123",
  };

  await Deno.writeTextFile("./test-config.json", JSON.stringify(config));

  try {
    const args = parse([
      "--method=saveUser",
      "--config=./test-config.json",
      "--username=john.doe",
    ]);

    // Test config loading
    const loadedConfig = JSON.parse(await Deno.readTextFile(args.config));

    assertEquals(loadedConfig.apiEndpoint, config.apiEndpoint);
    assertEquals(loadedConfig.accessCode, config.accessCode);
  } finally {
    // Cleanup
    await Deno.remove("./test-config.json");
  }
});
