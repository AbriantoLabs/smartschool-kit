#!/usr/bin/env -S deno run

import { parse } from "https://deno.land/std/flags/mod.ts";
import { SmartschoolClient, SmartschoolConfig } from "../src/mod.ts";
import endpointsJson from "../src/endpoints.json" with { type: "json" };

/** Per-endpoint parameter metadata from endpoints.json. */
interface ParamConfig {
  type?: string;
  required?: boolean;
  default?: unknown;
  options?: string[];
}

type Endpoints = Record<string, Record<string, ParamConfig>>;

const endpoints = endpointsJson as Endpoints;

/** Prompt library, loaded lazily so --help and scripted usage never load it. */
async function loadInquirer(): Promise<any> {
  const { default: inquirer } = await import("npm:inquirer");
  return inquirer;
}

async function selectMethod(): Promise<string> {
  const inquirer = await loadInquirer();
  const methods = Object.keys(endpoints);
  const { method } = await inquirer.prompt([
    {
      type: "list",
      name: "method",
      message: "Select the method you want to use:",
      choices: methods,
    },
  ]);
  return method as string;
}

async function getMethodParams(
  method: string,
  args: Record<string, unknown>,
  config: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const params = endpoints[method];
  if (!params) {
    throw new Error(`Unknown method: ${method}`);
  }

  const combinedParams: Record<string, unknown> = {
    ...config,
    ...args,
  };

  const types: Record<string, string> = {
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
      const messages: Record<string, string> = {
        boolean: `Enable ${key}`,
        list: `Choose ${key}`,
        default: `Enter ${key}`,
      };

      const question: Record<string, unknown> = {
        type: types[paramConfig.type ?? "default"] ?? types.default,
        name: key,
        message: messages[paramConfig.type ?? "default"] ?? messages.default,
        default: combinedParams[key] ?? paramConfig.default,
        validate: (input: unknown) => {
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
        question.choices = paramConfig.options;
      }

      return question;
    });

  const answers = await (await loadInquirer()).prompt(questions);
  return {
    ...Object.fromEntries(
      Object.entries(combinedParams).filter(
        ([key]) => params[key] !== undefined,
      ),
    ),
    ...(answers as Record<string, unknown>),
  };
}

async function main(): Promise<void> {
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

  let method: string | undefined = args.method as string | undefined;
  if (!method || args.interactive) {
    method = await selectMethod();
  } else if (!endpoints[method]) {
    console.error("Invalid method");
    console.log("Available methods:", Object.keys(endpoints).join(", "));
    Deno.exit(1);
  }

  let config: SmartschoolConfig;
  if (!args.config) {
    const inquirer = await loadInquirer();
    const { configPath } = await inquirer.prompt([
      {
        type: "input",
        name: "configPath",
        message: "Enter path to config file:",
        validate: async (input: string) => {
          try {
            await Deno.readTextFile(input);
            return true;
          } catch (error) {
            return `Error reading config file: ${
              error instanceof Error ? error.message : String(error)
            }`;
          }
        },
      },
    ]);
    config = JSON.parse(await Deno.readTextFile(configPath as string));
  } else {
    try {
      config = JSON.parse(await Deno.readTextFile(args.config as string));
    } catch (error) {
      console.error(
        "Error reading config file:",
        error instanceof Error ? error.message : error,
      );
      Deno.exit(1);
    }
  }

  try {
    const client = new SmartschoolClient(config);
    const params = await getMethodParams(
      method as string,
      args as Record<string, unknown>,
      config as unknown as Record<string, unknown>,
    );
    const result = await (client as unknown as Record<
      string,
      (p: Record<string, unknown>) => Promise<unknown>
    >)[method as string](params);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
