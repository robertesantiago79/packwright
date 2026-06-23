# Build State

- Current slice: Slice 6j.1 - CLI-Visible Sample Validation Record
- Status: RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Deviations:
  - A repository-local Git identity is used because no global Git identity is configured in Termux.
  - Slice 1 implementation deviations: None.
  - S1.1 implementation deviations: None.
  - Slice 2 implementation deviations: None.
  - S2.1 implementation deviations: None.
  - Slice 3a implementation deviations: None.
- Pending forks:
  - Governance ratifications #2-#4 remain PENDING per controller instruction.
  - Full TypeScript-to-JSON-Schema code generation is deferred; the enum-parity canary partially mitigates dual-contract drift risk.

## Slice History

- Slice 0 - Scaffold: PROMOTED (controller gate passed; pushed to `origin/main`)
- Slice 1 - Schema + Validator + Renderer: PROMOTED
- S1.1 - Contract Hardening + Quality Fixes: PROMOTED (controller gate passed; commit `e036976` verified at `origin/main`)
- Slice 2 - Intake + Taxonomy: PROMOTED (controller accepted; commit `a0fcd42df67a62a9a55a0d609abc390e2ad28142`)
- S2.1a - Audit Gate Remediation: PROMOTED (controller accepted; commit `b6f0742`)
- S2.1 - Drift Guards: PROMOTED (controller accepted; commit `90d054bb197f033c20df6794b55555b1fefcbc8c`)
- S2.1b - Promotion Record: PROMOTED (controller accepted; commit `673beb907f195a2a73be4f9ce1e4442a6ad05d44`)
- S2.1c - State Truth Correction: PROMOTED (controller accepted; commit `92deaaf07a545f00b820b99be5fa1af44e5167bc`)
- Slice 3 Preflight: COMPLETE / READ-ONLY / NO FILES CHANGED / CONTROLLER ACCEPTED
- Slice 3a - Provider Foundation: PROMOTED (controller accepted; commit `0be285b8585abe389fc31a87e8fa37554c61a87c`)
- Slice 3b - Corpus + Full Acceptance Planning: COMPLETE (72-entry candidate accepted for repo-backed validation)
- Slice 3b.1 - Production Corpus Insertion + Full Acceptance Test: PROMOTED (controller accepted; commit `1ae4ecd112d6f83ec87cf25692b9e152af7597ab`)
- Full Slice 3 Corpus Acceptance: PROMOTED (controller accepted)
- Slice 3 Overall: CLOSED / PROMOTED / REPO-RECORDED
- Slice 4 Preflight: COMPLETE / READ-ONLY / NO FILES CHANGED / CONTROLLER ACCEPTED (baseline `193e266a2c711de40b5742e4f06fedc2fa2ca760`)
- Slice 4a - Scoring Design Record: CONTROLLER ACCEPTED (commit `1a27db95ef1d4a0792e3988ad30e8ec54b6cbaa1`)
- Slice 4b - Scoring Foundation Implementation: PROMOTED (controller accepted; owner product-quality accepted; commit `1946f409754566e2f1fdb2f2534fc50d79c4268a`)
- Slice 4c - Ranked Sample Output Validation: READ-ONLY VALIDATION COMPLETE / GATED / CONTROLLER ACCEPTED (no tracked files changed; no commit or push; ranked evidence produced)
- Owner Product-Quality Validation: ACCEPTED directionally as the v1 scoring foundation; no correction slice required before promotion
- Slice 4 Scoring: CLOSED / PROMOTED / REPO-RECORDED
- Next SPEC Slice Preflight: COMPLETE / READ-ONLY / NO FILES CHANGED / NO COMMIT OR PUSH / CONTROLLER ACCEPTED (baseline remained `c2ab4989e33b98a4e5bfaad7fccf174fc576e142`)
- Next SPEC Capability: Slice 5 Sequencer; implementation is not authorized
- Slice 5a - Sequencer Design Record: RECORDED / GATED / PENDING CONTROLLER CONFIRMATION
- Slice 5a.1 - Terminology Clarification: RECORDED / GATED / PENDING CONTROLLER CONFIRMATION
- Slice 4e - Ranked Candidate Exposure Correction: CLOSED / PROMOTED / REPO-RECORDED (controller accepted; commit `2dbd8aa2de527120134a1a202ef2c3050966eae5`)
- Slice 4e.1 - Ranked Exposure Confirmation Record: RECORDED / GATED / PENDING CONTROLLER CONFIRMATION
- Slice 5b - Sequencer Foundation Implementation: IMPLEMENTED / CONTROLLER ACCEPTED / NOT FULL SLICE 5 PROMOTED (commit `e59adb956bd52428383a1b777814254fe9f77d80`)
- Slice 5b.1 - Sequencer Foundation Controller Acceptance Record: RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Slice 5c - Sequencer Sample Output Validation: COMPLETE / READ-ONLY / CONTROLLER ACCEPTED (no tracked files changed; no commit or push)
- Slice 5d - Fallback Selection Quality Correction: IMPLEMENTED / GATED / COMMITTED / PUSHED / CONTROLLER ACCEPTED (commit `e2ba2518ce7af43857da7969b41f9f8892762fd5`)
- Slice 5d.1 - Fallback Quality Controller Acceptance Record: STATE.md-ONLY / RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Slice 5e - Post-Correction Sequencer Sample Output Validation: COMPLETE / READ-ONLY / CONTROLLER ACCEPTED (no tracked files changed; no commit or push)
- Slice 5 Owner Product-Quality Validation: ACCEPTED DIRECTIONALLY FOR v1 with caveats; Owner selected the A path after Slice 5e review.
- Slice 5 Sequencer Behavior: CLOSED / PROMOTED / REPO-RECORDED with caveats.
- Slice 5f - Owner Product-Quality Acceptance and Slice 5 Promotion Record: STATE.md-ONLY / RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Slice 6 Pack Generation / Output Assembly Preflight: COMPLETE / READ-ONLY / NO FILES CHANGED / CONTROLLER ACCEPTED (baseline remained `14999f8b20771e72317b90ee318a19acb66c200d`)
- Slice 6a - Pack Generation Design Record / Contract Rulings: STATE.md-ONLY / RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Slice 6b - Core Pack Assembler Foundation: IMPLEMENTED / GATED / COMMITTED / PUSHED / CONTROLLER ACCEPTED (commit `c4ada13ad869c76983f21bcf0f2e2ae845bfffe8`)
- Slice 6b.1 - Core Pack Assembler Controller Acceptance Record: STATE.md-ONLY / RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Slice 6c - Generated ContextPack Sample Output Validation: COMPLETE / READ-ONLY / CONTROLLER ACCEPTED (no tracked files changed; no commit or push; baseline remained `04cef3bd6f046135d8ee644bfe2252898544d731`)
- Slice 6 Owner Product-Quality Validation: ACCEPTED DIRECTIONALLY FOR v1 with caveats; Owner selected the A path after Slice 6c review.
- Core Generated ContextPack Output Quality: ACCEPTED FOR v1 WITH CAVEATS / REPO-RECORDED BY SLICE 6d
- Slice 6d - Owner Product-Quality Acceptance Record: STATE.md-ONLY / RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Slice 6e - Engine Compile Pipeline Foundation: IMPLEMENTED / GATED / COMMITTED / PUSHED / CONTROLLER ACCEPTED (commit `a41b316c1a01ae0fc92d36ddac063112a7a20ff2`)
- Slice 6e.1 - Engine Compile Pipeline Controller Acceptance Record: STATE.md-ONLY / RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Slice 6f - CLI Compile Integration Preflight: COMPLETE / READ-ONLY / CONTROLLER ACCEPTED (no tracked files changed; no commit or push)
- Slice 6g - CLI Compile Integration Foundation: IMPLEMENTED / GATED / COMMITTED / PUSHED / CONTROLLER ACCEPTED (commit `783f404d597eaaed051b32a83e4fe7e0cfd33cc7`)
- Slice 6g.x - CLI SPEC Command Stdout Parity Review: COMPLETE / READ-ONLY / CONTROLLER ACCEPTED (no tracked files changed; no commit or push; baseline remained `783f404d597eaaed051b32a83e4fe7e0cfd33cc7`)
- Slice 6g.1 - CLI Compile Integration Controller Acceptance Record: STATE.md-ONLY / RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Slice 6i - Output Writing Foundation: IMPLEMENTED / GATED / COMMITTED / PUSHED / CONTROLLER ACCEPTED (commit `4c324082093a5d3af3c7e068988a47122325d680`)
- Slice 6i.1 - Output Writing Foundation Controller Acceptance Record: STATE.md-ONLY / RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Slice 6j - CLI-Visible Sample Validation: COMPLETE / READ-ONLY / CONTROLLER ACCEPTED (no tracked files changed; no commit or push; baseline remained `2d9e3952ab30665b261bc49f6b249dbd57405970`)
- Slice 6j.1 - CLI-Visible Sample Validation Record: STATE.md-ONLY / RECORDED / GATED / COMMITTED / PUSHED / PENDING CONTROLLER CONFIRMATION
- Pack generation promotion, CLI integration, output writing, UI, release work, Slice 7+, and later work: HOLD
- Next eligible work: final Slice 6 promotion preflight/record after Controller acceptance. Full Slice 6 promotion remains HOLD until final validation and Owner/Controller acceptance. Output directory policy only covers explicit `--out <dir>` for now. No later implementation is authorized by this record.

