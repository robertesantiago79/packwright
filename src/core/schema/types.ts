export type Stage = "discovery" | "prd"; // extension point: union grows post-P0
export type Depth = "light" | "medium" | "deep";
export type TimeBudget = 15 | 30 | 60; // minutes
export type ResourceType = "doc" | "video" | "visual" | "example";
export type PathRole =
  | "orientation"
  | "deepening"
  | "comparative"
  | "synthesis";
export type Confidence = "high" | "medium" | "low";

export interface Intake {
  projectName: string; // 1-80 chars
  description: string; // 1-3 sentences, 20-600 chars
  stage: Stage;
  depth?: Depth; // default "medium"
  timeBudgetMin?: TimeBudget; // default 30
  sourcePreference?: Partial<Record<ResourceType, number>>; // weights 0-2, default 1
}

export interface Resource {
  id: string; // stable hash of url
  title: string;
  url: string;
  type: ResourceType;
  sourceProvider: string; // which provider supplied it
  rationale: string; // 1-2 sentences: why it's in the stack
  estMinutes: number; // estimated consumption time
  scores: {
    stageRelevance: number; // 0-1
    topicalMatch: number; // 0-1
    signalQuality: number; // 0-1
    composite: number; // weighted, see Slice 4
  };
}

export interface PathItem {
  resourceId: string;
  position: number; // 1-based within whole path
  role: PathRole;
}

export interface ContextPack {
  specVersion: "1.0";
  packId: string; // uuid
  createdAt: string; // ISO 8601
  intake: Intake;
  confidence: Confidence;
  confidenceNotes: string[]; // why downgraded, if applicable
  projectSummary: string; // restated in clear product language
  resources: Resource[]; // 8-20 selected (fewer allowed if low-confidence)
  path: PathItem[]; // every resource appears exactly once
  extractedPatterns: string[]; // bullets: what similar products emphasize
  artifactGuidance: string[]; // "what good PRDs/discovery briefs include"
  aiContextBlock: string; // copy-paste prompt block (Markdown)
  stats: {
    candidatesConsidered: number;
    totalEstMinutes: number; // must respect timeBudget +/-20%
  };
}
