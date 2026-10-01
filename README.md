# Smartschool

A modern, TypeScript-based, non-opinionated client for the Smartschool's APIs.
This client provides a simple interface to interact with all Smartschool API
endpoints.

## Features

- 🚀 Runtime agnostic (works in Deno, Browser, Node.js)
- 💪 Full TypeScript support with comprehensive type definitions
- 🔧 CLI interface for quick operations
- 🎯 Supports all Smartschool API endpoints
- 📘 Detailed documentation for each method

## Installation

### From NPM:

```bash
npm i @abrianto/smartschool-kit

import { SmartschoolClient } from '@abrianto/smartschool-kit'
```

### From JSR.io

```bash
# From JSR
jsr add @abrianto/smartschool-kit

# Direct import
import { SmartschoolClient } from "jsr:@abrianto/smartschool-kit";
```

## Usage

### As a Library

```typescript
import { SmartschoolClient } from "@abrianto/smartschool-kit";

const client = new SmartschoolClient({
  apiEndpoint: "https://your-school.smartschool.be/Webservices/V3",
  accesscode: "your-access-code",
});

// Create a user
await client.saveUser({
  username: "john.doe",
  name: "John",
  surname: "Doe",
  email: "john@example.com",
  basisrol: "leerkracht",
});

// Send a message
await client.sendMsg({
  userIdentifier: "john.doe",
  title: "Welcome",
  body: "Welcome to Smartschool!",
  senderIdentifier: "admin",
});

// Get user details
const userDetails = await client.getUserDetails({
  userIdentifier: "john.doe",
});
```

### Configuration options

```typescript
const client = new SmartschoolClient({
  apiEndpoint: "https://your-school.smartschool.be/Webservices/V3",
  accesscode: "your-access-code",

  // Optional: per-attempt timeout in ms (default 30000, 0 disables)
  timeoutMs: 30000,

  // Optional: retry failed requests (default 0 = no retries).
  // Only network errors, timeouts and HTTP 429/502/503/504 are retried —
  // API calls are not idempotent, so everything else fails fast.
  maxRetries: 2,

  // Optional: base delay in ms for exponential backoff between
  // retries; the delay before retry N is retryDelayMs * 2^(N-1) (default 300)
  retryDelayMs: 300,
});
```

The constructor validates that `apiEndpoint` and `accesscode` are present. The
client fetches the API's error-code table once per instance — the fetch is
shared across concurrent requests, and if it fails, requests proceed with
untranslated error codes.

### Using the CLI

### NPM:

```bash
npm i -g @abrianto/smartschool-kit
```

### Using the repository and Deno

```bash
# Get help
deno run --allow-net ./bin/cli.ts --help

# Create a user, skip optional parameters
deno run --allow-net ./bin/cli.ts \
  --method=saveUser \
  --config=./config.json \
  --username=john.doe \
  --name=John \
  --surname=Doe \
  --skip

# Send a message
deno run --allow-net --allow-read --allow-env ./bin/cli.ts \
  --config=./config.json \
  --method=sendMsg \
  --userIdentifier=jane.roe \
  --title=Hallo \
  --body="Lorem ipsum"

# Get absents
deno run --allow-net --allow-read --allow-env ./bin/cli.ts \
  --config=./config.json \
  --method=getAbsents \
  --userIdentifier=jane.roe \
  --schoolYear=2025

# Interactive mode
deno run --allow-net cli.ts --interactive
```

## Available Methods

See [coverage](API-COVERAGE.md)

### User Management

- `saveUser` - Create or update a user (upsert, overwrites existing accounts)
- `createUser` - Create a user, refusing to overwrite an existing username
- `findUserByUsername` - Get user details, or `null` when the user doesn't exist
- `getUserDetails` - Get user details
- `getUserDetailsByNumber` - Get user details by internal number
- `getUserDetailsByUsername` - Get user details by username
- `getUserDetailsByScannableCode` - Get user details by scannable code
- `delUser` - Delete a user (optional `officialDate`)
- `setAccountStatus` - Set user account status
- `changeUsername` - Change a user's username
- `changeInternNumber` - Change a user's internal number
- `changePasswordAtNextLogin` - Force password change at next login
- `forcePasswordReset` - Force password reset
- `replaceInum` - Replace internal user number
- `saveUserParameter` - Update user parameters (e.g., co-accounts)
- `changeGroupOwners` - Update group owners