## Amendments

- 2026-06-12: Project renamed from Context Engine (`context-engine`) to Packwright (`packwright`) under specification amendment v1.0.1.

## Contract Clarifications

- S1.1: Resource stacks are capped at 20; high/medium-confidence packs require at least 8 resources, while low-confidence packs may contain 1-20.
- S1.1: `Resource.estMinutes` is an integer with a minimum value of 1.
- S1.1: TypeScript unions and JSON Schema enums remain dual contract sources. A parity canary covers stage, role, resource type, depth, and confidence; schema code generation is the deferred full fix.
- Length-bound literals `20-600` and `1-80` exist in TypeScript comments, JSON Schema, and `normalize.ts`; this remains a drift risk until future work centralizes those bounds.
- Slice 2 erratum: The short-description vague-input trigger is superseded by the `Intake.description` length contract. Descriptions under 20 characters are malformed and rejected, not marked low-confidence.
- Slice 2 ruling: Zero-domain-noun detection uses a deterministic exported stopword/generic-term list heuristic after hard validation; no NLP dependency is introduced.

## Known Limitations

- The sentence-count heuristic splits on punctuation and can falsely split abbreviations such as `e.g.`. This is a known risk, not a current blocker; correction requires a dedicated sentence-boundary slice.
- Slice 3a curated source loading supports a strict JSON-compatible YAML subset only. General YAML syntax requires a separately authorized parser dependency.
- Slice 3a matching is exact lowercase token overlap without stemming, synonyms, or semantic expansion.
- Production corpus URLs were not live-tested during Slice 3 acceptance.
- Direct PDF extraction remains a known risk for corpus entries that link to PDF resources.
- Scoring is lexical only, with no stemming, embeddings, semantic expansion, or LLM scoring.
- Source tier influences ranking, and exact product-quality tuning may require future refinement.

## Standing Gate

- `npm audit` is required for this and all subsequent slice gates.
- S2.1a audit remediation pins Vite's transitive `esbuild` to `0.28.1` through an npm override, avoiding a Vitest major-version migration.
- The Vite/esbuild override compatibility remains a monitored risk; the accepted S2.1 gate passed with 0 vulnerabilities.

## Slice 2 Decisions Applied

- Sub-20-character descriptions are rejected before vague-input analysis under the binding `Intake.description` contract.
- Zero-domain-noun detection is a deterministic list-driven heuristic using exported `STOPWORDS` and `GENERIC_TERMS`; no NLP dependency is used.
- No additional contingent decisions were required.

## Slice 3a Decisions Applied

- `CandidateResource` remains internal and carries URL identity, tags, domains, provider metadata, and optional tier, patterns, and `estMinutes`.
- Curated fixtures use dependency-free JSON-compatible YAML parsing with required-field validation.
- URL identity uses canonical URL SHA-256 with `url-sha256:` plus the first 16 hex characters for candidate IDs.
- Duplicate precedence keeps the earliest provider, then earliest file entry; metadata is not merged.
- Matching uses tag/domain token overlap, descending overlap order, and original order as the deterministic tie-break.
- Provider caps are honored; aggregation enforces a global maximum of 60; non-positive caps return an empty list.
- Full 40-60 candidate acceptance passed with the controller-accepted 72-entry production corpus and OmniAgent acceptance fixture.

## Slice 3b.1 Corpus

- `sources/product-building.yaml` contains 72 reviewed entries in the supported JSON-compatible YAML subset.
- The production corpus acceptance test loads the file through the curated source loader and provider.
- The acceptance test returns 60 deterministic, deduplicated candidates for the OmniAgent corpus intake.
- Full Slice 3 corpus acceptance is promoted and controller accepted.
- Slice 4+ remains HOLD.

## Slice 4a Scoring Design Decisions

