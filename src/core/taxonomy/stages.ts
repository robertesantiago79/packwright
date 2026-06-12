import type {
  PathRole,
  ResourceType,
  Stage,
} from "../schema/types.js";

export interface StageProfile {
  stage: Stage;
  goal: string;
  resourceMix: Record<ResourceType, number>;
  pathEmphasis: Record<PathRole, number>;
  relevanceCues: string[];
  antiCues: string[];
  artifactGuidanceSeed: string[];
}

export const DISCOVERY_PROFILE: StageProfile = {
  stage: "discovery",
  goal: "Build problem and market understanding before specifying a solution.",
  resourceMix: {
    // TUNABLE: evaluate against Slice 7 results.
    doc: 0.45,
    video: 0.1,
    visual: 0.15,
    example: 0.3,
  },
  pathEmphasis: {
    // TUNABLE: evaluate against Slice 7 results.
    orientation: 3,
    deepening: 4,
    comparative: 2,
    synthesis: 1,
  },
  relevanceCues: [
    "market size",
    "user pain",
    "competitor",
    "alternative",
    "jobs-to-be-done",
    "pricing landscape",
  ],
  antiCues: [
    "implementation detail",
    "API reference",
    "schema",
    "deployment",
  ],
  artifactGuidanceSeed: [
    "Define the target user and the problem evidence.",
    "Describe current alternatives and the competitive landscape.",
    "Separate observed needs from proposed solutions.",
    "Record assumptions, risks, and unanswered research questions.",
  ],
};

export const PRD_PROFILE: StageProfile = {
  stage: "prd",
  goal: "Build readiness to specify a scoped, testable product.",
  resourceMix: {
    // TUNABLE: evaluate against Slice 7 results.
    doc: 0.4,
    video: 0.2,
    visual: 0.1,
    example: 0.3,
  },
  pathEmphasis: {
    // TUNABLE: evaluate against Slice 7 results.
    orientation: 2,
    deepening: 4,
    comparative: 2,
    synthesis: 2,
  },
  relevanceCues: [
    "requirements",
    "user stories",
    "acceptance criteria",
    "feature comparison",
    "UX flow",
    "scope",
    "success metrics",
  ],
  antiCues: [
    "high-level market commentary",
    "opinion pieces without product specifics",
  ],
  artifactGuidanceSeed: [
    "Define scope, non-goals, and product requirements.",
    "Connect user stories to acceptance criteria.",
    "Document the expected UX flow and edge cases.",
    "Specify measurable success metrics and release risks.",
  ],
};

export const STAGE_PROFILES: Record<Stage, StageProfile> = {
  discovery: DISCOVERY_PROFILE,
  prd: PRD_PROFILE,
};

export function getStageProfile(stage: Stage): StageProfile {
  return STAGE_PROFILES[stage];
}
