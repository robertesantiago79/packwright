import type { Intake } from "../schema/types.js";
import type { CuratedSourceEntry } from "./types.js";

function tokenize(values: readonly string[]): Set<string> {
  const tokens = values
    .flatMap((value) => value.toLowerCase().match(/[a-z0-9]+/g) ?? [])
    .filter((token) => token.length >= 2);

  return new Set(tokens);
}

export function extractIntakeTokens(intake: Intake): Set<string> {
  return tokenize([intake.projectName, intake.description]);
}

export function calculateOverlap(
  intakeTokens: ReadonlySet<string>,
  entry: Pick<CuratedSourceEntry, "tags" | "domains">,
): number {
  const candidateTokens = tokenize([...entry.tags, ...entry.domains]);
  let overlap = 0;

  for (const token of candidateTokens) {
    if (intakeTokens.has(token)) {
      overlap += 1;
    }
  }

  return overlap;
}
