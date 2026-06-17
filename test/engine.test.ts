import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { engine } from "../src/core/index.js";
import { validatePack } from "../src/core/schema/index.js";
import { omniAgentIntake } from "./fixtures/omniagent-intake.js";

const FIXED_CREATED_AT = "2026-06-16T12:00:00.000Z";
const TSX_BIN = join(process.cwd(), "node_modules", ".bin", "tsx");

interface CliResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  Object.freeze(value);
  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }

  return value;
}

function listPackOutputs(): string[] {
  if (!existsSync("packs")) {
    return [];
  }

  return readdirSync("packs", { recursive: true }).map(String).sort();
}

function runCli(args: readonly string[]): Promise<CliResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      TSX_BIN,
      ["src/adapters/cli/index.ts", ...args],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          PACKWRIGHT_FIXED_CREATED_AT: FIXED_CREATED_AT,
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

function expectNoStackTrace(stderr: string): void {
  expect(stderr).not.toContain(" at ");
}

describe("engine compile pipeline", () => {
  it("compiles representative intake into a schema-valid pack and Markdown", async () => {
    const result = await engine.compile(omniAgentIntake, {
      createdAt: FIXED_CREATED_AT,
    });

    expect(validatePack(result.pack)).toEqual({
      valid: true,
      errors: [],
    });
    expect(result.pack.createdAt).toBe(FIXED_CREATED_AT);
    expect(result.pack.resources.length).toBeGreaterThan(0);
    expect(result.pack.path).toHaveLength(result.pack.resources.length);
    expect(["high", "medium", "low"]).toContain(result.pack.confidence);
    expect(result.markdown).toContain("# OmniAgent");
    expect(result.markdown).toContain("## Learning Path");
    expect(result.markdown).toContain("## AI Context Block");
  });

  it("is deterministic with a fixed createdAt", async () => {
    const first = await engine.compile(omniAgentIntake, {
      createdAt: FIXED_CREATED_AT,
    });
    const second = await engine.compile(omniAgentIntake, {
      createdAt: FIXED_CREATED_AT,
    });

    expect(second.pack).toEqual(first.pack);
    expect(second.markdown).toBe(first.markdown);
    expect(second.pack.packId).toBe(first.pack.packId);
  });

  it("does not mutate the caller intake", async () => {
    const intake = deepFreeze(clone(omniAgentIntake));
    const before = clone(intake);

    await engine.compile(intake, { createdAt: FIXED_CREATED_AT });

    expect(intake).toEqual(before);
  });

  it("preserves low-confidence fallback caveats in compiled output", async () => {
    const { pack, markdown } = await engine.compile(omniAgentIntake, {
      createdAt: FIXED_CREATED_AT,
    });
    const packText = [
      pack.projectSummary,
      ...pack.confidenceNotes,
      ...pack.artifactGuidance,
      pack.aiContextBlock,
      markdown,
    ].join("\n");

    if (pack.confidence === "low") {
      expect(packText).toMatch(/fallback|below-threshold/i);
      expect(packText).toMatch(/budget|actual sequencer estimate|minutes/i);
    }
  });

  it("rejects invalid intake through the existing normalizer", async () => {
    await expect(
      engine.compile({
        projectName: "Invalid",
        stage: "discovery",
      }),
    ).rejects.toThrow("description must be a string");
  });
});

describe("CLI compile integration", () => {
  it("compiles the SPEC fixture to a JSON envelope on stdout", async () => {
    const packOutputsBefore = listPackOutputs();
    const result = await runCli([
      "compile",
      "--file",
      "fixtures/omniagent-intake.json",
    ]);

    expect(result.code).toBe(0);
    expect(result.stderr).toBe("");
    const envelope = JSON.parse(result.stdout) as {
      pack?: unknown;
      markdown?: unknown;
    };

    expect(envelope.pack).toBeDefined();
    expect(typeof envelope.markdown).toBe("string");
    expect(validatePack(envelope.pack)).toEqual({
      valid: true,
      errors: [],
    });
    expect(envelope.markdown).toContain("## Learning Path");
    expect(envelope.markdown).toContain("## AI Context Block");
    expect(listPackOutputs()).toEqual(packOutputsBefore);
  });

  it("reports missing --file without a stack trace", async () => {
    const result = await runCli(["compile"]);

    expect(result.code).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("missing required --file <path>");
    expectNoStackTrace(result.stderr);
  });

  it("reports unreadable input files without a stack trace", async () => {
    const result = await runCli([
      "compile",
      "--file",
      "fixtures/missing-intake.json",
    ]);

    expect(result.code).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("failed to read input file");
    expectNoStackTrace(result.stderr);
  });

  it("reports invalid JSON without a stack trace", async () => {
    const dir = await mkdtemp(join(tmpdir(), "packwright-cli-"));
    try {
      const filePath = join(dir, "invalid.json");
      await writeFile(filePath, "{ invalid json", "utf8");
      const result = await runCli(["compile", "--file", filePath]);

      expect(result.code).not.toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("invalid JSON in input file");
      expectNoStackTrace(result.stderr);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("reports invalid intake without a stack trace", async () => {
    const dir = await mkdtemp(join(tmpdir(), "packwright-cli-"));
    try {
      const filePath = join(dir, "invalid-intake.json");
      await writeFile(
        filePath,
        JSON.stringify({ projectName: "Invalid", stage: "discovery" }),
        "utf8",
      );
      const result = await runCli(["compile", "--file", filePath]);

      expect(result.code).not.toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("description must be a string");
      expectNoStackTrace(result.stderr);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("reports unknown commands without a stack trace", async () => {
    const result = await runCli(["unknown"]);

    expect(result.code).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("unknown command: unknown");
    expectNoStackTrace(result.stderr);
  });

  it("prints help for --help", async () => {
    const result = await runCli(["--help"]);

    expect(result.code).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("packwright compile --file <path>");
  });
});
