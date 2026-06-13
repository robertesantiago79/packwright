import type { Intake } from "../schema/types.js";
import type { CandidateResource } from "./types.js";

export interface ResourceProvider {
  name: string;
  fetchCandidates(
    intake: Intake,
    cap: number,
  ): Promise<CandidateResource[]>;
}