- Score shape: `stageRelevance`, `topicalMatch`, `signalQuality`, and `composite` are numbers clamped from 0 to 1.
- Composite formula: `0.45 * stageRelevance + 0.35 * topicalMatch + 0.20 * signalQuality`.
- The composite formula and the `0.35` filter threshold must carry `// TUNABLE` markers in implementation.
- Promoted corpus tiers remain unchanged. Signal quality maps `primary` to `1.0`, `reference` to `0.7`, `example` to `0.4`, and missing or unknown tiers to `0.4`.
- Stage relevance uses lexical, token-level matching against existing taxonomy cues and anti-cues. Positive cue matches normalize to 0-1; anti-cues apply a penalty clamped to 0-1.
- Stage relevance does not use stemming, embeddings, LLM calls, or semantic expansion.
- Topical match compares candidate title, tags, and domains with intake project-name and description tokens, normalized to 0-1. Candidate body text is not assumed.
- Deterministic ranking tie-break order is higher composite, higher stage relevance, higher topical match, higher signal quality, lower original input order, then stable URL or ID lexical fallback.
- Internal calculations may use raw floating point. Returned scores are clamped to 0-1; tests avoid brittle excessive precision. If output rounding is required for stability, use four decimal places.
- Scoring must not mutate candidate inputs.
- Slice 4b scope may include pure scoring functions, a scored-candidate type, threshold filtering, deterministic ranking, focused scoring tests, and compatibility with Slice 3 candidates.
- Slice 4b excludes sequencing, resource-mix enforcement, time-budget selection, source preferences, rationales or explanations, pack generation, CLI or UI changes, provider or corpus changes, dependencies, and semantic matching.
- UI/UX Owner validation is not required unless a visible interface is added later.
- Product-quality Owner validation is required after scoring implementation produces ranked sample outputs and before scoring behavior is promoted.
- Slice 4b scoring foundation implementation was authorized under a separate Controller packet.

## Slice 4b Scoring Foundation

- Files changed: `src/core/scoring/scoring.ts`, `src/core/scoring/index.ts`, `test/scoring.test.ts`, and `STATE.md`; the scoring placeholder `.gitkeep` was removed.
- Pure lexical scoring produces clamped stage relevance, topical match, signal quality, and composite scores without mutating Slice 3 candidates.
- Composite scoring uses the accepted `0.45`, `0.35`, and `0.20` weights; threshold filtering uses `0.35`; both remain marked `// TUNABLE`.
- Deterministic ranking applies the accepted score-dimension, original-order, URL, and ID tie-break sequence.
- No provider, corpus, sequencing, resource-mix, time-budget, source-preference, rationale, pack-generation, CLI, UI, dependency, stemming, embedding, semantic-expansion, or LLM behavior changed.
- Scoring behavior is promoted after Controller acceptance and Owner product-quality acceptance.
- Later Slice 4+ work remains HOLD pending a separate authorization.

## Slice 4c Product-Quality Validation

- Read-only ranked sample-output validation completed with no tracked file changes, commit, or push.
- Build, test, lint, and audit gates passed; repeated rankings were deterministic.
- Owner accepted the scoring directionally as the v1 scoring foundation; no correction slice is required before promotion.
- Accepted v1 tuning risk: a useful example-tier discovery item scored `0.3300` and was filtered below the `0.35` threshold.
- Accepted v1 tuning risk: a primary topic-only item with zero stage relevance scored `0.3750` and passed.
- These threshold behaviors are future refinement risks, not current blockers.

## Slice 5a Sequencer Design Decisions

- Slice 5 requirements are to select 8-20 ranked candidates, honor stage `resourceMix`, target total `estMinutes` within +/-20% of the intake budget, apply `sourcePreference`, assign canonical path roles, support a five-item floor for 15-minute budgets, and support sparse domains with a smaller stack and appropriate confidence.
- The promoted corpus contains 68 docs, 3 examples, 1 visual, and 0 videos. Stage resource-mix values are therefore best-effort soft targets, not hard constraints.
- If a target resource type is unavailable or sparse, selection falls back to the next-best available scored candidates without failing solely on mix proportions; ordering remains deterministic.
- Candidates missing `estMinutes` remain eligible and use a deterministic 15-minute fallback estimate. Future corpus work may reduce fallback reliance.
- The budget +/-20% range is the target when feasible. If the item floor, sparse domain, or minimum durations make it infeasible, the sequencer returns the best feasible stack and reports reduced confidence rather than silently returning zero results.
- For 15-minute budgets, prefer a five-item floor when enough candidates exist. If five items exceed the budget, prioritize the floor and report low confidence or budget pressure.
- Sparse stacks may contain fewer than eight resources. Under the current schema, fewer-than-eight stacks use low confidence unless a later authorized schema change permits medium confidence.
- Assign exactly one existing canonical path role per selected resource. Short stacks use the earliest and highest-priority roles first; longer stacks distribute roles deterministically across selected order.
- `sourcePreference` influences selection as a soft preference and does not completely override score, budget, or availability. No new preference model or dependency is authorized.
- The promoted scoring threshold creates a production integration blocker for a representative Packwright sample intake modeled on an agent/product-building use case: discovery maximum composite observed was `0.3250`, PRD maximum was `0.3167`, and the threshold is `0.35`, producing zero passing production candidates.
- This is Packwright scoring/corpus integration evidence only; it is not OmniAgent project status or OmniAgent repo truth.
- Sequencer unit tests may use purpose-built scored fixtures. Slice 4e addresses production candidate-pool visibility, while below-threshold eligibility remains subject to the recorded low-confidence sequencer fallback.
- A future correction slice may expose below-threshold scored candidates, tune scoring or corpus matching, or adjust threshold behavior. No scoring, provider, or corpus correction is authorized by Slice 5a.
- Pack generation, rationales or explanations, CLI integration, UI, provider changes, corpus changes, scoring tuning, dependency additions, semantic matching, embeddings, and LLM scoring remain out of scope.
- Recommended follow-up requires separate Controller authorization: Slice 5b Sequencer Foundation Implementation using the exposed ranked pool and the recorded low-confidence fallback.

## Slice 4e Ranked Candidate Exposure

- Added `rankAllCandidates` to expose every scored candidate using the existing deterministic ranking rules.
- Added `partitionRankedCandidates` to separate threshold-eligible and ineligible scored candidates without mutation.
- Existing `rankCandidates` remains the filtered public behavior and returns only candidates with composite scores at or above `0.35`.
- No scoring weights, threshold, stage relevance, topical match, source-tier mapping, taxonomy, provider, or corpus behavior changed.
- Production-corpus scored candidates are now visible through the scoring API even when the eligible partition is empty.
- Below-threshold candidates remain ineligible; any future sequencer use must be an explicit low-confidence fallback.
- Product-quality Owner validation remains required after sample sequence outputs exist.
- Slice 4e is controller accepted, promoted, and repo-recorded at commit `2dbd8aa2de527120134a1a202ef2c3050966eae5`.
- Slice 5 implementation remains HOLD pending separate Controller authorization.

