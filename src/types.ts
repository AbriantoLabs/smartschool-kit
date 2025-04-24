/**
 * Types and interfaces for the Smartschool API
 * Contains base interfaces and request types for interacting with the Smartschool API
 * @module types
 */

/**
 * Base interface requiring an access code for API authentication
 * @interface AccessCodeBase
 */
export interface AccessCodeBase {
  /**
   * Access code for authenticating with the Smartschool API
   * This code must be obtained from your Smartschool administrator
   */
  accesscode: string;
}

/**
 * Configuration interface for connecting to the Smartschool API
 * @interface SmartschoolConfig
 * @extends {AccessCodeBase}
 */
export interface SmartschoolConfig extends AccessCodeBase {
  /**
   * Base URL endpoint for the Smartschool API
   * @example "https://schoolname.smartschool.be/api"
   */
  apiEndpoint: string;
}

/**
 * Base interface for requests that require a user identifier
 * @interface UserIdentifierBase
 */
export interface UserIdentifierBase {
  /**
   * Identifier of the target user - can be either:
   * - Username (e.g. "john.doe")
   * - Internal number (e.g. "12345")
   */
  userIdentifier: string;
}

/**
 * Base interface for requests that specify an account type
 * @interface AccountTypeBase
 */
export interface AccountTypeBase {
  /**
   * Account type to target:
   * - 0: Main user account
   * - 1: First co-account
   * - 2: Second co-account
   * - etc.
   *
   * 6 accounts in total
   */
  accountType: number;
}

/**
 * Base interface for course-related requests
 * @interface CourseBase
 */
export interface CourseBase {
  /** Full name of the course */
  coursename: string;
  /** Unique course code identifier */
  coursedesc: string;
  /**
   * Course visibility status
   * - 1: Visible
   * - 0: Hidden
   */
  visibility?: number;
}

/**
 * Base interface for requests that operate on multiple users
 */
export interface UserListBase {
  /**
   * Comma-separated list of user identifiers
   * @example "12345,67890,11223"
   */
  userlist: string;
}

/**
 * Base interface for requests that target multiple groups/classes
 * @interface GroupIdsBase
 */
export interface GroupIdsBase {
  /**
   * Comma-separated list of class or group codes
   * @example "1A,2B,3C"
   */
  groupIds: string;
}

/**
 * Interface for including an optional official date in requests
 * @interface DateOptional
 */
export interface DateOptional {
  /**
   * Date when the action should take effect
   * @format YYYY-MM-DD
   * @example "2024-09-01"
   */
  officialDate?: string;
}

/**
 * Base interface for class/group-related requests
 * @interface ClassBase
 */
export interface ClassBase {
  /**
   * Unique identifier code for a class or group
   * @example "1A" or "STEM-GROUP-1"
   */
  code: string;
}

/**
 * Request interface for adding a new course
 * @interface AddCourse
 * @extends {AccessCodeBase}
 * @extends {CourseBase}
 */
export interface AddCourse extends AccessCodeBase, CourseBase {
  /**
   * Course visibility setting
   * - 1: Visible (default if not provided)
   * - 0: Hidden
   */
  visibility?: number;
}

/**
 * Request interface for adding students to a course
 * @interface AddCourseStudents
 * @extends {AccessCodeBase}
 * @extends {CourseBase}
 * @extends {GroupIdsBase}
 */
export interface AddCourseStudents
  extends AccessCodeBase,
    CourseBase,
    GroupIdsBase {}

/**
 * Request interface for adding a teacher to a course
 * @interface AddCourseTeacher
 * @extends {AccessCodeBase}
 * @extends {CourseBase}
 * @extends {UserIdentifierBase}
 */
export interface AddCourseTeacher
  extends AccessCodeBase,
    CourseBase,
    UserIdentifierBase {
  /** Internal number identifier of the teacher */
  internnummer: string;
}

/**
 * Request interface for creating a new helpdesk ticket
 * @interface AddHelpdeskTicket
 * @extends {AccessCodeBase}
 * @extends {UserIdentifierBase}
 */
export interface AddHelpdeskTicket extends AccessCodeBase, UserIdentifierBase {
  /** Title/subject of the helpdesk ticket */
  title: string;
  /** Detailed description of the issue */
  description: string;
  /**
   * Priority level of the ticket
   * @example 1: Low, 2: Normal, 3: High
   */
  priority: number;
  /** Category ID from the helpdesk mini-database */
  miniDbItem: string;
}

/**
 * Request interface for changing group/class owners
 * @interface ChangeGroupOwners
 * @extends {AccessCodeBase}
 * @extends {UserListBase}
 */
export interface ChangeGroupOwners extends AccessCodeBase, UserListBase {
  /** Target class or group code to modify owners */
  code: string;
}

/**
 * Request interface for changing a user's internal number
 * @interface ChangeInternNumber
 * @extends {AccessCodeBase}
 */
export interface ChangeInternNumber extends AccessCodeBase {
  /** Username of the target user */
  username: string;
  /** New internal number to assign */
  newInternNumber: string;
}

/**
 * Request interface for requiring password change at next login
 * @interface ChangePasswordAtNextLogin
 * @extends {AccessCodeBase}
 * @extends {UserIdentifierBase}
 * @extends {AccountTypeBase}
 */
export interface ChangePasswordAtNextLogin
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {}

/**
 * Request interface for changing a user's username
 * @interface ChangeUsername
 * @extends {AccessCodeBase}
 */
export interface ChangeUsername extends AccessCodeBase {
  /** Current internal number of the user */
  internNumber: string;
  /** New username to assign */
  newUsername: string;
}

/**
 * Request interface for checking sync task status
 * @interface CheckStatus
 * @extends {AccessCodeBase}
 */
export interface CheckStatus extends AccessCodeBase {
  /** Task ID received from startSkoreSync */
  serviceId: string;
}

/**
 * Request interface for removing all members from a group
 * @interface ClearGroup
 * @extends {AccessCodeBase}
 */
export interface ClearGroup extends AccessCodeBase {
  /** Group code to clear */
  group: string;
  /**
   * When the removal should take effect
   * @format YYYY-MM-DD
   */
  officialDate?: string;
}

/**
 * Request interface for deleting a class/group
 * @interface DelClass
 * @extends {AccessCodeBase}
 * @extends {ClassBase}
 */
export interface DelClass extends AccessCodeBase, ClassBase {}

/**
 * Request interface for deleting a user from the system
 * @interface DelUser
 * @extends {AccessCodeBase}
 * @extends {UserIdentifierBase}
 * @extends {DateOptional}
 */
export interface DelUser
  extends AccessCodeBase,
    UserIdentifierBase,
    DateOptional {}

/**
 * Request interface for deleting a user from the system
 */
export interface DelUser
  extends AccessCodeBase,
    UserIdentifierBase,
    DateOptional {}

/**
 * Request interface for retrieving absence records for a specific user in a school year
 */
export interface GetAbsents extends AccessCodeBase, UserIdentifierBase {
  /** The school year to get absents for, format: YYYY */
  schoolYear: string;
}

/**
 * Request interface for retrieving all absence records for a specific date
 */
export interface GetAbsentsByDate extends AccessCodeBase {
  /** The date to get absents for, format: YYYY-MM-DD */
  date: string;
}

/**
 * Request interface for retrieving absence records for a specific date and class/group
 */
export interface GetAbsentsByDateAndGroup extends GetAbsentsByDate, ClassBase {}

/**
 * Request interface for retrieving all user accounts in a class/group
 */
