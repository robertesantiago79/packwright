import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  CuratedListProvider,
  aggregateCandidates,
  canonicalizeUrl,
  loadCuratedSourceFile,
} from "../src/core/providers/index.js";
import type { Intake } from "../src/core/schema/types.js";

const corpusPath = fileURLToPath(
  new URL("../sources/product-building.yaml", import.meta.url),
);
const keyMatchingTokens = new Set([
  "ai",
  "product",
  "workflow",
  "research",
  "planning",
  "automation",
  "agents",
  "context",
  "evaluation",
  "software",
  "documentation",
  "release",
  "governance",
  "learning",
  "design",
]);
const corpusAcceptanceIntake = {
  projectName: "OmniAgent",
  description:
    "An AI product workflow for research, planning, automation, agents, context, evaluation, software, documentation, release, governance, learning, and design.",
  stage: "discovery",
  depth: "medium",
  timeBudgetMin: 30,
} satisfies Intake;

function tokenize(values: readonly string[]): Set<string> {
  return new Set(
    values.flatMap(
      (value) => value.toLowerCase().match(/[a-z0-9]+/g) ?? [],
    ),
  );
}

describe("production curated corpus", () => {
  it("returns 40 to 60 deduplicated candidates for the OmniAgent corpus intake", async () => {
    const entries = await loadCuratedSourceFile(corpusPath);
    const provider = new CuratedListProvider(
      [corpusPath],
      "product-building-curated",
    );
    const candidates = await aggregateCandidates(
      [provider],
      corpusAcceptanceIntake,
      60,
    );
    const repeated = await aggregateCandidates(
      [provider],
      corpusAcceptanceIntake,
      60,
    );
    const ids = candidates.map(({ id }) => id);
    const urls = candidates.map(({ url }) => canonicalizeUrl(url));

    expect(entries).toHaveLength(72);
    expect(candidates.length).toBeGreaterThanOrEqual(40);
    expect(candidates.length).toBeLessThanOrEqual(60);
    expect(candidates).toHaveLength(60);
    expect(new Set(ids)).toHaveLength(candidates.length);
    expect(new Set(urls)).toHaveLength(candidates.length);
    expect(repeated).toEqual(candidates);

    for (const candidate of candidates) {
      expect(candidate.id.length).toBeGreaterThan(0);
      expect(candidate.url.length).toBeGreaterThan(0);
      expect(candidate.title.length).toBeGreaterThan(0);
      expect(candidate.type.length).toBeGreaterThan(0);
      expect(Array.isArray(candidate.tags)).toBe(true);
      expect(Array.isArray(candidate.domains)).toBe(true);
      expect(candidate.sourceProvider).toBe("product-building-curated");

      const candidateTokens = tokenize([
        ...candidate.tags,
        ...candidate.domains,
      ]);
      expect(
        [...keyMatchingTokens].some((token) => candidateTokens.has(token)),
      ).toBe(true);
    }
  });
});
