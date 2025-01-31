/**
  # Smartschool API wrapper with CLI interface

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
    firstName: "John",
    lastName: "Doe",
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

  # Create a user
  deno run --allow-net ./bin/cli.ts \
    --method=saveUser \
    --config=./config.json \
    --username=john.doe \
    --firstName=John \
    --lastName=Doe

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
* @module
*/
import { generateXML, parseXMLResponse } from "./xml.ts";
import type {
  SmartschoolConfig,
  SetAccountStatus,
  CourseBase,
  SaveUser,
  SendMsg,
  GetAllAccounts,
  GetAbsents,
  GetAbsentsByDate,
  GetAbsentsByDateAndGroup,
  UserDetails,
  GetUserDetailsByNumber,
  GetUserDetailsByScannableCode,
  GetUserDetailsByUsername,
  GetUserOfficialClass,
  GetClassTeachers,
  GetSchoolyearDataOfClass,
  DelClass,
  SaveClass,
  DeactivateTwoFactorAuthentication,
  ForcePasswordReset,
  GetAbsentsWithAlias,
  GetAbsentsWithAliasByDate,
  GetAbsentsWithInternalNumberByDate,
  GetAbsentsWithUsernameByDate,
  GetAccountPhoto,
  GetAllAccountsExtended,
  GetStudentCareer,
  RemoveCoAccount,
  RemoveUserFromGroup,
  ReplaceInum,
  SavePassword,
  SaveUserToClass,
  SaveClassList,
  SaveClassListJson,
  SaveGroup,
  SaveSchoolyearDataOfClass,
  SaveSignature,
  SaveUserParameter,
  SaveUserToClasses,
  SaveUserToClassesAndGroups,
  SetAccountPhoto,
  UnregisterStudent,
  ChangeUsername,
  CheckStatus,
  ChangeGroupOwners,
  ClearGroup,
  ChangeInternNumber,
  ChangePasswordAtNextLogin,
  DelUser,
  AddHelpdeskTicket,
  SmartschoolParams,
  SuccessResponse,
  UserDetailsResponse,
  AddCourseStudents,
  AddCourseTeacher,
  GetAbsentsResponse,
  GetAbsentsWithInternalNumberByDateResponse,
  ReturnJsonErrorCodesResponse,
  GetAbsentsByDateResponse,
  GetAbsentsWithAliasByDateResponse,
  GetSchoolyearDataOfClassResponse,
  GetStudentCareerResponse,
  GetAbsentsWithAliasResponse,
  GetHelpdeskMiniDbItems,
  GetHelpdeskMiniDbItemsResponse,
  GetClassListJsonResponse,
} from "./types.ts";

export class SmartschoolError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "SmartschoolError";
  }
}

export class SmartschoolClient {
  private config: SmartschoolConfig;
  private errorCodes: Record<string, string> = {};
  private initializing: boolean = false;

  constructor(config: SmartschoolConfig) {
    this.config = config;
  }

  private async initialize(): Promise<void> {
    this.errorCodes = await this.returnJsonErrorCodes();
  }

  private async makeRequest(
    methodName: string,
    params: SmartschoolParams,
    opts = { needsAuth: true },
  ): Promise<unknown | Record<string, unknown>> {
    if (!Object.keys(this.errorCodes).length && !this.initializing) {
      this.initializing = true;
      try {
        await this.initialize();
      } catch (e) {
        console.error("Error initializing", e);
      }
    }

    const xmlBody = generateXML(methodName, {
      accesscode: opts.needsAuth ? this.config.accesscode : undefined,
      ...params,
    });

    const response = await fetch(this.config.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: xmlBody,
    });

    const responseText = await response.text();

    const json = parseXMLResponse(responseText);

    // If we got an error code, throw it
    if (this.errorCodes[json.toString()]) {
      throw new SmartschoolError(
        this.decodeHtmlEntities(this.errorCodes[json]),
        json,
      );
    }

    // For simple success responses ("0"), return true
    if (json.toString() === "0") {
      return true;
    }

