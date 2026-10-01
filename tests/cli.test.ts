// tests/cli.test.ts
import { assertEquals } from "jsr:@std/assert";

import { parseArgs } from "../src/cli-args.ts";

Deno.test("parseArgs - parses --key=value arguments", () => {
  const args = parseArgs([
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

Deno.test("parseArgs - parses --key value pairs via look-ahead", () => {
  const args = parseArgs([
    "--method",
    "saveUser",
    "--config",
    "./config.json",
  ]);

  assertEquals(args.method, "saveUser");
  assertEquals(args.config, "./config.json");
});

Deno.test("parseArgs - recognizes boolean flags", () => {
  const args = parseArgs(["--help", "--interactive", "--skip"]);

  assertEquals(args.help, true);
  assertEquals(args.interactive, true);
  assertEquals(args.skip, true);
});

Deno.test("parseArgs - recognizes short flags -h and -i", () => {
  const args = parseArgs(["-h"]);
  assertEquals(args.help, true);

  const argsI = parseArgs(["-i"]);
  assertEquals(argsI.interactive, true);
});

Deno.test("parseArgs - flag followed by another flag resolves to true", () => {
  const args = parseArgs(["--skip", "--method=saveUser"]);

  assertEquals(args.skip, true);
  assertEquals(args.method, "saveUser");
});

Deno.test("parseArgs - unknown flags without a value resolve to true", () => {
  const args = parseArgs(["--verbose", "--method=saveUser"]);

  assertEquals(args.verbose, true);
});

Deno.test("parseArgs - positional arguments land in _", () => {
  const args = parseArgs(["--method=x", "extra", "more"]);

  assertEquals(args._, ["extra", "more"]);
  assertEquals(args.method, "x");
});

Deno.test("parseArgs - empty input yields safe defaults", () => {
  const args = parseArgs([]);

  assertEquals(args._, []);
  assertEquals(args.interactive, false);
  assertEquals(args.method, undefined);
  assertEquals(args.help, undefined);
});

Deno.test("parseArgs - values containing dashes are preserved", () => {
  const args = parseArgs(["--userIdentifier=jane-ro-1", "--date=2024-01-15"]);

  assertEquals(args.userIdentifier, "jane-ro-1");
  assertEquals(args.date, "2024-01-15");
});
