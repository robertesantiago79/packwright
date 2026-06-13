import { readFile } from "node:fs/promises";

import { defineUnionMembers } from "../schema/unionMembers.js";
import type { ResourceType } from "../schema/types.js";
import type { CuratedSourceEntry, SourceTier } from "./types.js";

const RESOURCE_TYPES = defineUnionMembers<ResourceType>()([
  "doc",
  "video",
  "visual",
  "example",
]);
const SOURCE_TIERS = defineUnionMembers<SourceTier>()([
  "primary",
  "reference",
  "example",
]);
const RESOURCE_TYPE_SET = new Set<ResourceType>(RESOURCE_TYPES);
const SOURCE_TIER_SET = new Set<SourceTier>(SOURCE_TIERS);

export class CuratedSourceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CuratedSourceValidationError";
  }
}

function assertObject(
  value: unknown,
  location: string,
): asserts value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new CuratedSourceValidationError(`${location} must be an object`);
  }
}

function readRequiredString(
  object: Record<string, unknown>,
  field: string,
  location: string,
): string {
  const value = object[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new CuratedSourceValidationError(
      `${location}.${field} must be a non-empty string`,
    );
  }

  return value.trim();
}

function readStringArray(
  object: Record<string, unknown>,
  field: string,
  location: string,
  required: boolean,
  normalize: boolean,
): string[] | undefined {
  const value = object[field];
  if (value === undefined && !required) {
    return undefined;
  }
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || item.trim().length === 0)
  ) {
    throw new CuratedSourceValidationError(
      `${location}.${field} must be an array of non-empty strings`,
    );
  }

  return value.map((item) => {
    const text = (item as string).trim();
    return normalize ? text.toLowerCase() : text;
  });
}

function validateEntry(value: unknown, index: number): CuratedSourceEntry {
  const location = `entries[${index}]`;
  assertObject(value, location);

  const url = readRequiredString(value, "url", location);
  try {
    new URL(url);
  } catch {
    throw new CuratedSourceValidationError(
      `${location}.url must be a valid absolute URL`,
    );
  }

  const type = value["type"];
  if (typeof type !== "string" || !RESOURCE_TYPE_SET.has(type as ResourceType)) {
    throw new CuratedSourceValidationError(
      `${location}.type must be one of: ${RESOURCE_TYPES.join(", ")}`,
    );
  }

  const sourceTier = value["sourceTier"];
  if (
    sourceTier !== undefined &&
    (typeof sourceTier !== "string" ||
      !SOURCE_TIER_SET.has(sourceTier as SourceTier))
  ) {
    throw new CuratedSourceValidationError(
      `${location}.sourceTier must be one of: ${SOURCE_TIERS.join(", ")}`,
    );
  }

  const estMinutes = value["estMinutes"];
  if (
    estMinutes !== undefined &&
    (!Number.isInteger(estMinutes) || (estMinutes as number) < 1)
  ) {
    throw new CuratedSourceValidationError(
      `${location}.estMinutes must be an integer greater than or equal to 1`,
    );
  }

  return {
    url,
    title: readRequiredString(value, "title", location),
    type: type as ResourceType,
    tags: readStringArray(value, "tags", location, true, true) ?? [],
    domains: readStringArray(value, "domains", location, true, true) ?? [],
    ...(sourceTier === undefined
      ? {}
      : { sourceTier: sourceTier as SourceTier }),
    ...(value["patterns"] === undefined
      ? {}
      : {
          patterns:
            readStringArray(value, "patterns", location, false, false) ?? [],
        }),
    ...(estMinutes === undefined
      ? {}
      : { estMinutes: estMinutes as number }),
  };
}

export async function loadCuratedSourceFile(
  filePath: string,
): Promise<CuratedSourceEntry[]> {
  const text = await readFile(filePath, "utf8");
  let parsed: unknown;

  try {
    // YAML is a superset of JSON. Slice 3a intentionally supports this strict,
    // deterministic subset for controlled repository fixtures.
    parsed = JSON.parse(text);
  } catch {
    throw new CuratedSourceValidationError(
      `${filePath} must use the supported JSON-compatible YAML format`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new CuratedSourceValidationError(
      `${filePath} must contain an array of curated source entries`,
    );
  }

  return parsed.map(validateEntry);
}