export interface GetAllAccounts extends AccessCodeBase, ClassBase {
  /** Whether to get subgroups recursively ('1') or not ('0') */
  recursive: string;
}

/**
 * Request interface for creating or updating a class/group in the system
 */
export interface SaveClass extends AccessCodeBase {
  /** The name of the class or group */
  name: string;
  /** The description of the class or group */
  desc: string;
  /** Unique code for the class or group */
  code: string;
  /** The parent class/group code */
  parent: string;
  /** The roster code (see @link UserDetails) */
  untis: string;
  /** Optional institute number, solely for adding an official class/group */
  instituteNumber?: string;
  /** Optional administrative number, solely for adding an official class/group */
  adminNumber?: string;
  /** Optional school year date, format: YYYY-MM-DD, in case it's not provided it will use the current school year */
  schoolYearDate?: string;
}

/**
 * Request interface for setting a new password for a user account
 */
export interface SavePassword
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {
  /** The new password to set for the user */
  password: string;
  /** Whether the user must change password at next login (1) or not (0), although this is present Smartschool doesn't allow this */
  changePasswordAtNextLogin: number;
}

/**
 * Request interface for creating or updating a user account in the system
 */
export interface SaveUser extends AccessCodeBase {
  /** The username for the user account */
  username: string;
  /** The first name of the user */
  name: string;
  /** The last name of the user */
  surname: string;
  /**
   * The base role of the user (required)
   * Must be one of:
   * - 'leerling' (student)
   * - 'leerkracht' (teacher)
   * - 'directie' (management)
   * - 'andere' (other)
   * When fetching user details, this field is returned as 'basisrol', but as integer
   * - 0: 'leerkracht'
   * - 1: 'leerling'
   * - 13: 'andere'
   * - 30: 'directie'
   */
  basisrol: string;
  /** Primary password (required for new users) */
  passwd1?: string;
  /** Internal number identifier */
  internnumber?: string;
  /** Additional names of the user */
  extranames?: string;
  /** User's initials */
  initials?: string;
  /** User's gender/sex */
  sex?: string;
  /** Date of birth, format: YYYY-MM-DD or DD-MM-YYYY */
  birthdate?: string;
  /** City of birth */
  birthcity?: string;
  /** Country of birth */
  birthcountry?: string;
  /** User's nationality */
  nationality?: string;
  /**
   * Full street address including house number and box/apartment number (optional).
   * The address can be provided in two formats:
   * 1. "Street House# box Box#" (e.g. "Church Street 22 box 1")
   * 2. "Street House#/Box#" (e.g. "Church Street 22/1")
   *
   * The system will automatically parse and store the street name, house number,
   * and box number in their respective database fields. Both formats are equivalent
   * and will be normalized to the standard "street house# box box#" format.
   */
  address?: string;
  /** Postal code */
  postalcode?: string;
  /** City of residence */
  city?: string;
  /** Country of residence */
  country?: string;
  /** Phone number */
  phone?: string;
  /** Mobile phone number */
  mobile?: string;
  /** Email address */
  email?: string;
  /** Secondary password */
  passwd2?: string;
  /** Tertiary password */
  passwd3?: string;
  /** Additional dynamic fields */
  [key: string]: unknown;
}

/**
 * Request interface for adding a user to a specific class in Smartschool.
 * Used to assign students or teachers to classes while optionally specifying an official date.
 *
 * @interface SaveUserToClass
 * @extends {AccessCodeBase}
 * @extends {UserIdentifierBase}
 */
export interface SaveUserToClass extends AccessCodeBase, UserIdentifierBase {
  /** The class code to add the user to */
  class: string;
  /**
   * Official date for the action (optional)
   * Format: YYYY-MM-DD
   * Note: If not provided, the class movement must be manually confirmed in Smartschool
   */
  officialDate?: string;
}

/**
 * Interface for sending messages to a user's main account or co-account through the Smartschool API
 */
/**
 * Interface for sending messages to users through the Smartschool API.
 * Allows sending messages to main accounts and co-accounts with optional attachments
 * and LVS (Student Tracking System) integration.
 *
 * @interface SendMsg
 * @extends {AccessCodeBase} Base interface requiring an access code
 * @extends {UserIdentifierBase} Base interface requiring a user identifier
 *
 * @example
 * ```typescript
 * // Send a message to a student with an attachment
 * const message: SendMsg = {
 *   accesscode: "your-access-code",
 *   userIdentifier: "john.doe",
 *   title: "Assignment Feedback",
 *   body: "Great work on your latest assignment!",
 *   senderIdentifier: "teacher.smith",
 *   attachments: ["base64EncodedFile"],
 *   coaccount: 0,  // Send to main account
 *   copyToLVS: true // Copy to student tracking system
 * };
 * ```
 */
export interface SendMsg extends AccessCodeBase, UserIdentifierBase {
  /** The title/subject of the message */
  title: string;

  /** The body/content of the message */
  body: string;

  /**
   * Unique identifier of the message sender
   * Use 'Null' string to send without specifying a sender
   */
  senderIdentifier: string;

  /**
   * Optional array of file attachments
   * Each attachment must be base64 encoded
   * Can contain one or more attachments
   * @todo Base64 encode files before sending is not yet implemented
   */
  attachments?: string[];

  /**
   * Optional account type specifier to determine which account receives the message
   * - 0: Main account (default if not specified)
   * - 1: First co-account
   * - 2: Second co-account
   * - etc.
   */
  coaccount?: number;

  /**
   * Whether to add the message to the LVS (Leerling Volg Systeem / Student Tracking System)
   * @default false
   */
  copyToLVS?: boolean;
}

/**
 * Request interface for setting/updating a user's account photo in Smartschool
 * The photo will be used as the user's profile picture
 */
export interface SetAccountPhoto extends AccessCodeBase, UserIdentifierBase {
  /**
   * Base64 encoded photo data
   * @todo Base64 encode files before sending is not yet implemented
   */
  photo: string;
}

/**
 * Request interface for changing a user's account status in Smartschool
 * Can be used to activate/deactivate accounts or set temporary access periods
 */
export interface SetAccountStatus extends AccessCodeBase, UserIdentifierBase {
  /**
   * The new status to set for the account
   * @link UserAccountStates
   */
  accountStatus: UserAccountStates;
}

/**
 * Request interface for retrieving detailed user information from Smartschool
 */
export interface UserDetails extends AccessCodeBase, UserIdentifierBase {}

/**
 * Request interface for retrieving user details using their internal number
 * Alternative to UserDetails when only the internal number is known
 */
export interface GetUserDetailsByNumber extends AccessCodeBase {
  /** The internal number of the user to get details for */
  number: string;
}

/**
 * Request interface for retrieving user details using their username
 * Alternative to UserDetails when only the username is known
 */
export interface GetUserDetailsByUsername extends AccessCodeBase {
  /** The username of the user to get details for */
  username: string;
}

/**
 * Request interface for retrieving user details using their scannable code
 * Alternative to UserDetails when only the scannable code (e.g., from ID card) is known
 */
export interface GetUserDetailsByScannableCode extends AccessCodeBase {
  /** The scannable code of the user to get details for */
  scannableCode: string;
}

/**
 * Request interface for retrieving a user's official class assignment on a specific date
 */
export interface GetUserOfficialClass
  extends AccessCodeBase,
    UserIdentifierBase {
  /** The date to get the official class for, format: YYYY-MM-DD */
  date: string;
}