## Slice 5b Sequencer Foundation

- Files changed: `src/core/sequencer/sequencer.ts`, `src/core/sequencer/index.ts`, `test/sequencer.test.ts`, and `STATE.md`; the sequencer placeholder `.gitkeep` was removed.
- Added `sequenceCandidates`, which consumes exposed ranked scored candidates without recomputing or changing scoring.
- Eligible candidates are selected first. When the eligible pool cannot meet the item floor, below-threshold ranked candidates remain explicitly identified and are used only as low-confidence fallback material.
- Selection targets 8-20 resources for normal budgets and a five-item floor for 15-minute budgets. Sparse pools return the available smaller stack with low confidence rather than returning zero.
- Candidate `estMinutes` values drive budget selection; missing estimates use the recorded deterministic 15-minute fallback.
- Budget compliance targets the intake budget +/-20%. Infeasible item floors or durations produce budget-pressure metadata and reduced confidence.
- Stage resource mix and intake source preference are deterministic soft influences and do not override eligibility, score priority, availability, or the item floor.
- Every selected candidate receives exactly one canonical path role in deterministic canonical order based on the stage path emphasis.
- Sequencer results expose selected items, total estimated minutes, budget status, fallback status, confidence, confidence notes, and path assignments.
- Inputs and scored candidate objects are not mutated; selected candidate data is cloned into the result.
- Production-corpus smoke coverage confirms the exposed ranked pool remains nonempty when the eligible set is empty and produces a nonzero low-confidence fallback stack.
- No scoring math, threshold, corpus, provider, intake, taxonomy, schema, pack-generation, rationale, CLI, UI, dependency, semantic-matching, embedding, or LLM behavior changed.
- Product-quality Owner validation remains required after sample sequences are reviewed.
- Slice 5b is controller accepted at commit `e59adb956bd52428383a1b777814254fe9f77d80`.
- Full Slice 5 is not promoted; pack generation, rationales, CLI integration, UI, release work, and later slices remain HOLD.

## Slice 5d Fallback Selection Quality Correction

- Fallback floor selection preserves the strongest ranked fallback as an anchor, then uses a deterministic bounded score window to consider shorter viable resources.
- Best-effort fallback diversity uses a tighter score window so non-doc resources are selected only when they are not materially weaker than the strongest fallback.
- Eligible-first selection, the `0.35` threshold, below-threshold ineligibility, five-item tiny-budget floor, sparse-stack behavior, deterministic roles, and immutability remain unchanged.
- Slice 5c production comparisons improved from `170` to `100` minutes for discovery, `173` to `95` for PRD, `100` to `68` for the tiny-budget case, and `159` to `89` for the narrow/off-topic case.
- Discovery and tiny-budget fallback paths include one viable example. PRD and narrow paths remain all-doc because available non-doc resources fall outside the coherence-preserving diversity window.
- All production fallback paths remain low confidence and continue reporting budget pressure; below-threshold candidates remain fallback material only.
- No scoring, threshold, corpus, provider, taxonomy, schema, CLI, pack-generation, UI, dependency, semantic-matching, embedding, or LLM behavior changed.
- Slice 5d is controller accepted at commit `e2ba2518ce7af43857da7969b41f9f8892762fd5`.
- Full Slice 5 promotion remains HOLD pending another sample-output validation and Owner product-quality review.

## Slice 5e/5f Sequencer Promotion

- Slice 5e post-correction sample-output validation completed read-only with no tracked file changes, no commit, and no push.
- Owner product-quality validation accepted Slice 5 sequencer behavior directionally for v1 after Slice 5e review and selected the A path.
- Slice 5 sequencer behavior is CLOSED / PROMOTED / REPO-RECORDED with caveats.
- Promotion covers sequencer behavior only. It does not include pack generation, CLI integration, UI, release work, or later slices.
- Caveat: production fallback paths may still exceed requested time budgets.
- Caveat: fallback paths remain low confidence where below-threshold candidates dominate.
- Caveat: below-threshold candidates remain fallback-only and are not eligible candidates.
- Caveat: PRD-stage quality may require future corpus or scoring tuning.
- Caveat: production representative intakes may still produce zero eligible candidates under the current `0.35` threshold.
- Pack generation and CLI are not implemented.
- Slice 6 and later work require a separate Controller packet.

## Slice 6a Pack Generation Contract Rulings

