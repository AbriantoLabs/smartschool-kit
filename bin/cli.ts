#!/usr/bin/env -S deno run
import inquirer from "npm:inquirer";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { SmartschoolClient } from "../src/mod.ts";
import endpoints from "../src/endpoints.json" with { type: "json" };

async function selectMethod() {
  const methods = Object.keys(endpoints);
  const { method } = await inquirer.prompt([
    {
      type: "list",
      name: "method",
      message: "Select the method you want to use:",
      choices: methods,
    },
  ]);
  return method;
}

async function getMethodParams(method, args, config) {
  const params = endpoints[method];
  if (!params) {
    throw new Error(`Unknown method: ${method}`);
  }

  const combinedParams = {
    ...config,
    ...args,
  };

  const types = {
    boolean: "confirm",
    list: "list",
    default: "input",
  };

  // TODO: Official date in interactive mode is not optional it says date is invalid because of the empty string
  // Close in interactive mode once request is responded
  const questions = Object.entries(params)
    .filter(([key, paramConfig]) => {
      // Only skip if value was explicitly provided via CLI
      return (
        combinedParams[key] === undefined &&
        paramConfig.required &&
        !(args.skip && !paramConfig.required)
      );
    })
    .map(([key, paramConfig]) => {
      const messages = {
        boolean: `Enable ${key}`,
        list: `Choose ${key}`,
        default: `Enter ${key}`,
      };

      const object = {
        type: types[paramConfig.type] ?? messages.default,
        name: key,
        message: messages[paramConfig.type] ?? messages.default,
        default: combinedParams[key] ?? paramConfig.default,
        validate: (input) => {
          if (
            paramConfig.required &&
            (input === undefined || input === null || input === "")
          ) {
            return `${key} is required`;
          }
          return true;
        },
      };

      if (paramConfig.type === "list") {
        object.choices = paramConfig.options;
      }

      return object;
    });

  const answers = await inquirer.prompt(questions);
  return {
    ...Object.fromEntries(
      Object.entries(combinedParams).filter(
        ([key]) => params[key] !== undefined,
      ),
    ),
    ...answers,
  };
}

async function main() {
  const args = parse(Deno.args, {
    string: ["method", "config"],
    boolean: ["help", "interactive"],
    alias: { h: "help", i: "interactive" },
    default: { interactive: false },
  });

  if (args.help || args.h) {
    console.log(`
Smartschool CLI
Usage:
  smartschool-cli --method=<method> --config=<config.json> [--interactive] [params...]
Options:
  --method        API method to call (optional, will show selection menu if not provided)
  --config        Path to config file (contains apiEndpoint and accessCode)
  --interactive   Force interactive mode even if parameters are provided
  --help, -h      Show this help message
  --skip          Skip optional parameters
Parameters can be provided either as command line arguments or interactively:
  --username=john.doe
  --firstName=John
  --lastName=Doe
  etc.
Examples:
  # Interactive mode with method selection
  smartschool-cli --config=./config.json
  # Specify method via command line
  smartschool-cli --method=saveUser --config=./config.json --username=john.doe
  # Force interactive mode
  smartschool-cli --method=saveUser --config=./config.json --interactive
`);
    Deno.exit(0);
  }

  let method = args.method;
  if (!method || args.interactive) {
    method = await selectMethod();
  } else if (!endpoints[method]) {
    console.error("Invalid method");
    console.log("Available methods:", Object.keys(endpoints).join(", "));
    Deno.exit(1);
  }

  let config;
  if (!args.config) {
    const { configPath } = await inquirer.prompt([
      {
        type: "input",
        name: "configPath",
        message: "Enter path to config file:",
        validate: async (input) => {
          try {
            await Deno.readTextFile(input);
            return true;
          } catch (error) {
            return `Error reading config file: ${error.message}`;
          }
        },
      },
    ]);
    config = JSON.parse(await Deno.readTextFile(configPath));
  } else {
    try {
      config = JSON.parse(await Deno.readTextFile(args.config));
    } catch (error) {
      console.error("Error reading config file:", error.message);
      Deno.exit(1);
    }
  }

  try {
    const client = new SmartschoolClient(config);
    const params = await getMethodParams(method, args, config);
    const result = await client[method](params);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    throw error;
    console.error("Error:", error.message);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