/**
 * Request interface for retrieving the list of titular teachers for classes
 */
export interface GetClassTeachers extends AccessCodeBase {
  /** Gets all class titulars (if true) or only the first titular (if false, default) */
  getAllOwners?: boolean;
}

/**
 * Request interface for retrieving academic year information for a specific class
 */
export interface GetSchoolyearDataOfClass extends AccessCodeBase {
  /** The class code to get school year data for */
  classCode: string;
}

/**
 * Request interface for disabling two-factor authentication on a user account
 */
export interface DeactivateTwoFactorAuthentication
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {}

/**
 * Request interface for forcing a password reset on next login for a user account
 */
export interface ForcePasswordReset
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {}

/**
 * Request interface for retrieving absence records with their platform-defined aliases
 */
export interface GetAbsentsWithAlias extends GetAbsents {}

/**
 * Request interface for retrieving absence records with aliases for a specific date
 */
export interface GetAbsentsWithAliasByDate extends GetAbsentsByDate {}

/**
 * Request interface for retrieving absence records by date, indexed by internal numbers
 */
export interface GetAbsentsWithInternalNumberByDate extends AccessCodeBase {
  /** The date to get absents for, format: YYYY-MM-DD */
  date: string;
}

/**
 * Request interface for retrieving absence records by date, indexed by usernames
 * Returns absences for all students on a specific date, using usernames as keys
 */
export interface GetAbsentsWithUsernameByDate extends AccessCodeBase {
  /** The date to get absents for, format: YYYY-MM-DD */
  date: string;
}

/**
 * Request interface for retrieving a user's profile photo from Smartschool
 */
export interface GetAccountPhoto extends AccessCodeBase, UserIdentifierBase {}

/**
 * Request interface for retrieving extended account information for all users
 */
export interface GetAllAccountsExtended extends GetAllAccounts {}

/**
 * Request interface for retrieving all groups and classes defined in Smartschool
 */
export interface GetAllGroupsAndClasses extends AccessCodeBase {}

/**
 * Request interface for retrieving the list of classes in CSV format
 */
export interface GetClassList extends AccessCodeBase {}

/**
 * Request interface for retrieving the list of classes in JSON format
 */
export interface GetClassListJson extends AccessCodeBase {}

/**
 * Request interface for retrieving helpdesk category items
 */
export interface GetHelpdeskMiniDbItems extends AccessCodeBase {}

/**
 * Request interface for retrieving reference field definitions
 */
export interface GetReferenceField extends AccessCodeBase {}

/**
 * Request interface for retrieving Skore class-teacher-course relationships
 */
export interface GetSkoreClassTeacherCourseRelation extends AccessCodeBase {}

/**
 * Request interface for retrieving a student's academic career history
 */
export interface GetStudentCareer extends AccessCodeBase, UserIdentifierBase {}

/**
 * Request interface for removing a co-account from a user's profile
 */
export interface RemoveCoAccount
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {}

/**
 * Request interface for removing a user from a class or group
 */
export interface RemoveUserFromGroup
  extends AccessCodeBase,
    UserIdentifierBase {
  /** The class/group code to remove the user from */
  class: string;
  /** Optional official date for the removal, format: YYYY-MM-DD */
  officialDate?: string;
}

/**
 * Request interface for replacing a user's internal number
 */
export interface ReplaceInum extends AccessCodeBase {
  /** The current internal number */
  oldInum: string;
  /** The new internal number to replace with */
  newInum: string;
}

/**
 * Request interface for retrieving error codes in CSV format
 */
export interface ReturnCsvErrorCodes extends AccessCodeBase {}

/**
 * Request interface for retrieving error codes in JSON format
 */
export interface ReturnJsonErrorCodes extends AccessCodeBase {}

/**
 * Request interface for updating multiple classes via CSV data
 */
export interface SaveClassList extends AccessCodeBase {
  /** Serialized list of classes in CSV format */
  serializedList: string;
}

/**
 * Request interface for updating multiple classes via JSON data
 */
export interface SaveClassListJson extends AccessCodeBase {
  /** Serialized array containing the list of classes */
  jsonList: string;
}

/**
 * Request interface for creating or updating a group
 */
export interface SaveGroup extends AccessCodeBase {
  /** The name of the group */
  name: string;
  /** The description of the group */
  desc: string;
  /** Unique code for the group */
  code: string;
  /** The parent group code */
  parent: string;
  /** The Untis identifier */
  untis: string;
}

/**
 * Request interface for saving school year data for a class in Smartschool.
 * Used to update or assign administrative and organizational details for a specific class's school year.
 *
 * @interface SaveSchoolyearDataOfClass
 * @extends {AccessCodeBase}
 *
 * @example Example
 * ```typescript
 * {
 *   accesscode: "your-access-code",
 *   classCode: "3A",
 *   date: "2024-09-01",
 *   instituteNumber: "123456",
 *   administrativeGroupNumber: "789",
 *   residence: "Campus A",
 *   domain: "Sciences",
 *   principal: "John Smith"
 * }
 * ```
 */
export interface SaveSchoolyearDataOfClass extends AccessCodeBase {
  /** The class code to save school year data for */
  classCode: string;
  /** The date for the school year data, format: YYYY-MM-DD */
  date: string;
  /** The institute number */
  instituteNumber: string;
  /** The administrative group number */
  administrativeGroupNumber: string;
  /** The residence location */
  residence: string;
  /** The domain of study */
  domain: string;
  /** The principal's name or identifier */
  principal: string;
}

/**
 * Request interface for saving a user account's signature.
 * Used to set email/message signatures for main accounts and co-accounts in Smartschool.
 *
 * @interface SaveSignature
 * @extends {AccessCodeBase} Base interface requiring an access code
 * @extends {UserIdentifierBase} Base interface requiring a user identifier
 * @extends {AccountTypeBase} Base interface specifying which account to modify
 */
export interface SaveSignature
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {
  /**
   * The signature text or data to save
   * @example Example
   * ```
   * "Kind regards,\nJohn Doe"
   * `
   */
  signature: string;
}

/**
 * Valid parameter names for the SaveUserParameter method
 * Can be used to update profile fields, co-account details, and system settings
 */
export enum UserParameterName {
  // Basic profile fields
  FirstName = "name",
  LastName = "surname",
  ExtraNames = "extranames",
  Initials = "initials",
  Gender = "sex",
  Status = "status",
  Role = "role",
  StudentNumber = "stamboeknummer",
  InternalNumber = "number",
  SortField = "sort",
  Birthday = "birthday",
  BirthPlace = "birthplace",
  BirthCountry = "birthcountry",
  NationalRegistrationNumber = "prn",

  // Address fields
  Street = "street",
  StreetNumber = "streetnr",
  BoxNumber = "busnr",
  PostalCode = "postalcode",
  City = "location",
  Country = "country",

  // Contact fields
  Email = "email",
  Website = "website",
  UntisCode = "untis",
  MobilePhone = "mobilePhone",
  HomePhone = "homePhone",
  Fax = "fax",
  InstantMessenger = "im",

  // Special fields
  Religion = "Godsdienstkeuze",
  StudentType = "Soort leerling",
  Nationality = "Nationaliteit",
  GoRoles = "gorollen",

  // Co-account fields (1-6)
  CoAccountType1 = "type_coaccount1",
  CoAccountType2 = "type_coaccount2",
  CoAccountType3 = "type_coaccount3",
  CoAccountType4 = "type_coaccount4",
  CoAccountType5 = "type_coaccount5",
  CoAccountType6 = "type_coaccount6",

