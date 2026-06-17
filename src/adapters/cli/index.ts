import { readFile } from "node:fs/promises";

import { engine, type CompileOptions } from "../../core/index.js";

const HELP = `Packwright CLI

Usage:
  packwright compile --file <path>
  packwright --help

Example:
  npm run cli -- compile --file fixtures/omniagent-intake.json

Options:
  -h, --help  Show this help
`;

class CliUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliUserError";
  }
}

interface CompileArgs {
  filePath: string;
}

function parseCompileArgs(args: readonly string[]): CompileArgs {
  let filePath: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--file") {
      const value = args[index + 1];
      if (value === undefined || value.startsWith("-")) {
        throw new CliUserError("missing required --file <path>");
      }
      filePath = value;
      index += 1;
      continue;
    }

    throw new CliUserError(`unsupported option: ${String(arg)}`);
  }

  if (filePath === undefined) {
    throw new CliUserError("missing required --file <path>");
  }

  return { filePath };
}

async function readJsonFile(filePath: string): Promise<unknown> {
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    throw new CliUserError(`failed to read input file: ${filePath}`);
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new CliUserError(`invalid JSON in input file: ${filePath}`);
  }
}

function compileOptionsFromEnv(): CompileOptions {
  const createdAt = process.env["PACKWRIGHT_FIXED_CREATED_AT"];
  return createdAt === undefined ? {} : { createdAt };
}

async function main(args: readonly string[]): Promise<number> {
  const command = args[0];

  if (command === undefined || command === "--help" || command === "-h") {
    process.stdout.write(HELP);
    return 0;
  }

  if (command !== "compile") {
    throw new CliUserError(`unknown command: ${command}`);
  }

  const { filePath } = parseCompileArgs(args.slice(1));
  const intake = await readJsonFile(filePath);
  const result = await engine.compile(intake, compileOptionsFromEnv());
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return 0;
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
}