- Slice 6 implementation must be split. The next implementation slice should be Slice 6b Core Pack Assembler Foundation, not full CLI end-to-end.
- Slice 6b should assemble a schema-valid `ContextPack` object from normalized intake, sequencer output, and scored candidate metadata.
- CLI compile integration remains a later slice. File output and CLI write paths are not in Slice 6b unless separately authorized.
- Markdown rendering may use the existing renderer only after the assembled core object passes validation.
- The current `validatePack` budget rule remains unchanged for now. Slice 6b must not create invalid packs.
- If sequencer output exceeds the +/-20% budget window because of low-confidence fallback behavior, Slice 6b must use a schema-valid handling strategy without hiding caveats.
- Ruling for over-budget fallback handling: pack-level estimated minutes may use the schema-valid budget-capped estimate when required by current validation, while actual sequencer total and budget pressure must be preserved in allowed textual fields such as the project summary, artifact guidance, AI context block, or caveat text.
- Pack assembly must not pretend the real sequencer total met budget when fallback output was over budget.
- Schema or validator changes are not authorized in Slice 6b unless implementation proves impossible and Controller authorizes a schema-specific correction.
- `packId` should be deterministic and derived from stable input data such as normalized project name, stage, selected resource IDs or URLs, and a stable short hash. Random IDs are not authorized for Slice 6b.
- `createdAt` must be deterministic in tests. Slice 6b should support an optional clock or `createdAt` override; production defaults may use current time only behind that deterministic option and must remain valid ISO format.
- `projectSummary` must be deterministic and template-based. It should summarize project name, stage, depth or time budget when available, confidence, and whether fallback or budget pressure exists. No LLM-generated prose is authorized.
- Per-resource rationales must be deterministic template strings using available metadata such as path role, title, resource type, scores, eligibility or fallback status folded into text, and source tier folded into text when available.
- Rationales must not invent content from unread pages or claim a resource contains information beyond its title, tags, domains, and recorded metadata.
- `extractedPatterns` should use selected candidate `patterns` metadata when present, deduplicated deterministically in first-seen selected-path order. If no patterns exist, return an empty array or other existing schema-valid default; do not infer new patterns from URLs or titles.
- `artifactGuidance` should be deterministic template guidance based on the stage profile, path roles, selected resource types, confidence, and fallback status. It must stay practical and generic rather than pretending to be a full narrative based on unread resource bodies.
- `aiContextBlock` should be a deterministic template for downstream AI use that includes project and stage summary, ordered path/resources, confidence and caveats, fallback or budget-pressure warning when applicable, and an instruction not to treat fallback candidates as high-confidence sources.
- Use the existing confidence enum. If the sequencer result is low confidence, the pack confidence must be low. Pack assembly must not upgrade confidence.
- If fallback was used, caveat text must state that selected resources include below-threshold fallback candidates. If budget pressure exists, caveat text must state that actual sequencer time may exceed the requested budget.
- Slice 6b should avoid schema changes and use the existing `ContextPack`, `Resource`, `PathItem`, and validation contracts where possible.
- If the existing schema cannot honestly represent required caveats, implementation must stop and request a schema-specific design correction rather than silently widening the schema.
- SPEC acceptance mentions CLI end-to-end, but the Controller boundary splits this into later slices. Slice 6b is core assembler only; Slice 6c or later may connect the assembler to engine/CLI once the core pack object is validated.
- Slice 6b tests should cover deterministic pack generation with fixed `createdAt`, schema-valid output, markdown renderer compatibility where practical, low-confidence fallback caveats, eligible/high-confidence fixtures, pattern aggregation and dedupe, and input immutability.
- Production-corpus smoke coverage may be included but should not be the only Slice 6b acceptance path.
- Owner product-quality validation will be required after generated sample ContextPacks exist. Slice 6b implementation alone does not promote full pack-generation quality until sample pack outputs are reviewed.
- Pack generation CLI integration, output writing, release work, UI, schema widening, scoring/corpus/provider changes, and Slice 7+ remain HOLD.

## Slice 6b Core Pack Assembler Foundation

- Added a core pack assembler that creates a schema-valid `ContextPack` object from normalized intake-compatible data, sequencer output, and scored selected candidate metadata.
- The assembler is exported from `src/core/packgen/index.ts` as `assembleContextPack`; the existing Markdown renderer is also exported from that index.
- Scope remained core assembler only. No CLI integration, file writing, schema or validator changes, scoring changes, threshold changes, corpus changes, provider changes, sequencer behavior changes, dependency additions, UI, release work, or Slice 7+ work was included.
- `packId` is deterministic and derived from normalized project/stage and selected resource IDs through a stable short hash.
- `createdAt` accepts a deterministic override for tests; production default remains isolated behind the option and uses a valid ISO timestamp.
- The assembler emits deterministic template-based project summary, per-resource rationales, artifact guidance, and AI context block content. No LLM synthesis or unread page-content claims are used.
- Selected candidate `patterns` metadata is aggregated into `extractedPatterns`, deduplicated in first-seen selected path order. Patterns are not inferred from URLs or titles.
- Existing confidence is preserved and never upgraded during pack assembly. Low-confidence sequencer output remains low-confidence pack output.
- Below-threshold fallback and budget-pressure caveats are preserved in allowed textual fields including confidence notes, project summary, rationales, artifact guidance, and AI context block.
- Current schema and validator behavior remain unchanged. When sequencer actual time is outside the validation budget window, the assembler uses schema-valid resource estimates and preserves the actual sequencer total in caveat text rather than claiming the actual total met budget.
- Assembled packs are validated with the existing `validatePack`; validation failures are surfaced rather than suppressed.
- Focused tests cover schema-valid eligible pack assembly, low-confidence fallback caveats, budget-pressure handling, deterministic output, pattern aggregation, renderer compatibility, and input immutability.
- Slice 6b is controller accepted at commit `c4ada13ad869c76983f21bcf0f2e2ae845bfffe8`.
- Generated ContextPack usefulness still requires read-only sample-output validation and Owner product-quality review before any Slice 6 promotion.
- CLI integration, output writing, schema widening, pack-generation promotion, UI, release work, and Slice 7+ remain HOLD.

## Slice 6c/6d Generated ContextPack Quality Acceptance

- Slice 6c generated ContextPack sample-output validation completed read-only with no tracked file changes, no commit, and no push. The baseline remained `04cef3bd6f046135d8ee644bfe2252898544d731`.
- Slice 6c validation generated six sample ContextPacks covering high-confidence fixture, low-confidence fallback fixture, production discovery, production PRD, tiny-budget discovery, and narrow/weakly aligned discovery scenarios.
- Accepted strengths: all six sample packs validated successfully with existing `validatePack`; Markdown rendering worked; deterministic `packId` was confirmed; fixed `createdAt` override was confirmed; fallback caveats were preserved; actual over-budget sequencer time was preserved in text; confidence was not upgraded; no schema changes occurred; no unread-page content claims were made; pattern aggregation was deterministic and deduped.
- Owner product-quality validation accepted generated ContextPack output directionally for v1 after Slice 6c review and selected the A path.
- Core generated ContextPack output quality is ACCEPTED FOR v1 WITH CAVEATS and repo-recorded by Slice 6d.
- Acceptance covers core generated ContextPack output quality only. It does not include CLI integration, output/file writing, schema widening, UI, release readiness, or later slices.
- Caveat: rationales are useful but template-heavy.
- Caveat: PRD sample output remains generic and not strongly PRD-specific.
- Caveat: pack-level budget-capped estimates may confuse users unless caveats are visible.
- Caveat: fallback and source metadata are not machine-readable yet.
- Caveat: generated pack quality may need polish after external or user-facing review.
- CLI integration remains unimplemented and requires a later separate Controller packet.
- Output/file writing remains unimplemented and requires a later separate Controller packet.
- Future schema widening may be needed if richer fallback or source metadata must become machine-readable.
- Release readiness remains out of scope.

## Slice 6e Engine Compile Pipeline Foundation

