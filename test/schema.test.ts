import { describe, expect, it } from "vitest";

import { assembleContextPack } from "../src/core/packgen/index.js";
import { renderPack } from "../src/core/packgen/render.js";
import { validatePack } from "../src/core/schema/validate.js";
import type {
  Intake,
  PathRole,
  ResourceType,
} from "../src/core/schema/types.js";
import type { ScoredCandidate } from "../src/core/scoring/index.js";
import type {
  SequencedCandidate,
  SequencerResult,
} from "../src/core/sequencer/index.js";
import {
  highConfidenceSparsePack,
  missingRequiredFieldPack,
  pathResourceMismatchPack,
  timeBudgetViolationPack,
  validPack,
  zeroEstimatePack,
} from "./fixtures/packs.js";

const createdAt = "2026-06-15T12:00:00.000Z";
const assemblerIntake = {
  projectName: "Packwright",
  description:
    "An AI product workflow that helps teams research, plan, and automate product-building work.",
  stage: "discovery",
  depth: "medium",
  timeBudgetMin: 30,
  sourcePreference: {
    doc: 1,
    video: 1,
    visual: 1,
    example: 1,
  },
} satisfies Intake;

function createCandidate(
  index: number,
  overrides: {
    type?: ResourceType;
    composite?: number;
    patterns?: string[];
    sourceTier?: ScoredCandidate["sourceTier"];
  } = {},
): ScoredCandidate {
  const composite = overrides.composite ?? 0.8;

  return {
    id: `resource-${index}`,
    url: `https://example.com/resource-${index}`,
    title: `Resource ${index}`,
    type: overrides.type ?? "doc",
    tags: ["ai", "product", "workflow"],
    domains: ["product building"],
    sourceProvider: "fixture",
    sourceTier: overrides.sourceTier ?? "primary",
    ...(overrides.patterns === undefined
      ? {}
      : { patterns: [...overrides.patterns] }),
    scores: {
      stageRelevance: composite,
      topicalMatch: composite,
      signalQuality: overrides.sourceTier === "example" ? 0.4 : 1,
      composite,
    },
  };
}

function createSequencerResult(
  options: {
    count: number;
    estMinutes: number;
    confidence: SequencerResult["confidence"];
    fallback?: boolean;
    budgetPressure?: boolean;
    patterns?: Array<string[] | undefined>;
  },
): SequencerResult {
  const roles: PathRole[] = [
    "orientation",
    "orientation",
    "deepening",
    "deepening",
    "deepening",
    "comparative",
    "comparative",
    "synthesis",
  ];
  const selected: SequencedCandidate[] = Array.from(
    { length: options.count },
    (_, index) => {
      const fallback = options.fallback ?? false;
      return {
        candidate: createCandidate(index + 1, {
          composite: fallback ? 0.3 : 0.8,
          patterns: options.patterns?.[index],
          sourceTier: fallback ? "example" : "primary",
          type: index % 4 === 1 ? "example" : "doc",
        }),
        position: index + 1,
        role: roles[index] ?? "synthesis",
        estMinutes: options.estMinutes,
        eligible: !fallback,
        fallbackSelected: fallback,
      };
    },
  );

  return {
    selected,
    path: selected.map(({ candidate, position, role }) => ({
      resourceId: candidate.id,
      position,
      role,
    })),
    totalEstMinutes: options.count * options.estMinutes,
    budgetTargetMet: !(options.budgetPressure ?? false),
    budgetPressure: options.budgetPressure ?? false,
    usedBelowThresholdFallback: options.fallback ?? false,
    confidence: options.confidence,
    confidenceNotes: options.fallback
      ? ["Below-threshold ranked candidates were used as explicit fallback material."]
      : [],
  };
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  Object.freeze(value);
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }

  return value;
}

describe("validatePack", () => {
  it("accepts the valid pack fixture", () => {
    expect(validatePack(validPack)).toEqual({
      valid: true,
      errors: [],
    });
  });

  it("rejects a pack missing a required field", () => {
    const result = validatePack(missingRequiredFieldPack);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "/ must have required property 'projectSummary'",
    );
  });

  it("rejects a path item referencing a nonexistent resource", () => {
    const result = validatePack(pathResourceMismatchPack);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "path[4].resourceId references nonexistent resourceId 'resource-does-not-exist'",
    );
    expect(result.errors).toContain(
      "resourceId 'resource-5' must appear exactly once in path; found 0",
    );
  });

  it("rejects a pack outside the intake time budget tolerance", () => {
    const result = validatePack(timeBudgetViolationPack);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "stats.totalEstMinutes must be within 20% of intake time budget (12-18); received 30",
    );
  });

  it("rejects a high-confidence pack with fewer than eight resources", () => {
    const result = validatePack(highConfidenceSparsePack);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("/resources must NOT have fewer than 8 items");
  });

  it("rejects a resource with a zero-minute estimate", () => {
    const result = validatePack(zeroEstimatePack);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "/resources/0/estMinutes must be >= 1",
    );
  });
});

