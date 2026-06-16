import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeIntake } from "./intake/index.js";
import {
  aggregateCandidates,
  CuratedListProvider,
  MAX_CANDIDATES,
} from "./providers/index.js";
import { assembleContextPack, renderPack } from "./packgen/index.js";
import type { ContextPack } from "./schema/index.js";
import { rankAllCandidates } from "./scoring/index.js";
import { sequenceCandidates } from "./sequencer/index.js";
import { getStageProfile } from "./taxonomy/index.js";

const DEFAULT_SOURCE_PATH = fileURLToPath(
  new URL("../../sources/product-building.yaml", import.meta.url),
);

export interface CompileOptions {
  createdAt?: string;
  sourceDir?: string;
  candidateCap?: number;
}

export interface CompileResult {
  pack: ContextPack;
  markdown: string;
}

export interface ContextEngine {
  compile(intake: unknown, options?: CompileOptions): Promise<CompileResult>;
}

function sourcePathFromOptions(options: CompileOptions): string {
  return options.sourceDir === undefined
    ? DEFAULT_SOURCE_PATH
    : join(options.sourceDir, "product-building.yaml");
}

export const engine: ContextEngine = {
  async compile(
    input: unknown,
    options: CompileOptions = {},
  ): Promise<CompileResult> {
    const { intake } = normalizeIntake(input);
    const provider = new CuratedListProvider([sourcePathFromOptions(options)]);
    const candidates = await aggregateCandidates(
      [provider],
      intake,
      options.candidateCap ?? MAX_CANDIDATES,
    );
    const stageProfile = getStageProfile(intake.stage);
    const rankedCandidates = rankAllCandidates(
      candidates,
      intake,
      stageProfile,
    );
    const sequencerResult = sequenceCandidates(
      rankedCandidates,
      intake,
      stageProfile,
    );
    const pack = assembleContextPack({
      intake,
      sequencerResult,
      candidatesConsidered: candidates.length,
      ...(options.createdAt === undefined
        ? {}
        : { createdAt: options.createdAt }),
    });

    return {
      pack,
      markdown: renderPack(pack),
    };
  },
};
