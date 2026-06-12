import { describe, expect, it } from "vitest";

import {
  GENERIC_TERMS,
  STOPWORDS,
  normalizeIntake,
} from "../src/core/intake/index.js";
import {
  domainDescriptionIntake,
  emptyProjectNameIntake,
  genericDescriptionIntake,
  invalidSourceWeightIntake,
  longDescriptionIntake,
  longProjectNameIntake,
  malformedStageIntake,
  shortDescriptionIntake,
  tooManySentencesIntake,
  validIntake,
} from "./fixtures/intakes.js";

describe("normalizeIntake", () => {
  it("applies all intake defaults without mutating the fixture", () => {
    const fixtureBefore = structuredClone(validIntake);
    const result = normalizeIntake(validIntake);

    expect(result.intake).toEqual({
      ...validIntake,
      depth: "medium",
      timeBudgetMin: 30,
      sourcePreference: {
        doc: 1,
        video: 1,
        visual: 1,
        example: 1,
      },
    });
    expect(validIntake).toEqual(fixtureBefore);
  });

  it("rejects a sub-minimum description instead of flagging it", () => {
    expect(() => normalizeIntake(shortDescriptionIntake)).toThrow(
      "description must be at least 20 characters; received 13",
    );
  });

  it("rejects an empty project name", () => {
    expect(() => normalizeIntake(emptyProjectNameIntake)).toThrow(
      "projectName must be at least 1 character; received 0",
    );
  });

  it("rejects a project name over the maximum length", () => {
    expect(() => normalizeIntake(longProjectNameIntake)).toThrow(
      "projectName must be at most 80 characters; received 81",
    );
  });

  it("rejects a description over the maximum length", () => {
    expect(() => normalizeIntake(longDescriptionIntake)).toThrow(
      "description must be at most 600 characters; received 601",
    );
  });

  it("rejects descriptions exceeding the sentence-count heuristic", () => {
    expect(() => normalizeIntake(tooManySentencesIntake)).toThrow(
      "description must contain 1 to 3 sentences; received 4",
    );
  });

  it("rejects an unsupported stage", () => {
    expect(() => normalizeIntake(malformedStageIntake)).toThrow(
      "stage must be one of: discovery, prd",
    );
  });

  it("rejects a source preference outside the weight contract", () => {
    expect(() => normalizeIntake(invalidSourceWeightIntake)).toThrow(
      "sourcePreference.doc must be between 0 and 2; received 2.5",
    );
  });

  it("flags a valid-length description containing only generic vocabulary", () => {
    const result = normalizeIntake(genericDescriptionIntake);

    expect(result.domainNounCount).toBe(0);
    expect(result.lowConfidenceCandidate).toBe(true);
  });

  it("does not flag a description containing domain-specific vocabulary", () => {
    const result = normalizeIntake(domainDescriptionIntake);

    expect(result.domainNounCount).toBeGreaterThan(0);
    expect(result.lowConfidenceCandidate).toBe(false);
  });

  it("exports the heuristic vocabularies for tuning", () => {
    expect(STOPWORDS).toContain("that");
    expect(GENERIC_TERMS).toContain("platform");
  });
});
