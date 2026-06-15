import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  CuratedListProvider,
  aggregateCandidates,
  type CandidateResource,
} from "../src/core/providers/index.js";
import type {
  Intake,
  ResourceType,
} from "../src/core/schema/types.js";
import {
  rankAllCandidates,
  rankCandidates,
  type ScoredCandidate,
} from "../src/core/scoring/index.js";
import {
  DEFAULT_EST_MINUTES,
  sequenceCandidates,
} from "../src/core/sequencer/index.js";
import {
  DISCOVERY_PROFILE,
  PRD_PROFILE,
  type StageProfile,
} from "../src/core/taxonomy/index.js";

const corpusPath = fileURLToPath(
  new URL("../sources/product-building.yaml", import.meta.url),
);
const baseIntake = {
  projectName: "Packwright",
  description:
    "An AI product workflow for research planning and automation agents.",
  stage: "discovery",
  timeBudgetMin: 30,
} satisfies Intake;

function createScoredCandidate(
  id: string,
  overrides: {
    type?: ResourceType;
    estMinutes?: number;
    composite?: number;
  } = {},
): ScoredCandidate {
  const candidate: ScoredCandidate = {
    id,
    url: `https://example.com/${id}`,
    title: `Resource ${id}`,
    type: overrides.type ?? "doc",
    tags: ["ai", "product"],
    domains: ["product building"],
    sourceProvider: "fixture",
    sourceTier: "primary",
    scores: {
      stageRelevance: overrides.composite ?? 0.8,
      topicalMatch: overrides.composite ?? 0.8,
      signalQuality: 1,
      composite: overrides.composite ?? 0.8,
    },
  };

  if (overrides.estMinutes !== undefined) {
    candidate.estMinutes = overrides.estMinutes;
  }

  return candidate;
}

function createCandidates(
  count: number,
  overrides: {
    type?: ResourceType;
    estMinutes?: number;
    composite?: number;
  } = {},
): ScoredCandidate[] {
  return Array.from({ length: count }, (_, index) =>
    createScoredCandidate(`candidate-${index + 1}`, overrides),
  );
}

function profileWithMix(
  resourceMix: StageProfile["resourceMix"],
): StageProfile {
  return {
    ...DISCOVERY_PROFILE,
    resourceMix,
  };
}

