import { describe, expect, it } from "vitest";

import { engine } from "../src/core/index.js";
import { validatePack } from "../src/core/schema/index.js";
import { omniAgentIntake } from "./fixtures/omniagent-intake.js";

const FIXED_CREATED_AT = "2026-06-16T12:00:00.000Z";

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