### Groups and Classes

- `saveGroup` - Create or update a group
- `saveClass` - Create or update a class (optional `instituteNumber`,
  `adminNumber`, `schoolYearDate`)
- `getAllGroupsAndClasses` - Get all groups and classes
- `getClassList` - Get class list
- `getClassListJson` - Get class list in JSON
- `getClassTeachers` - Get class teachers (optional `getAllOwners`)
- `saveUserToGroup` - Add user to group (via
  `saveUserToClass`/`saveUserToClasses`)
- `removeUserFromGroup` - Remove user from group (optional `officialDate`)
- `delClass` - Delete a class
- `saveClassList` - Bulk update class list (serialized)
- `saveClassListJson` - Bulk update class list (JSON)
- `getSchoolyearDataOfClass` - Get class metadata (e.g., year)
- `saveSchoolyearDataOfClass` - Update class metadata
- `getSkoreClassTeacherCourseRelation` - Teacher-course links

### Messages

- `sendMsg` - Send a message (optional `attachments`, `coaccount`, `copyToLVS`)
- `saveSignature` - Save message signature

### Absences

- `getAbsents` - Get user absences
- `getAbsentsWithAlias` - Get absences with alias
- `getAbsentsByDate` - Get absences by date
- `getAbsentsWithAliasByDate` - Get absences with alias by date
- `getAbsentsWithInternalNumberByDate` - Get absences by internal number and
  date
- `getAbsentsWithUsernameByDate` - Get absences by username and date
- `getAbsentsByDateAndGroup` - Get absences by date and group

### Photos

- `getAccountPhoto` - Get user photo
- `setAccountPhoto` - Set user photo

### Courses

- `addCourse` - Add a course (optional `visibility`)
- `addCourseStudents` - Add students to course
- `addCourseTeacher` - Add teacher to course
- `getCourses` - Get all courses

### Helpdesk

- `addHelpdeskTicket` - Add a helpdesk ticket
- `getHelpdeskMiniDbItems` - Get helpdesk items

### Password Management

- `savePassword` - Set/update password

### Account Management

- `getAllAccounts` - List all accounts
- `getAllAccountsExtended` - Extended list of accounts
- `getUserOfficialClass` - Get user’s official class (optional `date`)

### Data Sync/System

- `startSkoreSync` - Start synchronization
- `checkStatus` - Check service status
- `clearGroup` - Remove all users from a group (optional `officialDate`)
- `unregisterStudent` - Unregister student (optional `officialDate`)

### Co-Accounts

- `removeCoAccount` - Delete co-account

### Student Career

- `getStudentCareer` - Get student career history

### Parameters

- `getReferenceField` - Retrieve reference field

### Error Handling

**Note:** The API itself handles error code translations. By default, the API
returns error codes, and we fetch them to translate them into clear error
messages using the `SmartschoolError` class.

- `returnCsvErrorCodes` - List error codes in CSV
- `returnJsonErrorCodes` - List error codes in JSON

### Deprecated

- `deactivateTwoFactorAuthentication` - No longer supported by Smartschool

## Type Definitions

The client includes comprehensive TypeScript definitions for all methods.
Example:

```typescript
interface SaveUser {
  username: string;
  name: string;
  surname: string;
  basisrol: string;
  email?: string;
  // ... other optional fields
}

interface SendMessage {
  userIdentifier: string;
  title: string;
  body: string;
  senderIdentifier?: string;
  attachments?: Array<{
    filename: string;
    filedata: string;
  }>;
  coaccount?: number;
  copyToLVS?: boolean;
}
```

## Error handling

