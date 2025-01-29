import { client } from "./index.ts";

await client.sendMsg({
  userIdentifier: "john.doe",
  title: "Hallo",
  body: "Welkom op Smartschool!",
  senderIdentifier: "jane.roe",
});