  CoAccountLastName1 = "naam_coaccount1",
  CoAccountLastName2 = "naam_coaccount2",
  CoAccountLastName3 = "naam_coaccount3",
  CoAccountLastName4 = "naam_coaccount4",
  CoAccountLastName5 = "naam_coaccount5",
  CoAccountLastName6 = "naam_coaccount6",

  CoAccountFirstName1 = "voornaam_coaccount1",
  CoAccountFirstName2 = "voornaam_coaccount2",
  CoAccountFirstName3 = "voornaam_coaccount3",
  CoAccountFirstName4 = "voornaam_coaccount4",
  CoAccountFirstName5 = "voornaam_coaccount5",
  CoAccountFirstName6 = "voornaam_coaccount6",

  CoAccountStatus1 = "status_coaccount1",
  CoAccountStatus2 = "status_coaccount2",
  CoAccountStatus3 = "status_coaccount3",
  CoAccountStatus4 = "status_coaccount4",
  CoAccountStatus5 = "status_coaccount5",
  CoAccountStatus6 = "status_coaccount6",

  CoAccountEmail1 = "email_coaccount1",
  CoAccountEmail2 = "email_coaccount2",
  CoAccountEmail3 = "email_coaccount3",
  CoAccountEmail4 = "email_coaccount4",
  CoAccountEmail5 = "email_coaccount5",
  CoAccountEmail6 = "email_coaccount6",

  CoAccountPhone1 = "telefoonnummer_coaccount1",
  CoAccountPhone2 = "telefoonnummer_coaccount2",
  CoAccountPhone3 = "telefoonnummer_coaccount3",
  CoAccountPhone4 = "telefoonnummer_coaccount4",
  CoAccountPhone5 = "telefoonnummer_coaccount5",
  CoAccountPhone6 = "telefoonnummer_coaccount6",

  CoAccountMobile1 = "mobielnummer_coaccount1",
  CoAccountMobile2 = "mobielnummer_coaccount2",
  CoAccountMobile3 = "mobielnummer_coaccount3",
  CoAccountMobile4 = "mobielnummer_coaccount4",
  CoAccountMobile5 = "mobielnummer_coaccount5",
  CoAccountMobile6 = "mobielnummer_coaccount6",
}

/**
 * Valid religion choices for the Religion parameter
 */
export enum ReligionValue {
  NonConfessionalEthics = "MOR",
  CatholicReligion = "CAT",
  ProtestantReligion = "PRO",
  JewishReligion = "ISR",
  IslamicReligion = "ISL",
  OrthodoxReligion = "ORT",
  AnglicanReligion = "ANG",
  Exempt = "DIS",
  CulturalStudies = "CUL",
  OwnCultureAndReligion = "PER",
}

/**
 * Valid student types for secondary education
 */
export enum SecondaryStudentType {
  FreeStudent = "01",
  FreeStudentShort = "V",
  RegularFundable = "02",
  RegularFundableShort = "R",
  RegularNonFundable = "03",
  ProvisionallyAccepted = "99",
}

/**
 * Valid student types for primary education
 */
export enum PrimaryStudentType {
  CoefficientOne = "01",
  CoefficientOnePointFive = "02",
  NonFundable = "99",
}

/**
 * Interface for saving user parameters through the Smartschool API
 */
export interface SaveUserParameter extends AccessCodeBase, UserIdentifierBase {
  /** The parameter name to save */
  paramName: UserParameterName;
  /**
   * The value for the parameter
   * For checkbox fields, multiple values should be semicolon-separated
   * For GO! roles (gorollen), must be JSON encoded array e.g. '["Leerkracht"]'
   * For co-account status: 'actief', 'niet actief', or 'actief tot en met yyyy/mm/dd'
   * @link UserAccountStates
   */
  paramValue: string;
}

/**
 * Request interface for adding a user to multiple classes in a single operation.
 * Uses a CSV list format to specify multiple class codes at once.
 *
 * @interface SaveUserToClasses
 * @extends {AccessCodeBase} Base interface requiring an access code
 * @extends {UserIdentifierBase} Base interface requiring a user identifier
 */
export interface SaveUserToClasses extends AccessCodeBase, UserIdentifierBase {
  /** CSV list of class codes to add the user to */
  csvList: string;
}

/**
 * Request interface for adding a user to multiple classes and groups in a single operation.
 * Allows bulk assignment of users to classes/groups while controlling whether existing memberships are preserved.
 *
 * @interface SaveUserToClassesAndGroups
 * @extends {AccessCodeBase} Base interface requiring an access code
 * @extends {UserIdentifierBase} Base interface requiring a user identifier
 *
 * @example Example
 * ```typescript
 * const request: SaveUserToClassesAndGroups = {
 *   accesscode: "your-access-code",
 *   userIdentifier: "john.doe",
 *   csvList: "1A,STEM-GROUP-1,2B",
 *   keepOld: 1  // Preserve existing memberships
 * };
 * ```
 */
export interface SaveUserToClassesAndGroups
  extends AccessCodeBase,
    UserIdentifierBase {
  /** CSV list of class and group codes to add the user to */
  csvList: string;
  /** Whether to keep old class/group memberships (1) or remove them (0) */
  keepOld: number;
}

/**
 * Request interface for initiating a Skore synchronization task.
 * This interface represents a request to start synchronizing data with the Skore system.
 * Only requires an access code for authentication, no additional parameters needed.
 *
 * Upon successful request, it returns a service ID that can be used to check the sync status
 * using the CheckStatus interface.
 *
 * @interface StartSkoreSync
 * @extends {AccessCodeBase}
 *
 * @example Example
 * ```typescript
 * const request: StartSkoreSync = {
 *   accesscode: "your-access-code"
 * };
 * ```
 */
export interface StartSkoreSync extends AccessCodeBase {}

/**
 * Request interface for unregistering a student from the school in Smartschool.
 * This removes the student from all active classes/groups and marks them as unregistered,
 * while preserving their historical data.
 *
 * @interface UnregisterStudent
 * @extends {AccessCodeBase} Base interface requiring an access code
 * @extends {UserIdentifierBase} Base interface requiring a user identifier
 *
 * @example Example
 * ```typescript
 * const request: UnregisterStudent = {
 *   accesscode: "your-access-code",
 *   userIdentifier: "john.doe",
 *   officialDate: "2024-06-30"  // End of school year
 * };
 * ```
 */
export interface UnregisterStudent extends AccessCodeBase, UserIdentifierBase {
  /** Optional official date for unregistration, format: YYYY-MM-DD */
  officialDate?: string;
}

/**
 * Union type representing all possible parameter types for Smartschool API requests.
 * Combines all request interface types into a single type for API method parameters.
 */
