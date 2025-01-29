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

    if (this.errorCodes[json.toString()]) {
      throw new SmartschoolError(
        this.decodeHtmlEntities(this.errorCodes[json]),
        json,
      );
    }

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
   * @param data - The course data
   * @param data.coursename - The name of the course
   * @param data.coursedesc - The description of the course
   * @param data.visibility - Optional: Course visibility (1 = visible [default], 0 = hidden)
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.addCourse({
   *   coursename: "Mathematics",
   *   coursedesc: "Advanced mathematics course",
   *   visibility: 1
   * });
   * ```
   */
  addCourse(data: CourseBase) {
    return this.makeRequest("addCourse", data);
  }

  /**
   * Add classes to a specific course
   *
   * @param data - The course and student group data
   * @param data.coursename - The name of the course
   * @param data.coursedesc - The description of the course
   * @param data.groupIds - CSV list of unique class or group codes (e.g., "3A,3B,4A")
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.addCourseStudents({
   *   coursename: "Mathematics",
   *   coursedesc: "Advanced mathematics course",
   *   groupIds: "3A,3B,4A"
   * });
   * ```
   */
  addCourseStudents(data: CourseBase & { groupIds: string }) {
    return this.makeRequest("addCourseStudents", data);
  }

  /**
   * Add a teacher to a specific course
   *
   * @param data - The course and teacher data
   * @param data.coursename - The name of the course
   * @param data.coursedesc - The description of the course
   * @param data.internnummer - Unique identifier of the user
   * @param data.userlist - CSV list of unique user identifiers
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.addCourseTeacher({
   *   coursename: "Mathematics",
   *   coursedesc: "Advanced mathematics course",
   *   internnummer: "T123",
   *   userlist: "T123,T124,T125"
   * });
   * ```
   */
  addCourseTeacher(
    data: CourseBase & { internalNumber: string; userList: string },
  ) {
    return this.makeRequest("addCourseTeacher", data);
  }

  /**
   * Retrieve all profile fields (except passwords and profile photo) and group memberships
   * of a specific user (main and co-accounts). Returns a JSON object.
   *
   * @param data - The user identification data
   * @param data.userIdentifier - Unique identifier of the user
   * @returns Promise containing the user details as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getUserDetails({
   *   userIdentifier: "john.doe"
   * });
   * ```
   */
  getUserDetails(data: UserDetails) {
    return this.makeRequest("getUserDetails", data);
  }

  /**
   * Retrieve all profile fields (except passwords and profile photo) and group memberships
   * of a specific user (main and co-accounts) by their internal number. Returns a JSON object.
   *
   * @param data - The user identification data
   * @param data.number - Internal number of the user
   * @returns Promise containing the user details as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getUserDetailsByNumber({
   *   number: "12345"
   * });
   * ```
   */
  getUserDetailsByNumber(data: GetUserDetailsByNumber) {
    return this.makeRequest("getUserDetailsByNumber", data);
  }

  /**
   * Retrieve all profile fields (except passwords and profile photo) and group memberships
   * of a specific user (main and co-accounts) by their username. Returns a JSON object.
   *
   * @param data - The user identification data
   * @param data.username - Username of the user
   * @returns Promise containing the user details as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getUserDetailsByUsername({
   *   username: "john.doe"
   * });
   * ```
   */
  getUserDetailsByUsername(data: GetUserDetailsByUsername) {
    return this.makeRequest("getUserDetailsByUsername", data);
  }

  /**
   * Identify a student using their Smartschool scannable code or a custom scannable value (UUID)
   *
   * @param data - The scannable code data
   * @param data.scannableCode - UUID scannable code
   * @returns Promise containing the user details as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getUserDetailsByScannableCode({
   *   scannableCode: "550e8400-e29b-41d4-a716-446655440000"
   * });
   * ```
   */
  getUserDetailsByScannableCode(data: GetUserDetailsByScannableCode) {
    return this.makeRequest("getUserDetailsByScannableCode", data);
  }

  /**
   * Check which official class a student belongs to on a specific date
   *
   * @param data - The user and date data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.date - Optional: Date to check (format: YYYY-MM-DD). If omitted, current date is used
   * @returns Promise containing the official class information
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
  getUserOfficialClass(data: GetUserOfficialClass) {
    return this.makeRequest("getUserOfficialClass", data);
  }

  /**
   * Set the signature (Messages) for a specific main or co-account
   *
   * @param data - The signature data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.accountType - Account type (0 = main account, 1 = co-account 1, 2 = co-account 2, etc.)
   * @param data.signature - The signature text
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.saveSignature({
   *   userIdentifier: "john.doe",
   *   accountType: 0,
   *   signature: "Best regards,\nJohn Doe"
   * });
   * ```
   */
  saveSignature(data: SaveSignature) {
    return this.makeRequest("saveSignature", data);
  }

  /**
   * Retrieve official absences (morning and afternoon) of a student for a specific school year.
   * Returns a JSON object.
   *
   * @param data - The absence query data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.schoolYear - Start year of the school year (e.g., '2013' for school year 2013-2014)
   * @returns Promise containing the absences as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getAbsents({
   *   userIdentifier: "john.doe",
   *   schoolYear: "2023"
   * });
   * ```
   */
  getAbsents(data: GetAbsents) {
    return this.makeRequest("getAbsents", data);
  }

  /**
   * Get a list of class teachers. Returns a JSON object.
   *
   * @param data - The query parameters
   * @param data.getAllOwners - Optional: If true, returns all class teachers, if false (default) returns only the first teacher
   * @returns Promise containing the class teachers list as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
  getClassTeachers(data: GetClassTeachers) {
    return this.makeRequest("getClassTeachers", data);
  }

  /**
   * Create or modify classes and official classes in Smartschool.
   * Note: It's not possible to change the class name of existing classes/official classes
   * or move existing classes under different parent groups through the API.
   *
   * @param data - The class data
   * @param data.name - Class or group name (identifier string)
   * @param data.desc - Description
   * @param data.code - Unique class or group code
   * @param data.parent - Unique code of parent group (empty or '0' to keep current parent)
   * @param data.untis - Schedule code
   * @param data.instituteNumber - Optional: Institution number (only for creating official classes)
   * @param data.adminNumber - Optional: Administrative group number (only for creating official classes)
   * @param data.schoolYearDate - Optional: Adjusts institution number and admin group number for given school year (defaults to current school year)
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * // Create a regular class
   * const response = await client.saveClass({
   *   name: "3A",
   *   desc: "Third grade class A",
   *   code: "3A-2024",
   *   parent: "THIRD-GRADE",
   *   untis: "3A"
   * });
   *
   * // Create an official class
   * const response = await client.saveClass({
   *   name: "4B",
   *   desc: "Fourth grade class B",
   *   code: "4B-2024",
   *   parent: "FOURTH-GRADE",
   *   untis: "4B",
   *   instituteNumber: "123456",
   *   adminNumber: "789",
   *   schoolYearDate: "2024-09-01"
   * });
   * ```
   */
  saveClass(data: SaveClass) {
    return this.makeRequest("saveClass", data);
  }

  /**
   * Create or modify groups in Smartschool.
   * Note: It's not possible to change the group name of existing groups
   * or move existing groups under different parent groups through the API.
   *
   * @param data - The group data
   * @param data.name - Group name (identifier string)
   * @param data.desc - Description
   * @param data.code - Unique group code (if a group with this code exists, it will be updated)
   * @param data.parent - Unique code of parent group (empty or '0' to keep current parent)
   * @param data.untis - Schedule code
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * // Create a new group
   * const response = await client.saveGroup({
   *   name: "Science Club",
   *   desc: "Group for science enthusiasts",
   *   code: "SCI-CLUB-2024",
   *   parent: "CLUBS",
   *   untis: "SCICLUB"
   * });
   *
   * // Modify an existing group
   * const response = await client.saveGroup({
   *   name: "Science Club",
   *   desc: "Updated description for science club",
   *   code: "SCI-CLUB-2024", // Existing group code
   *   parent: "0", // Keep current parent
   *   untis: "SCICLUB"
   * });
   * ```
   */
  saveGroup(data: SaveGroup) {
    return this.makeRequest("saveGroup", data);
  }

  /**
   * Update user profile parameters in Smartschool. This method can modify various profile fields
   * including personal information, co-account details, and specific educational parameters.
   *
   * @param data - The parameter data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.paramName - Name of the parameter to update
   * @param data.paramValue - Value to set for the parameter
   * @returns Promise containing the API response
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
   * @example
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
  saveUserParameter(data: SaveUserParameter) {
    return this.makeRequest("saveUserParameter", data);
  }

  /**
   * Create a new user or modify an existing user in Smartschool.
   * The system checks the userIdentifier field to determine if it should create or update a user.
   *
   * @param data - The user data
   * @param data.userIdentifier - Unique identifier for the user (internal number)
   * @param data.username - Username (minimum 2 characters)
   * @param data.passwd1 - Main account password (required for new users, optional for existing users)
   * @param data.passwd2 - Co-account password (optional)
   * @param data.passwd3 - Second co-account password (optional)
   * @param data.name - First name (minimum 1 character)
   * @param data.surname - Last name (minimum 1 character)
   * @param data.extranames - Additional first names (optional)
   * @param data.initials - Initials (optional)
   * @param data.sex - Gender: 'm' or 'v' (optional)
   * @param data.birthday - Birth date (optional, format: YYYY-MM-DD or DD-MM-YYYY)
   * @param data.birthplace - Place of birth (optional)
   * @param data.birthcountry - Country of birth (optional)
   * @param data.address - Address (optional)
   * @param data.postalcode - Postal code (optional)
   * @param data.location - City/Municipality (optional)
   * @param data.country - Country (optional)
   * @param data.email - Email address (optional)
   * @param data.mobilephone - Mobile phone number (optional)
   * @param data.homephone - Home phone number (optional)
   * @param data.fax - Fax number (optional)
   * @param data.prn - National registration number (optional)
   * @param data.stamboeknummer - Registration number (optional)
   * @param data.basisrol - Base role: 'leerling', 'leerkracht', 'directie' or 'andere' (required)
   * @param data.untis - Schedule code (optional)
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @remarks
   * The address field can include house number and box number in the following formats:
   * - "Street 22"
   * - "Street 22 bus 1"
   * - "Street 22/1" (will be converted to "Street 22 bus 1")
   *
   * @example
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
   * ```
   */
  saveUser(data: SaveUser) {
    return this.makeRequest("saveUser", data);
  }

  /**
   * Send a message to a user's main account or co-account. Attachments are optional.
   *
   * @param data - The message data
   * @param data.userIdentifier - Unique identifier of the recipient
   * @param data.title - Message title
   * @param data.body - Message content
   * @param data.senderIdentifier - Unique identifier of the sender. Use 'Null' for no sender
   * @param data.attachments - Optional array of attachments in base64 encoding
   * @param data.coaccount - Optional account type (0 = main account [default], 1 = co-account 1, 2 = co-account 2, etc.)
   * @param data.copyToLVS - Optional: Set to true to add message to LVS (default: false)
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
   * // Message with file attachments using Node.js fs
   * import { readFileSync } from 'fs';
   * import { join } from 'path';
   *
   * // Read files and convert to base64
   * const file1 = readFileSync(join(__dirname, 'document.pdf'));
   * const file2 = readFileSync(join(__dirname, 'image.jpg'));
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
  sendMsg(data: SendMsg) {
    return this.makeRequest("sendMsg", data);
  }

  /**
   * Set or remove a user's profile photo.
   * An empty photo value can be used to remove the existing photo.
   *
   * @param data - The photo data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.photo - The photo in base64 encoded format, or empty string to remove photo
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * // Set a new profile photo using Node.js fs
   * import { readFileSync } from 'fs';
   * import { join } from 'path';
   *
   * const photoFile = readFileSync(join(__dirname, 'photo.jpg'));
   * const photoBase64 = photoFile.toString('base64');
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
  setAccountPhoto(data: SetAccountPhoto) {
    return this.makeRequest("setAccountPhoto", data);
  }

  /**
   * Change the status of a user's account.
   *
   * @param data - The account status data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.accountStatus - Account status. Can be one of:
   *   - 'actief' (active)
   *   - 'niet actief' (not active)
   *   - 'actief tot en met yyyy/mm/dd' (active until yyyy/mm/dd)
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
  setAccountStatus(data: SetAccountStatus) {
    return this.makeRequest("setAccountStatus", data);
  }

  /**
   * Haalt alle Smartschool API errorcodes op in CSV-formaat.
   *
   * @returns Promise met een string in CSV-formaat die alle errorcodes bevat
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.returnCsvErrorCodes();
   * // Response bevat CSV data met errorcodes, bijvoorbeeld:
   * // "code;description\n1;Invalid username\n2;Invalid password"
   * ```
   */
  returnCsvErrorCodes() {
    return this.makeRequest("returnCsvErrorCodes", {}, { needsAuth: false });
  }

  /**
   * Haalt de officiële afwezigheden (voor- en namiddag) van alle leerlingen op voor een specifieke datum.
   *
   * @param data - De opvraaggegevens
   * @param data.date - Datum waarvoor de afwezigheden worden opgevraagd (formaat: YYYY-MM-DD)
   * @returns Promise met een JSON-object dat de afwezigheden bevat
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getAbsentsWithInternalNumberByDate({
   *   date: "2024-01-15"
   * });
   * // Response bevat een JSON object met afwezigheden voor alle leerlingen
   * // geïdentificeerd op basis van hun intern nummer
   * ```
   */
  getAbsentsWithInternalNumberByDate(data: GetAbsentsWithInternalNumberByDate) {
    return this.makeRequest("getAbsentsWithInternalNumberByDate", data);
  }

  /**
   * Retrieve all Smartschool API error codes in JSON format.
   *
   * @returns Promise containing a JSON object with all error codes and their descriptions
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.returnJsonErrorCodes();
   * // Response contains JSON data with error codes, for example:
   * // {
   * //   "1": "Invalid username",
   * //   "2": "Invalid password",
   * //   ...
   * // }
   * ```
   */
  returnJsonErrorCodes() {
    return this.makeRequest(
      "returnJsonErrorCodes",
      {},
      { needsAuth: false },
    ) as Promise<Record<string, string>>;
  }

  /**
   * Wijzigt de gebruikersnaam van een gebruiker op basis van het intern nummer.
   *
   * @param data - De gegevens voor de gebruikersnaamwijziging
   * @param data.internNumber - Het intern nummer van de gebruiker
   * @param data.newUsername - De nieuwe gebruikersnaam voor de gebruiker
   * @returns Promise met de API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.changeUsername({
   *   internNumber: "12345",
   *   newUsername: "nieuwe.gebruikersnaam"
   * });
   * ```
   */
  changeUsername(data: ChangeUsername) {
    return this.makeRequest("changeUsername", data);
  }

  /**
   * Remove a group, class or official class from Smartschool.
   * This method only removes the group/class itself, not its members.
   *
   * @param data - The deletion data
   * @param data.code - Unique class or group code that identifies the group to be removed
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * // Remove a class
   * const response = await client.delClass({
   *   code: "3A-2024"
   * });
   *
   * // Remove a group
   * const response = await client.delClass({
   *   code: "SCIENCE-CLUB"
   * });
   * ```
   */
  delClass(data: DelClass) {
    return this.makeRequest("delClass", data);
  }

  /**
   * Retrieve official absences (morning and afternoon) of all students for a specific date.
   * Returns a JSON object.
   *
   * @param data - The query parameters
   * @param data.date - Date to check absences for (format: YYYY-MM-DD)
   * @returns Promise containing the absences as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getAbsentsByDate({
   *   date: "2024-01-15"
   * });
   * ```
   */
  getAbsentsByDate(data: GetAbsentsByDate) {
    return this.makeRequest("getAbsentsByDate", data);
  }

  /**
   * Retrieve official absences (morning and afternoon) of all students in a specific class/group for a specific date.
   * Returns a JSON object.
   *
   * @param data - The query parameters
   * @param data.date - Date to check absences for (format: YYYY-MM-DD)
   * @param data.code - Unique class or group code to get absences for
   * @returns Promise containing the absences as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getAbsentsByDateAndGroup({
   *   date: "2024-01-15",
   *   code: "3A-2024"
   * });
   * ```
   */
  getAbsentsByDateAndGroup(data: GetAbsentsByDateAndGroup) {
    return this.makeRequest("getAbsentsByDateAndGroup", data);
  }

  /**
   * Retrieve official absences (morning and afternoon) including aliases of all students for a specific date.
   * Returns a JSON object.
   *
   * @param data - The query parameters
   * @param data.date - Date to check absences for (format: YYYY-MM-DD)
   * @returns Promise containing the absences with aliases as a JSON object
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getAbsentsWithAliasByDate({
   *   date: "2024-01-15"
   * });
   * ```
   */
  getAbsentsWithAliasByDate(data: GetAbsentsWithAliasByDate) {
    return this.makeRequest("getAbsentsWithAliasByDate", data);
  }

  /**
   * Haalt de profielfoto van een gebruiker op.
   * Retrieve a user's profile photo.
   *
   * @param data - De opvraaggegevens / The query parameters
   * @param data.userIdentifier - Uniek identificatieveld van de gebruiker / Unique identifier of the user
   * @returns Promise met een base64 gecodeerde string van de foto / Promise containing the photo as a base64 encoded string
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getAccountPhoto({
   *   userIdentifier: "john.doe"
   * });
   * // Response bevat de foto als base64 string
   * // Response contains the photo as base64 string
   * ```
   */
  getAccountPhoto(data: GetAccountPhoto) {
    return this.makeRequest("getAccountPhoto", data);
  }

  /**
   * Haalt alle schooljaargegevens op van de opgegeven klas.
   * Deze methode geeft informatie over de klas voor het huidige schooljaar.
   *
   * @param data - De opvraaggegevens
   * @param data.classCode - Unieke klas- of groepscode
   * @returns Promise met een JSON-object dat de schooljaargegevens van de klas bevat
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getSchoolyearDataOfClass({
   *   classCode: "3A-2024"
   * });
   * // Response bevat een JSON object met schooljaargegevens zoals:
   * // {
   * //   "schoolYear": "2023-2024",
   * //   "classData": {
   * //     // ... specifieke klasgegevens
   * //   }
   * // }
   * ```
   */
  getSchoolyearDataOfClass(data: GetSchoolyearDataOfClass) {
    return this.makeRequest("getSchoolyearDataOfClass", data);
  }

  /**
   * Retrieve Skore class-teacher-course relationships in JSON format.
   * This method returns a structured overview of which teachers teach which courses in which classes.
   *
   * @returns Promise containing a JSON object with class-teacher-course relationships
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getSkoreClassTeacherCourseRelation();
   * // Response example:
   * // {
   * //   "classes": [
   * //     {
   * //       "code": "3A",
   * //       "courses": [
   * //         {
   * //           "name": "Mathematics",
   * //           "teachers": [
   * //             {
   * //               "userIdentifier": "john.doe",
   * //               "name": "John Doe"
   * //             }
   * //           ]
   * //         }
   * //       ]
   * //     }
   * //   ]
   * // }
   * ```
   */
  getSkoreClassTeacherCourseRelation() {
    return this.makeRequest("getSkoreClassTeacherCourseRelation", {});
  }

  /**
   * Haalt de volledige schoolloopbaan van een leerling op.
   * Deze methode retourneert een JSON-object met alle beschikbare informatie over de schoolcarrière van de leerling.
   *
   * @param data - De opvraaggegevens
   * @param data.userIdentifier - Uniek identificatieveld van de leerling
   * @returns Promise met een JSON-object dat de complete schoolloopbaan bevat
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getStudentCareer({
   *   userIdentifier: "john.doe"
   * });
   * // Response bevat een JSON object met de schoolloopbaan, bijvoorbeeld:
   * // {
   * //   "career": [
   * //     {
   * //       "schoolYear": "2023-2024",
   * //       "class": "3A",
   * //       "studies": "Wetenschappen",
   * //       "status": "actief"
   * //     },
   * //     {
   * //       "schoolYear": "2022-2023",
   * //       "class": "2A",
   * //       "studies": "Moderne Wetenschappen",
   * //       "status": "geslaagd"
   * //     }
   * //   ]
   * // }
   * ```
   */
  getStudentCareer(data: GetStudentCareer) {
    return this.makeRequest("getStudentCareer", data);
  }

  /**
   * Update a list of classes using a serialized array format.
   * This method allows you to update multiple classes in a single API call.
   *
   * @param data - The class list data
   * @param data.serializedList - A serialized array containing all classes to update
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.saveClassList({
   *   serializedList: 'a:2:{i:0;a:5:{s:4:"name";s:2:"3A";s:4:"desc";s:15:"Third grade A";' +
   *                  's:4:"code";s:7:"3A-2024";s:6:"parent";s:11:"THIRD-GRADE";s:5:"untis";s:2:"3A";}' +
   *                  'i:1;a:5:{s:4:"name";s:2:"3B";s:4:"desc";s:15:"Third grade B";' +
   *                  's:4:"code";s:7:"3B-2024";s:6:"parent";s:11:"THIRD-GRADE";s:5:"untis";s:2:"3B";}}'
   * });
   * ```
   */
  saveClassList(data: SaveClassList) {
    return this.makeRequest("saveClassList", data);
  }

  /**
   * Update a list of classes using a JSON array format.
   * This method allows you to update multiple classes in a single API call using JSON notation.
   *
   * @param data - The class list data
   * @param data.jsonList - A JSON array containing all classes to update
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.saveClassListJson({
   *   jsonList: JSON.stringify([
   *     {
   *       name: "3A",
   *       desc: "Third grade A",
   *       code: "3A-2024",
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
   * ```
   */
  saveClassListJson(data: SaveClassListJson) {
    return this.makeRequest("saveClassListJson", data);
  }

  /**
   * Retrieves official absences (morning and afternoon) including aliases of a student
   * for a specific school year. Returns a JSON object.
   *
   * @param data - The query parameters
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.schoolYear - Start year of the school year (e.g., '2013' for school year 2013-2014)
   * @returns Promise containing a JSON object with absences including aliases
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getAbsentsWithAlias({
   *   userIdentifier: "john.doe",
   *   schoolYear: "2023"
   * });
   * // Response contains a JSON object with absences including aliases for school year 2023-2024
   * ```
   */
  getAbsentsWithAlias(data: GetAbsentsWithAlias) {
    return this.makeRequest("getAbsentsWithAlias", data);
  }

  /**
   * Retrieves user information (first name, last name, username, internal number, and official class number)
   * for all users in a specified group. Returns base64 encoded XML.
   *
   * @param data - The query parameters
   * @param data.code - Unique class or group code to get accounts from
   * @param data.recursive - Whether to include subgroups ('0' = no, '1' = yes)
   * @returns Promise containing base64 encoded XML with user information
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * // Get accounts from a single group
   * const response = await client.getAllAccounts({
   *   code: "3A-2024",
   *   recursive: "0"
   * });
   *
   * // Get accounts including all subgroups
   * const response = await client.getAllAccounts({
   *   code: "THIRD-GRADE",
   *   recursive: "1"
   * });
   * ```
   */
  getAllAccounts(data: GetAllAccounts) {
    return this.makeRequest("getAllAccounts", data);
  }

  /**
   * Check the status of a Skore synchronization task that was started using startSkoreSync.
   * This method allows you to monitor the progress of a synchronization job.
   *
   * @param data - The status check parameters
   * @param data.serviceId - Unique identifier code of the synchronization task received from startSkoreSync
   * @returns Promise containing one of these status values:
   * - "no_status": No task found for the provided serviceId
   * - "busy": Task is currently running
   * - "done": Task completed successfully
   * - "error": Task failed due to an error during execution
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
   */
  checkStatus(data: CheckStatus) {
    return this.makeRequest("checkStatus", data);
  }

  /**
   * Replace a user's internal number with a new one.
   * This method allows you to change the internal identifier number of a specific user.
   *
   * @param data - The internal number replacement data
   * @param data.oldInum - Current internal number of the user
   * @param data.newInum - New internal number to assign to the user
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.replaceInum({
   *   oldInum: "12345",
   *   newInum: "67890"
   * });
   * ```
   */
  replaceInum(data: ReplaceInum) {
    return this.makeRequest("replaceInum", data);
  }

  /**
   * Remove a specific co-account from a user.
   * This method allows you to delete a co-account while keeping the main account intact.
   *
   * @param data - The co-account removal data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.accountType - Type of co-account to remove ('1' = co-account 1, '2' = co-account 2, etc.)
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
  removeCoAccount(data: RemoveCoAccount) {
    return this.makeRequest("removeCoAccount", data);
  }

  /**
   * Set the password for a user's main account or co-account.
   *
   * @param data - The password data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.password - New password or passphrase to set
   * @param data.accountType - Account type ('0' = main account, '1' = co-account 1, '2' = co-account 2, etc.)
   * @param data.changePasswordAtNextLogin - Optional: Force password change at next login
   *                                        (0 = no change required, 1 = change required, default is 1)
   * @returns Promise containing the API response
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
   * @example
   * ```typescript
   * // Set main account password
   * const response = await client.savePassword({
   *   userIdentifier: "john.doe",
   *   password: "NewSecure123!",
   *   accountType: "0",
   *   changePasswordAtNextLogin: 1
   * });
   *
   * // Set co-account password without forced change
   * const response = await client.savePassword({
   *   userIdentifier: "john.doe",
   *   password: "CoAccount456#",
   *   accountType: "1",
   *   changePasswordAtNextLogin: 0
   * });
   * ```
   */
  savePassword(data: SavePassword) {
    return this.makeRequest("savePassword", data);
  }

  /**
   * Move a user to a new official class. A student can only be linked to one official class at a time.
   *
   * @param data - The class assignment data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.class - Unique class or group code
   * @param data.officialDate - Optional: Official date for the class change (format: YYYY-MM-DD).
   *                           Without an official date, the class movement must be confirmed in Smartschool
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
  saveUserToClass(data: SaveUserToClass) {
    return this.makeRequest("saveUserToClass", data);
  }

  /**
   * Link a user to multiple classes/groups. New classes and groups will be added to existing ones.
   * For official classes: the student will be removed from their current official class and
   * linked to the new official class provided in the list.
   *
   * @param data - The classes assignment data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.csvList - CSV list of unique class or group codes (e.g., "3A,3B,SCIENCE-CLUB")
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * // Add user to multiple classes/groups
   * const response = await client.saveUserToClasses({
   *   userIdentifier: "john.doe",
   *   csvList: "4A-2024,MATH-CLUB,CHESS-TEAM"
   * });
   * ```
   */
  saveUserToClasses(data: SaveUserToClasses) {
    return this.makeRequest("saveUserToClasses", data);
  }

  /**
   * Define memberships of official class, classes, and groups for a specific user.
   * This method allows you to either add new memberships to existing ones or replace all existing memberships.
   * If there are any errors during processing, a CSV file with error codes will be returned.
   *
   * @param data - The membership assignment data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.csvList - CSV list of unique class or group codes (e.g., "3A,3B,SCIENCE-CLUB")
   * @param data.keepOld - Membership handling flag:
   *                      '1' = Keep existing memberships and add new ones
   *                      '0' = Remove old memberships and create only the new ones
   * @returns Promise containing the API response or CSV with error codes if there were issues
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
  saveUserToClassesAndGroups(data: SaveUserToClassesAndGroups) {
    return this.makeRequest("saveUserToClassesAndGroups", data);
  }

  /**
   * Update the school year data for a specified class.
   * This method allows you to modify various administrative details for a class within a specific school year.
   *
   * @param data - The school year data parameters
   * @param data.classCode - Unique class or group code
   * @param data.date - Date to apply changes (format: YYYY-MM-DD)
   * @param data.instituteNumber - Institution number
   * @param data.administrativeGroupNumber - Administrative group number
   * @param data.residence - School location/campus
   * @param data.domain - Study domain/field
   * @param data.principal - Principal's name in format "lastname firstname" or "firstname lastname"
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.saveSchoolyearDataOfClass({
   *   classCode: "3A-2024",
   *   date: "2024-01-15",
   *   instituteNumber: "123456",
   *   administrativeGroupNumber: "789",
   *   residence: "Main Campus",
   *   domain: "Sciences",
   *   principal: "John Smith"
   * });
   * ```
   */
  saveSchoolyearDataOfClass(data: SaveSchoolyearDataOfClass) {
    return this.makeRequest("saveSchoolyearDataOfClass", data);
  }

  /**
   * Retrieve the unique reference field that is configured in the platform.
   * This method returns which field ('number' or 'username') is used as the unique identifier in the platform.
   *
   * @returns Promise containing the reference field setting ('number' or 'username')
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getReferenceField();
   * // Response will be either "number" or "username" depending on platform configuration
   * ```
   */
  getReferenceField() {
    return this.makeRequest("getReferenceField", {});
  }

  /**
   * Retrieve all items from mini databases that are available for use in the Helpdesk module.
   * These items can be used when creating or managing helpdesk tickets.
   *
   * @returns Promise containing a JSON object with all available mini database items
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getHelpdeskMiniDbItems();
   * // Response contains mini database items that can be used in helpdesk tickets, for example:
   * // {
   * //   "categories": [
   * //     {
   * //       "id": "1",
   * //       "name": "Hardware Issues"
   * //     },
   * //     {
   * //       "id": "2",
   * //       "name": "Software Support"
   * //     }
   * //   ]
   * // }
   * ```
   */
  getHelpdeskMiniDbItems() {
    return this.makeRequest("getHelpdeskMiniDbItems", {});
  }

  /**
   * Retrieve a list of all courses in Smartschool.
   * Returns a JSON object containing course information.
   *
   * @returns Promise containing a JSON object with all courses
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getCourses();
   * // Response example:
   * // {
   * //   "courses": [
   * //     {
   * //       "name": "Mathematics",
   * //       "description": "Advanced Mathematics",
   * //       "visibility": 1,
   * //       "teachers": ["T123", "T124"],
   * //       "groups": ["3A", "3B"]
   * //     },
   * //     {
   * //       "name": "Physics",
   * //       "description": "General Physics",
   * //       "visibility": 1,
   * //       "teachers": ["T125"],
   * //       "groups": ["4A", "4B"]
   * //     }
   * //   ]
   * // }
   * ```
   */
  getCourses() {
    return this.makeRequest("getCourses", {});
  }

  /**
   * Unregister a student from Smartschool.
   * This method allows you to officially withdraw a student from the school.
   *
   * @param data - The unregistration data
   * @param data.userIdentifier - Unique identifier of the student
   * @param data.officialDate - Optional: Official date of unregistration (format: YYYY-MM-DD).
   *                           Without an official date, the unregistration must be confirmed in Smartschool
   * @returns Promise containing the API response
   *
   * @example
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
   * ```
   */
  unregisterStudent(data: UnregisterStudent) {
    return this.makeRequest("unregisterStudent", data);
  }

  /**
   * Start the synchronization of classes and students from Smartschool to Skore.
   * This method allows you to initiate a sync operation that will update Skore with the latest data from Smartschool.
   *
   * @returns Promise containing a JSON object with the UUID of the synchronization task
   * @throws SmartschoolError if the API returns an error
   *
   * @remarks
   * - This operation can only be initiated once every 15 minutes
   * - The sync process runs asynchronously; use checkStatus() to monitor progress
   *
   * @example
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
   * @param data - The helpdesk ticket data
   * @param data.title - Title of the helpdesk ticket
   * @param data.description - Description of the helpdesk ticket
   * @param data.priority - Priority level of the ticket (1-5, default is 3)
   * @param data.miniDbItem - Item from the mini database
   * @param data.userIdentifier - Unique identifier of the user
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
   * ```
   */
  addHelpdeskTicket(data: AddHelpdeskTicket) {
    return this.makeRequest("addHelpdeskTicket", data);
  }

  /**
   * Change the class teachers (owners) of a specific class or group.
   * This method allows you to update who are the primary teachers responsible for a class.
   *
   * @param data - The group owners update data
   * @param data.code - Unique class or group code
   * @param data.userList - CSV list of unique user identifiers for the new class teachers
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * // Change class teachers for class 3A
   * const response = await client.changeGroupOwners({
   *   code: "3A-2024",
   *   userList: "T123,T124,T125"
   * });
   *
   * // Set single class teacher
   * const response = await client.changeGroupOwners({
   *   code: "4B-2024",
   *   userList: "T789"
   * });
   * ```
   */
  changeGroupOwners(data: ChangeGroupOwners) {
    return this.makeRequest("changeGroupOwners", data);
  }

  /**
   * Remove all users from a specified group or class.
   * This method will remove all member associations from the given group while keeping the group itself intact.
   *
   * @param data - The group clearing data
   * @param data.group - Unique class or group code to clear
   * @param data.officialDate - Optional: Official date for the removal (format: YYYY-MM-DD).
   *                           Without an official date, any class movements must be confirmed in Smartschool
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * // Clear group with specific date
   * const response = await client.clearGroup({
   *   group: "3A-2024",
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
   * @returns Promise containing a JSON object with all groups and classes
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getAllGroupsAndClasses();
   * // Response example:
   * // {
   * //   "groups": [
   * //     {
   * //       "code": "GRADE-3",
   * //       "name": "Third Grade",
   * //       "description": "All third grade classes",
   * //       "subgroups": [
   * //         {
   * //           "code": "3A",
   * //           "name": "Class 3A",
   * //           "description": "Third grade class A"
   * //         },
   * //         {
   * //           "code": "3B",
   * //           "name": "Class 3B",
   * //           "description": "Third grade class B"
   * //         }
   * //       ]
   * //     }
   * //   ]
   * // }
   * ```
   */
  getAllGroupsAndClasses() {
    return this.makeRequest("getAllGroupsAndClasses", {});
  }

  /**
   * Retrieve a list of all classes in Smartschool.
   * Returns a serialized array containing class information including name, description,
   * visibility, unique class code, and whether it's an official class.
   *
   * @returns Promise containing a serialized array with class information
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getClassList();
   * // Response example (serialized array):
   * // a:2:{
   * //   i:0;a:5:{
   * //     s:4:"name";s:2:"3A";
   * //     s:4:"desc";s:15:"Third grade A";
   * //     s:10:"visibility";i:1;
   * //     s:4:"code";s:7:"3A-2024";
   * //     s:10:"isOfficial";b:1;
   * //   }
   * // }
   * ```
   */
  getClassList() {
    return this.makeRequest("getClassList", {});
  }

  /**
   * Retrieve a list of all classes in Smartschool.
   * Returns a JSON array containing class information including name, description,
   * visibility, unique class code, and whether it's an official class.
   *
   * @returns Promise containing a JSON array with class information
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.getClassListJson();
   * // Response example:
   * // {
   * //   "classes": [
   * //     {
   * //       "name": "3A",
   * //       "description": "Third grade A",
   * //       "visibility": 1,
   * //       "code": "3A-2024",
   * //       "isOfficial": true
   * //     },
   * //     {
   * //       "name": "3B",
   * //       "description": "Third grade B",
   * //       "visibility": 1,
   * //       "code": "3B-2024",
   * //       "isOfficial": true
   * //     }
   * //   ]
   * // }
   * ```
   */
  getClassListJson() {
    return this.makeRequest("getClassListJson", {});
  }

  /**
   * Change the internal number of a user using their username as the key field.
   * This method allows you to update a user's internal number while identifying them by their username.
   *
   * @param data - The internal number change data
   * @param data.username - Username of the user whose internal number needs to be changed
   * @param data.newInternNumber - New internal number to assign to the user
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * const response = await client.changeInternNumber({
   *   username: "john.doe",
   *   newInternNumber: "12345"
   * });
   * ```
   */
  changeInternNumber(data: ChangeInternNumber) {
    return this.makeRequest("changeInternNumber", data);
  }

  /**
   * Force a user's main account or co-account to change their password at next login.
   *
   * @param data - The password change requirement data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.accountType - Account type ('0' = main account, '1' = co-account 1, '2' = co-account 2, etc.)
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @remarks
   * Important note: When a user logs in for the first time, they will ALWAYS be required
   * to change their password, regardless of any settings. This is a built-in security feature
   * of Smartschool that cannot be bypassed using this method or any other means.
   * The password set by administrators will never be retained for first-time logins.
   *
   * @example
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
  changePasswordAtNextLogin(data: ChangePasswordAtNextLogin) {
    return this.makeRequest("changePasswordAtNextLogin", data);
  }

  /**
   * Delete a user from Smartschool.
   * This method allows you to completely remove a user from the platform.
   *
   * @param data - The user deletion data
   * @param data.userIdentifier - Unique identifier of the user to delete
   * @param data.officialDate - Optional: Official date for the deletion (format: YYYY-MM-DD).
   *                           Without an official date, the removal must be confirmed in Smartschool
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
  delUser(data: DelUser) {
    return this.makeRequest("delUser", data);
  }

  /**
   * Force a user to reset their password at next login.
   * This method allows you to require a password change for a user's main account or co-account.
   *
   * @param data - The password reset data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.accountType - Account type ('0' = main account, '1' = co-account 1, '2' = co-account 2, etc.)
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
  forcePasswordReset(data: ForcePasswordReset) {
    return this.makeRequest("forcePasswordReset", data);
  }

  /**
   * Retrieve extended user information for all users in a specified group.
   * This method returns all profile fields (except passwords and profile photos),
   * official class numbers, group memberships, and last login timestamps for both
   * main accounts and co-accounts. Returns a JSON object.
   *
   * @param data - The query parameters
   * @param data.code - Unique class or group code to get accounts from
   * @param data.recursive - Whether to include subgroups ('0' = no, '1' = yes)
   * @returns Promise containing a JSON object with extended user information
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * // Get extended account info from a single group
   * const response = await client.getAllAccountsExtended({
   *   code: "3A-2024",
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
  getAllAccountsExtended(data: GetAllAccountsExtended) {
    return this.makeRequest("getAllAccountsExtended", data);
  }

  /**
   * @deprecated Due to the renewal of 'two-step authentication', this method is no longer supported.
   *
   * Deactivate two-factor authentication for a user's main account or co-account.
   * This method allows you to disable 2FA for a specific user account.
   *
   * @param data - The 2FA deactivation data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.accountType - Account type ('0' = main account, '1' = co-account 1, '2' = co-account 2, etc.)
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
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
  deactivateTwoFactorAuthentication(data: DeactivateTwoFactorAuthentication) {
    return this.makeRequest("deactivateTwoFactorAuthentication", data);
  }

  /**
   * Remove a user from a specific group or class.
   * This method allows you to remove a user's membership from a particular group while keeping their other group memberships intact.
   *
   * @param data - The group removal data
   * @param data.userIdentifier - Unique identifier of the user
   * @param data.class - Unique class or group code to remove the user from
   * @param data.officialDate - Optional: Official date for the removal (format: YYYY-MM-DD).
   *                           Without an official date, any class movements must be confirmed in Smartschool
   * @returns Promise containing the API response
   * @throws SmartschoolError if the API returns an error
   *
   * @example
   * ```typescript
   * // Remove user from group with specific date
   * const response = await client.removeUserFromGroup({
   *   userIdentifier: "john.doe",
   *   class: "3A-2024",
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
  removeUserFromGroup(data: RemoveUserFromGroup) {
    return this.makeRequest("removeUserFromGroup", data);
  }
}
