export interface AccessCodeBase {
  /** Access code for the Smartschool API */
  accesscode: string;
}

export interface SmartschoolConfig extends AccessCodeBase {
  /** Base URL for the Smartschool API */
  apiEndpoint: string;
}

export interface UserIdentifierBase {
  /** Username or internal number of the user */
  userIdentifier: string;
}

export interface AccountTypeBase {
  /** Account type of the user, 0 is the user (main-account), 1 first co-account, 2 second co-account, ... */
  accountType: number;
}

export interface CourseBase {
  /** Course name */
  coursename: string;
  /** Course code */
  coursedesc: string;
  /** Course abbreviation */
  visibility?: number;
}

export interface UserListBase {
  /** CSV list of unique user codes */
  userlist: string;
}

export interface GroupIdsBase {
  /** CSV list of unique class- or groupscodes */
  groupIds: string;
}

export interface DateOptional {
  /** Official date for the action, YYYY-MM-DD format */
  officialDate?: string;
}

export interface ClassBase {
  /** Unique class- or groupscode */
  code: string;
}

export interface AddCourse extends AccessCodeBase, CourseBase {
  /** 1 for visible , 0 for hidden, by default when not provided 1 */
  visibility?: number;
}

export interface AddCourseStudents
  extends AccessCodeBase,
    CourseBase,
    GroupIdsBase {}

export interface AddCourseTeacher
  extends AccessCodeBase,
    CourseBase,
    UserIdentifierBase {
  /** Unique field user */
  internnummer: string;
}

export interface AddHelpdeskTicket extends AccessCodeBase, UserIdentifierBase {
  /** Title of the helpdesk ticket */
  title: string;
  /** Description of the helpdesk ticket */
  description: string;
  /** Priority of the helpdesk ticket */
  priority: number;
  /** Category of the helpdesk ticket */
  miniDbItem: string;
}

export interface ChangeGroupOwners extends AccessCodeBase, UserListBase {
  /** Unique class- or groupscode */
  code: string;
}

export interface ChangeInternNumber extends AccessCodeBase {
  /** The current username of the user whose internal number needs to be changed */
  username: string;
  /** The new internal number to assign to the user */
  newInternNumber: string;
}

export interface ChangePasswordAtNextLogin
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {}

export interface ChangeUsername extends AccessCodeBase {
  /** The internal number of the user whose username needs to be changed */
  internNumber: string;
  /** The new username to assign to the user */
  newUsername: string;
}

export interface CheckStatus extends AccessCodeBase {
  /** Unique identifier code of the synchronization task received from startSkoreSync */
  serviceId: string;
}

export interface ClearGroup extends AccessCodeBase {
  group: string;
  officialDate?: string;
}

export interface DelClass extends AccessCodeBase, ClassBase {}

export interface DelUser
  extends AccessCodeBase,
    UserIdentifierBase,
    DateOptional {}

export interface GetAbsents extends AccessCodeBase, UserIdentifierBase {
  /** The school year to get absents for, format: YYYY */
  schoolYear: string;
}

export interface GetAbsentsByDate extends AccessCodeBase {
  /** The date to get absents for, format: YYYY-MM-DD */
  date: string;
}

export interface GetAbsentsByDateAndGroup extends GetAbsentsByDate, ClassBase {}

export interface GetAllAccounts extends AccessCodeBase, ClassBase {
  /** Whether to get subgroups recursively ('1') or not ('0') */
  recursive: string;
}

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

export interface SavePassword
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {
  /** The new password to set for the user */
  password: string;
  /** Whether the user must change password at next login (1) or not (0), although this is present Smartschool doesn't allow this */
  changePasswordAtNextLogin: number;
}

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

export interface SetAccountPhoto extends AccessCodeBase, UserIdentifierBase {
  /**
   * Base64 encoded photo data
   * @todo Base64 encode files before sending is not yet implemented
   */
  photo: string;
}

export interface SetAccountStatus extends AccessCodeBase, UserIdentifierBase {
  /**
   * The new status to set for the account
   * @link UserAccountStates
   */
  accountStatus: UserAccountStates;
}

export interface UserDetails extends AccessCodeBase, UserIdentifierBase {}

export interface GetUserDetailsByNumber extends AccessCodeBase {
  /** The internal number of the user to get details for */
  number: string;
}

export interface GetUserDetailsByUsername extends AccessCodeBase {
  /** The username of the user to get details for */
  username: string;
}

export interface GetUserDetailsByScannableCode extends AccessCodeBase {
  /** The scannable code of the user to get details for */
  scannableCode: string;
}