describe("sequencer foundation", () => {
  it("selects a feasible eligible stack deterministically without mutation", () => {
    const candidates = createCandidates(10, { estMinutes: 4 });
    const before = structuredClone(candidates);
    const first = sequenceCandidates(
      candidates,
      baseIntake,
      DISCOVERY_PROFILE,
    );
    const repeated = sequenceCandidates(
      candidates,
      baseIntake,
      DISCOVERY_PROFILE,
    );

    expect(first).toEqual(repeated);
    expect(first.selected).toHaveLength(8);
    expect(first.totalEstMinutes).toBe(32);
    expect(first.budgetTargetMet).toBe(true);
    expect(first.budgetPressure).toBe(false);
    expect(first.usedBelowThresholdFallback).toBe(false);
    expect(first.confidence).toBe("high");
    expect(first.selected.every(({ eligible }) => eligible)).toBe(true);
    expect(first.path).toHaveLength(first.selected.length);
    expect(new Set(first.path.map(({ resourceId }) => resourceId))).toHaveLength(
      first.selected.length,
    );
    expect(first.path.map(({ position }) => position)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    expect(first.path.map(({ role }) => role)).toEqual([
      "orientation",
      "orientation",
      "deepening",
      "deepening",
      "deepening",
      "comparative",
      "comparative",
      "synthesis",
    ]);
    expect(candidates).toEqual(before);
    expect(first.selected[0]?.candidate).not.toBe(candidates[0]);
  });

  it("uses below-threshold candidates only as explicit low-confidence fallback", () => {
    const candidates = createCandidates(9, {
      estMinutes: 4,
      composite: 0.3,
    });
    const result = sequenceCandidates(
      candidates,
      baseIntake,
      DISCOVERY_PROFILE,
    );

    expect(result.selected).toHaveLength(8);
    expect(result.usedBelowThresholdFallback).toBe(true);
    expect(result.confidence).toBe("low");
    expect(result.selected.every(({ eligible }) => !eligible)).toBe(true);
    expect(
      result.selected.every(({ fallbackSelected }) => fallbackSelected),
    ).toBe(true);
  });

  it("uses shorter viable resources for a duration-aware fallback floor", () => {
    const candidates = [
      ...createCandidates(8, {
        estMinutes: 25,
        composite: 0.3,
      }),
      ...createCandidates(8, {
        estMinutes: 5,
        composite: 0.27,
      }).map((candidate, index) => ({
        ...candidate,
        id: `short-${index + 1}`,
        url: `https://example.com/short-${index + 1}`,
      })),
    ];
    const before = structuredClone(candidates);
    const result = sequenceCandidates(
      candidates,
      baseIntake,
      DISCOVERY_PROFILE,
    );
    const repeated = sequenceCandidates(
      candidates,
      baseIntake,
      DISCOVERY_PROFILE,
    );

    expect(result.totalEstMinutes).toBeLessThan(8 * 25);
    expect(result.totalEstMinutes).toBe(60);
    expect(result.selected.filter(({ estMinutes }) => estMinutes === 5))
      .toHaveLength(7);
    expect(result.confidence).toBe("low");
    expect(result.budgetPressure).toBe(true);
    expect(result).toEqual(repeated);
    expect(candidates).toEqual(before);
  });

  it("adds viable non-doc resources to a fallback stack deterministically", () => {
    const candidates = [
      ...createCandidates(8, {
        type: "doc",
        estMinutes: 10,
        composite: 0.3,
      }),
      createScoredCandidate("fallback-example", {
        type: "example",
        estMinutes: 10,
        composite: 0.27,
      }),
      createScoredCandidate("fallback-visual", {
        type: "visual",
        estMinutes: 10,
        composite: 0.27,
      }),
      createScoredCandidate("too-weak-video", {
        type: "video",
        estMinutes: 5,
        composite: 0.1,
      }),
    ];
    const result = sequenceCandidates(
      candidates,
      baseIntake,
      DISCOVERY_PROFILE,
    );
    const selectedTypes = result.selected.map(
      ({ candidate }) => candidate.type,
    );

    expect(selectedTypes).toContain("example");
    expect(selectedTypes).toContain("visual");
    expect(selectedTypes).not.toContain("video");
    expect(result.confidence).toBe("low");
    expect(
      sequenceCandidates(candidates, baseIntake, DISCOVERY_PROFILE),
    ).toEqual(result);
  });

  it("exhausts eligible candidates before selecting fallback material", () => {
    const candidates = [
      ...createCandidates(3, {
        estMinutes: 4,
        composite: 0.8,
      }),
      ...createCandidates(6, {
        estMinutes: 4,
        composite: 0.3,
      }).map((candidate, index) => ({
        ...candidate,
        id: `fallback-${index + 1}`,
        url: `https://example.com/fallback-${index + 1}`,
      })),
    ];
    const result = sequenceCandidates(
      candidates,
      baseIntake,
      DISCOVERY_PROFILE,
    );

    expect(result.selected).toHaveLength(8);
    expect(result.selected.slice(0, 3).every(({ eligible }) => eligible))
      .toBe(true);
    expect(result.selected.slice(3).every(({ eligible }) => !eligible))
      .toBe(true);
    expect(result.usedBelowThresholdFallback).toBe(true);
    expect(result.confidence).toBe("low");
  });

  it("uses candidate estimates, falls back to 15 minutes, and reports pressure", () => {
    const feasible = createCandidates(8, { estMinutes: 4 });
    delete feasible[0]?.estMinutes;
    const feasibleBudget = {
      ...baseIntake,
      timeBudgetMin: 60,
    } satisfies Intake;
    const feasibleResult = sequenceCandidates(
      feasible,
      feasibleBudget,
      DISCOVERY_PROFILE,
    );
    const pressured = sequenceCandidates(
      createCandidates(8),
      baseIntake,
      DISCOVERY_PROFILE,
    );

    expect(feasibleResult.selected[0]?.estMinutes).toBe(
      DEFAULT_EST_MINUTES,
    );
    expect(feasibleResult.totalEstMinutes).toBe(43);
    expect(feasibleResult.budgetTargetMet).toBe(false);
    expect(feasibleResult.budgetPressure).toBe(true);
    expect(pressured.totalEstMinutes).toBe(120);
    expect(pressured.budgetTargetMet).toBe(false);
    expect(pressured.budgetPressure).toBe(true);
    expect(pressured.confidence).toBe("medium");
  });

  it("meets the budget range when the available estimates make it feasible", () => {
    const candidates = createCandidates(12, { estMinutes: 5 });
    const result = sequenceCandidates(
      candidates,
      {
        ...baseIntake,
        timeBudgetMin: 60,
      },
      DISCOVERY_PROFILE,
    );

    expect(result.selected).toHaveLength(10);
    expect(result.totalEstMinutes).toBe(50);
    expect(result.budgetTargetMet).toBe(true);
    expect(result.budgetPressure).toBe(false);
  });

  it("prioritizes the five-item floor for a pressured 15-minute budget", () => {
    const result = sequenceCandidates(
      createCandidates(8, { estMinutes: 8 }),
      {
        ...baseIntake,
        timeBudgetMin: 15,
      },
      DISCOVERY_PROFILE,
    );

    expect(result.selected).toHaveLength(5);
    expect(result.totalEstMinutes).toBe(40);
    expect(result.budgetPressure).toBe(true);
    expect(result.confidence).toBe("low");
  });

  it("returns a smaller low-confidence stack for sparse domains", () => {
    const result = sequenceCandidates(
      createCandidates(3, { estMinutes: 5 }),
      baseIntake,
      DISCOVERY_PROFILE,
    );

    expect(result.selected).toHaveLength(3);
    expect(result.confidence).toBe("low");
    expect(result.path.map(({ role }) => role)).toEqual([
      "orientation",
      "deepening",
      "comparative",
    ]);
  });

  it("treats unavailable resource-mix types as soft targets", () => {
    const result = sequenceCandidates(
      createCandidates(9, {
        type: "doc",
        estMinutes: 4,
      }),
      baseIntake,
      profileWithMix({
        doc: 0,
        video: 0.5,
        visual: 0.25,
        example: 0.25,
      }),
    );

    expect(result.selected).toHaveLength(8);
    expect(result.selected.every(({ candidate }) => candidate.type === "doc"))
      .toBe(true);
  });

  it("applies source preference softly without displacing a clearly stronger score", () => {
    const candidates = [
      createScoredCandidate("strong-doc", {
        type: "doc",
        estMinutes: 4,
        composite: 0.9,
      }),
      ...createCandidates(7, {
        type: "doc",
        estMinutes: 4,
        composite: 0.8,
      }),
      createScoredCandidate("preferred-video", {
        type: "video",
        estMinutes: 4,
        composite: 0.8,
      }),
    ];
    const result = sequenceCandidates(
      candidates,
      {
        ...baseIntake,
        sourcePreference: {
          doc: 1,
          video: 2,
          visual: 1,
          example: 1,
        },
      },
      profileWithMix({
        doc: 1,
        video: 0,
        visual: 0,
        example: 0,
      }),
    );
    const selectedIds = result.selected.map(({ candidate }) => candidate.id);

    expect(selectedIds).toContain("strong-doc");
    expect(selectedIds).toContain("preferred-video");
    expect(selectedIds).toHaveLength(8);
  });

  it("selects a production-corpus fallback stack from the exposed ranked pool", async () => {
    const representativeIntake = {
      projectName: "Packwright Sample",
      description:
        "An AI product workflow for research, planning, automation, agents, context, evaluation, software, documentation, release, governance, learning, and design.",
      stage: "discovery",
      depth: "medium",
      timeBudgetMin: 30,
    } satisfies Intake;
    const providerCandidates: CandidateResource[] =
      await aggregateCandidates(
        [
          new CuratedListProvider(
            [corpusPath],
            "product-building-curated",
          ),
        ],
        representativeIntake,
        60,
      );
    const eligible = rankCandidates(
      providerCandidates,
      representativeIntake,
      DISCOVERY_PROFILE,
    );
    const ranked = rankAllCandidates(
      providerCandidates,
      representativeIntake,
      DISCOVERY_PROFILE,
    );
    const result = sequenceCandidates(
      ranked,
      representativeIntake,
      DISCOVERY_PROFILE,
    );
    const repeated = sequenceCandidates(
      ranked,
      representativeIntake,
      DISCOVERY_PROFILE,
    );

    expect(ranked.length).toBeGreaterThan(0);
    expect(eligible).toEqual([]);
    expect(result.selected.length).toBeGreaterThan(0);
    expect(result.usedBelowThresholdFallback).toBe(true);
    expect(result.confidence).toBe("low");
    expect(result.totalEstMinutes).toBeLessThan(170);
    expect(
      new Set(result.selected.map(({ candidate }) => candidate.type)).size,
    ).toBeGreaterThan(1);
    expect(result).toEqual(repeated);
  });

  it("improves production PRD fallback duration without changing eligibility", async () => {
    const representativeIntake = {
      projectName: "Packwright Product Specification",
      description:
        "An AI product workflow requiring user stories, acceptance criteria, UX flow, scope, success metrics, software documentation, and release planning.",
      stage: "prd",
      depth: "medium",
      timeBudgetMin: 60,
    } satisfies Intake;
    const providerCandidates = await aggregateCandidates(
      [
        new CuratedListProvider(
          [corpusPath],
          "product-building-curated",
        ),
      ],
      representativeIntake,
      60,
    );
    const eligible = rankCandidates(
      providerCandidates,
      representativeIntake,
      PRD_PROFILE,
    );
    const ranked = rankAllCandidates(
      providerCandidates,
      representativeIntake,
      PRD_PROFILE,
    );
    const result = sequenceCandidates(
      ranked,
      representativeIntake,
      PRD_PROFILE,
    );

    expect(eligible).toEqual([]);
    expect(result.selected).toHaveLength(8);
    expect(result.totalEstMinutes).toBeLessThan(173);
    expect(result.usedBelowThresholdFallback).toBe(true);
    expect(result.confidence).toBe("low");
    expect(result.budgetPressure).toBe(true);
  });

  it("improves the production tiny-budget fallback while preserving its floor", async () => {
    const representativeIntake = {
      projectName: "Packwright Tiny Discovery",
      description:
        "An AI product workflow for research, planning, automation, agents, context, evaluation, software, documentation, release, governance, learning, and design.",
      stage: "discovery",
      depth: "medium",
      timeBudgetMin: 15,
    } satisfies Intake;
    const providerCandidates = await aggregateCandidates(
      [
        new CuratedListProvider(
          [corpusPath],
          "product-building-curated",
        ),
      ],
      representativeIntake,
      60,
    );
    const ranked = rankAllCandidates(
      providerCandidates,
      representativeIntake,
      DISCOVERY_PROFILE,
    );
    const result = sequenceCandidates(
      ranked,
      representativeIntake,
      DISCOVERY_PROFILE,
    );

    expect(result.selected).toHaveLength(5);
    expect(result.totalEstMinutes).toBeLessThan(100);
    expect(result.usedBelowThresholdFallback).toBe(true);
    expect(result.confidence).toBe("low");
    expect(result.budgetPressure).toBe(true);
  });
});
