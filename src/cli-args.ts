/**
 * Shared command-line argument parsing for the Smartschool CLI.
 *
 * Pure TypeScript without runtime dependencies so it can be imported and
 * unit-tested from any runtime (Deno, Node).
 *
 * @module
 */

/** Shape of the arguments produced by {@link parseArgs}. */
export interface ParsedArgs {
  /** Positional (non-flag) arguments. */
  _: string[];
  [key: string]: any;
  method?: string;
  config?: string;
  interactive?: boolean;
  help?: boolean;
  h?: boolean;
  skip?: boolean;
}

/**
 * Parses command line arguments of the form `--key=value`, `--key value`
 * and boolean flags (`--help`, `--interactive`, `--skip`, `-h`, `-i`).
 *
 * Unknown flags without a value resolve to `true`; a flag followed by
 * another flag also resolves to `true`.
 *
 * @example
 * ```typescript
 * parseArgs(["--method=saveUser", "--skip", "--username", "john.doe"]);
 * // => { _: [], method: "saveUser", skip: true, username: "john.doe", interactive: false }
 * ```
 */
export function parseArgs(args: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    _: [],
    interactive: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;

    if (arg.startsWith("--")) {
      const parts = arg.slice(2).split("=");
      const key = parts[0] as string;
      const value = parts.length > 1 ? parts[1] : undefined;

      if (value !== undefined) {
        // Handle --key=value
        parsed[key] = value;
      } else if (key === "help" || key === "interactive" || key === "skip") {
        // Boolean flags
        parsed[key] = true;
      } else {
        // Look ahead for value
        if (i + 1 < args.length && !args[i + 1]!.startsWith("-")) {
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

  return parsed;
}