export type SmartschoolParams =
  | SaveUser
  | SetAccountStatus
  | CourseBase
  | SendMsg
  | GetAllAccounts
  | GetAbsents
  | GetAbsentsByDate
  | GetAbsentsByDateAndGroup
  | UserDetails
  | GetUserDetailsByNumber
  | GetUserDetailsByScannableCode
  | GetUserDetailsByUsername
  | GetUserOfficialClass
  | GetClassTeachers
  | GetSchoolyearDataOfClass
  | DelClass
  | SaveClass
  | DeactivateTwoFactorAuthentication
  | ForcePasswordReset
  | GetAbsentsWithAlias
  | GetAbsentsWithAliasByDate
  | GetAbsentsWithInternalNumberByDate
  | GetAbsentsWithUsernameByDate
  | GetAccountPhoto
  | GetAllAccountsExtended
  | GetStudentCareer
  | RemoveCoAccount
  | RemoveUserFromGroup
  | ReplaceInum
  | SavePassword
  | SaveUserToClass
  | SaveClassList
  | SaveClassListJson
  | SaveGroup
  | SaveSchoolyearDataOfClass
  | SaveSignature
  | SaveUserParameter
  | SaveUserToClasses
  | SaveUserToClassesAndGroups
  | SetAccountPhoto
  | UnregisterStudent
  | ChangeUsername
  | CheckStatus
  | ChangeGroupOwners
  | ClearGroup
  | ChangeInternNumber
  | ChangePasswordAtNextLogin
  | DelUser
  | AddHelpdeskTicket
  | {};

/**
 * Valid co-account type values for Smartschool
 * These types define the relationship between the main account holder and the co-account user
 *
 * @example
 * ```typescript
 * // Setting co-account type for parent
 * const coAccountType: CoAccountTypes = "Moeder";
 *
 * // Setting co-account type for staff
 * const staffType: CoAccountTypes = "Interimaris";
 * ```
 */
export type CoAccountTypes =
  | "Maak uw keuze"
  | "Moeder"
  | "Vader"
  | "Voogd"
  | "Interimaris"
  | "Stagair"
  | "Collega"
  | "Plusmoeder"
  | "Plusvader"
  | "Meemoeder"
  | "Meevader"
  | "Stiefmoeder"
  | "Stiefvader"
  | "Grootmoeder"
  | "Grootvader"
  | "Broer"
  | "Zus"
  | "Pleegmoeder"
  | "Pleegvader"
  | "ION-begeleider"
  | "Ondersteuner"
  | "Internaatsmedewerker"
  | "Studiecoach"
  | "Logopedist"
  | "Begeleider"
  | "Interne Begeleider"
  | "Externe begeleider";

/** For co-account status: 'actief', 'niet actief', or 'actief tot en met yyyy/mm/dd' */
export type UserAccountStates = "actief" | "niet actief" | string;

/**
 * Represents a group or class that a user is a member of in Smartschool.
 * Contains identification and descriptive information about the group/class.
 *
 * @interface UserGroup
 *
 * @example
 * ```typescript
 * const group: UserGroup = {
 *   id: "123",
 *   code: "1A",
 *   name: "First Year Group A",
 *   desc: "Main class group for first year students, section A",
 *   isKlas: true,
 *   isOfficial: true
 * };
 * ```
 */
export interface UserGroup {
  id: string;
  code: string;
  name: string;
  desc: string;
  isKlas: boolean;
  isOfficial: boolean;
}

/**
 * Response interface for retrieving detailed user information from Smartschool.
 * Contains comprehensive personal, contact, school-related information and co-account details for a user.
 *
 * @interface UserDetailsResponse
 *
 * @example Example
 * ```typescript
 * const userDetails: UserDetailsResponse = {
 *   voornaam: "John",
 *   naam: "Doe",
 *   gebruikersnaam: "john.doe",
 *   internnummer: "12345",
 *   status: "actief",
 *   emailadres: "john.doe@school.be",
 *   basisrol: "leerling",
 *   groups: [
 *     {
 *       id: "123",
 *       code: "1A",
 *       name: "First Year Class A",
 *       desc: "Main class group for 1A",
 *       isKlas: true,
 *       isOfficial: true
 *     }
 *   ],
 *   // ... other fields
 * };
 * ```
 */
export interface UserDetailsResponse {
  // Personal Information
  /** First name of the user */
  voornaam: string;
  /** Last name of the user */
  naam: string;
  /** Username for system login */
  gebruikersnaam: string;
  /** Internal identification number, can be null */
  internnummer: string | null;
  /** Current account status */
  status: UserAccountStates;
  /** Additional first names of the user */
  extravoornamen: string;
  /** User's initials */
  initialen: string;
  /** Preferred name or nickname */
  roepnaam: string;
  /** Date of birth in YYYY-MM-DD format */
  geboortedatum: string;
  /** Place of birth */
  geboorteplaats: string;
  /** Country of birth */
  geboorteland: string;
  /** National registration number */
  rijksregisternummer: string;
  /** Nationality code */
  nationaliteitscode: string;
  /** Full nationality name */
  nationaliteit: string;

  // Contact Information
  /** Street name */
  straat: string;
  /** House number */
  huisnummer: string;
  /** Apartment or box number */
  busnummer: string;
  /** Postal code */
  postcode: string;
  /** City of residence */
  woonplaats: string;
  /** Country of residence */
  land: string;
  /** Primary email address */
  emailadres: string;
  /** Personal or professional website */
  website: string;
  /** Mobile phone number */
  mobielnummer: string;
  /** Landline phone number */
  telefoonnummer: string;
  /** Fax number */
  fax: string;
  /** Instant messaging handles */
  instantmessengers: string;

  // School Related
  /** Sorting field for system organization */
  sorteerveld: string;
  /** Student registration number, can be "NULL" string */
  stamboeknummer: string | "NULL";
  /** School agenda linking field */
  koppelingsveldschoolagenda: string;
  /** Base role in the system */
  basisrol: string;
  /** Class number identifier */
  klasnummer: string;
  /** External reference identifier */
  referenceIdentifier: string;
  /** Code used for scanning/identification */
  scannableCode: string;
  /** Type of student */
  soortleerling: string;
  /** User's function or role */
  function: string;
  /** Teacher identification card number */
  teachercardnumber: string;
  /** Flag indicating if student has left school */
  schoolverlater: number;

  // Authentication & Security
  /** Whether email has been verified */
  isEmailVerified: boolean;
  /** Whether 2FA app is enabled */
  isAuthenticatorAppEnabled: boolean;
  /** Whether Yubikey authentication is enabled */
  isYubikeyEnabled: boolean;
  /** Timestamp of last successful login */
  last_successful_login: string;

  // Groups & Classes
  /** Array of user groups and their properties */
  groups: UserGroup[];
  /** String representation of user groups */
  Groepen: string;

  // System IDs
  /** Internal system identifier */
  internId: string | null;
  /** Smartschool client user identifier */
  smartschoolClientUserId: string | null;

  // School Specific Fields
  /** Important information about the user */
  "Belangrijke informatie:": string | null;
  /** Lunch break preferences/schedule */
  Middagpauze: string | null;
  /** Test field placeholder */
  TEST: null;
  /** Shuttle bus information */
  Pendelbus: string;
  /** Basic option for 2A class */
  "Basisoptie 2A": string | null;
  /** Basic options for 2B class */
  "Basisopties 2B": string;
  /** Choice field */
  keuze: string;
  /** Week specification */
  week: string;
  /** Weeks specification */
  weken: string;
  /** Initiation information */
  Initiatie: string;
  /** Basic option selection */
  Basisoptie: string;
  /** Religious course choice */
  godsdienstkeuze: string;

  // Informat Integration
  /** Doctor's name from Informat */
  informat_dokter: string;
  /** Doctor's phone number from Informat */
  informat_doktertel: string;
  /** Language preferences from Informat */
  informat_languages: string;
  /** Optional course selection from Informat */
  informat_optionalcourse: string | null;

