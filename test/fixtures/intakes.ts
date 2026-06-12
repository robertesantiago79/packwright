import type { Intake } from "../../src/core/schema/types.js";

export const validIntake = {
  projectName: "Pharmacy Forecasting",
  description:
    "A platform for pharmacy inventory forecasting and prescription demand planning.",
  stage: "discovery",
} satisfies Intake;

export const shortDescriptionIntake: unknown = structuredClone(validIntake);
(shortDescriptionIntake as Intake).description = "A useful tool";

export const emptyProjectNameIntake: unknown = structuredClone(validIntake);
(emptyProjectNameIntake as Intake).projectName = "";

export const longProjectNameIntake: unknown = structuredClone(validIntake);
(longProjectNameIntake as Intake).projectName = "P".repeat(81);

export const longDescriptionIntake: unknown = structuredClone(validIntake);
(longDescriptionIntake as Intake).description = "D".repeat(601);

export const tooManySentencesIntake: unknown = structuredClone(validIntake);
(tooManySentencesIntake as Intake).description =
  "First pharmacy sentence. Second inventory sentence. Third demand sentence. Fourth planning sentence.";

export const malformedStageIntake: unknown = structuredClone(validIntake);
(malformedStageIntake as Record<string, unknown>)["stage"] = "build";

export const invalidSourceWeightIntake: unknown = structuredClone(validIntake);
(invalidSourceWeightIntake as Intake).sourcePreference = {
  doc: 2.5,
};

export const genericDescriptionIntake: unknown = structuredClone(validIntake);
(genericDescriptionIntake as Intake).description =
  "A tool that helps users with their projects and ideas";

export const domainDescriptionIntake: unknown = structuredClone(validIntake);
