import type { Intake } from "../schema/types.js";
import type { ResourceProvider } from "./resourceProvider.js";
import type { CandidateResource } from "./types.js";
import { createUrlIdentity } from "./urlIdentity.js";

export const MAX_CANDIDATES = 60;

export async function aggregateCandidates(
  providers: readonly ResourceProvider[],
  intake: Intake,
  cap: number,
): Promise<CandidateResource[]> {
  const effectiveCap = Math.min(Math.max(Math.trunc(cap), 0), MAX_CANDIDATES);
  if (effectiveCap === 0) {
    return [];
  }

  const candidates: CandidateResource[] = [];
  const seen = new Set<string>();

  for (const provider of providers) {
    const provided = await provider.fetchCandidates(intake, effectiveCap);

    for (const candidate of provided) {
      const key = createUrlIdentity(candidate.url).fullHash;
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      candidates.push(candidate);

      if (candidates.length === effectiveCap) {
        return candidates;
      }
    }
  }

  return candidates;
}
