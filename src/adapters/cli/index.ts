import { engine } from "../../core/index.js";

const HELP = `Packwright CLI

Usage:
  packwright [command] [options]

Commands:
  compile    Compile an intake into a context pack (stub in Slice 0)

Options:
  -h, --help  Show this help
`;

async function main(args: string[]): Promise<void> {
  const command = args[0];

  if (command === undefined || args.includes("--help") || args.includes("-h")) {
    process.stdout.write(HELP);
    return;
  }

  if (command === "compile") {
    const result = await engine.compile({});
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  process.stderr.write(`Unknown command: ${command}\n\n${HELP}`);
  process.exitCode = 1;
}

await main(process.argv.slice(2));