  // Co-accounts 1
  /** First name of first co-account */
  voornaam_coaccount1: string;
  /** Last name of first co-account */
  naam_coaccount1: string;
  /** Email address of first co-account */
  email_coaccount1: string;
  /** Email verification status of first co-account */
  email_coaccount1_isVerified: boolean;
  /** Phone number of first co-account */
  telefoonnummer_coaccount1: string;
  /** Mobile number of first co-account */
  mobielnummer_coaccount1: string;
  /** Account type of first co-account */
  type_coaccount1: CoAccountTypes;
  /** 2FA app status for first co-account */
  authenticator_app_enabled1: boolean;
  /** Yubikey status for first co-account */
  yubikey_enabled1: boolean;
  /** Account status of first co-account */
  status1: UserAccountStates;
  /** Last successful login of first co-account */
  last_successful_login_coaccount1: string;

  // Co-accounts 2
  /** First name of second co-account */
  voornaam_coaccount2: string;
  /** Last name of second co-account */
  naam_coaccount2: string;
  /** Email address of second co-account */
  email_coaccount2: string;
  /** Email verification status of second co-account */
  email_coaccount2_isVerified: boolean;
  /** Phone number of second co-account */
  telefoonnummer_coaccount2: string;
  /** Mobile number of second co-account */
  mobielnummer_coaccount2: string;
  /** Account type of second co-account */
  type_coaccount2: CoAccountTypes;
  /** 2FA app status for second co-account */
  authenticator_app_enabled2: boolean;
  /** Yubikey status for second co-account */
  yubikey_enabled2: boolean;
  /** Account status of second co-account */
  status2: UserAccountStates;
  /** Last successful login of second co-account */
  last_successful_login_coaccount2: string;

  // Co-accounts 3
  /** First name of third co-account */
  voornaam_coaccount3: string;
  /** Last name of third co-account */
  naam_coaccount3: string;
  /** Email address of third co-account */
  email_coaccount3: string;
  /** Email verification status of third co-account */
  email_coaccount3_isVerified: boolean;
  /** Phone number of third co-account */
  telefoonnummer_coaccount3: string;
  /** Mobile number of third co-account */
  mobielnummer_coaccount3: string;
  /** Account type of third co-account */
  type_coaccount3: number | CoAccountTypes;
  /** 2FA app status for third co-account */
  authenticator_app_enabled3: boolean;
  /** Yubikey status for third co-account */
  yubikey_enabled3: boolean;
  /** Account status of third co-account */
  status3: UserAccountStates;

  // Co-accounts 4
  /** First name of fourth co-account */
  voornaam_coaccount4: string;
  /** Last name of fourth co-account */
  naam_coaccount4: string;
  /** Email address of fourth co-account */
  email_coaccount4: string;
  /** Email verification status of fourth co-account */
  email_coaccount4_isVerified: boolean;
  /** Phone number of fourth co-account */
  telefoonnummer_coaccount4: string;
  /** Mobile number of fourth co-account */
  mobielnummer_coaccount4: string;
  /** Account type of fourth co-account */
  type_coaccount4: number | CoAccountTypes;
  /** 2FA app status for fourth co-account */
  authenticator_app_enabled4: boolean;
  /** Yubikey status for fourth co-account */
  yubikey_enabled4: boolean;
  /** Account status of fourth co-account */
  status4: UserAccountStates;

  // Co-accounts 5
  /** First name of fifth co-account */
  voornaam_coaccount5: string;
  /** Last name of fifth co-account */
  naam_coaccount5: string;
  /** Email address of fifth co-account */
  email_coaccount5: string;
  /** Email verification status of fifth co-account */
  email_coaccount5_isVerified: boolean;
  /** Phone number of fifth co-account */
  telefoonnummer_coaccount5: string;
  /** Mobile number of fifth co-account */
  mobielnummer_coaccount5: string;
  /** Account type of fifth co-account */
  type_coaccount5: number | CoAccountTypes;
  /** 2FA app status for fifth co-account */
  authenticator_app_enabled5: boolean;
  /** Yubikey status for fifth co-account */
  yubikey_enabled5: boolean;
  /** Account status of fifth co-account */
  status5: UserAccountStates;

  // Co-accounts 6
  /** First name of sixth co-account */
  voornaam_coaccount6: string;
  /** Last name of sixth co-account */
  naam_coaccount6: string;
  /** Email address of sixth co-account */
  email_coaccount6: string;
  /** Email verification status of sixth co-account */
  email_coaccount6_isVerified: boolean;
  /** Phone number of sixth co-account */
  telefoonnummer_coaccount6: string;
  /** Mobile number of sixth co-account */
  mobielnummer_coaccount6: string;
  /** Account type of sixth co-account */
  type_coaccount6: number | CoAccountTypes;
  /** 2FA app status for sixth co-account */
  authenticator_app_enabled6: boolean;
  /** Yubikey status for sixth co-account */
  yubikey_enabled6: boolean;
  /** Account status of sixth co-account */
  status6: UserAccountStates;

  [key: string]: unknown;
}

/**
 * Response interface for retrieving a user's official class details in Smartschool
 */
export interface GetUserOfficialClassResponse {
  /** Unique identifier of the class/group */
  groupID: string;
  /** ID of the parent group/class */
  parentID: string;
  /** Name of the class */
  name: string;
  /** Description of the class */
  description: string;
  /** Type of group ('K' for class) */
  type: string;
  /** Whether this is an official class (1) or not (0) */
  isOfficial: string;
  /** Password/code for the class */
  passwd: string;
  /** Icon filename for the class */
  icon: string;
  /** Visibility status of the class (1 visible, 0 hidden) */
  visible: string;
  /** Label for secondary password (if any) */
  pwd2label: string;
  /** Untis timetable system identifier */
  untis: string;
  /** Whether Google Apps integration is enabled (1) or not (0) */
  googleAppsEnabled: string;
  /** Whether this is a Google Apps subgroup (1) or not (0) */
  googleAppsSubgroup: string;
  /** Name used for Google Apps integration */
  googleAppsName: string;
  /** Whether the class was imported from SAS (1) or not (0) */
  fromSas: string;
  /** Whether the class has been deleted (1) or not (0) */
  deleted: string;
  /** Date when the class was deleted, null if not deleted */
  deleteDate: string | null;
  /** Administrative number of the class */
  adminNumber: string;
  /** Institute number the class belongs to */
  instituteNumber: string;
  /** Training component identifier, if applicable */
  vormingscomponent: string | null;
}

/**
 * Valid absence codes returned by the Smartschool API
 *
 * - `null`: No school/holiday - indicates a non-school day or holiday period
 * - `"|"`: Present - student was in attendance
 * - `"L"`: Late - student arrived late to class
 * - `"Z"`: Sick/Illness - absent due to sickness
 * - `"D"`: Doctor - absent for medical appointment
 * - `"B"`: Known - absence was notified in advance
 * - `"R"`: Unforeseen - existential reason for absence e.g. family emergency
 * - `"-"`: Unknown - unexplained/unexcused absence
 * - `"G"`: Spread - spread of lesson program
 * - `"C"`: Topsport - absence due to top sports activities
 * - `"H"`: Revalidation - absence due to revalidation
 * - `"O"`: Childcare - absence due to childcare
 * - `"Q"`: Mourning - absence due to mourning
 * - `"P"`: Personal - personal reasons for absence
 * - `"W"`: Internship work - absence due to internship work
 * - `"M"`: Absent internship - absence from internship work
 * - `"J"`: Maternity leave - absence due to maternity leave
 * - `"Y"`: Suspension - absence due to suspension
 * - `"U"`: Temporary termination - temporary termination of the student
 * - `"T"`: Termination - termination of the student
 */
