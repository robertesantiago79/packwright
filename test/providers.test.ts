import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  MAX_CANDIDATES,
  CuratedListProvider,
  CuratedSourceValidationError,
  aggregateCandidates,
  canonicalizeUrl,
  createUrlIdentity,
  loadCuratedSourceFile,
  type CandidateResource,
  type ResourceProvider,
} from "../src/core/providers/index.js";
import type { Intake, ResourceType } from "../src/core/schema/types.js";
import { omniAgentIntake } from "./fixtures/omniagent-intake.js";

const sourcePath = fileURLToPath(
  new URL("./fixtures/provider-sources.yaml", import.meta.url),
);
const invalidSourcePath = fileURLToPath(
  new URL("./fixtures/provider-invalid.yaml", import.meta.url),
);

function createCandidate(
  index: number,
  overrides: Partial<CandidateResource> = {},
): CandidateResource {
  return {
    id: `candidate-${index}`,
    url: `https://example.com/candidate-${index}`,
    title: `Candidate ${index}`,
    type: "doc",
    tags: ["product"],
    domains: ["product"],
    sourceProvider: "fixture-provider",
    ...overrides,
  };
}

class FixtureProvider implements ResourceProvider {
  readonly name: string;
  readonly #candidates: CandidateResource[];

  constructor(name: string, candidates: CandidateResource[]) {
    this.name = name;
    this.#candidates = candidates;
  }

  fetchCandidates(
    _intake: Intake,
    cap: number,
  ): Promise<CandidateResource[]> {
    return Promise.resolve(this.#candidates.slice(0, cap));
  }
}

describe("curated source loading", () => {
  it("loads valid controlled YAML and normalizes matching metadata", async () => {
    const entries = await loadCuratedSourceFile(sourcePath);

    expect(entries).toHaveLength(5);
    expect(entries[0]).toEqual({
      url: "HTTPS://Example.COM/product-workflow/?b=2&a=1#overview",
      title: "AI Product Workflow Guide",
      type: "doc",
      tags: ["ai", "product", "workflow"],
      domains: ["product building"],
      sourceTier: "primary",
      patterns: ["Ground recommendations in explicit evidence."],
      estMinutes: 8,
    });
  });

  it("rejects a source entry missing a required field", async () => {
    await expect(loadCuratedSourceFile(invalidSourcePath)).rejects.toThrow(
      new CuratedSourceValidationError(
        "entries[0].domains must be an array of non-empty strings",
      ),
    );
  });
});

describe("URL identity", () => {
  it("canonicalizes URLs and creates stable SHA-256 identifiers", () => {
    const rawUrl = "HTTPS://Example.COM/path/?b=2&a=1#fragment";
    const canonicalUrl = "https://example.com/path?a=1&b=2";
    const first = createUrlIdentity(rawUrl);
    const second = createUrlIdentity(canonicalUrl);

    expect(canonicalizeUrl(rawUrl)).toBe(canonicalUrl);
    expect(first).toEqual(second);
    expect(first.id).toMatch(/^url-sha256:[0-9a-f]{16}$/);
    expect(first.fullHash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("CuratedListProvider", () => {
  it("matches tags and domains, orders deterministically, and sets metadata", async () => {
    const provider = new CuratedListProvider([sourcePath], "fixture-curated");
    const candidates = await provider.fetchCandidates(omniAgentIntake, 10);
    const repeated = await provider.fetchCandidates(omniAgentIntake, 10);

    expect(provider.name).toBe("fixture-curated");
    expect(repeated).toEqual(candidates);
    expect(candidates.map((candidate) => candidate.title)).toEqual([
      "AI Product Workflow Guide",
      "Duplicate Workflow Entry",
      "Product Research Reference",
      "Automation Design Examples",
    ]);
    expect(candidates[0]).toMatchObject({
      url: "https://example.com/product-workflow?a=1&b=2",
      sourceProvider: "fixture-curated",
      sourceTier: "primary",
      patterns: ["Ground recommendations in explicit evidence."],
      estMinutes: 8,
    });
  });

  it("lets aggregation keep the earliest duplicate in file order", async () => {
    const provider = new CuratedListProvider([sourcePath], "fixture-curated");
    const candidates = await aggregateCandidates(
      [provider],
      omniAgentIntake,
      60,
    );

    expect(candidates.map((candidate) => candidate.title)).toEqual([
      "AI Product Workflow Guide",
      "Product Research Reference",
      "Automation Design Examples",
    ]);
  });

  it("honors provider cap and returns an empty list for non-positive caps", async () => {
    const provider = new CuratedListProvider([sourcePath]);

    await expect(provider.fetchCandidates(omniAgentIntake, 2)).resolves.toHaveLength(
      2,
    );
    await expect(provider.fetchCandidates(omniAgentIntake, 0)).resolves.toEqual(
      [],
    );
    await expect(provider.fetchCandidates(omniAgentIntake, -1)).resolves.toEqual(
      [],
    );
  });
});

describe("candidate aggregation", () => {
  it("deduplicates canonical URLs and keeps the earliest provider candidate", async () => {
    const earliest = createCandidate(1, {
      url: "https://EXAMPLE.com/shared/?b=2&a=1#first",
      title: "Earliest Candidate",
      sourceProvider: "first",
    });
    const duplicate = createCandidate(2, {
      url: "https://example.com/shared?a=1&b=2",
      title: "Later Candidate",
      sourceProvider: "second",
    });

    const result = await aggregateCandidates(
      [
        new FixtureProvider("first", [earliest]),
        new FixtureProvider("second", [duplicate]),
      ],
      omniAgentIntake,
      60,
    );

    expect(result).toEqual([earliest]);
  });

  it("enforces requested cap and the global maximum of 60", async () => {
    const candidates = Array.from({ length: 75 }, (_, index) =>
      createCandidate(index),
    );
    const provider = new FixtureProvider("bulk", candidates);

    await expect(
      aggregateCandidates([provider], omniAgentIntake, 4),
    ).resolves.toHaveLength(4);
    await expect(
      aggregateCandidates([provider], omniAgentIntake, 100),
    ).resolves.toHaveLength(MAX_CANDIDATES);
  });

  it("returns an empty list for non-positive aggregate caps", async () => {
    const provider = new FixtureProvider("fixture", [createCandidate(1)]);

    await expect(
      aggregateCandidates([provider], omniAgentIntake, 0),
    ).resolves.toEqual([]);
    await expect(
      aggregateCandidates([provider], omniAgentIntake, -10),
    ).resolves.toEqual([]);
  });

  it("keeps candidate resource types compatible with the schema union", () => {
    const resourceType: ResourceType = createCandidate(1).type;

    expect(resourceType).toBe("doc");
  });
});
