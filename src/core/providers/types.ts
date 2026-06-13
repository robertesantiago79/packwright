import type { ResourceType } from "../schema/types.js";

export type SourceTier = "primary" | "reference" | "example";

export interface CandidateResource {
  id: string;
  url: string;
  title: string;
  type: ResourceType;
  tags: string[];
  domains: string[];
  sourceProvider: string;
  sourceTier?: SourceTier;
  patterns?: string[];
  estMinutes?: number;
}

export interface CuratedSourceEntry {
  url: string;
  title: string;
  type: ResourceType;
  tags: string[];
  domains: string[];
  sourceTier?: SourceTier;
  patterns?: string[];
  estMinutes?: number;
}
