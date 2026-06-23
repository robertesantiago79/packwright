import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { engine, type CompileOptions } from "../../core/index.js";

const HELP = `Packwright CLI

Usage:
  packwright compile --file <path>
  packwright compile --file <path> --out <dir>
  packwright --help

Example:
  npm run --silent cli -- compile --file fixtures/omniagent-intake.json --out packs

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
  outDir?: string;
}

function parseCompileArgs(args: readonly string[]): CompileArgs {
  let filePath: string | undefined;
  let outDir: string | undefined;

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

    if (arg === "--out") {
      const value = args[index + 1];
      if (value === undefined || value.startsWith("-")) {
        throw new CliUserError("missing value for --out <dir>");
      }
      outDir = value;
      index += 1;
      continue;
    }

    throw new CliUserError(`unsupported option: ${String(arg)}`);
  }

  if (filePath === undefined) {
    throw new CliUserError("missing required --file <path>");
  }

  return outDir === undefined ? { filePath } : { filePath, outDir };
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

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function ensureOutputDirectory(outDir: string): Promise<void> {
  try {
    const outputPath = await stat(outDir);
    if (!outputPath.isDirectory()) {
      throw new CliUserError(`output path exists and is not a directory: ${outDir}`);
    }
  } catch (error) {
    if (error instanceof CliUserError) {
      throw error;
    }

    try {
      await mkdir(outDir, { recursive: true });
    } catch {
      throw new CliUserError(`failed to create output directory: ${outDir}`);
    }
  }
}

async function writeOutputFiles(
  outDir: string,
  result: Awaited<ReturnType<typeof engine.compile>>,
): Promise<void> {
  await ensureOutputDirectory(outDir);

  const jsonPath = join(outDir, `${result.pack.packId}.json`);
  const markdownPath = join(outDir, `${result.pack.packId}.md`);
  if (await pathExists(jsonPath)) {
    throw new CliUserError(`output file already exists: ${jsonPath}`);
  }
  if (await pathExists(markdownPath)) {
    throw new CliUserError(`output file already exists: ${markdownPath}`);
  }

  const markdown = result.markdown.endsWith("\n")
    ? result.markdown
    : `${result.markdown}\n`;
  try {
    await writeFile(jsonPath, `${JSON.stringify(result.pack, null, 2)}\n`, "utf8");
    await writeFile(markdownPath, markdown, "utf8");
  } catch {
    throw new CliUserError("failed to write output files");
  }
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

  const { filePath, outDir } = parseCompileArgs(args.slice(1));
  const intake = await readJsonFile(filePath);
  const result = await engine.compile(intake, compileOptionsFromEnv());
  if (outDir !== undefined) {
    await writeOutputFiles(outDir, result);
  }
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