export type AbsenceCode =
  | "|" // Present
  | "L" // Late
  | "Z" // Sick/Illness
  | "D" // Doctor
  | "B" // Known
  | "R" // Unforeseen
  | "-" // Unknown
  | "G" // Spread
  | "C" // Topsport
  | "H" // Revalidation
  | "O" // Childcare
  | "Q" // Mourning
  | "P" // Personal
  | "W" // Internship work
  | "M" // Absent internship
  | "J" // Maternity leave
  | "Y" // Suspension
  | "U" // Temporary termination
  | "T"; // Termination

/**
 * Response interface for absence data from Smartschool API.
 * Contains absence records for each date, split into morning (am) and afternoon (pm) periods.
 *
 * @link AbsenceCode
 *
 * @example Example
 * {
 *   "2024-09-01": {
 *     "am": null,    // No school/holiday
 *     "pm": null
 *   },
 *   "2024-09-02": {
 *     "am": "|",     // Present
 *     "pm": "|"
 *   },
 *   "2024-09-03": {
 *     "am": "L",     // Late
 *     "pm": "L"
 *   }
 * }
 */
export interface GetAbsentsResponse {
  [date: string]: {
    am: AbsenceCode | null;
    pm: AbsenceCode | null;
  };
}

export interface AbsentAlias {
  /**
   * Absence code
   * @link AbsenceCode
   */
  code: AbsenceCode | null;
  /**
   * Alias for the absence code, defined by the platform manager, can be multiple aliasses for one code
   */
  alias: string | null;
}

/**
 * Response format for getting absences by date endpoint
 * Returns absence records for all students on a specific date
 */
export interface AbsentsByDateResponse {
  [userId: string]: {
    /** User's full name */
    name: string;
    /** Morning absence code */
    am: AbsenceCode | null;
    /** Afternoon absence code */
    pm: AbsenceCode | null;
  };
}

/**
 * Response format for getting absences by class endpoint
 * Returns absence records for students in a specific class
 */
export interface AbsentsByClassResponse {
  /** Class or group code */
  classCode: string;
  /** Class or group name */
  className: string;
  /** Student absence records */
  students: {
    /** Student user ID */
    userId: string;
    /** Student's full name */
    name: string;
    /** Morning absence code */
    am: AbsenceCode | null;
    /** Afternoon absence code */
    pm: AbsenceCode | null;
  }[];
}

/**
 * Response interface for retrieving titular teacher and their assigned class information.
 * Each record represents a titular teacher assignment to a class.
 *
 * @example Example
 * ```typescript
 * {
 *   naam: "Smith",
 *   voornaam: "John",
 *   gebruikersnaam: "jsmith",
 *   internummer: "12345",
 *   stamboeknummer: "T789",
 *   koppelingsveldschoolagenda: "SCHEDULE1",
 *   klasid: "3A",
 *   klasnaam: "Class 3A",
 *   klasomschrijving: "Third year, group A",
 *   "koppelingsveld (klas)": "3A-2023",
 *   instellingsnummer: "123456",
 *   administratievegroup: "SEC1",
 *   isOfficial: true
 * }
 * ```
 */
export interface GetClassTeachersResponse {
  // Teacher Personal Information
  /** Last name of the titular teacher */
  naam: string;
  /** First name of the titular teacher */
  voornaam: string;
  /** Username/login name of the titular teacher */
  gebruikersnaam: string;
  /** Internal identification number of the teacher (can be null) */
  internummer: string | null;
  /** Official teacher registration number in the system. Can be "NULL" string if not assigned */
  stamboeknummer: string | "NULL";
  /** Field used for linking to school agenda/schedule system */
  koppelingsveldschoolagenda: string | null;

  // Class Information
  /** Unique identifier of the assigned class */
  klasid: string;
  /** Display name of the class */
  klasnaam: string;
  /** Detailed description of the class */
  klasomschrijving: string;
  /** System linking field for the class, usually contains year and class code */
  "koppelingsveld (klas)": string;

  // Administrative Information
  /** Institution number where the class is registered */
  instellingsnummer: string;
  /** Administrative group identifier for the class */
  administratievegroup: string;
  /** Indicates if this is an official class assignment (true) or temporary/informal (false) */
  isOfficial: boolean;
}

/**
 * Response interface for retrieving absences by date using internal numbers.
 * Returns a mapping of internal student numbers to their absence records for both morning (am) and afternoon (pm) periods.
 *
 * @example Example
 * {
 *   "119940": { "am": "|", "pm": "|" },    // Present all day
 *   "119975": { "am": "|", "pm": "L" },    // Present morning, Late afternoon
 *   "120004": { "am": "|", "pm": "Z" }     // Present morning, Sick afternoon
 * }
 */
export interface GetAbsentsWithInternalNumberByDateResponse {
  /**
   * Object mapping internal student numbers to absence records
   * @key Internal student number as string
   * @value Object containing morning (am) and afternoon (pm) absence codes
   */
  [internalNumber: string]: {
    /** Morning absence code */
    am: AbsenceCode | null;
    /** Afternoon absence code */
    pm: AbsenceCode | null;
  };
}

export interface ReturnJsonErrorCodesResponse {
  [code: string]: string;
}

/**
 * Response interface for retrieving absences by date using usernames.
 * Returns a mapping of student usernames to their absence records for both morning (am) and afternoon (pm) periods.
 *
 * @example Example
 * {
 *   "john.doe": { "am": "|", "pm": "|" },    // Present all day
 *   "jane.roe": { "am": "|", "pm": "L" },    // Present morning, Late afternoon
 *   "franky.loosveld": { "am": "|", "pm": "Z" }     // Present morning, Sick afternoon
 * }
 */
export interface GetAbsentsByDateResponse {
  /**
   * Object mapping student usernames to absence records
   * @key Username as string
   * @value Object containing morning (am) and afternoon (pm) absence codes
   */
  [username: string]: {
    /** Morning absence code */
    am: AbsenceCode | null;
    /** Afternoon absence code */
    pm: AbsenceCode | null;
  };
}

/**
 * Response interface for retrieving absences by date using usernames.
 * Returns a mapping of student usernames (with appended date numbers) to their absence records for both morning (am) and afternoon (pm) periods.
 *
 * @example Example
 * {
 *   "20240916_104204_john.doe": {
 *     "am": { "officialcode": "|", "alias": "Present" },
 *     "pm": { "officialcode": "|", "alias": "Present" }
 *   },
 *   "jane.roe": {
 *     "am": { "officialcode": "|", "alias": "Present" },
 *     "pm": { "officialcode": "L", "alias": "Late" }
 *   },
 *   "franky.loosveld": {
 *     "am": { "officialcode": "|", "alias": "Present" },
 *     "pm": { "officialcode": "Z", "alias": "Sick" }
 *   }
 * }
 */
export interface GetAbsentsWithAliasByDateResponse {
  /**
   * Object mapping student usernames with appended date numbers (e.g., "username_123456") to absence records
   * @key Username with date number as string (format: "username" or "YYYYMMDD_HHMMSS_username")
   * @value Object containing morning (am) and afternoon (pm) absence codes with aliases
   */
  [username: string]: {
    /** Morning absence code with alias */
    am: {
      /**
       * Absence code
       * @link AbsenceCode
       */
      officialcode: AbsenceCode | null;
      /**
       * Alias for the absence code, defined by the platform manager
       */
      alias: string;
    };
    /** Afternoon absence code with alias */
    pm: {
      /**
       * Absence code
       * @link AbsenceCode
       */
      officialcode: AbsenceCode | null;
      /**
       * Alias for the absence code, defined by the platform manager
       */
      alias: string;
    };
  };
}

