import type { Intake } from "../schema/types.js";
import { loadCuratedSourceFile } from "./loadYaml.js";
import { calculateOverlap, extractIntakeTokens } from "./match.js";
import type { ResourceProvider } from "./resourceProvider.js";
import type { CandidateResource } from "./types.js";
import { createUrlIdentity } from "./urlIdentity.js";

export class CuratedListProvider implements ResourceProvider {
  readonly name: string;
  readonly #sourcePaths: readonly string[];

  constructor(sourcePaths: readonly string[], name = "curated-list") {
    this.#sourcePaths = sourcePaths;
    this.name = name;
  }

  async fetchCandidates(
    intake: Intake,
    cap: number,
  ): Promise<CandidateResource[]> {
    if (cap <= 0) {
      return [];
    }

    const intakeTokens = extractIntakeTokens(intake);
    const ranked: Array<{
      candidate: CandidateResource;
      overlap: number;
      order: number;
    }> = [];
    let order = 0;

    for (const sourcePath of this.#sourcePaths) {
      const entries = await loadCuratedSourceFile(sourcePath);

      for (const entry of entries) {
        const overlap = calculateOverlap(intakeTokens, entry);
        if (overlap === 0) {
          order += 1;
          continue;
        }

        const identity = createUrlIdentity(entry.url);
        ranked.push({
          candidate: {
            id: identity.id,
            url: identity.canonicalUrl,
            title: entry.title,
            type: entry.type,
            tags: entry.tags,
            domains: entry.domains,
            sourceProvider: this.name,
            ...(entry.sourceTier === undefined
              ? {}
              : { sourceTier: entry.sourceTier }),
            ...(entry.patterns === undefined
              ? {}
              : { patterns: entry.patterns }),
            ...(entry.estMinutes === undefined
              ? {}
              : { estMinutes: entry.estMinutes }),
          },
          overlap,
          order,
        });
        order += 1;
      }
    }

    return ranked
      .sort(
        (left, right) =>
          right.overlap - left.overlap || left.order - right.order,
      )
      .slice(0, cap)
      .map(({ candidate }) => candidate);
  }
}
