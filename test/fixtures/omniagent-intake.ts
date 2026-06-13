import type { Intake } from "../../src/core/schema/types.js";

export const omniAgentIntake = {
  projectName: "OmniAgent",
  description:
    "An AI product workflow that helps teams research, plan, and automate product-building work.",
  stage: "discovery",
  depth: "medium",
  timeBudgetMin: 30,
} satisfies Intake;
