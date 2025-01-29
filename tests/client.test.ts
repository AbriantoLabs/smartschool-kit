// client_test.ts
import { assertEquals, assertExists, assertRejects } from "jsr:@std/assert";
import { SmartschoolClient, SmartschoolError } from "../src/mod.ts";

const ERROR_CODES = {
  "1": "De naam dient minimaal uit 2 karakters te bestaan.",
  "2": "De voornaam dient uit minimaal 2 karakters te bestaan.",
  "3": "De gebruikersnaam dient minimaal uit 2 karakters bestaan.",
  "4": "Het nieuwe wachtwoord is niet complex genoeg.&lt;br&gt;Bekijk de voorwaarden voor een wachtwoord of wachtzin in de handleiding (Profiel &gt; Gebruikersnaam en wachtwoord).",
  "5": "Er is geen groep geselecteerd.",
  "6": "De gebruikersnaam bestaat reeds.",
  "7": "De wachtwoorden zijn niet identiek.",
  "8": "Het opgegeven webserviceswachtwoord is niet correct.",
  "9": "Deze gebruiker bestaat niet",
  "10": "Er is een fout gebeurd tijdens het verwerken van de gegevens. Er is niets toegepast.",
  "11": "Er is een fout opgetreden tijdens het bewaren van de klasgegevens.",
  "12": "Deze gebruiker bestaat niet",
  "13": "Er is een fout opgetreden tijdens het kopiëren/verplaatsen van de gebruikers naar de opgegeven klas.",
  "14": "Onvoldoende gegeven aangeleverd.",
  "15": "Dubbele gebruikersnaam",
  "16": "Dubbele interne nummer",
  "17": "Er is een fout opgetreden tijdens het bewaren van één of meerdere profielvelden.",
  "18": "Er is een fout opgetreden bij het versturen van het bericht",
  "19": "Parent-ID bestaat niet !",
  "20": "Cursus toevoegen mislukt.",
  "21": "Cursus met zelfde naam aanwezig.",
  "22": "Cursus niet gevonden.",
  "23": "Er is een onbekende fout opgetreden tijdens de verwerking.",
  "24": "Er is reeds een gebruiker aanwezig met dit intern nummer. Gelieve een ander nummer in te geven.",
  "25": "Opgelet, de gebruiker kon niet worden gewijzigd, omdat deze niet bestaat in Smartschool.",
  "26": "Opgelet, de gebruiker kon niet worden toegevoegd, omdat deze reeds bestaat in Smartschool.",
  "27": "Opgelet, het instellingsnummer komt niet voor in Smartschool. Gelieve eerst de instelling toe te voegen.",
  "28": "Het selecteren van een basisrol is verplicht.",
  "29": "U mag de basisrol van deze account niet meer wijzigen.",
  "30": "Enkel leerlingen (basisrol leerling) mogen lid zijn van officiële klassen.",
  "31": "De leerling mag maar lid zijn van één officiële klas.",
  "32": "Een leerling dient lid te zijn van één officiële klas.",
  "33": "Het registeren van de klasbeweging is mislukt.",
  "34": "De leerling kan niet geactiveerd worden omdat hij geen lid is van een officiële klas.",
  "35": "Het instellingsnummer is verplicht bij een officiële klas.",
  "36": "U mag het type van een officiële klas niet wijzigen.",
  "37": "U mag het type van deze klas of groep niet wijzigen omdat sommige leden van deze groep of klas niet de basisrol leerling hebben.",
  "38": "U mag het type van deze klas of groep niet wijzigen omdat sommige leden van deze groep of klas reeds lid zijn van een andere officiële klas.",
  "39": "U dient een vormingscomponent te selecteren.",
  "40": "U mag de naam van een klas niet meer wijzigen.",
  "41": "U mag het administratiefnummer niet meer wijzigen.",
  "42": "U mag het instellingsnummer niet meer wijzigen.",
  "43": "U mag de vormingscomponent niet meer wijzigen.",
  "44": "De vormingscomponent is verplicht op te geven.",
  "45": "U mag het type van een klas niet wijzigen.",
  "46": "U dient het type van de groep te selecteren.",
  "47": "Er bestaat reeds een klas met dezelfde unieke klas- of groepcode",
  "48": "Het intern nummer bestaat reeds.",
  "49": "De datum is niet geldig",
  "50": "De module 'Skore' is niet geactiveerd",
  "51": "Er is een fout opgetreden tijdens het uitschrijven van de leerling",
  "52": "Dit wachtwoord werd niet toegestaan. Gelieve een ander wachtwoord te kiezen.",
  "53": "De bovenliggende groep werd niet gevonden.",
  "54": "De bovenliggende groep mag geen officiële klas zijn.",
  "55": "Een officiële klas kan geen subgroepen bevatten.",
  "56": "Gelieve een geldige datum op te geven voor het schooljaar",
  "57": "De 'Roostercode' dient uniek te zijn. De waarde die u invulde is reeds in gebruik.",
};