All failures — transport-level and API-level — surface as `SmartschoolError`
with a `code` (unchanged, e.g. `"12"`) and a readable `reason`
(`"USER_NOT_FOUND"`). Compare against the exported `SmartschoolErrorCode` names
with `error.is(...)` instead of memorising numeric codes:

```typescript
import {
  SmartschoolError,
  SmartschoolErrorCode,
} from "@abrianto/smartschool-kit";

try {
  await client.getUserDetailsByUsername({ username: "john.doe" });
} catch (error) {
  if (error instanceof SmartschoolError) {
    if (error.is(SmartschoolErrorCode.USER_NOT_FOUND)) {
      // code "9", "12" or "25": Smartschool has several codes for this
    } else if (error.is(SmartschoolErrorCode.TIMEOUT)) {
      // ...
    } else {
      console.error(error.code, error.reason, error.message);
    }
  }
}
```

| `error.reason`           | `error.code`           | Meaning                                                               |
| ------------------------ | ---------------------- | --------------------------------------------------------------------- |
| `USER_NOT_FOUND`         | `"9"`, `"12"`, `"25"`  | The user does not exist.                                              |
| `USERNAME_EXISTS`        | `"6"`, `"15"`, `"26"`  | The username is already taken.                                        |
| `INTERNAL_NUMBER_EXISTS` | `"16"`, `"24"`, `"48"` | The internal number is already in use.                                |
| `INVALID_ACCESS_CODE`    | `"8"`                  | The webservices access code is wrong.                                 |
| `ROSTER_CODE_NOT_UNIQUE` | `"57"`                 | The roster code (`untis`) is already in use.                          |
| ... (all 57 codes)       | `"1"` .. `"57"`        | See `SMARTSCHOOL_ERROR_CODE_TABLE` / `SmartschoolErrorCode`.          |
| `SOAP_FAULT`             | `SOAP_FAULT`           | SOAP fault; the message carries Smartschool's `faultstring`.          |
| `HTTP_<status>`          | `HTTP_<status>`        | Non-2xx HTTP response (e.g. `HTTP_500`).                              |
| `INVALID_ROLE`           | `INVALID_ROLE`         | Client-side: `basisrol` is not a `SmartschoolRole` (no request sent). |
| `TIMEOUT`                | `TIMEOUT`              | Request exceeded `timeoutMs` and the retry budget.                    |
| `NETWORK`                | `NETWORK`              | Fetch failed at the network level after the retry budget.             |

Reasons that group several codes: `USER_NOT_FOUND` (9, 12, 25),
`USERNAME_EXISTS` (6, 15, 26) and `INTERNAL_NUMBER_EXISTS` (16, 24, 48). All
other codes have their own reason. Unknown numeric codes have
`reason === undefined`; the `message` is still Smartschool's own translated
text.

## Safe helpers

`basisrol` must be one of `SmartschoolRole` (`TEACHER` = `leerkracht`, `STUDENT`
= `leerling`, `MANAGEMENT` = `directie`, `OTHER` = `andere`). `saveUser` and
`createUser` throw a `SmartschoolError` (`INVALID_ROLE`) for anything else,
before sending a request.

`saveUser` is an upsert: calling it with an existing username silently
overwrites that account. Two helpers avoid the footguns:

```typescript
// null instead of an exception when the user doesn't exist
const user = await client.findUserByUsername("john.doe");

// throws SmartschoolError (reason USERNAME_EXISTS, code "6") instead of
// overwriting an existing account; returns the fresh user details otherwise
const created = await client.createUser({
  username: "john.doe",
  name: "John",
  surname: "Doe",
  basisrol: "leerkracht",
});
```

`createUser` checks and saves in two calls, so it is not atomic against
concurrent creators.

## CLI Configuration

Create a `config.json` file:

```json
{
  "apiEndpoint": "https://your-school.smartschool.be/Webservices/V3",
  "accesscode": "your-access-code"
}
```

## Contributing

Contributions are welcome! Please submit pull requests with any improvements.

## License

MIT License - see LICENSE file for details
