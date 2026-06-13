import { describe, expect, it } from "vitest";

import {
  DISCOVERY_PROFILE,
  PRD_PROFILE,
  STAGE_PROFILES,
  getStageProfile,
} from "../src/core/taxonomy/index.js";

function toHundredths(value: number): number {
  const [whole, fraction = ""] = value.toString().split(".");
  if (whole === undefined || fraction.length > 2) {
    throw new Error(`resourceMix value must use at most two decimals: ${value}`);
  }

  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

describe("stage taxonomy", () => {
  it("loads the discovery profile with problem and market cues", () => {
    const profile = getStageProfile("discovery");

    expect(profile).toBe(DISCOVERY_PROFILE);
    expect(profile.goal).toContain("problem and market understanding");
    expect(profile.relevanceCues).toEqual(
      expect.arrayContaining(["user pain", "competitor", "jobs-to-be-done"]),
    );
    expect(profile.antiCues).toContain("implementation detail");
    expect(profile.resourceMix.doc + profile.resourceMix.example).toBeGreaterThan(
      0.5,
    );
  });

  it("loads the PRD profile with specification-readiness cues", () => {
    const profile = getStageProfile("prd");

    expect(profile).toBe(PRD_PROFILE);
    expect(profile.goal).toContain("readiness to specify");
    expect(profile.relevanceCues).toEqual(
      expect.arrayContaining([
        "requirements",
        "acceptance criteria",
        "success metrics",
      ]),
    );
    expect(profile.antiCues).toContain("high-level market commentary");
    expect(profile.resourceMix.doc + profile.resourceMix.example).toBeGreaterThan(
      0.5,
    );
  });

  it("allocates exactly 100% of every stage resource mix", () => {
    for (const profile of Object.values(STAGE_PROFILES)) {
      // Mix values are contract literals in hundredths. Parsing their decimal
      // strings to integers checks an exact total without float tolerance.
      const scaledTotal = Object.values(profile.resourceMix).reduce(
        (total, value) => total + toHundredths(value),
        0,
      );

      expect(scaledTotal).toBe(100);
    }
  });
});
