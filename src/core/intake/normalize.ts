import type {
  Depth,
  Intake,
  ResourceType,
  Stage,
  TimeBudget,
} from "../schema/types.js";
import { GENERIC_TERMS, STOPWORDS } from "./constants.js";

export interface NormalizedIntake extends Intake {
  depth: Depth;
  timeBudgetMin: TimeBudget;
  sourcePreference: Record<ResourceType, number>;
}

export interface IntakeNormalizationResult {
  intake: NormalizedIntake;
  lowConfidenceCandidate: boolean;
  domainNounCount: number;
}

export class IntakeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IntakeValidationError";
  }
}

const STAGES = new Set<Stage>(["discovery", "prd"]);
const DEPTHS = new Set<Depth>(["light", "medium", "deep"]);
const TIME_BUDGETS = new Set<TimeBudget>([15, 30, 60]);
const RESOURCE_TYPES = [
  "doc",
  "video",
  "visual",
  "example",
] as const satisfies readonly ResourceType[];
const STOPWORD_SET = new Set<string>(STOPWORDS);
const GENERIC_TERM_SET = new Set<string>(GENERIC_TERMS);

function assertObject(value: unknown): asserts value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new IntakeValidationError("intake must be an object");
  }
}

function readString(
  object: Record<string, unknown>,
  field: string,
): string {
  const value = object[field];
  if (typeof value !== "string") {
    throw new IntakeValidationError(`${field} must be a string`);
  }

  return value.trim();
}

function validateLength(
  field: string,
  value: string,
  minimum: number,
  maximum: number,
): void {
  if (value.length < minimum) {
    const unit = minimum === 1 ? "character" : "characters";
    throw new IntakeValidationError(
      `${field} must be at least ${minimum} ${unit}; received ${value.length}`,
    );
  }

  if (value.length > maximum) {
    throw new IntakeValidationError(
      `${field} must be at most ${maximum} characters; received ${value.length}`,
    );
  }
}

function countSentences(description: string): number {
  return description
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0).length;
}

function countDomainNouns(description: string): number {
  // Deterministic vocabulary heuristic, not linguistic noun detection.
  const tokens = description.toLowerCase().match(/[a-z]+/g) ?? [];
  return tokens.filter(
    (token) =>
      token.length >= 3 &&
      !STOPWORD_SET.has(token) &&
      !GENERIC_TERM_SET.has(token),
  ).length;
}

function normalizeSourcePreference(
  value: unknown,
): Record<ResourceType, number> {
  const defaults: Record<ResourceType, number> = {
    doc: 1,
    video: 1,
    visual: 1,
    example: 1,
  };

  if (value === undefined) {
    return defaults;
  }

  assertObject(value);
  for (const key of Object.keys(value)) {
    if (!RESOURCE_TYPES.includes(key as ResourceType)) {
      throw new IntakeValidationError(
        `sourcePreference contains unsupported resource type '${key}'`,
      );
    }
  }

  for (const type of RESOURCE_TYPES) {
    const weight = value[type];
    if (weight === undefined) {
      continue;
    }
    if (typeof weight !== "number" || !Number.isFinite(weight)) {
      throw new IntakeValidationError(
        `sourcePreference.${type} must be a finite number`,
      );
    }
    if (weight < 0 || weight > 2) {
      throw new IntakeValidationError(
        `sourcePreference.${type} must be between 0 and 2; received ${weight}`,
      );
    }
    defaults[type] = weight;
  }

  return defaults;
}

export function normalizeIntake(input: unknown): IntakeNormalizationResult {
  assertObject(input);

  const projectName = readString(input, "projectName");
  validateLength("projectName", projectName, 1, 80);

  const description = readString(input, "description");
  validateLength("description", description, 20, 600);

  const sentenceCount = countSentences(description);
  if (sentenceCount < 1 || sentenceCount > 3) {
    throw new IntakeValidationError(
      `description must contain 1 to 3 sentences; received ${sentenceCount}`,
    );
  }

  const stage = input["stage"];
  if (typeof stage !== "string" || !STAGES.has(stage as Stage)) {
    throw new IntakeValidationError(
      "stage must be one of: discovery, prd",
    );
  }

  const depthValue = input["depth"] ?? "medium";
  if (typeof depthValue !== "string" || !DEPTHS.has(depthValue as Depth)) {
    throw new IntakeValidationError(
      "depth must be one of: light, medium, deep",
    );
  }

  const timeBudgetValue = input["timeBudgetMin"] ?? 30;
  if (
    typeof timeBudgetValue !== "number" ||
    !TIME_BUDGETS.has(timeBudgetValue as TimeBudget)
  ) {
    throw new IntakeValidationError(
      "timeBudgetMin must be one of: 15, 30, 60",
    );
  }

  const domainNounCount = countDomainNouns(description);
  return {
    intake: {
      projectName,
      description,
      stage: stage as Stage,
      depth: depthValue as Depth,
      timeBudgetMin: timeBudgetValue as TimeBudget,
      sourcePreference: normalizeSourcePreference(input["sourcePreference"]),
    },
    lowConfidenceCandidate: domainNounCount === 0,
    domainNounCount,
  };
}
