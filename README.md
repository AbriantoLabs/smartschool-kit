# Smartschool

A modern, TypeScript-based, non-opinionated client for the Smartschool's APIs. This client provides a simple interface to interact with all Smartschool API endpoints.

## Features

- 🚀 Runtime agnostic (works in Deno, Browser, Node.js)
- 💪 Full TypeScript support with comprehensive type definitions
- 🔧 CLI interface for quick operations
- 🎯 Supports all Smartschool API endpoints
- 📘 Detailed documentation for each method

## Installation

```bash
# From JSR
jsr add @abrianto/smartschool-client

# Direct import
import { SmartschoolClient } from "jsr:@abrianto/smartschool-client";
```

## Usage

### As a Library

```typescript
import { SmartschoolClient } from "@abrianto/smartschool-client";

const client = new SmartschoolClient({
  apiEndpoint: "https://your-school.smartschool.be/Webservices/V3",
  accesscode: "your-access-code"
});

// Create a user
await client.saveUser({
  username: "john.doe",
  name: "John",
  surname: "Doe",
  email: "john@example.com",
  basisrol: "leerkracht"
});

// Send a message
await client.sendMsg({
  userIdentifier: "john.doe",
  title: "Welcome",
  body: "Welcome to Smartschool!",
  senderIdentifier: "admin"
});

// Get user details
const userDetails = await client.getUserDetails({
  userIdentifier: "john.doe"
});
```

### Using the CLI

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
- `saveUser` - Create or update a user
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
- `saveClass` - Create or update a class (optional `instituteNumber`, `adminNumber`, `schoolYearDate`)
- `getAllGroupsAndClasses` - Get all groups and classes
- `getClassList` - Get class list
- `getClassListJson` - Get class list in JSON
- `getClassTeachers` - Get class teachers (optional `getAllOwners`)
- `saveUserToGroup` - Add user to group (via `saveUserToClass`/`saveUserToClasses`)
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
- `getAbsentsWithInternalNumberByDate` - Get absences by internal number and date
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
**Note:** The API itself handles error code translations. By default, the API returns error codes, and we fetch them to translate them into clear error messages using the `SmartschoolError` class.

- `returnCsvErrorCodes` - List error codes in CSV
- `returnJsonErrorCodes` - List error codes in JSON

### Deprecated
- `deactivateTwoFactorAuthentication` - No longer supported by Smartschool

## Type Definitions

The client includes comprehensive TypeScript definitions for all methods. Example:

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

## Error Handling

The client provides proper error handling:

```typescript
try {
  await client.saveUser({...});
} catch (error) {
  if (error instanceof SmartschoolError) {
    console.error("API Error:", error.code, error.message);
  } else {
    console.error("Network or other error:", error);
  }
}
```

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