describe("assembleContextPack", () => {
  it("builds a schema-valid high-confidence pack and renders Markdown", () => {
    const result = createSequencerResult({
      count: 8,
      estMinutes: 4,
      confidence: "high",
    });
    const pack = assembleContextPack({
      intake: assemblerIntake,
      sequencerResult: result,
      candidatesConsidered: 12,
      createdAt,
    });

    expect(validatePack(pack)).toEqual({ valid: true, errors: [] });
    expect(pack.confidence).toBe("high");
    expect(pack.confidenceNotes).toEqual([]);
    expect(pack.projectSummary).not.toContain("below-threshold");
    expect(pack.resources).toHaveLength(8);
    expect(pack.stats.totalEstMinutes).toBe(32);
    expect(pack.path.map(({ position }) => position)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);

    const markdown = renderPack(pack);
    expect(markdown).toContain("# Packwright");
    expect(markdown).toContain("## Learning Path");
    expect(markdown).toContain("## AI Context Block");
  });

  it("preserves fallback and over-budget caveats while remaining schema-valid", () => {
    const result = createSequencerResult({
      count: 5,
      estMinutes: 20,
      confidence: "low",
      fallback: true,
      budgetPressure: true,
    });
    const pack = assembleContextPack({
      intake: assemblerIntake,
      sequencerResult: result,
      candidatesConsidered: 20,
      createdAt,
    });

    expect(validatePack(pack)).toEqual({ valid: true, errors: [] });
    expect(pack.confidence).toBe("low");
    expect(pack.stats.totalEstMinutes).toBe(30);
    expect(pack.resources.map(({ estMinutes }) => estMinutes)).toEqual([
      6, 6, 6, 6, 6,
    ]);
    expect(pack.projectSummary).toContain("below-threshold fallback");
    expect(pack.projectSummary).toContain("100 minutes");
    expect(pack.confidenceNotes.join(" ")).toContain("100 actual minutes");
    expect(pack.aiContextBlock).toContain("100 minutes");
    expect(pack.aiContextBlock).toContain(
      "must not be treated as high-confidence",
    );
    expect(pack.resources[0]?.rationale).toContain(
      "sequencer estimate was 20 minutes",
    );
    expect(pack.resources[0]?.rationale).toContain(
      "included only as fallback",
    );
  });

  it("is deterministic with a fixed createdAt and stable packId", () => {
    const result = createSequencerResult({
      count: 8,
      estMinutes: 4,
      confidence: "high",
    });
    const first = assembleContextPack({
      intake: assemblerIntake,
      sequencerResult: result,
      candidatesConsidered: 12,
      createdAt,
    });
    const second = assembleContextPack({
      intake: assemblerIntake,
      sequencerResult: result,
      candidatesConsidered: 12,
      createdAt,
    });

    expect(first).toEqual(second);
    expect(first.packId).toBe(second.packId);
    expect(first.createdAt).toBe(createdAt);
  });

  it("deduplicates selected candidate patterns in path order", () => {
    const result = createSequencerResult({
      count: 5,
      estMinutes: 6,
      confidence: "low",
      patterns: [
        ["Start with user pain.", "Compare alternatives."],
        ["Compare alternatives.", "Name assumptions."],
        undefined,
        ["Name assumptions."],
        [],
      ],
    });
    const pack = assembleContextPack({
      intake: assemblerIntake,
      sequencerResult: result,
      candidatesConsidered: 5,
      createdAt,
    });

    expect(pack.extractedPatterns).toEqual([
      "Start with user pain.",
      "Compare alternatives.",
      "Name assumptions.",
    ]);
  });

  it("does not mutate intake or sequencer inputs", () => {
    const result = createSequencerResult({
      count: 5,
      estMinutes: 20,
      confidence: "low",
      fallback: true,
      budgetPressure: true,
    });
    const frozenIntake = deepFreeze(structuredClone(assemblerIntake));
    const frozenResult = deepFreeze(structuredClone(result));
    const beforeIntake = structuredClone(frozenIntake);
    const beforeResult = structuredClone(frozenResult);

    assembleContextPack({
      intake: frozenIntake,
      sequencerResult: frozenResult,
      candidatesConsidered: 20,
      createdAt,
    });

    expect(frozenIntake).toEqual(beforeIntake);
    expect(frozenResult).toEqual(beforeResult);
  });
});

describe("renderPack", () => {
  it("renders a readable Markdown pack with an ordered path", () => {
    const markdown = renderPack(validPack);

    expect(markdown).toContain("# Atlas Discovery Pack");
    expect(markdown).toContain("## Learning Path");
    expect(markdown).toContain(
      "### 1. Orientation: Problem Discovery Fundamentals",
    );
    expect(markdown).toContain("### 5. Synthesis: Discovery Brief Example");
    expect(markdown.indexOf("### 1. Orientation")).toBeLessThan(
      markdown.indexOf("### 5. Synthesis"),
    );
    expect(markdown).toContain("## AI Context Block");
    expect(markdown).toContain(validPack.aiContextBlock);
  });
});
