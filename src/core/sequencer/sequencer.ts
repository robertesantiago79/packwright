import type { ScoredCandidate } from "../scoring/index.js";
import { passesScoreThreshold } from "../scoring/index.js";
import type {
  Confidence,
  Intake,
  PathItem,
  PathRole,
  ResourceType,
} from "../schema/types.js";
import type { StageProfile } from "../taxonomy/index.js";

export const DEFAULT_EST_MINUTES = 15;

const STANDARD_ITEM_FLOOR = 8;
const TINY_BUDGET_ITEM_FLOOR = 5;
const MAX_SELECTED_ITEMS = 20;
const BUDGET_TOLERANCE = 0.2;
const SOFT_PREFERENCE_WEIGHT = 0.01;
const SOFT_MIX_WEIGHT = 0.01;
const PATH_ROLES = [
  "orientation",
  "deepening",
  "comparative",
  "synthesis",
] as const satisfies readonly PathRole[];

interface RankedSelectionCandidate {
  candidate: ScoredCandidate;
  eligible: boolean;
  estMinutes: number;
  originalOrder: number;
}

export interface SequencedCandidate {
  candidate: ScoredCandidate;
  position: number;
  role: PathRole;
  estMinutes: number;
  eligible: boolean;
  fallbackSelected: boolean;
}

export interface SequencerResult {
  selected: SequencedCandidate[];
  path: PathItem[];
  totalEstMinutes: number;
  budgetTargetMet: boolean;
  budgetPressure: boolean;
  usedBelowThresholdFallback: boolean;
  confidence: Confidence;
  confidenceNotes: string[];
}

function cloneCandidate(candidate: ScoredCandidate): ScoredCandidate {
  return {
    ...candidate,
    tags: [...candidate.tags],
    domains: [...candidate.domains],
    ...(candidate.patterns === undefined
      ? {}
      : { patterns: [...candidate.patterns] }),
    scores: { ...candidate.scores },
  };
}

function getSourcePreference(
  intake: Intake,
  type: ResourceType,
): number {
  return intake.sourcePreference?.[type] ?? 1;
}

function countSelectedTypes(
  selected: readonly RankedSelectionCandidate[],
): Record<ResourceType, number> {
  const counts: Record<ResourceType, number> = {
    doc: 0,
    video: 0,
    visual: 0,
    example: 0,
  };

  for (const item of selected) {
    counts[item.candidate.type] += 1;
  }

  return counts;
}

function selectionPriority(
  item: RankedSelectionCandidate,
  selected: readonly RankedSelectionCandidate[],
  intake: Intake,
  stageProfile: StageProfile,
): number {
  const selectedTypeCounts = countSelectedTypes(selected);
  const selectedTotal = Math.max(selected.length, 1);
  const currentProportion =
    selectedTypeCounts[item.candidate.type] / selectedTotal;
  const mixDeficit = Math.max(
    stageProfile.resourceMix[item.candidate.type] - currentProportion,
    0,
  );
  const preferenceAdjustment =
    (getSourcePreference(intake, item.candidate.type) - 1) *
    SOFT_PREFERENCE_WEIGHT;

  return (
    item.candidate.scores.composite +
    preferenceAdjustment +
    mixDeficit * SOFT_MIX_WEIGHT
  );
}

function pickNextCandidate(
  remaining: readonly RankedSelectionCandidate[],
  selected: readonly RankedSelectionCandidate[],
  intake: Intake,
  stageProfile: StageProfile,
): RankedSelectionCandidate | undefined {
  const hasEligible = remaining.some(({ eligible }) => eligible);
  const candidates = hasEligible
    ? remaining.filter(({ eligible }) => eligible)
    : remaining;

  return [...candidates].sort((left, right) => {
    return (
      selectionPriority(right, selected, intake, stageProfile) -
        selectionPriority(left, selected, intake, stageProfile) ||
      right.candidate.scores.composite -
        left.candidate.scores.composite ||
      left.originalOrder - right.originalOrder ||
      left.candidate.url.localeCompare(right.candidate.url) ||
      left.candidate.id.localeCompare(right.candidate.id)
    );
  })[0];
}

function removeCandidate(
  remaining: RankedSelectionCandidate[],
  selected: RankedSelectionCandidate,
): void {
  const index = remaining.indexOf(selected);
  if (index >= 0) {
    remaining.splice(index, 1);
  }
}

function totalMinutes(
  candidates: readonly RankedSelectionCandidate[],
): number {
  return candidates.reduce((total, item) => total + item.estMinutes, 0);
}