/**
 * Response interface for retrieving school year data for a specific class.
 * Contains an array of school year records with administrative and organizational details.
 *
 * @example Example
 * ```typescript
 * [
 *   {
 *     "id": 123,
 *     "groupId": 123,
 *     "schoolyear": "2024-2025",
 *     "instituteNumber": "123456",
 *     "administrativeGroupNumber": 1234,
 *     "residence": "",
 *     "domain": "",
 *     "studyChoiceComponent": "",
 *     "principal": "Franky Loosveld"
 *   }
 * ]
 * ```
 */
export interface GetSchoolyearDataOfClassResponse
  extends Array<{
    /** Unique identifier for the school year record */
    id: number;

    /** Identifier of the associated class/group */
    groupId: number;

    /** School year in YYYY-YYYY format */
    schoolyear: string;

    /** Official institute number assigned by educational authorities */
    instituteNumber: string;

    /** Administrative group number for internal organization */
    administrativeGroupNumber: number;

    /** Location/campus where the class is primarily housed */
    residence: string;

    /** Study domain or field of education */
    domain: string;

    /** Optional component specifying study track or specialization */
    studyChoiceComponent: string;

    /** Name of the school principal or head administrator */
    principal: string;
  }> {}

/**
 * Represents a student's academic career progression through different classes/groups over time.
 * Each entry contains details about the student's class placement and administrative information for a specific period.
 *
 * @example Example
 * ```typescript
 * [
 *   {
 *     "inClass": true,
 *     "outSchool": false,
 *     "date": "2025-01-01",
 *     "stamboeknummer": "1234567",
 *     "groupName": "1A",
 *     "groupCode": "1A",
 *     "adminNumber": "12345",
 *     "instituteNumber": "123456"
 *   }
 * ]
 * ```
 */
export interface GetStudentCareerResponse
  extends Array<{
    /** Indicates if the student is currently enrolled in this class */
    inClass: boolean;

    /** Indicates if the student has left the school during this period */
    outSchool: boolean;

    /** Start date of the academic period in YYYY-MM-DD format */
    date: string;

    /** Student's registration/enrollment number */
    stamboeknummer: string;

    /** Display name of the class/group */
    groupName: string;

    /** Unique identifier code for the class/group */
    groupCode: string;

    /** Administrative reference number for the class */
    adminNumber: string;

    /** Official institution number where the student is enrolled */
    instituteNumber: string;
  }> {}

/**
 * Response interface for retrieving absences with associated aliases.
 * Maps dates to morning (am) and afternoon (pm) absence records, each containing a code and optional alias.
 *
 * @example Example
 * ```typescript
 * {
 *   "2025-01-28": {
 *     "am": { "code": "|", "alias": null },     // Present in morning, no alias
 *     "pm": { "code": "|", "alias": null }      // Present in afternoon, no alias
 *   },
 *   "2025-01-29": {
 *     "am": { "code": "|", "alias": null },     // Present in morning, no alias
 *     "pm": { "code": null, "alias": null }     // No school/holiday in afternoon
 *   }
 * }
 * ```
 */
export interface GetAbsentsWithAliasResponse {
  /**
   * Maps dates to absence records for morning and afternoon periods
   * @key Date in YYYY-MM-DD format
   */
  [date: string]: {
    /** Morning absence record */
    am: {
      /**
       * Absence code
       * @link AbsenceCode
       */
      code: AbsenceCode | null;
      /** Optional alias for the absence code, defined by the platform manager */
      alias: string | null;
    };
    /** Afternoon absence record */
    pm: {
      /**
       * Absence code
       * @link AbsenceCode
       */
      code: AbsenceCode | null;
      /** Optional alias for the absence code, defined by the platform manager */
      alias: string | null;
    };
  };
}

/**
 * Response interface for retrieving helpdesk mini database items.
 * Contains a hierarchical structure of helpdesk categories and their items.
 *
 * @example Example
 * ```typescript
 * [
 *   {
 *     "itemId": "33",
 *     "name": "ICT",
 *     "type": "group",
 *     "kind": "miniDb",
 *     "children": [
 *       {
 *         "itemId": "81a0704e-9cc2-424e-86e4-555188b8aff0",
 *         "name": "Hardware PC",
 *         "type": "item",
 *         "kind": "item"
 *       }
 *     ]
 *   }
 * ]
 * ```
 */
export interface GetHelpdeskMiniDbItemsResponse extends Array<HelpdeskGroup> {}

/**
 * Represents a group/category in the helpdesk mini database structure
 */
interface HelpdeskGroup {
  /** Unique identifier for the group */
  itemId: string;
  /** Display name of the group */
  name: string;
  /** Type identifier, always 'group' for categories */
  type: "group";
  /** Kind identifier, always 'miniDb' for groups */
  kind: "miniDb";
  /** Array of child items within this group */
  children: HelpdeskItem[];
}

/**
 * Represents an individual item within a helpdesk group
 */
interface HelpdeskItem {
  /** Unique identifier for the item (UUID format) */
  itemId: string;
  /** Display name of the item */
  name: string;
  /** Type identifier, always 'item' for individual entries */
  type: "item";
  /** Kind identifier, always 'item' for individual entries */
  kind: "item";
}

/**
 * Response interface for retrieving the JSON formatted class list from Smartschool.
 * Contains an array of class objects with their properties and status information.
 *
 * @example Example
 * ```typescript
 * [
 *   {
 *     "id": "4695",
 *     "code": "6WEWE",
 *     "name": "6WEWE",
 *     "desc": "Klas 6WEWE",
 *     "isOfficial": true,
 *     "isGroup": false,
 *     "isClass": true,
 *     "isVisible": true,
 *     "untis": "6WEWE"
 *   }
 * ]
 * ```
 */
export interface GetClassListJsonResponse
  extends Array<{
    /** Unique identifier of the class/group */
    id: string;

    /** Unique class/group code used for identification */
    code: string;

    /** Display name of the class/group */
    name: string;

    /** Description of the class/group */
    desc: string;

    /** Indicates if this is an official class/group in the system */
    isOfficial: boolean;

    /** Indicates if this is a group (false for regular classes) */
    isGroup: boolean;

    /** Indicates if this is a class (true for regular classes) */
    isClass: boolean;

    /** Indicates if the class/group is visible in the system */
    isVisible: boolean;

    /** Identifier used for Untis timetable system integration */
    untis: string;
  }> {}

/**
 * Response interface for retrieving absences by date using usernames.
 * Maps usernames to their morning (am) and afternoon (pm) absence records.
 *
 * @example Example
 * ```typescript
 * {
 *   "jan.roe": {
 *     "am": "|",    // Present in morning
 *     "pm": "Z"     // Sick in afternoon
 *   },
 *   "john.doe": {
 *     "am": "L",    // Late in morning
 *     "pm": "|"     // Present in afternoon
 *   }
 * }
 * ```
 */
export interface GetAbsentsWithUsernameByDateResponse {
  /**
   * Maps usernames to absence records
   * @key Username of the student
   */
  [username: string]: {
    /**
     * Morning absence code
     * @link AbsenceCode
     */
    am: AbsenceCode | null;
    /**
     * Afternoon absence code
     * @link AbsenceCode
     */
    pm: AbsenceCode | null;
  };
}
