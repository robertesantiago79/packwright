import { createHash } from "node:crypto";

import type {
  ContextPack,
  Intake,
  PathItem,
  PathRole,
  Resource,
} from "../schema/types.js";
import { validatePack } from "../schema/validate.js";
import type { SequencerResult } from "../sequencer/index.js";

export interface AssembleContextPackOptions {
  intake: Intake;
  sequencerResult: SequencerResult;
  candidatesConsidered: number;
  createdAt?: string;
}

const ROLE_LABELS: Record<PathRole, string> = {
  orientation: "orientation",
  deepening: "deepening",
  comparative: "comparative",
  synthesis: "synthesis",
};

function stableHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function buildPackId(
  intake: Intake,
  selectedIds: readonly string[],
): string {
  return `pack-${stableHash(
    [
      intake.projectName.trim().toLowerCase(),
      intake.stage,
      ...selectedIds,
    ].join("|"),
  )}`;
}

function budgetWindow(intake: Intake): { minimum: number; maximum: number } {
  const budget = intake.timeBudgetMin ?? 30;
  return {
    minimum: budget * 0.8,
    maximum: budget * 1.2,
  };
}

function allocateSchemaValidMinutes(
  actualMinutes: readonly number[],
  intake: Intake,
): number[] {
  const actualTotal = actualMinutes.reduce((total, minutes) => total + minutes, 0);
  const { minimum, maximum } = budgetWindow(intake);

  if (actualTotal >= minimum && actualTotal <= maximum) {
    return actualMinutes.map((minutes) => Math.max(Math.round(minutes), 1));
  }

  const target = intake.timeBudgetMin ?? 30;
  const count = actualMinutes.length;
  if (count === 0) {
    return [];
  }
  if (count > maximum) {
    throw new Error(
      `Cannot assemble schema-valid pack: ${count} resources cannot fit within the ${maximum}-minute validation ceiling with one-minute minimum estimates.`,
    );
  }

  const base = Math.max(Math.floor(target / count), 1);
  const estimates = Array.from({ length: count }, () => base);
  let remaining = target - base * count;
  for (let index = 0; index < estimates.length && remaining > 0; index += 1) {
    estimates[index] = (estimates[index] ?? 0) + 1;
    remaining -= 1;
  }

  return estimates;
}

function formatScore(score: number): string {
  return score.toFixed(4);
}

function sourceTierText(sourceTier: string | undefined): string {
  return sourceTier === undefined ? "unspecified tier" : `${sourceTier} tier`;
}

function buildRationale(
  selected: SequencerResult["selected"][number],
  schemaMinutes: number,
): string {
  const fallbackText = selected.fallbackSelected
    ? " It is below the scoring threshold and is included only as fallback material."
    : " It passed the scoring threshold.";
  const timeText =
    schemaMinutes === selected.estMinutes
      ? `Estimated at ${schemaMinutes} minutes.`
      : `Schema estimate is ${schemaMinutes} minutes; sequencer estimate was ${selected.estMinutes} minutes.`;

  return [
    `Use this ${selected.candidate.type} as a ${ROLE_LABELS[selected.role]} resource for the path.`,
    `Composite score ${formatScore(selected.candidate.scores.composite)} with ${sourceTierText(selected.candidate.sourceTier)} metadata.`,
    timeText,
    fallbackText.trim(),
  ].join(" ");
}

function buildConfidenceNotes(
  sequencerResult: SequencerResult,
): string[] {
  const notes = [...sequencerResult.confidenceNotes];
  if (sequencerResult.usedBelowThresholdFallback) {
    notes.push(
      "Pack includes below-threshold fallback resources; do not treat them as high-confidence sources.",
    );
  }
  if (sequencerResult.budgetPressure) {
    notes.push(
      `Sequencer estimated ${sequencerResult.totalEstMinutes} actual minutes, which may exceed the requested budget.`,
    );
  }

  return [...new Set(notes)];
}

function buildProjectSummary(
  intake: Intake,
  confidence: ContextPack["confidence"],
  sequencerResult: SequencerResult,
): string {
  const budget = intake.timeBudgetMin ?? 30;
  const depth = intake.depth ?? "medium";
  const caveats: string[] = [];

  if (sequencerResult.usedBelowThresholdFallback) {
    caveats.push("includes below-threshold fallback resources");
  }
  if (sequencerResult.budgetPressure) {
    caveats.push(
      `actual sequencer time may be ${sequencerResult.totalEstMinutes} minutes`,
    );
  }

  const caveatText =
    caveats.length === 0 ? "No fallback caveats were reported." : caveats.join("; ");

  return `${intake.projectName} ${intake.stage} pack for a ${depth} pass within a requested ${budget}-minute budget. Confidence is ${confidence}. ${caveatText}`;
}

function dedupePatterns(
  selected: readonly SequencerResult["selected"][number][],
): string[] {
  const patterns: string[] = [];
  const seen = new Set<string>();

  for (const item of selected) {
    for (const pattern of item.candidate.patterns ?? []) {
      if (!seen.has(pattern)) {
        seen.add(pattern);
        patterns.push(pattern);
      }
    }
  }

  return patterns;
}

