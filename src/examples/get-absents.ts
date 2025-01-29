import { client } from "./index.ts";

let response;

response = await client.getAbsents({
  userIdentifier: "anil.onder",
  schoolYear: "2024",
});

console.log("getAbsents:", response);

response = await client.getAbsentsWithAlias({
  userIdentifier: "anil.onder",
  schoolYear: "2024",
});

console.log("getAbsentsWithAlias:", response);

response = await client.getAbsentsWithAliasByDate({
  date: "2024-09-20",
});

console.log("getAbsentsWithAliasByDate:", response);

response = await client.getAbsentsWithInternalNumberByDate({
  date: "2024-09-20",
});

console.log("getAbsentsWithInternalNumberByDate:", response);

response = await client.getAbsentsWithUsernameByDate({
  date: "2024-09-21",
});

console.log("getAbsentsWithUsernameByDate:", response);

response = await client.getAbsentsByDateAndGroup({
  date: "2024-09-21",
  code: "1A",
});

console.log("getAbsentsByDateAndGroup:", response);
