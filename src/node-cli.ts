#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs").promises;
const path = require("path");
const { SmartschoolClient } = require("../dist/mod.js");
const endpoints = require("../src/endpoints.json");

// Parse command line arguments (Node.js equivalent of Deno's parse)
function parseArgs(args) {
  const parsed = {
    _: [],
    string: {},
    boolean: {},
    alias: {},
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      if (value !== undefined) {
        // Handle --key=value
        parsed[key] = value;
      } else if (key === "help" || key === "interactive" || key === "skip") {
        // Boolean flags
        parsed[key] = true;
      } else {
        // Look ahead for value
        if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
          parsed[key] = args[i + 1];
          i++; // Skip next arg
        } else {
          parsed[key] = true;
        }
      }
    } else if (arg.startsWith("-")) {
      const key = arg.slice(1);
      if (key === "h") {
        parsed.help = true;
      } else if (key === "i") {
        parsed.interactive = true;
      } else {
        parsed[key] = true;
      }
    } else {
      parsed._.push(arg);
    }
  }

  // Set defaults
  if (parsed.interactive === undefined) {
    parsed.interactive = false;
  }

  return parsed;
}

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
  const args = parseArgs(process.argv.slice(2));

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
    process.exit(0);
  }

  let method = args.method;
  if (!method || args.interactive) {
    method = await selectMethod();
  } else if (!endpoints[method]) {
    console.error("Invalid method");
    console.log("Available methods:", Object.keys(endpoints).join(", "));
    process.exit(1);
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
            await fs.readFile(input, "utf8");
            return true;
          } catch (error) {
            return `Error reading config file: ${error.message}`;
          }
        },
      },
    ]);
    config = JSON.parse(await fs.readFile(configPath, "utf8"));
  } else {
    try {
      config = JSON.parse(await fs.readFile(args.config, "utf8"));
    } catch (error) {
      console.error("Error reading config file:", error.message);
      process.exit(1);
    }
  }

  try {
    const client = new SmartschoolClient(config);
    const params = await getMethodParams(method, args, config);
    const result = await client[method](params);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
}

module.exports = { main };
