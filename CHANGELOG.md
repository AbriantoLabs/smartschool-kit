# Changelog

## 0.1.0

### Fixed

- **Security**: removed a leftover `console.log` that printed every SOAP request
  body — including the `accesscode` credential — on each API call.
- Requests now fail fast with a clear `SmartschoolError` (`HTTP_<status>`) on
  non-2xx responses, instead of feeding HTML error pages into the response
  parser.
- Response parser: JSON embedded in the SOAP body is now extracted with bracket
  balancing, so nested objects/arrays are no longer truncated at the first
  `]`/`}` (e.g. `{"items": [1, 2]}` inside a SOAP body).
- Response parser: base64 detection is strict — plain alphanumeric strings are
  no longer mistakenly run through `atob`.
- Response parser never silently returns `undefined` for unrecognized payloads;
  it throws a descriptive error instead.
- Fixed an initialization race: concurrent first requests now share a single
  error-code fetch instead of some proceeding without translations.
- Endpoint payload types no longer require `accesscode` on every call; the
  client injects the configured one (the documented examples now type-check).
- CLI (Deno): removed an unreachable `throw` that shadowed the error message +
  exit path.
- Docs consistently reference `@abrianto/smartschool-kit`; the JSR snippets
  previously pointed at a nonexistent `@abrianto/smartschool-client`.

- SOAP faults (usually HTTP 500 without a `<return>`) throw a `SmartschoolError`
  with code `SOAP_FAULT` and Smartschool's own `faultstring`, instead of a raw
  XML snippet. Never retried.

### Added

- `SmartschoolRole` (frozen name map + union type) and a typed
  `SaveUser.basisrol`. `saveUser`/`createUser` throw a `SmartschoolError` with
  reason `INVALID_ROLE` (client-side, no request sent) for an invalid role,
  instead of Smartschool's "Het selecteren van een basisrol is verplicht."
- `SmartschoolErrorCode` (frozen name map, also a type) and
  `SMARTSCHOOL_ERROR_CODE_TABLE`: readable names for all Smartschool error codes
  (several numeric codes can share one reason, e.g. `USER_NOT_FOUND` = 9/12/25).
- `SmartschoolError.reason` (readable name; also `SOAP_FAULT`, `HTTP_<n>`,
  `TIMEOUT`, `NETWORK`) and `SmartschoolError.is(reason)`. `.code` is unchanged.
- `SmartschoolClient.findUserByUsername()` (returns `null` for unknown users)
  and `SmartschoolClient.createUser()` (refuses to overwrite an existing
  username, since `saveUser` is an upsert).
- Per-attempt request timeouts via `timeoutMs` (default 30 s, `0` disables) with
  a `TIMEOUT` error code.
- Opt-in retries with exponential backoff via `maxRetries`/`retryDelayMs` for
  network errors, timeouts and HTTP 429/502/503/504. Everything else fails fast
  because API calls are not idempotent.
- Constructor validation of `apiEndpoint`/`accesscode`.
- `SaveUser.untis` (roster code / `koppelingsveldschoolagenda`) is now a
  documented field.
- This changelog.
- Comprehensive test suite: XML parser edge cases (nested JSON, base64, CDATA,
  repeated tags), HTTP/timeout/retry behavior, error translation,
  credential-leak regression, init-once concurrency, CLI argument parsing.
- CLI argument parsing extracted into a runtime-agnostic, unit-tested module
  (`src/cli-args.ts`).
- The Node CLI lazy-loads its prompt library, so library usage never loads
  `inquirer`.

### Changed

- `makeRequest` is generic internally; public method signatures and behavior are
  unchanged (the documented `"0"` → `true` success mapping now matches what the
  tests assert).
- XML `<return>` text values are entity-decoded; repeated sibling tags in
  flattened responses are collected into arrays; CDATA sections are unwrapped.

## 0.0.14

### Fixed

- **Security**: stopped logging every SOAP request body (access code and user
  passwords leaked into application logs).
- SOAP faults and non-2xx responses throw a `SmartschoolError` (`SOAP_FAULT` /
  `HTTP_<status>`) instead of being returned as data.