export interface GetUserOfficialClass
  extends AccessCodeBase,
    UserIdentifierBase {
  /** The date to get the official class for, format: YYYY-MM-DD */
  date: string;
}

export interface GetClassTeachers extends AccessCodeBase {
  /** Gets all class titulars (if true) or only the first titular (if false, default) */
  getAllOwners?: boolean;
}

export interface GetSchoolyearDataOfClass extends AccessCodeBase {
  /** The class code to get school year data for */
  classCode: string;
}

export interface DeactivateTwoFactorAuthentication
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {}

export interface ForcePasswordReset
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {}

export interface GetAbsentsWithAlias extends GetAbsents {}

export interface GetAbsentsWithAliasByDate extends GetAbsentsByDate {}

export interface GetAbsentsWithInternalNumberByDate extends AccessCodeBase {
  /** The date to get absents for, format: YYYY-MM-DD */
  date: string;
}

export interface GetAbsentsWithUsernameByDate extends AccessCodeBase {
  /** The date to get absents for, format: YYYY-MM-DD */
  date: string;
}

export interface GetAccountPhoto extends AccessCodeBase, UserIdentifierBase {}

export interface GetAllAccountsExtended extends GetAllAccounts {}

export interface GetAllGroupsAndClasses extends AccessCodeBase {}

export interface GetClassList extends AccessCodeBase {}

export interface GetClassListJson extends AccessCodeBase {}

export interface GetHelpdeskMiniDbItems extends AccessCodeBase {}

export interface GetReferenceField extends AccessCodeBase {}

export interface GetSkoreClassTeacherCourseRelation extends AccessCodeBase {}

export interface GetStudentCareer extends AccessCodeBase, UserIdentifierBase {}

export interface RemoveCoAccount
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {}

export interface RemoveUserFromGroup
  extends AccessCodeBase,
    UserIdentifierBase {
  /** The class/group code to remove the user from */
  class: string;
  /** Optional official date for the removal, format: YYYY-MM-DD */
  officialDate?: string;
}

export interface ReplaceInum extends AccessCodeBase {
  /** The current internal number */
  oldInum: string;
  /** The new internal number to replace with */
  newInum: string;
}

export interface ReturnCsvErrorCodes extends AccessCodeBase {}

export interface ReturnJsonErrorCodes extends AccessCodeBase {}

export interface SaveClassList extends AccessCodeBase {
  /** Serialized list of classes in CSV format */
  serializedList: string;
}

export interface SaveClassListJson extends AccessCodeBase {
  /** Serialized array containing the list of classes */
  jsonList: string;
}

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

export interface SaveUserToClasses extends AccessCodeBase, UserIdentifierBase {
  /** CSV list of class codes to add the user to */
  csvList: string;
}

export interface SaveUserToClassesAndGroups
  extends AccessCodeBase,
    UserIdentifierBase {
  /** CSV list of class and group codes to add the user to */
  csvList: string;
  /** Whether to keep old class/group memberships (1) or remove them (0) */
  keepOld: number;
}

export interface SendMsg extends AccessCodeBase, UserIdentifierBase {
  title: string;
  body: string;
  senderIdentifier: string;
  attachments?: string[];
  coaccount?: number;
  copyToLVS?: boolean;
}

export interface StartSkoreSync extends AccessCodeBase {}

export interface UnregisterStudent extends AccessCodeBase, UserIdentifierBase {
  /** Optional official date for unregistration, format: YYYY-MM-DD */
  officialDate?: string;
}

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

export interface UserGroup {
  id: string;
  code: string;
  name: string;
  desc: string;
  isKlas: boolean;
  isOfficial: boolean;
}

// export interface CoAccount {
//   voornaam: string;
//   naam: string;
//   email: string;
//   email_isVerified: boolean;
//   telefoonnummer: string;
//   mobielnummer: string;
//   type: CoAccountTypes | number;
//   authenticator_app_enabled: boolean;
//   yubikey_enabled: boolean;
//   status: UserAccountStates;
//   last_successful_login?: string;
// }

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
 * - `"R"`: Reason - reason provided for absence
 * - `"-"`: Unknown - unexplained/unexcused absence
 * - `"T"`: Suspension - temporary suspension from school
 * - `"U"`: Expelled - expelled from school
 * - `"S"`: Skip/Truant - intentionally skipped class
 * - `"A"`: Administrative - administrative absence
 * - `"E"`: Excused - excused absence with valid reason
 * @todo verify codes
 */
export type AbsenceCode =
  | "|"
  | "L"
  | "Z"
  | "D"
  | "B"
  | "R"
  | "-"
  | "T"
  | "U"
  | "S"
  | "A"
  | "E";

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
