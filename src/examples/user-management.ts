import { client } from "./index.ts";

let response;

response = await client.saveUser({
  username: "john.doe",
  name: "John",
  surname: "Doe",
  basisrol: "andere", // Required: Base role
  passwd1: "SecurePassword123", // Consider using environment variables for passwords
  sex: "M", // Optional: M or F
  email: "john.doe@example.com", // Optional
  internnumber: "12345", // Optional
});

console.log("saveUser response:", response);

// Test saveUserToClass method
response = await client.saveUserToClass({
  userIdentifier: "john.doe",
  class: "demo",
  officialDate: "2025-01-15", // Optional: YYYY-MM-DD format
});

console.log("saveUserToClass response:", response);

response = await client.delUser({
  userIdentifier: "john.doe",
});

console.log("delUser response:", response);

// Returns SmartschoolError: Het nieuwe wachtwoord is niet correct genoeg...
response = await client.saveUser({
  username: "john.doe",
  name: "John",
  surname: "Doe",
  basisrol: "andere", // Required: Base role
  password: "SecurePassword123", // Wrong key, should be passwd1
  sex: "M", // Optional: M or F
  email: "john.doe@example.com", // Optional
  internnumber: "12345", // Optional
});
