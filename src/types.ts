export interface AccessCodeBase {
  accesscode?: string;
}

export interface SmartschoolConfig extends AccessCodeBase {
  apiEndpoint: string;
  accesscode: string;
}

export interface UserIdentifierBase {
  userIdentifier: string;
}

export interface AccountTypeBase {
  accountType: number;
}

export interface CourseBase {
  coursename: string;
  coursedesc: string;
  visibility?: number;
}

export interface DateOptional {
  officialDate?: string;
}

export interface ClassBase {
  code: string;
}

// Method specific interfaces
export interface AddCourse extends AccessCodeBase, CourseBase {
  visibility?: number;
}

export interface AddCourseStudents extends AccessCodeBase, CourseBase {
  groupIds: string;
}

export interface AddCourseTeacher extends AccessCodeBase, CourseBase {
  internnummer: string;
  userlist: string;
}

export interface AddHelpdeskTicket extends AccessCodeBase {
  title: string;
  description: string;
  priority: number;
  miniDbItem: string;
  userIdentifier: string;
}

export interface ChangeGroupOwners extends AccessCodeBase {
  code: string;
  userlist: string;
}

export interface ChangeInternNumber extends AccessCodeBase {
  username: string;
  newInternNumber: string;
}

export interface ChangePasswordAtNextLogin
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {}

export interface ChangeUsername extends AccessCodeBase {
  internNumber: string;
  newUsername: string;
}

export interface CheckStatus extends AccessCodeBase {
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
  schoolYear: string;
}

export interface GetAbsentsByDate extends AccessCodeBase {
  date: string;
}

export interface GetAbsentsByDateAndGroup extends GetAbsentsByDate, ClassBase {}

export interface GetAllAccounts extends AccessCodeBase, ClassBase {
  recursive: string;
}

export interface SaveClass extends AccessCodeBase {
  name: string;
  desc: string;
  code: string;
  parent: string;
  untis: string;
  instituteNumber?: string;
  adminNumber?: string;
  schoolYearDate?: string;
}

export interface SavePassword
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {
  password: string;
  changePasswordAtNextLogin: number;
}

export interface SaveUser extends AccessCodeBase {
  username: string;
  name: string;
  surname: string;
  basisrol: string;
  // Needs to be provided for a new user
  passwd1?: string;
  internnumber?: string;
  extranames?: string;
  initials?: string;
  sex?: string;
  birthdate?: string;
  birthcity?: string;
  birthcountry?: string;
  nationality?: string;
  address?: string;
  postalcode?: string;
  city?: string;
  country?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  passwd2?: string;
  passwd3?: string;
  [key: string]: unknown;
}

export interface SaveUserToClass extends AccessCodeBase, UserIdentifierBase {
  class: string;
  officialDate?: string;
}

export interface SendMsg extends AccessCodeBase, UserIdentifierBase {
  title: string;
  body: string;
  senderIdentifier: string;
  attachments?: any[];
  coaccount?: number;
  copyToLVS?: boolean;
}

export interface SetAccountPhoto extends AccessCodeBase, UserIdentifierBase {
  photo: string;
}

export interface SetAccountStatus extends AccessCodeBase, UserIdentifierBase {
  accountStatus: any;
}

export interface UserDetails extends AccessCodeBase, UserIdentifierBase {}

export interface GetUserDetailsByNumber extends AccessCodeBase {
  number: string;
}

export interface GetUserDetailsByUsername extends AccessCodeBase {
  username: string;
}

export interface GetUserDetailsByScannableCode extends AccessCodeBase {
  scannableCode: string;
}

export interface GetUserOfficialClass
  extends AccessCodeBase,
    UserIdentifierBase {
  date: string;
}

export interface GetClassTeachers extends AccessCodeBase {
  getAllOwners: boolean;
}

export interface GetSchoolyearDataOfClass extends AccessCodeBase {
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
  date: string;
}

export interface GetAbsentsWithUsernameByDate extends AccessCodeBase {
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
  class: string;
  officialDate?: string;
}

export interface ReplaceInum extends AccessCodeBase {
  oldInum: string;
  newInum: string;
}

export interface ReturnCsvErrorCodes extends AccessCodeBase {}

export interface ReturnJsonErrorCodes extends AccessCodeBase {}

export interface SaveClassList extends AccessCodeBase {
  serializedList: string;
}

export interface SaveClassListJson extends AccessCodeBase {
  jsonList: string;
}

export interface SaveGroup extends AccessCodeBase {
  name: string;
  desc: string;
  code: string;
  parent: string;
  untis: string;
}

export interface SaveSchoolyearDataOfClass extends AccessCodeBase {
  classCode: string;
  date: string;
  instituteNumber: string;
  administrativeGroupNumber: string;
  residence: string;
  domain: string;
  principal: string;
}

export interface SaveSignature
  extends AccessCodeBase,
    UserIdentifierBase,
    AccountTypeBase {
  signature: string;
}

export interface SaveUserParameter extends AccessCodeBase, UserIdentifierBase {
  paramName: string;
  paramValue: string;
}

export interface SaveUserToClasses extends AccessCodeBase, UserIdentifierBase {
  csvList: string;
}

export interface SaveUserToClassesAndGroups
  extends AccessCodeBase,
    UserIdentifierBase {
  csvList: string;
  keepOld: number;
}

export interface SendMsg extends AccessCodeBase, UserIdentifierBase {
  title: string;
  body: string;
  senderIdentifier: string;
  attachments?: any[];
  coaccount?: number;
  copyToLVS?: boolean;
}

export interface StartSkoreSync extends AccessCodeBase {}

export interface UnregisterStudent extends AccessCodeBase, UserIdentifierBase {
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
