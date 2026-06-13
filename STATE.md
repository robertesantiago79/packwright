# Build State

- Current slice: Slice 3a - Provider Foundation
- Status: ACCEPTANCE PASSED - AWAITING CONTROLLER GATE REVIEW
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
- Slice 3a - Provider Foundation: IMPLEMENTED / GATED / PENDING CONTROLLER REVIEW
- Full Slice 3 Corpus Acceptance: HOLD pending a credible 60-100 entry seed corpus and OmniAgent acceptance fixture
- Slice 4 - Scoring: HOLD

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
- Full 40-60 candidate acceptance remains pending the controller-owned 60-100 entry production corpus and acceptance fixture.

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