function createRoleSequence(
  count: number,
  pathEmphasis: Readonly<Record<PathRole, number>>,
): PathRole[] {
  if (count <= PATH_ROLES.length) {
    return PATH_ROLES.slice(0, count);
  }

  const allocations: Record<PathRole, number> = {
    orientation: 1,
    deepening: 1,
    comparative: 1,
    synthesis: 1,
  };
  const totalWeight = PATH_ROLES.reduce(
    (total, role) => total + pathEmphasis[role],
    0,
  );

  for (let assigned = PATH_ROLES.length; assigned < count; assigned += 1) {
    const nextRole = [...PATH_ROLES].sort((left, right) => {
      const leftDeficit =
        (count * pathEmphasis[left]) / totalWeight - allocations[left];
      const rightDeficit =
        (count * pathEmphasis[right]) / totalWeight - allocations[right];
      return (
        rightDeficit - leftDeficit ||
        PATH_ROLES.indexOf(left) - PATH_ROLES.indexOf(right)
      );
    })[0];

    if (nextRole !== undefined) {
      allocations[nextRole] += 1;
    }
  }

  return PATH_ROLES.flatMap((role) =>
    Array.from({ length: allocations[role] }, () => role),
  );
}

function buildConfidence(
  selectedCount: number,
  usedBelowThresholdFallback: boolean,
  budgetPressure: boolean,
): Pick<SequencerResult, "confidence" | "confidenceNotes"> {
  const confidenceNotes: string[] = [];

  if (selectedCount < STANDARD_ITEM_FLOOR) {
    confidenceNotes.push(
      "Fewer than eight ranked candidates were available for the selected path.",
    );
  }
  if (usedBelowThresholdFallback) {
    confidenceNotes.push(
      "Below-threshold ranked candidates were used as explicit fallback material.",
    );
  }
  if (budgetPressure) {
    confidenceNotes.push(
      "The item floor and available durations prevented a path within the target budget range.",
    );
  }

  if (
    selectedCount < STANDARD_ITEM_FLOOR ||
    usedBelowThresholdFallback
  ) {
    return { confidence: "low", confidenceNotes };
  }

  return {
    confidence: budgetPressure ? "medium" : "high",
    confidenceNotes,
  };
}

export function sequenceCandidates(
  rankedCandidates: readonly ScoredCandidate[],
  intake: Intake,
  stageProfile: StageProfile,
): SequencerResult {
  const timeBudgetMin = intake.timeBudgetMin ?? 30;
  const itemFloor =
    timeBudgetMin === 15
      ? TINY_BUDGET_ITEM_FLOOR
      : STANDARD_ITEM_FLOOR;
  const lowerBudget = timeBudgetMin * (1 - BUDGET_TOLERANCE);
  const upperBudget = timeBudgetMin * (1 + BUDGET_TOLERANCE);
  const targetCount = Math.min(itemFloor, rankedCandidates.length);
  const maxCount = Math.min(MAX_SELECTED_ITEMS, rankedCandidates.length);
  const eligibleCount = rankedCandidates.filter(({ scores }) =>
    passesScoreThreshold(scores),
  ).length;
  const allowFallback = eligibleCount < targetCount;
  const remaining = rankedCandidates
    .map(
      (candidate, originalOrder): RankedSelectionCandidate => ({
        candidate,
        eligible: passesScoreThreshold(candidate.scores),
        estMinutes: candidate.estMinutes ?? DEFAULT_EST_MINUTES,
        originalOrder,
      }),
    )
    .filter(({ eligible }) => eligible || allowFallback);
  const selected: RankedSelectionCandidate[] = [];

  while (selected.length < targetCount) {
    const next = pickNextCandidate(
      remaining,
      selected,
      intake,
      stageProfile,
    );
    if (next === undefined) {
      break;
    }
    selected.push(next);
    removeCandidate(remaining, next);
  }

  while (
    selected.length < maxCount &&
    totalMinutes(selected) < lowerBudget
  ) {
    const next = pickNextCandidate(
      remaining,
      selected,
      intake,
      stageProfile,
    );
    if (next === undefined) {
      break;
    }

    const currentDistance = Math.abs(
      timeBudgetMin - totalMinutes(selected),
    );
    const nextDistance = Math.abs(
      timeBudgetMin - (totalMinutes(selected) + next.estMinutes),
    );
    if (nextDistance > currentDistance) {
      break;
    }

    selected.push(next);
    removeCandidate(remaining, next);
  }

  const selectedMinutes = totalMinutes(selected);
  const budgetTargetMet =
    selectedMinutes >= lowerBudget && selectedMinutes <= upperBudget;
  const budgetPressure = selected.length > 0 && !budgetTargetMet;
  const usedBelowThresholdFallback = selected.some(
    ({ eligible }) => !eligible,
  );
  const roles = createRoleSequence(
    selected.length,
    stageProfile.pathEmphasis,
  );
  const sequenced = selected.map(
    (item, index): SequencedCandidate => ({
      candidate: cloneCandidate(item.candidate),
      position: index + 1,
      role: roles[index] ?? "synthesis",
      estMinutes: item.estMinutes,
      eligible: item.eligible,
      fallbackSelected: !item.eligible,
    }),
  );
  const path = sequenced.map(
    ({ candidate, position, role }): PathItem => ({
      resourceId: candidate.id,
      position,
      role,
    }),
  );
  const confidence = buildConfidence(
    sequenced.length,
    usedBelowThresholdFallback,
    budgetPressure,
  );

  return {
    selected: sequenced,
    path,
    totalEstMinutes: selectedMinutes,
    budgetTargetMet,
    budgetPressure,
    usedBelowThresholdFallback,
    ...confidence,
  };
}