function typeSummary(
  selected: readonly SequencerResult["selected"][number][],
): string {
  const types = [...new Set(selected.map(({ candidate }) => candidate.type))];
  return types.length === 0 ? "none" : types.join(", ");
}

function buildArtifactGuidance(
  intake: Intake,
  sequencerResult: SequencerResult,
): string[] {
  const guidance = [
    `Use the ordered ${intake.stage} path to draft the stage artifact from orientation through synthesis.`,
    `Selected resource types: ${typeSummary(sequencerResult.selected)}.`,
    `Carry forward confidence level ${sequencerResult.confidence} when using this pack.`,
  ];

  if (sequencerResult.usedBelowThresholdFallback) {
    guidance.push(
      "Treat fallback resources as directional support, not definitive evidence.",
    );
  }
  if (sequencerResult.budgetPressure) {
    guidance.push(
      `State that the actual sequencer estimate was ${sequencerResult.totalEstMinutes} minutes and may exceed the requested budget.`,
    );
  }

  return guidance;
}

function buildAiContextBlock(
  intake: Intake,
  sequencerResult: SequencerResult,
  path: readonly PathItem[],
): string {
  const resources = new Map(
    sequencerResult.selected.map((item) => [item.candidate.id, item]),
  );
  const orderedResources = path
    .map((item) => {
      const selected = resources.get(item.resourceId);
      if (selected === undefined) {
        throw new Error(`Path references missing selected resource ${item.resourceId}`);
      }

      const fallback = selected.fallbackSelected
        ? "fallback, below threshold"
        : "eligible";
      return `${item.position}. [${item.role}] ${selected.candidate.title} (${selected.candidate.type}, composite ${formatScore(selected.candidate.scores.composite)}, ${fallback})`;
    })
    .join("\n");
  const caveats = [
    `Confidence: ${sequencerResult.confidence}.`,
    ...(sequencerResult.usedBelowThresholdFallback
      ? ["Some selected resources are below-threshold fallback candidates and must not be treated as high-confidence sources."]
      : []),
    ...(sequencerResult.budgetPressure
      ? [`Actual sequencer estimate was ${sequencerResult.totalEstMinutes} minutes and may exceed the requested budget.`]
      : []),
  ].join(" ");

  return [
    `Project: ${intake.projectName}`,
    `Stage: ${intake.stage}`,
    `Requested budget: ${intake.timeBudgetMin ?? 30} minutes`,
    "",
    "Ordered resources:",
    orderedResources,
    "",
    caveats,
    "",
    `Use this context to draft the ${intake.stage} artifact. Preserve uncertainty, cite the ordered resources, and do not upgrade fallback resources beyond their stated confidence.`,
  ].join("\n");
}

export function assembleContextPack(
  options: AssembleContextPackOptions,
): ContextPack {
  const { intake, sequencerResult } = options;
  const selectedIds = sequencerResult.selected.map(
    ({ candidate }) => candidate.id,
  );
  const schemaMinutes = allocateSchemaValidMinutes(
    sequencerResult.selected.map(({ estMinutes }) => estMinutes),
    intake,
  );
  const path = sequencerResult.path.map((item): PathItem => ({ ...item }));
  const resources = sequencerResult.selected.map((selected, index): Resource => ({
    id: selected.candidate.id,
    title: selected.candidate.title,
    url: selected.candidate.url,
    type: selected.candidate.type,
    sourceProvider: selected.candidate.sourceProvider,
    rationale: buildRationale(selected, schemaMinutes[index] ?? selected.estMinutes),
    estMinutes: schemaMinutes[index] ?? selected.estMinutes,
    scores: { ...selected.candidate.scores },
  }));
  const pack: ContextPack = {
    specVersion: "1.0",
    packId: buildPackId(intake, selectedIds),
    createdAt: options.createdAt ?? new Date().toISOString(),
    intake: {
      projectName: intake.projectName,
      description: intake.description,
      stage: intake.stage,
      ...(intake.depth === undefined ? {} : { depth: intake.depth }),
      ...(intake.timeBudgetMin === undefined
        ? {}
        : { timeBudgetMin: intake.timeBudgetMin }),
      ...(intake.sourcePreference === undefined
        ? {}
        : { sourcePreference: { ...intake.sourcePreference } }),
    },
    confidence: sequencerResult.confidence,
    confidenceNotes: buildConfidenceNotes(sequencerResult),
    projectSummary: buildProjectSummary(
      intake,
      sequencerResult.confidence,
      sequencerResult,
    ),
    resources,
    path,
    extractedPatterns: dedupePatterns(sequencerResult.selected),
    artifactGuidance: buildArtifactGuidance(intake, sequencerResult),
    aiContextBlock: buildAiContextBlock(intake, sequencerResult, path),
    stats: {
      candidatesConsidered: options.candidatesConsidered,
      totalEstMinutes: resources.reduce(
        (total, resource) => total + resource.estMinutes,
        0,
      ),
    },
  };
  const validation = validatePack(pack);
  if (!validation.valid) {
    throw new Error(
      `Assembled ContextPack failed validation:\n${validation.errors.join("\n")}`,
    );
  }

  return pack;
}