    // Otherwise return the parsed response data
    return parseXMLResponse(json);
  }

  private decodeHtmlEntities(text: string): string {
    return text
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/<br\s*\/?>/gi, "\n");
  }

  /**
   * Create a new course in Smartschool
   *
   * @param data CourseBase
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.addCourse({
   *   coursename: "Mathematics",
   *   coursedesc: "Advanced mathematics course",
   *   visibility: 1
   * });
   * ```
   */
  addCourse(data: CourseBase) {
    return this.makeRequest("addCourse", data) as Promise<true>;
  }

  /**
   * Add classes to a specific course
   *
   * @param data AddCourseStudents
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.addCourseStudents({
   *   coursename: "Mathematics",
   *   coursedesc: "Advanced mathematics course",
   *   groupIds: "3A,3B,4A"
   * });
   * ```
   */
  addCourseStudents(data: AddCourseStudents) {
    return this.makeRequest("addCourseStudents", data) as Promise<true>;
  }

  /**
   * Add a teacher to a specific course
   *
   * @param data AddCourseTeacher
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.addCourseTeacher({
   *   coursename: "Mathematics",
   *   coursedesc: "Advanced mathematics course",
   *   internnummer: "T123",
   *   userlist: "T123,T124,T125"
   * });
   * ```
   */
  addCourseTeacher(data: AddCourseTeacher) {
    return this.makeRequest("addCourseTeacher", data) as Promise<true>;
  }

  /**
   * Retrieve all profile fields (except passwords and profile photo) and group memberships
   * of a specific user (main and co-accounts). Returns a JSON object.
   *
   * @param data UserDetails
   * @returns Promise<UserDetailsResponse> containing the user details as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getUserDetails({
   *   userIdentifier: "john.doe"
   * });
   * ```
   */
  getUserDetails(data: UserDetails): Promise<UserDetailsResponse> {
    return this.makeRequest(
      "getUserDetails",
      data,
    ) as Promise<UserDetailsResponse>;
  }

  /**
   * Retrieve all profile fields (except passwords and profile photo) and group memberships
   * of a specific user (main and co-accounts) by their internal number. Returns a JSON object.
   *
   * @param data GetUserDetailsByNumber
   * @returns Promise<UserDetailsResponse> containing the user details as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getUserDetailsByNumber({
   *   number: "12345"
   * });
   * ```
   */
  getUserDetailsByNumber(
    data: GetUserDetailsByNumber,
  ): Promise<UserDetailsResponse> {
    return this.makeRequest(
      "getUserDetailsByNumber",
      data,
    ) as Promise<UserDetailsResponse>;
  }

  /**
   * Retrieve all profile fields (except passwords and profile photo) and group memberships
   * of a specific user (main and co-accounts) by their username. Returns a JSON object.
   *
   * @param data GetUserDetailsByUsername
   * @returns Promise<UserDetailsResponse> containing the user details as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getUserDetailsByUsername({
   *   username: "john.doe"
   * });
   * ```
   */
  getUserDetailsByUsername(data: GetUserDetailsByUsername) {
    return this.makeRequest(
      "getUserDetailsByUsername",
      data,
    ) as Promise<UserDetailsResponse>;
  }

  /**
   * Identify a student using their Smartschool scannable code or a custom scannable value (UUID)
   *
   * @param data GetUserDetailsByScannableCode
   * @returns Promise<UserDetailsResponse> containing the user details as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getUserDetailsByScannableCode({
   *   scannableCode: "550e8400-e29b-41d4-a716-446655440000"
   * });
   * ```
   */
  getUserDetailsByScannableCode(
    data: GetUserDetailsByScannableCode,
  ): Promise<UserDetailsResponse> {
    return this.makeRequest(
      "getUserDetailsByScannableCode",
      data,
    ) as Promise<UserDetailsResponse>;
  }

  /**
   * Check which official class a student belongs to on a specific date
   *
   * @param data GetUserOfficialClass
   * @returns Promise<GetUserOfficialClassResponse> containing the official class details
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // With specific date
   * const response = await client.getUserOfficialClass({
   *   userIdentifier: "john.doe",
   *   date: "2024-01-15"
   * });
   *
   * // Without date (uses current date)
   * const response = await client.getUserOfficialClass({
   *   userIdentifier: "john.doe"
   * });
   * ```
   */
  getUserOfficialClass(
    data: GetUserOfficialClass,
  ): Promise<GetUserOfficialClass> {
    return this.makeRequest(
      "getUserOfficialClass",
      data,
    ) as Promise<GetUserOfficialClass>;
  }

  /**
   * Set the signature (Messages) for a specific main or co-account
   *
   * @param data SaveSignature
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.saveSignature({
   *   userIdentifier: "john.doe",
   *   accountType: 0,
   *   signature: "Best regards,\nJohn Doe"
   * });
   * ```
   */
  saveSignature(data: SaveSignature): Promise<true> {
    return this.makeRequest("saveSignature", data) as Promise<true>;
  }

  /**
   * Retrieve official absences (morning and afternoon) of a student for a specific school year.
   *
   * @param data GetAbsents
   * @returns Promise<GetAbsentsResponse>
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Request
   * const response = await client.getAbsents({
   *   userIdentifier: "john.doe",
   *   schoolYear: "2024"
   * });
   *
   * // Example Response:
   * {
   *   "2024-09-01": {
   *     "am": null,    // No registration needed (e.g., weekend)
   *     "pm": null
   *   },
   *   "2024-09-02": {
   *     "am": "|",     // Present
   *     "pm": "|"
   *   },
   *   "2024-09-03": {
   *     "am": "L",     // Late
   *     "pm": "L"
   *   },
   *   "2024-09-05": {
   *     "am": "|",     // Present in morning
   *     "pm": "Z"      // Sick in afternoon
   *   }
   * }
   *
   * // Accessing the data
   * console.log(response["2024-09-03"].am);     // "L"
   * console.log(response["2024-09-05"].pm);     // "Z"
   * ```
   */
  getAbsents(data: GetAbsents): Promise<GetAbsentsResponse> {
    return this.makeRequest("getAbsents", data) as Promise<GetAbsentsResponse>;
  }

  /**
   * Get a list of class teachers. Returns a JSON object.
   *
   * @param data GetClassTeachers
   * @returns Promise<GetClassTeachers> containing the class teachers
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Get all class teachers
   * const response = await client.getClassTeachers({
   *   getAllOwners: true
   * });
   *
   * // Get only first class teacher
   * const response = await client.getClassTeachers({
   *   getAllOwners: false
   * });
   * ```
   */
  getClassTeachers(data: GetClassTeachers): Promise<GetClassTeachers> {
    return this.makeRequest(
      "getClassTeachers",
      data,
    ) as Promise<GetClassTeachers>;
  }

  /**
   * Create or modify classes and official classes in Smartschool.
   * Note: It's not possible to change the class name of existing classes/official classes
   * or move existing classes under different parent groups through the API.
   *
   * @param data SaveClass
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Create a regular class
   * const response = await client.saveClass({
   *   name: "3A",
   *   desc: "Third grade class A",
   *   code: "1A",
   *   parent: "THIRD-GRADE",
   *   untis: "3A"
   * });
   *
   * // Create an official class
   * const response = await client.saveClass({
   *   name: "4B",
   *   desc: "Fourth grade class B",
   *   code: "1A",
   *   parent: "FOURTH-GRADE",
   *   untis: "4B",
   *   instituteNumber: "123456",
   *   adminNumber: "789",
   *   schoolYearDate: "2024-09-01"
   * });
   * ```
   */
  saveClass(data: SaveClass): Promise<true> {
    return this.makeRequest("saveClass", data) as Promise<true>;
  }

  /**
   * Create or modify groups in Smartschool.
   * Note: It's not possible to change the group name of existing groups
   * or move existing groups under different parent groups through the API.
   *
   * @param data SaveGroup
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Create a new group
   * const response = await client.saveGroup({
   *   name: "Science Club",
   *   desc: "Group for science enthusiasts",
   *   code: "SCI-CLUB",
   *   parent: "CLUBS",
   *   untis: "SCICLUB"
   * });
   *
   * // Modify an existing group
   * const response = await client.saveGroup({
   *   name: "Science Club",
   *   desc: "Updated description for science club",
   *   code: "SCI-CLUB", // Existing group code
   *   parent: "0", // Keep current parent
   *   untis: "SCICLUB"
   * });
   * ```
   */
  saveGroup(data: SaveGroup): Promise<true> {
    return this.makeRequest("saveGroup", data) as Promise<true>;
  }

  /**
   * Update user profile parameters in Smartschool. This method can modify various profile fields
   * including personal information, co-account details, and specific educational parameters.
   *
   * @param data SaveUserParameter
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @remarks
   * Supported parameters include:
   * - Profile fields: name, surname, extranames, initials, sex, status, role, number, etc.
   * - Address fields: street, streetnr, busnr, postalCode, location, country
   * - Contact fields: email, website, mobilePhone, homePhone, fax, im
   * - Co-account fields (1-6): type_coaccount{n}, naam_coaccount{n}, voornaam_coaccount{n}, etc.
   * - Educational fields: Godsdienstkeuze (religion choice), Soort leerling (student type), Nationaliteit (nationality)
   * - GO! school roles: gorollen (as JSON-encoded array)
   *
   * Special parameter values:
   * - Co-account status: 'actief', 'niet actief', or 'actief tot en met yyyy/mm/dd'
   * - Religion choice: 'MOR', 'CAT', 'PRO', 'ISR', 'ISL', 'ORT', 'ANG', 'DIS', 'CUL', 'PER'
   * - Student type (secondary): '01'/'V', '02'/'R', '03', '99'
   * - Student type (primary): '01', '02', '99'
   *
   * @example Example
   * ```typescript
   * // Update basic profile information
   * const response = await client.saveUserParameter({
   *   userIdentifier: "john.doe",
   *   paramName: "email",
   *   paramValue: "john.doe@example.com"
   * });
   *
   * // Update co-account status
   * const response = await client.saveUserParameter({
   *   userIdentifier: "john.doe",
   *   paramName: "status_coaccount1",
   *   paramValue: "actief tot en met 2024/12/31"
   * });
   *
   * // Set religion choice
   * const response = await client.saveUserParameter({
   *   userIdentifier: "john.doe",
   *   paramName: "Godsdienstkeuze",
   *   paramValue: "CAT"
   * });
   *
   * // Set GO! roles
   * const response = await client.saveUserParameter({
   *   userIdentifier: "john.doe",
   *   paramName: "gorollen",
   *   paramValue: '["Leerkracht"]'
   * });
   * ```
   */
  saveUserParameter(data: SaveUserParameter): Promise<true> {
    return this.makeRequest("saveUserParameter", data) as Promise<true>;
  }

  /**
   * Create a new user or modify an existing user in Smartschool.
   * The system checks the userIdentifier field to determine if it should create or update a user.
   *
   * @param data SaveUser
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @remarks
   * The address field can include house number and box number in the following formats:
   * - "Street 22"
   * - "Street 22 bus 1"
   * - "Street 22/1" (will be converted to "Street 22 bus 1")
   *
   * @example Example
   * ```typescript
   * // Create a new user
   * const response = await client.saveUser({
   *   userIdentifier: "12345",
   *   username: "john.doe",
   *   passwd1: "secretPassword123",
   *   name: "John",
   *   surname: "Doe",
   *   basisrol: "leerling",
   *   email: "john.doe@example.com",
   *   address: "Main Street 42 bus 3",
   *   postalcode: "1000",
   *   location: "Brussels",
   *   country: "Belgium"
   * });
   *
   * // Update an existing user
   * const response = await client.saveUser({
   *   userIdentifier: "12345", // Existing user's identifier
   *   username: "john.doe",
   *   name: "John",
   *   surname: "Doe",
   *   basisrol: "leerling",
   *   email: "new.email@example.com"
   * });
   *
   * @todo Non required fields are required in the CLI
   * ```
   */
  saveUser(data: SaveUser): Promise<true> {
    return this.makeRequest("saveUser", data) as Promise<true>;
  }

  /**
   * Send a message to a user's main account or co-account. Attachments are optional.
   *
   * @param data SendMsg
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Simple message without attachments
   * const response = await client.sendMsg({
   *   userIdentifier: "john.doe",
   *   title: "Test Message",
   *   body: "Hello, this is a test message",
   *   senderIdentifier: "jane.smith",
   *   coaccount: 0,
   *   copyToLVS: false
   * });
   *
   *
   * // Message with file attachments using Node.js fs
   * // Read files and convert to base64 for NodeJS
   * import { readFileSync } from 'fs';
   * import { join } from 'path';
   *
   * const file1 = readFileSync(join(__dirname, 'document.pdf'));
   * const file2 = readFileSync(join(__dirname, 'image.jpg'));
   *
   * // Read files and convert to base64 for Deno
   * import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64"
   * import { join } from 'npm:path';
   *
   * const file1 = encodeBase64(await Deno.readFile(join(Deno.cwd(), 'document.pdf')));
   * const file2 = encodeBase64(await Deno.readFile(join(Deno.cwd(), 'image.jpg')));
   *
   *
   * const response = await client.sendMsg({
   *   userIdentifier: "john.doe",
   *   title: "Message with Attachments",
   *   body: "Please find the requested files attached.",
   *   senderIdentifier: "jane.smith",
   *   attachments: [
   *     {
   *       filename: "document.pdf",
   *       filedata: file1.toString('base64')
   *     },
   *     {
   *       filename: "image.jpg",
   *       filedata: file2.toString('base64')
   *     }
   *   ]
   * });
   * ```
   */
  sendMsg(data: SendMsg): Promise<true> {
    return this.makeRequest("sendMsg", data) as Promise<true>;
  }

  /**
   * Set or remove a user's profile photo.
   * An empty photo value can be used to remove the existing photo.
   *
   * @param data SetAccountPhoto
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Set a new profile photo using Node.js fs
   * import { readFileSync } from 'fs';
   * import { join } from 'path';
   *
   * const photoFile = readFileSync(join(__dirname, 'photo.jpg'));
   * const photoBase64 = photoFile.toString('base64');
   *
   * // Set a new profile photo using Deno
   * // Read files and convert to base64 for Deno
   * import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64"
   * import { join } from 'npm:path';
   *
   * const file1 = encodeBase64(await Deno.readFile(join(Deno.cwd(), 'document.pdf')));
   * const file2 = encodeBase64(await Deno.readFile(join(Deno.cwd(), 'image.jpg')));
   *
   * const response = await client.setAccountPhoto({
   *   userIdentifier: "john.doe",
   *   photo: photoBase64
   * });
   *
   * // Remove existing profile photo
   * const response = await client.setAccountPhoto({
   *   userIdentifier: "john.doe",
   *   photo: ""
   * });
   * ```
   */
  setAccountPhoto(data: SetAccountPhoto): Promise<true> {
    return this.makeRequest("setAccountPhoto", data) as Promise<true>;
  }

  /**
   * Change the status of a user's account.
   *
   * @param data SetAccountStatus
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Set account to active
   * const response = await client.setAccountStatus({
   *   userIdentifier: "john.doe",
   *   accountStatus: "actief"
   * });
   *
   * // Set account to inactive
   * const response = await client.setAccountStatus({
   *   userIdentifier: "john.doe",
   *   accountStatus: "niet actief"
   * });
   *
   * // Set account active until specific date
   * const response = await client.setAccountStatus({
   *   userIdentifier: "john.doe",
   *   accountStatus: "actief tot en met 2024/12/31"
   * });
   * ```
   */
  setAccountStatus(data: SetAccountStatus): Promise<true> {
    return this.makeRequest("setAccountStatus", data) as Promise<true>;
  }

  /**
   * Haalt alle Smartschool API errorcodes op in CSV-formaat.
   *
   * @returns Promise met een string in CSV-formaat die alle errorcodes bevat
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.returnCsvErrorCodes();
   * // Response bevat CSV data met errorcodes, bijvoorbeeld:
   * // "code;description\n1;Invalid username\n2;Invalid password"
   * ```
   */
  returnCsvErrorCodes(): Promise<string> {
    return this.makeRequest(
      "returnCsvErrorCodes",
      {},
      { needsAuth: false },
    ) as Promise<string>;
  }

  /**
   * Haalt de officiële afwezigheden (voor- en namiddag) van alle leerlingen op voor een specifieke datum.
   *
   * @param data GetAbsentsWithInternalNumberByDate
   * @returns Promise<GetAbsentsWithInternalNumberByDateResponse> met de afwezigheden als JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getAbsentsWithInternalNumberByDate({
   *   date: "2024-01-15"
   * });
   * ```
   */
  getAbsentsWithInternalNumberByDate(
    data: GetAbsentsWithInternalNumberByDate,
  ): Promise<GetAbsentsWithInternalNumberByDateResponse> {
    return this.makeRequest(
      "getAbsentsWithInternalNumberByDate",
      data,
    ) as Promise<GetAbsentsWithInternalNumberByDateResponse>;
  }

  /**
   * Retrieve all Smartschool API error codes in JSON format.
   *
   * @returns Promise containing a JSON object with all error codes and their descriptions
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.returnJsonErrorCodes();
   * // Response contains JSON data with error codes, for example:
   * // {
   * // "1": "De naam dient minimaal uit 2 karakters te bestaan.",
   * // "2": "De voornaam dient uit minimaal 2 karakters te bestaan.",
   * // "3": "De gebruikersnaam dient minimaal uit 2 karakters bestaan.",
   * // "4": "Het nieuwe wachtwoord is niet complex genoeg.&lt;br&gt;Bekijk de voorwaarden voor een wachtwoord of wachtzin in de handleiding (Profiel &gt; Gebruikersnaam en wachtwoord).",
   * //   ...
   * // }
   * ```
   */
  returnJsonErrorCodes(): Promise<ReturnJsonErrorCodesResponse> {
    return this.makeRequest(
      "returnJsonErrorCodes",
      {},
      { needsAuth: false },
    ) as Promise<ReturnJsonErrorCodesResponse>;
  }

  /**
   * Wijzigt de gebruikersnaam van een gebruiker op basis van het intern nummer.
   *
   * @param data ChangeUsername
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.changeUsername({
   *   internNumber: "12345",
   *   newUsername: "nieuwe.gebruikersnaam"
   * });
   * ```
   */
  changeUsername(data: ChangeUsername): Promise<true> {
    return this.makeRequest("changeUsername", data) as Promise<true>;
  }

  /**
   * Remove a group, class or official class from Smartschool.
   * This method only removes the group/class itself, not its members.
   *
   * @param data DelClass
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Remove a class
   * const response = await client.delClass({
   *   code: "1A"
   * });
   *
   * // Remove a group
   * const response = await client.delClass({
   *   code: "SCIENCE-CLUB"
   * });
   * ```
   */
  delClass(data: DelClass): Promise<true> {
    return this.makeRequest("delClass", data) as Promise<true>;
  }

  /**
   * Retrieve official absences (morning and afternoon) of all students for a specific date.
   * Returns a JSON object.
   *
   * @param data GetAbsentsByDate
   * @returns Promise<GetAbsentsByDateResponse>
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getAbsentsByDate({
   *   date: "2024-01-15"
   * });
   * ```
   */
  getAbsentsByDate(data: GetAbsentsByDate): Promise<GetAbsentsByDateResponse> {
    return this.makeRequest(
      "getAbsentsByDate",
      data,
    ) as Promise<GetAbsentsByDateResponse>;
  }

  /**
   * Retrieve official absences (morning and afternoon) of all students in a specific class/group for a specific date.
   * Returns a JSON object.
   *
   * @param data GetAbsentsByDateAndGroup
   * @returns Promise<GetAbsentsByDateResponse>
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getAbsentsByDateAndGroup({
   *   date: "2024-01-15",
   *   code: "1A"
   * });
   * ```
   */
  getAbsentsByDateAndGroup(
    data: GetAbsentsByDateAndGroup,
  ): Promise<GetAbsentsByDateResponse> {
    return this.makeRequest(
      "getAbsentsByDateAndGroup",
      data,
    ) as Promise<GetAbsentsByDateResponse>;
  }

  /**
   * Retrieve official absences (morning and afternoon) including aliases of all students for a specific date.
   * Returns a JSON object.
   *
   * @param data GetAbsentsWithAliasByDate
   * @returns Promise<GetAbsentsWithAliasByDateResponse>
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getAbsentsWithAliasByDate({
   *   date: "2024-01-15"
   * });
   * ```
   */
  getAbsentsWithAliasByDate(
    data: GetAbsentsWithAliasByDate,
  ): Promise<GetAbsentsWithAliasByDateResponse> {
    return this.makeRequest(
      "getAbsentsWithAliasByDate",
      data,
    ) as Promise<GetAbsentsWithAliasByDateResponse>;
  }

  /**
   * Retrieve a user's profile photo.
   *
   * @param data GetAccountPhoto
   * @returns Promise containing the photo as a base64 encoded string
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getAccountPhoto({
   *   userIdentifier: "john.doe"
   * });
   * // Response contains the photo as base64 string
   * ```
   *
   * @todo Not working, return empty object
   * @todo Translate base64 to image
   */
  getAccountPhoto(data: GetAccountPhoto): Promise<string> {
    return this.makeRequest("getAccountPhoto", data) as Promise<string>;
  }

  /**
   * Retrieves all school year data for the specified class.
   * This method provides information about the class for the current school year.
   *
   * @param data GetSchoolyearDataOfClass
   * @returns Promise<GetSchoolyearDataOfClassResponse> containing the school year data as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getSchoolyearDataOfClass({
   *   classCode: "1A1"
   * });
   * // Response contains a JSON object with school year data like:
   * // {
   * //   "id": 343,
   * //   "groupId": 309,
   * //   "schoolyear": "2024-2025",
   * //   "instituteNumber": "127704",
   * //   "administrativeGroupNumber": 6246,
   * //   "residence": "",
   * //   "domain": "",
   * //   "studyChoiceComponent": "",
   * //   "principal": "Franky Loosveld"
   * // }
   * ```
   */
  getSchoolyearDataOfClass(
    data: GetSchoolyearDataOfClass,
  ): Promise<GetSchoolyearDataOfClassResponse> {
    return this.makeRequest(
      "getSchoolyearDataOfClass",
      data,
    ) as Promise<GetSchoolyearDataOfClassResponse>;
  }

  /**
   * Retrieve Skore class-teacher-course relationships in JSON format.
   * This method returns a structured overview of which teachers teach which courses in which classes.
   *
   * @beta This method has not been tested yet
   * @returns Promise containing a JSON object with class-teacher-course relationships
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getSkoreClassTeacherCourseRelation();
   * ```
   * @todo figure out response type and add proper return type annotation, my test only shows an empty object
   */
  getSkoreClassTeacherCourseRelation() {
    return this.makeRequest("getSkoreClassTeacherCourseRelation", {});
  }

  /**
   * Retrieves the complete educational career of a student.
   * This method returns a JSON object containing all available information about the student's academic career.
   *
   * @param data GetStudentCareer
   * @returns Promise
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getStudentCareer({
   *   userIdentifier: "john.doe"
   * });
   * // Response contains a JSON object with the academic career, for example:
   * // [
   * //   {
   * //     "inClass": true,
   * //     "outSchool": false,
   * //     "date": "2025-01-01",
   * //     "stamboeknummer": "1234567",
   * //     "groupName": "1A",
   * //     "groupCode": "1A",
   * //     "adminNumber": "12345",
   * //     "instituteNumber": "123456"
   * //   }
   * // ]
   * ```
   */
  getStudentCareer(data: GetStudentCareer): Promise<GetStudentCareerResponse> {
    return this.makeRequest(
      "getStudentCareer",
      data,
    ) as Promise<GetStudentCareerResponse>;
  }

  /**
   * Update a list of classes using a serialized array format.
   * This method allows you to update multiple classes in a single API call.
   *
   * @beta This method has not been tested yet
   * @param data - The class list data
   * @param data.serializedList - A serialized array containing all classes to update
   * @returns Returning true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.saveClassList({
   *   serializedList: 'a:2:{i:0;a:5:{s:4:"name";s:2:"3A";s:4:"desc";s:15:"Third grade A";' +
   *                  's:4:"code";s:7:"1A";s:6:"parent";s:11:"THIRD-GRADE";s:5:"untis";s:2:"3A";}' +
   *                  'i:1;a:5:{s:4:"name";s:2:"3B";s:4:"desc";s:15:"Third grade B";' +
   *                  's:4:"code";s:7:"3B-2024";s:6:"parent";s:11:"THIRD-GRADE";s:5:"untis";s:2:"3B";}}'
   * });
   * ```
   *
   * @todo Test and implement
   */
  saveClassList(data: SaveClassList) {
    return this.makeRequest("saveClassList", data);
  }

  /**
   * Update a list of classes using a JSON array format.
   * This method allows you to update multiple classes in a single API call using JSON notation.
   *
   * @beta This method has not been tested yet
   * @param data - The class list data
   * @param data.jsonList - A JSON array containing all classes to update
   * @returns Returning true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.saveClassListJson({
   *   jsonList: JSON.stringify([
   *     {
   *       name: "3A",
   *       desc: "Third grade A",
   *       code: "1A",
   *       parent: "THIRD-GRADE",
   *       untis: "3A"
   *     },
   *     {
   *       name: "3B",
   *       desc: "Third grade B",
   *       code: "3B-2024",
   *       parent: "THIRD-GRADE",
   *       untis: "3B"
   *     }
   *   ])
   * });
   *
   * @todo Test and implement
   * ```
   */
  saveClassListJson(data: SaveClassListJson) {
    return this.makeRequest("saveClassListJson", data);
  }

  /**
   * Retrieves official absences (morning and afternoon) including aliases of a student
   * for a specific school year. Returns a JSON object.
   *
   * @param data GetAbsentsWithAlias
   * @returns Promise<GetAbsentsWithAliasResponse>
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getAbsentsWithAlias({
   *   userIdentifier: "john.doe",
   *   schoolYear: "2023"
   * });
   * // Response contains a JSON object with absences including aliases for school year 2023-2024
   *
   * // {
   * //   "2024-09-01": {
   * //     "am": {
   * //       "code": "|",
   * //       "alias": null
   * //     },
   * //     "pm": {
   * //       "code": "-",
   * //       "alias": null
   * //     }
   * //   }
   * // }
   * ```
   */
  getAbsentsWithAlias(
    data: GetAbsentsWithAlias,
  ): Promise<GetAbsentsWithAliasResponse> {
    return this.makeRequest(
      "getAbsentsWithAlias",
      data,
    ) as Promise<GetAbsentsWithAliasResponse>;
  }

  /**
   * Retrieves user information (first name, last name, username, internal number, and official class number)
   * for all users in a specified group. Returns base64 encoded XML.
   *
   * @beta Method has been tested but is returning a weird XML response
   * @param data GetAllAccounts
   * @returns Promise containing base64 encoded XML with user information
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Get accounts from a single group
   * const response = await client.getAllAccounts({
   *   code: "1A",
   *   recursive: "0"
   * });
   *
   * // Get accounts including all subgroups
   * const response = await client.getAllAccounts({
   *   code: "THIRD-GRADE",
   *   recursive: "1"
   * });
   * ```
   *
   * @todo Test, fix and implement
   */
  getAllAccounts(data: GetAllAccounts) {
    return this.makeRequest("getAllAccounts", data);
  }

  /**
   * Check the status of a Skore synchronization task that was started using startSkoreSync.
   * This method allows you to monitor the progress of a synchronization job.
   *
   * @beta Method hasn't been tested yet
   * @param data CheckStatus
   * @returns Promise containing one of these status values:
   * - "no_status": No task found for the provided serviceId
   * - "busy": Task is currently running
   * - "done": Task completed successfully
   * - "error": Task failed due to an error during execution
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // First start a sync task
   * const syncResponse = await client.startSkoreSync();
   * const serviceId = syncResponse.serviceId;
   *
   * // Then check its status
   * const response = await client.checkStatus({
   *   serviceId: serviceId
   * });
   *
   * // Response will contain the current status
   * console.log(response); // e.g., "busy", "done", etc.
   * ```
   *
   * @todo Test, fix and implement
   */
  checkStatus(data: CheckStatus) {
    return this.makeRequest("checkStatus", data);
  }

  /**
   * Replace a user's internal number with a new one.
   * This method allows you to change the internal identifier number of a specific user.
   *
   * @param data ReplaceInum
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.replaceInum({
   *   oldInum: "12345",
   *   newInum: "67890"
   * });
   * ```
   */
  replaceInum(data: ReplaceInum): Promise<true> {
    return this.makeRequest("replaceInum", data) as Promise<true>;
  }

  /**
   * Remove a specific co-account from a user.
   * This method allows you to delete a co-account while keeping the main account intact.
   *
   * @param data RemoveCoAccount
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Remove the first co-account of a user
   * const response = await client.removeCoAccount({
   *   userIdentifier: "john.doe",
   *   accountType: "1"
   * });
   *
   * // Remove the second co-account of a user
   * const response = await client.removeCoAccount({
   *   userIdentifier: "john.doe",
   *   accountType: "2"
   * });
   * ```
   */
  removeCoAccount(data: RemoveCoAccount): Promise<true> {
    return this.makeRequest("removeCoAccount", data) as Promise<true>;
  }

  /**
   * Set the password for a user's main account or co-account.
   *
   * @param data SavePassword
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @remarks
   * The password must meet Smartschool's password requirements:
   * - Minimum length of 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   *
   * @example Example
   * ```typescript
   * // Set main account password
   * const response = await client.savePassword({
   *   userIdentifier: "john.doe",
   *   password: "NewSecure123!",
   *   accountType: "0",
   *   changePasswordAtNextLogin: 1
   * });
   *
   * // Set co-account password without forced change, exists but doesn't work
   * const response = await client.savePassword({
   *   userIdentifier: "john.doe",
   *   password: "CoAccount456#",
   *   accountType: "1",
   *   changePasswordAtNextLogin: 0
   * });
   * ```
   */
  savePassword(data: SavePassword): Promise<true> {
    return this.makeRequest("savePassword", data) as Promise<true>;
  }

  /**
   * Move a user to a new official class. A student can only be linked to one official class at a time.
   *
   * @param data SaveUserToClass
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Move student to new class with specific date
   * const response = await client.saveUserToClass({
   *   userIdentifier: "john.doe",
   *   class: "4A-2024",
   *   officialDate: "2024-01-15"
   * });
   *
   * // Move student to new class without specific date
   * const response = await client.saveUserToClass({
   *   userIdentifier: "john.doe",
   *   class: "4A-2024"
   * });
   * ```
   */
  saveUserToClass(data: SaveUserToClass): Promise<true> {
    return this.makeRequest("saveUserToClass", data) as Promise<true>;
  }

  /**
   * Link a user to multiple classes/groups. New classes and groups will be added to existing ones.
   * For official classes: the student will be removed from their current official class and
   * linked to the new official class provided in the list.
   *
   * @beta Method has not been tested yet
   * @param data SaveUserToClasses
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Add user to multiple classes/groups
   * const response = await client.saveUserToClasses({
   *   userIdentifier: "john.doe",
   *   csvList: "4A-2024,MATH-CLUB,CHESS-TEAM"
   * });
   * ```
   */
  saveUserToClasses(data: SaveUserToClasses): Promise<true> {
    return this.makeRequest("saveUserToClasses", data) as Promise<true>;
  }

  /**
   * Define memberships of official class, classes, and groups for a specific user.
   * This method allows you to either add new memberships to existing ones or replace all existing memberships.
   * If there are any errors during processing, a CSV file with error codes will be returned.
   *
   * @beta Method has not been tested yet
   * @param data SaveUserToClassesAndGroups
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Add new memberships while keeping existing ones
   * const response = await client.saveUserToClassesAndGroups({
   *   userIdentifier: "john.doe",
   *   csvList: "4A-2024,MATH-CLUB,CHESS-TEAM",
   *   keepOld: "1"
   * });
   *
   * // Replace all existing memberships with new ones
   * const response = await client.saveUserToClassesAndGroups({
   *   userIdentifier: "john.doe",
   *   csvList: "4A-2024,MATH-CLUB,CHESS-TEAM",
   *   keepOld: "0"
   * });
   * ```
   */
  saveUserToClassesAndGroups(data: SaveUserToClassesAndGroups): Promise<true> {
    return this.makeRequest(
      "saveUserToClassesAndGroups",
      data,
    ) as Promise<true>;
  }

  /**
   * Update the school year data for a specified class.
   * This method allows you to modify various administrative details for a class within a specific school year.
   *
   * @beta Method has not been tested yet
   * @param data SaveSchoolyearDataOfClass
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.saveSchoolyearDataOfClass({
   *   classCode: "1A",
   *   date: "2024-01-15",
   *   instituteNumber: "123456",
   *   administrativeGroupNumber: "789",
   *   residence: "Main Campus",
   *   domain: "Sciences",
   *   principal: "John Smith"
   * });
   * ```
   */
  saveSchoolyearDataOfClass(data: SaveSchoolyearDataOfClass): Promise<true> {
    return this.makeRequest("saveSchoolyearDataOfClass", data) as Promise<true>;
  }

  /**
   * Retrieve the unique reference field that is configured in the platform.
   * This method returns which field ('number' or 'username') is used as the unique identifier in the platform.
   *
   * @beta Don't understand this method
   * @returns Promise containing the reference field setting ('number' or 'username')
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getReferenceField();
   * // Response will be either "number" or "username" depending on platform configuration
   * ```
   *
   * @todo Figure this out
   */
  getReferenceField() {
    return this.makeRequest("getReferenceField", {});
  }

  /**
   * Retrieve all items from mini databases that are available for use in the Helpdesk module.
   * These items can be used when creating or managing helpdesk tickets.
   *
   * @returns Promise<GetHelpdeskMiniDbItemsResponse> containing the mini database items
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getHelpdeskMiniDbItems();
   * // Response contains mini database items that can be used in helpdesk tickets, for example:
   * // [
   * //   {
   * //     "itemId": "33",
   * //     "name": "ICT",
   * //     "type": "group",
   * //     "kind": "miniDb",
   * //     "children": [
   * //       {
   * //         "itemId": "81a0704e-9cc2-424e-86e4-555188b8aff0",
   * //         "name": "Hardware PC",
   * //         "type": "item",
   * //         "kind": "item"
   * //       }
   * //     ]
   * //   }
   * // ]
   * ```
   */
  getHelpdeskMiniDbItems(): Promise<GetHelpdeskMiniDbItemsResponse> {
    return this.makeRequest(
      "getHelpdeskMiniDbItems",
      {},
    ) as Promise<GetHelpdeskMiniDbItemsResponse>;
  }

  /**
   * Retrieve a list of all courses in Smartschool.
   * Returns a JSON object containing course information.
   *
   * @beta Method has been tester but it's return weird XML
   * @returns Promise<string>
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getCourses();
   * // Response example:
   * ```
   *
   * @todo implement
   */
  getCourses(): Promise<string> {
    return this.makeRequest("getCourses", {}) as Promise<string>;
  }

  /**
   * Unregister a student from Smartschool.
   * This method allows you to officially withdraw a student from the school.
   *
   * @beta Method has not been tested yet
   * @param data UnregisterStudent
   * @returns Returning true if successful
   *
   * @example Example
   * ```typescript
   * // Unregister student with specific date
   * const response = await client.unregisterStudent({
   *   userIdentifier: "john.doe",
   *   officialDate: "2024-01-15"
   * });
   *
   * // Unregister student without specific date (requires manual confirmation)
   * const response = await client.unregisterStudent({
   *   userIdentifier: "john.doe"
   * });
   *
   * @todo Test and implement
   * ```
   */
  unregisterStudent(data: UnregisterStudent) {
    return this.makeRequest("unregisterStudent", data);
  }

  /**
   * Start the synchronization of classes and students from Smartschool to Skore.
   * This method allows you to initiate a sync operation that will update Skore with the latest data from Smartschool.
   *
   * @beta Method has not been tested yet
   * @returns Promise containing a JSON object with the UUID of the synchronization task
   * @throws SmartschoolError if the API returns an error
   *
   * @remarks
   * - This operation can only be initiated once every 15 minutes
   * - The sync process runs asynchronously; use checkStatus() to monitor progress
   *
   * @example Example
   * ```typescript
   * const response = await client.startSkoreSync();
   * // Response example:
   * // {
   * //   "serviceId": "550e8400-e29b-41d4-a716-446655440000"
   * // }
   *
   * // You can then check the status using:
   * const status = await client.checkStatus({
   *   serviceId: response.serviceId
   * });
   *
   * @todo Test and implement
   * ```
   */
  startSkoreSync() {
    return this.makeRequest("startSkoreSync", {});
  }

  /**
   * Create a new ticket in the Helpdesk module.
   * Use the getHelpdeskMiniDbItems() method to retrieve all available mini database items
   * that can be used in the Helpdesk module.
   *
   * @beta Method has not been tested yet
   * @param data AddHelpdeskTicket
   * @returns Returning true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Create a high-priority ticket
   * const response = await client.addHelpdeskTicket({
   *   title: "Hardware Issue",
   *   description: "Computer not booting up",
   *   priority: 5,
   *   miniDbItem: "hardware_issues",
   *   userIdentifier: "john.doe"
   * });
   *
   * // Create a normal priority ticket
   * const response = await client.addHelpdeskTicket({
   *   title: "Software Question",
   *   description: "Need help with application access",
   *   priority: 3,
   *   miniDbItem: "software_support",
   *   userIdentifier: "jane.smith"
   * });
   *
   * @todo Test and implement
   * ```
   */
  addHelpdeskTicket(data: AddHelpdeskTicket) {
    return this.makeRequest("addHelpdeskTicket", data);
  }

  /**
   * Change the class teachers (owners) of a specific class or group.
   * This method allows you to update who are the primary teachers responsible for a class.
   *
   * @param data ChangeGroupOwners
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Change class teachers for class 3A
   * const response = await client.changeGroupOwners({
   *   code: "1A",
   *   userList: "T123,T124,T125"
   * });
   *
   * // Set single class teacher
   * const response = await client.changeGroupOwners({
   *   code: "1A",
   *   userList: "T789"
   * });
   * ```
   */
  changeGroupOwners(data: ChangeGroupOwners): Promise<true> {
    return this.makeRequest("changeGroupOwners", data) as Promise<true>;
  }

  /**
   * Remove all users from a specified group or class.
   * This method will remove all member associations from the given group while keeping the group itself intact.
   *
   * @param data ClearGroup
   * @returns Promise<true> true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Clear group with specific date
   * const response = await client.clearGroup({
   *   group: "1A",
   *   officialDate: "2024-01-15"
   * });
   *
   * // Clear group without specific date (requires manual confirmation)
   * const response = await client.clearGroup({
   *   group: "SCIENCE-CLUB"
   * });
   * ```
   */
  clearGroup(data: ClearGroup) {
    return this.makeRequest("clearGroup", data);
  }

  /**
   * Retrieve a complete list of all groups and classes in Smartschool.
   * Returns a JSON object containing the hierarchical structure of groups and classes.
   *
   * @beta Method has been tested, returns a weird XML
   * @returns Promise containing a JSON object with all groups and classes
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getAllGroupsAndClasses();
   * // Response example:
   * ```
   *
   * @todo implement
   */
  getAllGroupsAndClasses() {
    return this.makeRequest("getAllGroupsAndClasses", {});
  }

  /**
   * Retrieve a list of all classes in Smartschool.
   * Returns a serialized array containing class information including name, description,
   * visibility, unique class code, and whether it's an official class.
   *
   * @beta Tested but returns empty object
   * @returns Promise containing a serialized array with class information
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getClassList();
   * // Response example (serialized array):
   * // a:2:{
   * //   i:0;a:5:{
   * //     s:4:"name";s:2:"3A";
   * //     s:4:"desc";s:15:"Third grade A";
   * //     s:10:"visibility";i:1;
   * //     s:4:"code";s:7:"1A";
   * //     s:10:"isOfficial";b:1;
   * //   }
   * // }
   * ```
   *
   * @todo implement
   */
  getClassList() {
    return this.makeRequest("getClassList", {});
  }

  /**
   * Retrieve a list of all classes in Smartschool.
   * Returns a JSON array containing class information including name, description,
   * visibility, unique class code, and whether it's an official class.
   *
   * @returns containing a JSON array with class information
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.getClassListJson();
   * // Response example:
   * // [
   * //   {
   * //     "id": "4695",
   * //     "code": "6WEWE",
   * //     "name": "6WEWE",
   * //     "desc": "Klas 6WEWE",
   * //     "isOfficial": true,
   * //     "isGroup": false,
   * //     "isClass": true,
   * //     "isVisible": true,
   * //     "untis": "6WEWE"
   * //   }
   * // ]
   * ```
   */
  getClassListJson(): Promise<GetClassListJsonResponse> {
    return this.makeRequest(
      "getClassListJson",
      {},
    ) as Promise<GetClassListJsonResponse>;
  }

  /**
   * Change the internal number of a user using their username as the key field.
   * This method allows you to update a user's internal number while identifying them by their username.
   *
   * @param data ChangeInternNumber
   * @returns Returning true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * const response = await client.changeInternNumber({
   *   username: "john.doe",
   *   newInternNumber: "12345"
   * });
   * ```
   */
  changeInternNumber(data: ChangeInternNumber): Promise<true> {
    return this.makeRequest("changeInternNumber", data) as Promise<true>;
  }

  /**
   * Force a user's main account or co-account to change their password at next login.
   *
   * @param data ChangePasswordAtNextLogin
   * @returns Returning true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @remarks
   * Important note: When a user logs in for the first time, they will ALWAYS be required
   * to change their password, regardless of any settings. This is a built-in security feature
   * of Smartschool that cannot be bypassed using this method or any other means.
   * The password set by administrators will never be retained for first-time logins.
   *
   * @example Example
   * ```typescript
   * // Force main account password change
   * const response = await client.changePasswordAtNextLogin({
   *   userIdentifier: "john.doe",
   *   accountType: "0"
   * });
   *
   * // Force co-account password change
   * const response = await client.changePasswordAtNextLogin({
   *   userIdentifier: "john.doe",
   *   accountType: "1"
   * });
   * ```
   */
  changePasswordAtNextLogin(data: ChangePasswordAtNextLogin): Promise<true> {
    return this.makeRequest("changePasswordAtNextLogin", data) as Promise<true>;
  }

  /**
   * Delete a user from Smartschool.
   * This method allows you to completely remove a user from the platform.
   *
   * @param data DelUser
   * @returns Returning true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Delete user with specific date
   * const response = await client.delUser({
   *   userIdentifier: "john.doe",
   *   officialDate: "2024-01-15"
   * });
   *
   * // Delete user without specific date (requires manual confirmation)
   * const response = await client.delUser({
   *   userIdentifier: "john.doe"
   * });
   * ```
   */
  delUser(data: DelUser): Promise<true> {
    return this.makeRequest("delUser", data) as Promise<true>;
  }

  /**
   * Force a user to reset their password at next login.
   * This method allows you to require a password change for a user's main account or co-account.
   *
   * @param data ForcePasswordReset
   * @returns Returning true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Force password reset for main account
   * const response = await client.forcePasswordReset({
   *   userIdentifier: "john.doe",
   *   accountType: "0"
   * });
   *
   * // Force password reset for first co-account
   * const response = await client.forcePasswordReset({
   *   userIdentifier: "john.doe",
   *   accountType: "1"
   * });
   * ```
   */
  forcePasswordReset(data: ForcePasswordReset): Promise<true> {
    return this.makeRequest("forcePasswordReset", data) as Promise<true>;
  }

  /**
   * Retrieve extended user information for all users in a specified group.
   * This method returns all profile fields (except passwords and profile photos),
   * official class numbers, group memberships, and last login timestamps for both
   * main accounts and co-accounts. Returns a JSON object.
   *
   * @param data GetAllAccountsExtended
   * @returns Promise containing a JSON array with all acounts of the group
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Get extended account info from a single group
   * const response = await client.getAllAccountsExtended({
   *   code: "1A",
   *   recursive: "0"
   * });
   *
   * // Get extended account info including all subgroups
   * const response = await client.getAllAccountsExtended({
   *   code: "THIRD-GRADE",
   *   recursive: "1"
   * });
   * ```
   */
  getAllAccountsExtended(
    data: GetAllAccountsExtended,
  ): Promise<UserDetailsResponse[]> {
    return this.makeRequest("getAllAccountsExtended", data) as Promise<
      UserDetailsResponse[]
    >;
  }

  /**
   * @deprecated Due to the renewal of 'two-step authentication', this method is no longer supported.
   *
   * Deactivate two-factor authentication for a user's main account or co-account.
   * This method allows you to disable 2FA for a specific user account.
   *
   * @param data DeactivateTwoFactorAuthentication
   * @returns Returning true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Deactivate 2FA for main account
   * const response = await client.deactivateTwoFactorAuthentication({
   *   userIdentifier: "john.doe",
   *   accountType: "0"
   * });
   *
   * // Deactivate 2FA for first co-account
   * const response = await client.deactivateTwoFactorAuthentication({
   *   userIdentifier: "john.doe",
   *   accountType: "1"
   * });
   * ```
   */
  deactivateTwoFactorAuthentication(
    data: DeactivateTwoFactorAuthentication,
  ): Promise<true> {
    return this.makeRequest(
      "deactivateTwoFactorAuthentication",
      data,
    ) as Promise<true>;
  }

  /**
   * Remove a user from a specific group or class.
   * This method allows you to remove a user's membership from a particular group while keeping their other group memberships intact.
   *
   * @param data RemoveUserFromGroup
   * @returns Returning true if successful
   * @throws SmartschoolError if the API returns an error
   *
   * @example Example
   * ```typescript
   * // Remove user from group with specific date
   * const response = await client.removeUserFromGroup({
   *   userIdentifier: "john.doe",
   *   class: "3A",
   *   officialDate: "2024-01-15"
   * });
   *
   * // Remove user from group without specific date (requires manual confirmation)
   * const response = await client.removeUserFromGroup({
   *   userIdentifier: "john.doe",
   *   class: "SCIENCE-CLUB"
   * });
   * ```
   */
  removeUserFromGroup(data: RemoveUserFromGroup): Promise<true> {
    return this.makeRequest("removeUserFromGroup", data) as Promise<true>;
  }
}