- Replaced the core engine compile stub with a real core pipeline that normalizes intake, loads the promoted production corpus, aggregates candidates, ranks candidates, sequences a resource path, assembles a schema-valid `ContextPack`, renders Markdown, and returns `{ pack, markdown }`.
- Slice 6e is controller accepted at commit `a41b316c1a01ae0fc92d36ddac063112a7a20ff2`.
- The engine API accepts a deterministic `createdAt` override for tests and preserves the assembler's deterministic `packId` behavior.
- `candidateCap` remains optional and defaults to the promoted provider/aggregator maximum. `sourceDir` is available only as a deterministic source-location option and defaults to `sources/product-building.yaml`.
- The pipeline uses existing accepted components: `normalizeIntake`, `CuratedListProvider`, `aggregateCandidates`, `rankAllCandidates`, `sequenceCandidates`, `assembleContextPack`, and `renderPack`.
- No CLI argument parsing, file writing, output directory behavior, overwrite policy, schema or validator changes, scoring changes, threshold changes, sequencer behavior changes, corpus changes, provider behavior changes, dependency additions, release work, Owner acceptance claim, or Slice 6 promotion is included.
- Focused engine tests cover schema-valid pack compilation, Markdown section rendering, deterministic output with fixed `createdAt`, caller-intake immutability, fallback/caveat preservation, and invalid intake rejection through the existing normalizer.
- CLI integration, JSON/Markdown file output, output directory and overwrite policy, CLI-visible sample validation, release readiness, and Slice 6 promotion remain HOLD pending separate Controller packets.

## Slice 6e.1 Engine Compile Pipeline Controller Acceptance Record

- This record is STATE.md-only and records Controller acceptance of Slice 6e.
- Accepted Slice 6e files were `src/core/index.ts`, `test/engine.test.ts`, and `STATE.md`.
- Accepted Slice 6e gates passed: build PASS, tests PASS with 71 tests, lint PASS, and audit PASS with 0 vulnerabilities.
- Preserved behavior: `engine.compile(input, options)` returns `{ pack, markdown }`; intake normalization is connected; promoted corpus loading uses `CuratedListProvider`; candidate aggregation is connected; ranking uses `rankAllCandidates`; sequencing uses `sequenceCandidates`; pack assembly uses `assembleContextPack`; Markdown rendering uses `renderPack`.
- Preserved options and quality coverage: deterministic `createdAt`, `candidateCap`, and `sourceDir` are supported; caller intake is not mutated; fallback and caveat preservation is covered; invalid intake rejection goes through the existing normalizer.
- No CLI argument parsing, file/output writing, output directory behavior, overwrite policy, schema or validator changes, scoring/threshold/sequencer/corpus/provider changes, dependency changes, full Slice 6 promotion, or release readiness claim is included.
- Next eligible work may be CLI compile integration preflight or a bounded CLI compile integration packet if Controller authorizes it. Output writing should remain separate unless a future packet explicitly combines it.

## Slice 6g CLI Compile Integration Foundation

- Slice 6g is controller accepted at commit `783f404d597eaaed051b32a83e4fe7e0cfd33cc7`.
- Added CLI parsing for `compile --file <path>`.
- Added `fixtures/omniagent-intake.json` to mirror the representative OmniAgent-style intake fixture required by SPEC command parity.
- The CLI reads JSON intake from disk, calls `engine.compile`, and prints a parseable `{ pack, markdown }` JSON envelope to stdout.
- Expected user errors now print concise stderr messages and exit nonzero for unknown command, missing `--file`, missing file value, unreadable file, invalid JSON, and invalid intake.
- Help text now documents `packwright compile --file <path>` and the SPEC example command.
- A narrow `PACKWRIGHT_FIXED_CREATED_AT` environment variable is supported as a deterministic CLI test hook and is not a broader product configuration system.
- Focused CLI tests cover the successful SPEC fixture command, stdout envelope parsing, `validatePack` success, Markdown sections, missing `--file`, unreadable file, invalid JSON, invalid intake, unknown command, help output, and no generated `packs/` output files.
- Scope remained CLI compile stdout integration only. No JSON/Markdown output-file writing, `packs/` directory behavior, output directory option, overwrite policy, schema or validator changes, scoring changes, threshold changes, sequencer behavior changes, corpus changes, provider behavior changes, engine behavior changes, dependency additions, Owner acceptance claim, full Slice 6 promotion, or release readiness claim is included.
- Next eligible work may be output writing preflight after Controller acceptance. CLI-visible sample validation may be needed after acceptance, but output writing remains the main pending capability. Full Slice 6 promotion remains HOLD until output writing and final acceptance gates are complete.

## Slice 6g.x CLI SPEC Command Stdout Parity Review

- Slice 6g.x completed as a read-only parity review with no tracked files changed, no commit, and no push. The baseline remained `783f404d597eaaed051b32a83e4fe7e0cfd33cc7`.
- Direct CLI invocation emits parseable JSON stdout.
- Machine-parseable npm invocation is `npm run --silent cli -- compile --file fixtures/omniagent-intake.json`.
- Non-silent npm invocation may prepend npm wrapper/banner output to stdout: `npm run cli -- compile --file fixtures/omniagent-intake.json`.
- Non-silent npm wrapper output is not a Packwright CLI stdout defect. The non-silent command may remain acceptable for human terminal use, but it is not the machine-parseable stdout contract.
- Preserved probe evidence: direct CLI parse PASS; silent npm parse PASS; non-silent npm parse FAIL due to npm wrapper banner.
- Observed parity-review versions: npm `11.17.0`; Node `v24.16.0`.
- The Termux `/tmp` limitation is environmental and not a Packwright defect.

## Slice 6g.1 CLI Compile Integration Controller Acceptance Record

- This record is STATE.md-only and records Controller acceptance of Slice 6g.
- Slice 6g.1 records Slice 6g as IMPLEMENTED / GATED / COMMITTED / PUSHED / CONTROLLER ACCEPTED at commit `783f404d597eaaed051b32a83e4fe7e0cfd33cc7`.
- Accepted behavior: CLI parses `compile --file <path>`; reads UTF-8 JSON intake from disk; calls `engine.compile(parsedJson)`; prints parseable `{ pack, markdown }` JSON envelope to stdout; and returns concise stderr plus nonzero exit for expected user errors.
- Accepted help and test support: help text documents the compile command and SPEC example; `PACKWRIGHT_FIXED_CREATED_AT` exists as a narrow deterministic CLI test hook; `fixtures/omniagent-intake.json` exists for SPEC command parity; focused CLI coverage is colocated in `test/engine.test.ts` to avoid the current typed-lint file cap.
- Accepted stdout rule: direct CLI invocation emits parseable JSON stdout; machine-parseable npm invocation is `npm run --silent cli -- compile --file fixtures/omniagent-intake.json`; non-silent npm may prepend npm wrapper/banner output and is not the machine-parseable stdout contract.
- Boundaries preserved: no generated `packs/` output files are written; no JSON/Markdown output-file writing, `packs/` directory behavior, output directory policy, overwrite policy, schema or validator changes, engine behavior changes, scoring/threshold/sequencer/corpus/provider changes, dependency changes, full Slice 6 promotion, or release readiness claim is included.
- Output writing preflight may be prepared next after Controller acceptance. CLI-visible sample validation may be needed after acceptance, but output writing remains the main pending capability. No implementation is authorized by this record.

