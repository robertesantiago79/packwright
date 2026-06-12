import { Ajv2020, type ErrorObject } from "ajv/dist/2020.js";

import packSchema from "./pack.schema.json" with { type: "json" };
import type { ContextPack } from "./types.js";

export interface PackValidationResult {
  valid: boolean;
  errors: string[];
}

export const TIME_BUDGET_TOLERANCE = 0.2;

const ajv = new Ajv2020({ allErrors: true, strict: true });
const validateSchema = ajv.compile<ContextPack>(packSchema);

function formatSchemaError(error: ErrorObject): string {
  const location = error.instancePath || "/";

  if (error.keyword === "required") {
    const params = error.params as { missingProperty?: unknown };
    const missingProperty = params.missingProperty;
    return `${location} must have required property '${String(missingProperty)}'`;
  }

  return `${location} ${error.message ?? "is invalid"}`;
}

function validatePath(pack: ContextPack): string[] {
  const errors: string[] = [];
  const resourceIds = new Set(pack.resources.map((resource) => resource.id));
  const pathCounts = new Map<string, number>();

  for (const [index, item] of pack.path.entries()) {
    if (!resourceIds.has(item.resourceId)) {
      errors.push(
        `path[${index}].resourceId references nonexistent resourceId '${item.resourceId}'`,
      );
    }

    pathCounts.set(item.resourceId, (pathCounts.get(item.resourceId) ?? 0) + 1);

    if (item.position !== index + 1) {
      errors.push(
        `path[${index}].position must be ${index + 1}; received ${item.position}`,
      );
    }
  }

  for (const resourceId of resourceIds) {
    const count = pathCounts.get(resourceId) ?? 0;
    if (count !== 1) {
      errors.push(
        `resourceId '${resourceId}' must appear exactly once in path; found ${count}`,
      );
    }
  }

  return errors;
}

function validateTimeBudget(pack: ContextPack): string[] {
  const errors: string[] = [];
  const resourceTotal = pack.resources.reduce(
    (total, resource) => total + resource.estMinutes,
    0,
  );

  if (pack.stats.totalEstMinutes !== resourceTotal) {
    errors.push(
      `stats.totalEstMinutes must equal summed resource estMinutes (${resourceTotal}); received ${pack.stats.totalEstMinutes}`,
    );
  }

  const budget = pack.intake.timeBudgetMin ?? 30;
  const minimum = budget * (1 - TIME_BUDGET_TOLERANCE);
  const maximum = budget * (1 + TIME_BUDGET_TOLERANCE);

  if (
    pack.stats.totalEstMinutes < minimum ||
    pack.stats.totalEstMinutes > maximum
  ) {
    errors.push(
      `stats.totalEstMinutes must be within 20% of intake time budget (${minimum}-${maximum}); received ${pack.stats.totalEstMinutes}`,
    );
  }

  return errors;
}

export function validatePack(obj: unknown): PackValidationResult {
  if (!validateSchema(obj)) {
    return {
      valid: false,
      errors: (validateSchema.errors ?? []).map(formatSchemaError),
    };
  }

  const errors = [...validatePath(obj), ...validateTimeBudget(obj)];
  return {
    valid: errors.length === 0,
    errors,
  };
}
