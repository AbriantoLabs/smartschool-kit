import { client } from "./index.ts";

let response;

response = await client.getUserDetails({
  userIdentifier: "noreply",
});

console.log("getUserDetails:", response);

response = await client.getUserDetailsByNumber({
  number: "35828",
});

console.log("getUserDetailsByNumber:", response);

response = await client.getUserDetailsByUsername({
  username: "noreply",
});

console.log("getUserDetailsByUsername:", response);

response = await client.getUserDetailsByScannableCode({
  scannableCode: "e0354947-d83a-5501-b622-9a672c2669ca",
});

console.log("getUserDetailsByScannableCode:", response);

response = await client.getUserOfficialClass({
  userIdentifier: "john.doe",
  date: "2024-09-01",
});

console.log("getUserOfficialClass:", response);
