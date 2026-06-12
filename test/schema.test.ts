import { describe, expect, it } from "vitest";

import { renderPack } from "../src/core/packgen/render.js";
import { validatePack } from "../src/core/schema/validate.js";
import {
  highConfidenceSparsePack,
  missingRequiredFieldPack,
  pathResourceMismatchPack,
  timeBudgetViolationPack,
  validPack,
  zeroEstimatePack,
} from "./fixtures/packs.js";

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
