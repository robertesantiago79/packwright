# Build State

- Current slice: Slice 4d - Scoring Promotion Record
- Status: RECORDED / GATED / PENDING CONTROLLER CONFIRMATION
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
- Slice 4+ Later Slices: HOLD
- Next eligible work: the next SPEC slice preflight/planning under a separate Owner/Controller packet; not authorized by this closeout.

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
