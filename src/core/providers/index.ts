export {
  MAX_CANDIDATES,
  aggregateCandidates,
} from "./aggregator.js";
export { CuratedListProvider } from "./curatedListProvider.js";
export {
  CuratedSourceValidationError,
  loadCuratedSourceFile,
} from "./loadYaml.js";
export {
  calculateOverlap,
  extractIntakeTokens,
} from "./match.js";
export type { ResourceProvider } from "./resourceProvider.js";
export type {
  CandidateResource,
  CuratedSourceEntry,
  SourceTier,
} from "./types.js";
export {
  canonicalizeUrl,
  createUrlIdentity,
  type UrlIdentity,
} from "./urlIdentity.js";
