import type { CandidateResource } from "../providers/types.js";
import type { Intake } from "../schema/types.js";
import type { StageProfile } from "../taxonomy/stages.js";

export interface CandidateScores {
  stageRelevance: number;
  topicalMatch: number;
  signalQuality: number;
  composite: number;
}

export interface ScoredCandidate extends CandidateResource {
  scores: CandidateScores;
}

export interface RankedCandidatePartition {
  eligible: ScoredCandidate[];
  ineligible: ScoredCandidate[];
}

interface RankedCandidate {
  candidate: ScoredCandidate;
  originalOrder: number;
}

// TUNABLE: evaluate against Slice 7 results.
export const SCORE_THRESHOLD = 0.35;

function tokenize(values: readonly string[]): Set<string> {
  return new Set(
    values.flatMap(
      (value) => value.toLowerCase().match(/[a-z0-9]+/g) ?? [],
    ),
  );
}

function coverage(
  candidateTokens: ReadonlySet<string>,
  phrases: readonly string[],
): number {
  const cueTokens = tokenize(phrases);
  if (cueTokens.size === 0) {
    return 0;
  }

  let matches = 0;
  for (const token of cueTokens) {
    if (candidateTokens.has(token)) {
      matches += 1;
    }
  }

  return matches / cueTokens.size;
}

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) {
    return value === Number.POSITIVE_INFINITY ? 1 : 0;
  }

  return Math.min(Math.max(value, 0), 1);
}

export function calculateSignalQuality(candidate: {
  sourceTier?: string;
}): number {
  switch (candidate.sourceTier) {
    case "primary":
      return 1;
    case "reference":
      return 0.7;
    case "example":
    default:
      return 0.4;
  }
}

export function calculateStageRelevance(
  candidate: Pick<CandidateResource, "title" | "tags" | "domains">,
  stageProfile: StageProfile,
): number {
  const candidateTokens = tokenize([
    candidate.title,
    ...candidate.tags,
    ...candidate.domains,
  ]);
  const positive = coverage(candidateTokens, stageProfile.relevanceCues);
  const penalty = coverage(candidateTokens, stageProfile.antiCues);

  return clampScore(positive - penalty);
}

export function calculateTopicalMatch(
  candidate: Pick<CandidateResource, "title" | "tags" | "domains">,
  intake: Intake,
): number {
  const candidateTokens = tokenize([
    candidate.title,
    ...candidate.tags,
    ...candidate.domains,
  ]);
  const intakeTokens = tokenize([intake.projectName, intake.description]);
  const union = new Set([...candidateTokens, ...intakeTokens]);

  if (union.size === 0) {
    return 0;
  }

  let intersectionSize = 0;
  for (const token of candidateTokens) {
    if (intakeTokens.has(token)) {
      intersectionSize += 1;
    }
  }

  return clampScore(intersectionSize / union.size);
}

export function calculateCompositeScore(
  scores: Omit<CandidateScores, "composite">,
): number {
  // TUNABLE: evaluate against Slice 7 results.
  return clampScore(
    0.45 * scores.stageRelevance +
      0.35 * scores.topicalMatch +
      0.2 * scores.signalQuality,
  );
}

export function scoreCandidate(
  candidate: CandidateResource,
  intake: Intake,
  stageProfile: StageProfile,
): ScoredCandidate {
  const componentScores = {
    stageRelevance: calculateStageRelevance(candidate, stageProfile),
    topicalMatch: calculateTopicalMatch(candidate, intake),
    signalQuality: calculateSignalQuality(candidate),
  };

  return {
    ...candidate,
    tags: [...candidate.tags],
    domains: [...candidate.domains],
    ...(candidate.patterns === undefined
      ? {}
      : { patterns: [...candidate.patterns] }),
    scores: {
      ...componentScores,
      composite: calculateCompositeScore(componentScores),
    },
  };
}

export function passesScoreThreshold(
  scores: Pick<CandidateScores, "composite">,
): boolean {
  return scores.composite >= SCORE_THRESHOLD;
}

function compareRankedCandidates(
  left: RankedCandidate,
  right: RankedCandidate,
): number {
  return (
    right.candidate.scores.composite -
      left.candidate.scores.composite ||
    right.candidate.scores.stageRelevance -
      left.candidate.scores.stageRelevance ||
    right.candidate.scores.topicalMatch -
      left.candidate.scores.topicalMatch ||
    right.candidate.scores.signalQuality -
      left.candidate.scores.signalQuality ||
    left.originalOrder - right.originalOrder ||
    left.candidate.url.localeCompare(right.candidate.url) ||
    left.candidate.id.localeCompare(right.candidate.id)
  );
}

export function rankCandidates(
  candidates: readonly CandidateResource[],
  intake: Intake,
  stageProfile: StageProfile,
): ScoredCandidate[] {
  return rankAllCandidates(candidates, intake, stageProfile).filter(
    ({ scores }) => passesScoreThreshold(scores),
  );
}

export function rankAllCandidates(
  candidates: readonly CandidateResource[],
  intake: Intake,
  stageProfile: StageProfile,
): ScoredCandidate[] {
  return candidates
    .map((candidate, originalOrder): RankedCandidate => ({
      candidate: scoreCandidate(candidate, intake, stageProfile),
      originalOrder,
    }))
    .sort(compareRankedCandidates)
    .map(({ candidate }) => candidate);
}

export function partitionRankedCandidates(
  candidates: readonly ScoredCandidate[],
): RankedCandidatePartition {
  const eligible: ScoredCandidate[] = [];
  const ineligible: ScoredCandidate[] = [];

  for (const candidate of candidates) {
    const target = passesScoreThreshold(candidate.scores)
      ? eligible
      : ineligible;
    target.push(candidate);
  }

  return { eligible, ineligible };
}
