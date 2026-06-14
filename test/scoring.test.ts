import { describe, expect, it } from "vitest";

import type { CandidateResource } from "../src/core/providers/index.js";
import type { Intake } from "../src/core/schema/types.js";
import {
  SCORE_THRESHOLD,
  calculateCompositeScore,
  calculateSignalQuality,
  calculateStageRelevance,
  calculateTopicalMatch,
  clampScore,
  passesScoreThreshold,
  rankCandidates,
  scoreCandidate,
} from "../src/core/scoring/index.js";
import {
  DISCOVERY_PROFILE,
  type StageProfile,
} from "../src/core/taxonomy/index.js";

const intake = {
  projectName: "OmniAgent",
  description:
    "An AI product workflow for research planning and automation agents.",
  stage: "discovery",
} satisfies Intake;

function createCandidate(
  id: string,
  overrides: Partial<CandidateResource> = {},
): CandidateResource {
  return {
    id,
    url: `https://example.com/${id}`,
    title: "AI Product Workflow",
    type: "doc",
    tags: ["ai", "product", "workflow"],
    domains: ["product building"],
    sourceProvider: "fixture",
    sourceTier: "primary",
    ...overrides,
  };
}

function createProfile(
  relevanceCues: string[],
  antiCues: string[] = [],
): StageProfile {
  return {
    ...DISCOVERY_PROFILE,
    relevanceCues,
    antiCues,
  };
}

describe("scoring foundation", () => {
  it("returns the four numeric scores clamped to the supported range", () => {
    const result = scoreCandidate(
      createCandidate("shape", {
        title: "User pain and competitor research",
      }),
      intake,
      DISCOVERY_PROFILE,
    );

    expect(Object.keys(result.scores).sort()).toEqual([
      "composite",
      "signalQuality",
      "stageRelevance",
      "topicalMatch",
    ]);
    for (const score of Object.values(result.scores)) {
      expect(typeof score).toBe("number");
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(5)).toBe(1);
  });

  it("calculates the weighted composite formula", () => {
    expect(
      calculateCompositeScore({
        stageRelevance: 0.8,
        topicalMatch: 0.6,
        signalQuality: 0.7,
      }),
    ).toBeCloseTo(0.71, 10);
  });

  it("maps promoted, missing, and unknown source tiers", () => {
    expect(calculateSignalQuality({ sourceTier: "primary" })).toBe(1);
    expect(calculateSignalQuality({ sourceTier: "reference" })).toBe(0.7);
    expect(calculateSignalQuality({ sourceTier: "example" })).toBe(0.4);
    expect(calculateSignalQuality({})).toBe(0.4);
    expect(calculateSignalQuality({ sourceTier: "unknown" })).toBe(0.4);
  });

  it("includes the threshold boundary and excludes scores below it", () => {
    expect(SCORE_THRESHOLD).toBe(0.35);
    expect(passesScoreThreshold({ composite: 0.35 })).toBe(true);
    expect(passesScoreThreshold({ composite: 0.3499 })).toBe(false);
  });

  it("uses title, tags, and domains for topical overlap without body text", () => {
    const titleMatch = calculateTopicalMatch(
      createCandidate("title", {
        title: "OmniAgent",
        tags: [],
        domains: [],
      }),
      intake,
    );
    const tagMatch = calculateTopicalMatch(
      createCandidate("tag", {
        title: "Unrelated",
        tags: ["automation"],
        domains: [],
      }),
      intake,
    );
    const domainMatch = calculateTopicalMatch(
      createCandidate("domain", {
        title: "Unrelated",
        tags: [],
        domains: ["product workflow"],
      }),
      intake,
    );

    expect(titleMatch).toBeGreaterThan(0);
    expect(tagMatch).toBeGreaterThan(0);
    expect(domainMatch).toBeGreaterThan(0);
  });

  it("uses token-level stage cues and applies a clamped anti-cue penalty", () => {
    const profile = createProfile(
      ["user pain", "market size"],
      ["API reference"],
    );
    const positive = calculateStageRelevance(
      createCandidate("positive", {
        title: "User research",
        tags: ["market"],
        domains: [],
      }),
      profile,
    );
    const penalized = calculateStageRelevance(
      createCandidate("penalized", {
        title: "API reference schema",
        tags: [],
        domains: [],
      }),
      profile,
    );

    expect(positive).toBeCloseTo(0.5, 10);
    expect(penalized).toBe(0);
  });

  it("ranks deterministically by score dimensions and original order", () => {
    const profile = createProfile(["alpha", "beta"]);
    const candidates = [
      createCandidate("original-first", {
        title: "Alpha shared",
        tags: ["shared"],
        domains: [],
        sourceTier: "reference",
      }),
      createCandidate("original-second", {
        title: "Alpha shared",
        tags: ["shared"],
        domains: [],
        sourceTier: "reference",
      }),
      createCandidate("higher-signal", {
        title: "Alpha shared",
        tags: ["shared"],
        domains: [],
        sourceTier: "primary",
      }),
      createCandidate("higher-stage", {
        title: "Alpha beta",
        tags: [],
        domains: [],
        sourceTier: "reference",
      }),
    ];
    const first = rankCandidates(candidates, intake, profile);
    const repeated = rankCandidates(candidates, intake, profile);

    expect(repeated).toEqual(first);
    expect(first.map(({ id }) => id)).toEqual([
      "higher-stage",
      "higher-signal",
      "original-first",
      "original-second",
    ]);
  });

  it("does not mutate representative Slice 3 candidates", () => {
    const candidate = createCandidate("immutable", {
      patterns: ["Use for product workflow grounding."],
      estMinutes: 12,
    });
    const before = structuredClone(candidate);
    const result = scoreCandidate(candidate, intake, DISCOVERY_PROFILE);

    expect(candidate).toEqual(before);
    expect(result).not.toBe(candidate);
    expect(result.tags).not.toBe(candidate.tags);
    expect(result.patterns).not.toBe(candidate.patterns);
    expect(result).toMatchObject({
      id: candidate.id,
      url: candidate.url,
      type: candidate.type,
      sourceProvider: candidate.sourceProvider,
      estMinutes: 12,
    });
  });
});
