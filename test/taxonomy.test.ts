import { describe, expect, it } from "vitest";

import {
  DISCOVERY_PROFILE,
  PRD_PROFILE,
  getStageProfile,
} from "../src/core/taxonomy/index.js";

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
});