// Mock fetch for testing
const mockFetch = async (url: string, options: RequestInit) => {
  // Simulate different API responses based on the request
  const body = options.body as string;

  if (body.includes("returnJsonErrorCodes")) {
    return new Response(JSON.stringify(ERROR_CODES));
  }

  if (body.includes("saveUser")) {
    return new Response(
      `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
         <soap:Body>
           <saveUserResponse xmlns="http://www.smartschool.be/webservices">
             <return>0</return>
           </saveUserResponse>
         </soap:Body>
       </soap:Envelope>`,
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      },
    );
  }

  if (body.includes("error")) {
    return new Response(
      `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
         <soap:Body>
           <getUserDetailsResponse xmlns="http://www.smartschool.be/webservices">
             <return>
               12
             </return>
           </getUserDetailsResponse>
         </soap:Body>
       </soap:Envelope>`,
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      },
    );
  }

  if (body.includes("getUserDetails")) {
    return new Response(
      `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
         <soap:Body>
           <getUserDetailsResponse xmlns="http://www.smartschool.be/webservices">
             <return>
               <username>john.doe</username>
               <name>John</name>
               <surname>Doe</surname>
             </return>
           </getUserDetailsResponse>
         </soap:Body>
       </soap:Envelope>`,
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      },
    );
  }

  return new Response(
    `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
       <soap:Body>
         <defaultResponse xmlns="http://www.smartschool.be/webservices">
           <return>0</return>
         </defaultResponse>
       </soap:Body>
     </soap:Envelope>`,
    {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    },
  );
};

// Replace global fetch with mock
globalThis.fetch = mockFetch as typeof fetch;

const client = new SmartschoolClient({
  apiEndpoint: "https://test.smartschool.be/Webservices/V3",
  accesscode: "test123",
});

Deno.test("SmartschoolClient - saveUser succeeds", async () => {
  const result = await client.saveUser({
    username: "john.doe",
    name: "John",
    surname: "Doe",
    basisrol: "leerkracht",
    passwd1: "password123",
    passwd2: "password123",
    passwd3: "password123",
  });

  assertEquals(result, 0);
});

Deno.test("SmartschoolClient - getUserDetails returns user data", async () => {
  const result = (await client.getUserDetails({
    userIdentifier: "john.doe",
  })) as Record<string, unknown>;

  assertExists(result["username"]);
  assertEquals(result["username"], "john.doe");
  assertEquals(result["name"], "John");
  assertEquals(result["surname"], "Doe");
});

Deno.test("SmartschoolClient - addCourse creates new course", async () => {
  const result = await client.addCourse({
    coursename: "Mathematics",
    coursedesc: "Advanced Math",
    visibility: 1,
  });

  assertEquals(result, 0);
});

Deno.test("SmartschoolClient - sendMsg sends message", async () => {
  const result = await client.sendMsg({
    userIdentifier: "john.doe",
    title: "Test Message",
    body: "Hello World",
    senderIdentifier: "admin",
  });

  assertEquals(result, 0);
});

Deno.test("SmartschoolClient - saves class list", async () => {
  const result = await client.saveClassList({
    serializedList: JSON.stringify([
      { name: "Class A", code: "A1" },
      { name: "Class B", code: "B1" },
    ]),
  });

  assertEquals(result, 0);
});

Deno.test("SmartschoolClient - handles errors", async () => {
  await assertRejects(
    async () => {
      const response = await client.getUserDetails({
        userIdentifier: "error",
      });
      console.log(response);
    },
    SmartschoolError,
    ERROR_CODES["12"],
  );
});
