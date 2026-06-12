import type { ContextPack } from "../../src/core/schema/types.js";

export const validPack = {
  specVersion: "1.0",
  packId: "11111111-1111-4111-8111-111111111111",
  createdAt: "2026-06-12T12:00:00.000Z",
  intake: {
    projectName: "Atlas Discovery Pack",
    description:
      "Atlas helps product teams compile focused research before writing a product requirements document.",
    stage: "discovery",
    depth: "medium",
    timeBudgetMin: 30,
    sourcePreference: {
      doc: 1.5,
      video: 0.5,
      visual: 1,
      example: 1.25,
    },
  },
  confidence: "low",
  confidenceNotes: [
    "The fixture intentionally uses a sparse five-resource stack.",
  ],
  projectSummary:
    "Atlas is a research compiler for product teams moving from discovery toward a grounded PRD.",
  resources: [
    {
      id: "resource-1",
      title: "Problem Discovery Fundamentals",
      url: "https://example.com/problem-discovery",
      type: "doc",
      sourceProvider: "fixture",
      rationale:
        "Establishes the problem framing needed before comparing solutions.",
      estMinutes: 6,
      scores: {
        stageRelevance: 0.95,
        topicalMatch: 0.9,
        signalQuality: 0.8,
        composite: 0.9,
      },
    },
    {
      id: "resource-2",
      title: "Jobs-to-be-Done Interview Guide",
      url: "https://example.com/jtbd-interviews",
      type: "example",
      sourceProvider: "fixture",
      rationale:
        "Provides a concrete method for extracting user needs and alternatives.",
      estMinutes: 6,
      scores: {
        stageRelevance: 0.92,
        topicalMatch: 0.86,
        signalQuality: 0.85,
        composite: 0.88,
      },
    },
    {
      id: "resource-3",
      title: "Research Synthesis Walkthrough",
      url: "https://example.com/research-synthesis",
      type: "video",
      sourceProvider: "fixture",
      rationale:
        "Shows how raw observations become defensible product findings.",
      estMinutes: 6,
      scores: {
        stageRelevance: 0.87,
        topicalMatch: 0.82,
        signalQuality: 0.8,
        composite: 0.84,
      },
    },
    {
      id: "resource-4",
      title: "Competitive Landscape Matrix",
      url: "https://example.com/competitive-matrix",
      type: "visual",
      sourceProvider: "fixture",
      rationale:
        "Supports structured comparison of alternatives and category gaps.",
      estMinutes: 6,
      scores: {
        stageRelevance: 0.9,
        topicalMatch: 0.78,
        signalQuality: 0.75,
        composite: 0.83,
      },
    },
    {
      id: "resource-5",
      title: "Discovery Brief Example",
      url: "https://example.com/discovery-brief",
      type: "example",
      sourceProvider: "fixture",
      rationale:
        "Demonstrates how evidence, risks, and next steps fit into one artifact.",
      estMinutes: 6,
      scores: {
        stageRelevance: 0.94,
        topicalMatch: 0.88,
        signalQuality: 0.9,
        composite: 0.91,
      },
    },
  ],
  path: [
    {
      resourceId: "resource-1",
      position: 1,
      role: "orientation",
    },
    {
      resourceId: "resource-2",
      position: 2,
      role: "deepening",
    },
    {
      resourceId: "resource-3",
      position: 3,
      role: "deepening",
    },
    {
      resourceId: "resource-4",
      position: 4,
      role: "comparative",
    },
    {
      resourceId: "resource-5",
      position: 5,
      role: "synthesis",
    },
  ],
  extractedPatterns: [
    "Strong discovery artifacts separate observed user pain from proposed solutions.",
    "Comparable products make their workflow and evidence trail explicit.",
  ],
  artifactGuidance: [
    "State the target user, problem, evidence, alternatives, and unresolved risks.",
    "Connect each recommendation to a cited research input.",
  ],
  aiContextBlock:
    "Use this evidence to draft a discovery brief. Preserve uncertainty and cite the ordered resources.",
  stats: {
    candidatesConsidered: 12,
    totalEstMinutes: 30,
  },
} satisfies ContextPack;

export const missingRequiredFieldPack: unknown = structuredClone(validPack);
delete (missingRequiredFieldPack as Partial<ContextPack>).projectSummary;

export const pathResourceMismatchPack: unknown = structuredClone(validPack);
const mismatchedPath = pathResourceMismatchPack as ContextPack;
mismatchedPath.path[4] = {
  resourceId: "resource-does-not-exist",
  position: 5,
  role: "synthesis",
};

export const timeBudgetViolationPack: unknown = structuredClone(validPack);
const overBudgetPack = timeBudgetViolationPack as ContextPack;
overBudgetPack.intake.timeBudgetMin = 15;