## Slice 6i Output Writing Foundation

- Slice 6i is controller accepted at commit `4c324082093a5d3af3c7e068988a47122325d680`.
- Added opt-in CLI output writing with `compile --file <path> --out <dir>`.
- When `--out` is omitted, the Slice 6g stdout envelope behavior is preserved and no files are written.
- When `--out <dir>` is supplied, the CLI creates the output directory if missing and writes `<packId>.json` plus `<packId>.md`.
- The JSON file contains the `ContextPack` object only. The Markdown file contains the rendered Markdown only. Stdout continues to emit the full parseable `{ pack, markdown }` envelope.
- Output filenames are derived exactly from `pack.packId` with `.json` and `.md` extensions.
- Existing target files are refused by default before either output file is written. No `--force` behavior is included.
- Expected output-writing errors use concise stderr, nonzero exit, and no stack traces for missing `--out` value, output path as file, existing target files, directory creation failure, and write failure.
- Machine-parseable compile command: `npm run --silent cli -- compile --file fixtures/omniagent-intake.json`.
- Output-writing command: `npm run --silent cli -- compile --file fixtures/omniagent-intake.json --out packs`.
- Focused tests cover no-output behavior, temp-directory output writing, JSON validation, Markdown sections, stdout parsing, missing `--out` value, output path as file, existing JSON target refusal, existing Markdown target refusal, and no stack traces for expected errors.
- Accepted Slice 6i evidence: `npm test` PASS with 9 files and 83 tests; `npm run lint` PASS; `npm audit` PASS with 0 vulnerabilities; build skipped because it writes `dist/` under the no-generated-output posture.
- Manual smoke wrote temp output files under Termux tmp with packId `pack-b3dfaec0d48d9840`; JSON and Markdown files existed; envelope/file packId matched; Markdown contained `## Learning Path` and `## AI Context Block`.
- No generated outputs or `packs/` directory are committed.
- Boundaries preserved: no schema or validator changes, no engine behavior changes, no renderer behavior changes except using existing rendered Markdown, no scoring/threshold/sequencer/corpus/provider changes, no dependency changes, no package script changes, no `.gitignore` change, no `--force`, no full Slice 6 promotion, no Owner acceptance claim, and no release readiness claim.
- Final CLI-visible sample validation remains pending after acceptance. Full Slice 6 promotion remains HOLD until final validation and Owner/Controller acceptance. Output directory policy only covers explicit `--out <dir>` for now.

## Slice 6i.1 Output Writing Foundation Controller Acceptance Record

- This record is STATE.md-only and records Controller acceptance of Slice 6i.
- Slice 6i.1 records Slice 6i as IMPLEMENTED / GATED / COMMITTED / PUSHED / CONTROLLER ACCEPTED at commit `4c324082093a5d3af3c7e068988a47122325d680`.
- Accepted behavior: CLI supports optional `--out <dir>`; no `--out` preserves the stdout envelope and writes no files; `--out <dir>` creates the output directory if missing and writes `<packId>.json` plus `<packId>.md`.
- Accepted file contents: JSON output contains the `ContextPack` object only; Markdown output contains rendered Markdown only; stdout continues to emit the full parseable `{ pack, markdown }` envelope.
- Accepted file policy: output filenames are derived from `pack.packId`; existing JSON or Markdown targets are refused before either output file is written; expected output-writing errors use concise stderr, nonzero exit, and no stack traces.
- Accepted commands: machine-parseable compile command is `npm run --silent cli -- compile --file fixtures/omniagent-intake.json`; output-writing command is `npm run --silent cli -- compile --file fixtures/omniagent-intake.json --out packs`.
- Accepted evidence: `npm test` PASS with 9 files and 83 tests; `npm run lint` PASS; `npm audit` PASS with 0 vulnerabilities; build skipped because it writes `dist/` under the no-generated-output posture.
- Accepted manual smoke: temp output files were written under Termux tmp; packId was `pack-b3dfaec0d48d9840`; JSON and Markdown files existed; envelope/file packId matched; Markdown contained `## Learning Path` and `## AI Context Block`.
- Boundaries preserved: no schema or validator changes, no engine behavior changes, no renderer behavior changes except using existing rendered Markdown, no scoring/threshold/sequencer/corpus/provider changes, no dependency changes, no package script changes, no `.gitignore` change, no committed generated output, no `--force`, no full Slice 6 promotion, no Owner acceptance claim, and no release readiness claim.
- CLI-visible sample validation is next eligible after Controller acceptance. Full Slice 6 promotion remains HOLD until final validation and Owner/Controller acceptance. Output directory policy only covers explicit `--out <dir>` for now. No later implementation is authorized by this record.

## Slice 6j CLI-Visible Sample Validation

- Slice 6j completed as a read-only CLI-visible sample validation with no tracked files changed, no commit, and no push. The baseline remained `2d9e3952ab30665b261bc49f6b249dbd57405970`.
- No-output command emitted parseable `{ pack, markdown }` JSON successfully.
- No-output validation evidence: packId `pack-b3dfaec0d48d9840`; resource count `8`; Markdown length `7133`; Markdown included `## Learning Path` and `## AI Context Block`.
- Output-writing command created `<packId>.json` and `<packId>.md` in temp output.
- Output-writing validation evidence: JSON file matched the envelope pack exactly; JSON file contained the `ContextPack` object only; Markdown file matched the envelope Markdown after trailing-newline normalization; envelope packId, JSON packId, and filenames matched.
- Overwrite validation evidence: a second output-writing run exited nonzero with exit code `1`; stderr contained a concise existing-file message: `Error: output file already exists: ...pack-b3dfaec0d48d9840.json`. Overwrite refusal is accepted.
- Temp outputs were cleaned and the worktree remained clean.
- Product-quality observation: Markdown is readable and structurally useful with clear Learning Path, extracted patterns, artifact guidance, confidence notes, and AI context block.
- Visible caveats remain: sample confidence is low; all selected resources are fallback docs; actual sequencer estimate is 122 minutes against a 30-minute request.
- The caveats are visible and honestly represented. No correction slice is required before final Slice 6 promotion consideration.
- Accepted gates: `npm test` PASS with 9 files and 83 tests; `npm run lint` PASS; `npm audit` PASS with 0 vulnerabilities; build skipped because Slice 6j was read-only validation and build writes `dist/`.

## Slice 6j.1 CLI-Visible Sample Validation Record

