# Smartschool API Coverage Report

This document provides an overview of the API coverage status for the Smartschool client implementation.

## Status Indicators

- ✅ Fully implemented and available
- ❌ Defined in endpoints but not implemented
- ⚠️ Implemented but not in endpoints

## Implementation Status

### Available Methods

The following methods are fully implemented and match the API endpoints:

```typescript
class SmartschoolClient {
    ✅ addCourse()
    ✅ addCourseStudents()
    ✅ addCourseTeacher()
    ✅ addHelpdeskTicket()
    ✅ changeGroupOwners()
    ✅ changeInternNumber()
    ✅ changePasswordAtNextLogin()
    ✅ changeUsername()
    ✅ checkStatus()
    ✅ clearGroup()
    ✅ deactivateTwoFactorAuthentication()
    ✅ delClass()
    ✅ delUser()
    ✅ forcePasswordReset()
    ✅ getAbsents()
    ✅ getAbsentsWithAlias()
    ✅ getAbsentsByDate()
    ✅ getAbsentsWithAliasByDate()
    ✅ getAbsentsWithInternalNumberByDate()
    ✅ getAbsentsWithUsernameByDate()
    ✅ getAbsentsByDateAndGroup()
    ✅ getAccountPhoto()
    ✅ getAllAccounts()
    ✅ getAllAccountsExtended()
    ✅ getAllGroupsAndClasses()
    ✅ getClassList()
    ✅ getClassListJson()
    ✅ getClassTeachers()
    ✅ getCourses()
    ✅ getHelpdeskMiniDbItems()
    ✅ getReferenceField()
    ✅ getSchoolyearDataOfClass()
    ✅ getSkoreClassTeacherCourseRelation()
    ✅ getStudentCareer()
    ✅ getUserDetails()
    ✅ getUserDetailsByNumber()
    ✅ getUserDetailsByScannableCode()
    ✅ getUserDetailsByUsername()
    ✅ getUserOfficialClass()
    ✅ removeCoAccount()
    ✅ removeUserFromGroup()
    ✅ replaceInum()
    ✅ returnCsvErrorCodes()
    ✅ returnJsonErrorCodes()
    ✅ saveClass()
    ✅ saveClassList()
    ✅ saveClassListJson()
    ✅ saveGroup()
    ✅ savePassword()
    ✅ saveSchoolyearDataOfClass()
    ✅ saveSignature()
    ✅ saveUser()
    ✅ saveUserParameter()
    ✅ saveUserToClass()
    ✅ saveUserToClasses()
    ✅ saveUserToClassesAndGroups()
    ✅ sendMsg()
    ✅ setAccountPhoto()
    ✅ setAccountStatus()
    ✅ startSkoreSync()
    ✅ unregisterStudent()
}
```

### Missing Implementations

The following endpoints are defined in the API but not yet implemented in the client:

```typescript
class SmartschoolClient {

}
```

### Extra Implementations

The following methods are implemented in the client but not defined in the API endpoints:

```typescript
class SmartschoolClient {

}
```

## Coverage Statistics

Current status:
- Total number of API endpoints: 61
- Implemented endpoints: 61
- Coverage percentage: 100.0%

## How to Contribute

To help improve API coverage:

1. Pick a method marked with ❌ from the Missing Implementations section
2. Implement the method following the API specification
3. Submit a pull request with your implementation
4. Update this coverage report

## Automated Verification

You can run the API coverage check yourself using:

```typescript
const checker = new APIChecker(client);
console.log(checker.getAllMethodsStatus());
```

This report is automatically generated using the APIChecker utility class.

---
Last updated: 1/15/2025