- This record is STATE.md-only and records Controller acceptance of Slice 6j.
- Slice 6j.1 records Slice 6j as COMPLETE / READ-ONLY / CONTROLLER ACCEPTED with no tracked files changed, no commit, and no push.
- Preserved no-output validation: command emitted parseable `{ pack, markdown }` JSON; packId was `pack-b3dfaec0d48d9840`; resource count was `8`; Markdown length was `7133`; Markdown included `## Learning Path` and `## AI Context Block`.
- Preserved output-writing validation: output-writing command created `<packId>.json` and `<packId>.md` in temp output; JSON file matched envelope pack exactly; JSON file contained the `ContextPack` object only; Markdown file matched envelope Markdown after trailing-newline normalization; envelope packId, JSON packId, and filenames matched.
- Preserved overwrite validation: second output-writing run exited nonzero with exit code `1`; stderr contained a concise existing-file message; overwrite refusal is accepted.
- Preserved product-quality finding: Markdown is readable and structurally useful; output is good enough for final Slice 6 promotion consideration; caveats remain visible for low confidence, fallback docs, and actual sequencer estimate of 122 minutes against a 30-minute request.
- No correction slice is recommended before final Slice 6 promotion consideration.
- Preserved gates: `npm test` PASS with 9 files and 83 tests; `npm run lint` PASS; `npm audit` PASS with 0 vulnerabilities; build skipped because read-only validation and build writes `dist/`.
- Remaining holds: final Slice 6 promotion remains HOLD; final Slice 6 promotion preflight/record is next eligible after Controller acceptance; output directory policy only covers explicit `--out <dir>`; no `--force`; no Owner acceptance claim; no release readiness claim; no later implementation is authorized by this record.

## Verification

- `npm run build`: PASS
- `npm test`: PASS (1 test)
- `npm run cli -- --help`: PASS
- `npm run lint`: PASS
- Native module check: PASS (no `node-gyp` dependency or install failure)
- Slice 1 `npm run build`: PASS
- Slice 1 `npm test`: PASS (6 tests)
- Slice 1 `npm run lint`: PASS
- Ajv install: PASS (pure JavaScript; no `node-gyp`)
- S1.1 `npm run build`: PASS
- S1.1 `npm test`: PASS (13 tests)
- S1.1 `npm run lint`: PASS
- S1.1 `npm audit`: PASS (0 vulnerabilities)
- Slice 2 `npm run build`: PASS
- Slice 2 `npm test`: PASS (26 tests)
- Slice 2 `npm run lint`: PASS
- Slice 2 `npm audit`: PASS (0 vulnerabilities)
- S2.1a `npm run build`: PASS
- S2.1a `npm test`: PASS (26 tests)
- S2.1a `npm run lint`: PASS
- S2.1a `npm audit`: PASS (0 vulnerabilities)
- S2.1 final `npm run build`: PASS
- S2.1 final `npm test`: PASS (27 tests)
- S2.1 final `npm run lint`: PASS
- S2.1 final `npm audit`: PASS (0 vulnerabilities)
- S2.1b `npm run build`: PASS
- S2.1b `npm test`: PASS (27 tests)
- S2.1b `npm run lint`: PASS
- S2.1b `npm audit`: PASS (0 vulnerabilities)
- S2.1c `npm run build`: PASS
- S2.1c `npm test`: PASS (27 tests)
- S2.1c `npm run lint`: PASS
- S2.1c `npm audit`: PASS (0 vulnerabilities)
- Slice 3a `npm run build`: PASS
- Slice 3a `npm test`: PASS (37 tests)
- Slice 3a `npm run lint`: PASS
- Slice 3a `npm audit`: PASS (0 vulnerabilities)
- Slice 3a.1 `npm run build`: PASS
- Slice 3a.1 `npm test`: PASS (37 tests)
- Slice 3a.1 `npm run lint`: PASS
- Slice 3a.1 `npm audit`: PASS (0 vulnerabilities)
- Slice 3b.1 `npm run build`: PASS
- Slice 3b.1 `npm test`: PASS (38 tests)
- Slice 3b.1 `npm run lint`: PASS
- Slice 3b.1 `npm audit`: PASS (0 vulnerabilities)
- Slice 3b.2 `npm run build`: PASS
- Slice 3b.2 `npm test`: PASS (38 tests)
- Slice 3b.2 `npm run lint`: PASS
- Slice 3b.2 `npm audit`: PASS (0 vulnerabilities)
- Slice 4a `npm run build`: PASS
- Slice 4a `npm test`: PASS (38 tests)
- Slice 4a `npm run lint`: PASS
- Slice 4a `npm audit`: PASS (0 vulnerabilities)
- Slice 4b `npm run build`: PASS
- Slice 4b `npm test`: PASS (46 tests)
- Slice 4b `npm run lint`: PASS
- Slice 4b `npm audit`: PASS (0 vulnerabilities)
- Slice 4d `npm run build`: PASS
- Slice 4d `npm test`: PASS (46 tests)
- Slice 4d `npm run lint`: PASS
- Slice 4d `npm audit`: PASS (0 vulnerabilities)
- Slice 5a `npm run build`: PASS
- Slice 5a `npm test`: PASS (46 tests)
- Slice 5a `npm run lint`: PASS
- Slice 5a `npm audit`: PASS (0 vulnerabilities)
- Slice 5a.1 `npm run build`: PASS
- Slice 5a.1 `npm test`: PASS (46 tests)
- Slice 5a.1 `npm run lint`: PASS
- Slice 5a.1 `npm audit`: PASS (0 vulnerabilities)
- Slice 4e `npm run build`: PASS
- Slice 4e `npm test`: PASS (48 tests)
- Slice 4e `npm run lint`: PASS
- Slice 4e `npm audit`: PASS (0 vulnerabilities)
- Slice 4e.1 `npm run build`: PASS
- Slice 4e.1 `npm test`: PASS (48 tests)
- Slice 4e.1 `npm run lint`: PASS
- Slice 4e.1 `npm audit`: PASS (0 vulnerabilities)
- Slice 5b `npm run build`: PASS
- Slice 5b `npm test`: PASS (58 tests)
- Slice 5b `npm run lint`: PASS
- Slice 5b `npm audit`: PASS (0 vulnerabilities)
- Slice 5d `npm run build`: PASS
- Slice 5d `npm test`: PASS (62 tests)
- Slice 5d `npm run lint`: PASS
- Slice 5d `npm audit`: PASS (0 vulnerabilities)
- Slice 5f `npm run build`: PASS
- Slice 5f `npm test`: PASS (62 tests)
- Slice 5f `npm run lint`: PASS
- Slice 5f `npm audit`: PASS (0 vulnerabilities)
