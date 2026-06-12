# Context Engine — P0 Build Specification
**Version:** 1.0
**Date:** 2026-06-12
**Parent document:** Context Engine — Master Operating Document v1.0 (governs; conflicts resolve to Master)
**Execution model:** Claude = controller/reviewer · Codex-in-Termux = executor · S24 = runtime validator
**Phase gate (from Master, P0):** Packs demonstrably beat raw prompting on the OmniAgent test case via the eval harness.

---

## 0. Execution Rules

1. **Slice discipline:** Build in the numbered slices below, in order. No slice begins until the prior slice passes its acceptance criteria on-device (Termux).
2. **Pause points:** Codex stops at the end of each slice and reports: files created/modified, test results, deviations. Claude reviews before promotion.
3. **No sprawl:** Anything not in this spec is out of scope for P0. Decision forks go back to the controller; Codex does not improvise architecture.
4. **Environment:** Node.js ≥ 20 LTS in Termux (ARM64-native, no compilation-heavy deps). TypeScript. No native modules requiring node-gyp unless prebuilt ARM64 binaries exist.
5. **Repo layout is fixed** (Section 1). All paths relative to repo root `context-engine/`.
6. **Validation on S24:** P0 has no UI. Validator role = run CLI commands in Termux, inspect emitted JSON/Markdown in a viewer or Chrome (file://). Every slice's acceptance criteria are executable commands with expected outputs.

---

## 1. Repository Layout

```
context-engine/
├── package.json
├── tsconfig.json
├── src/
│   ├── core/
│   │   ├── schema/          # Pack spec types + JSON Schema + validator
│   │   ├── taxonomy/        # Stage taxonomy v1
│   │   ├── intake/          # Input normalization & validation
│   │   ├── providers/       # Resource provider abstraction + implementations
│   │   ├── scoring/         # Relevance ranking
│   │   ├── sequencer/       # Path ordering
│   │   ├── packgen/         # Context pack generation
│   │   └── index.ts         # Engine facade: compile(intake) -> Pack
│   ├── adapters/
│   │   ├── cli/             # CLI adapter (P0 primary surface)
│   │   └── mcp/             # MCP server adapter (Slice 8)
│   └── eval/                # Eval harness
├── sources/                 # Curated source lists (YAML) — see Slice 3
├── packs/                   # Emitted packs (gitignored)
├── eval-runs/               # Eval artifacts (gitignored)
└── test/                    # Vitest unit + fixture tests
```

**Architecture rule (Master D3):** `src/core` has zero knowledge of any adapter. Adapters are thin. The MCP server and CLI both call `engine.compile()`.

---

## 2. Pack Format Specification v1 (core IP — exact schema)

### 2.1 TypeScript types (authoritative)

```typescript
// src/core/schema/types.ts

export type Stage = "discovery" | "prd";          // extension point: union grows post-P0
export type Depth = "light" | "medium" | "deep";
export type TimeBudget = 15 | 30 | 60;            // minutes
export type ResourceType = "doc" | "video" | "visual" | "example";
export type PathRole = "orientation" | "deepening" | "comparative" | "synthesis";
export type Confidence = "high" | "medium" | "low";

export interface Intake {
  projectName: string;                  // 1–80 chars
  description: string;                  // 1–3 sentences, 20–600 chars
  stage: Stage;
  depth?: Depth;                        // default "medium"
  timeBudgetMin?: TimeBudget;           // default 30
  sourcePreference?: Partial<Record<ResourceType, number>>; // weights 0–2, default 1
}

export interface Resource {
  id: string;                           // stable hash of url
  title: string;
  url: string;
  type: ResourceType;
  sourceProvider: string;               // which provider supplied it
  rationale: string;                    // 1–2 sentences: why it's in the stack
  estMinutes: number;                   // estimated consumption time
  scores: {
    stageRelevance: number;             // 0–1
    topicalMatch: number;               // 0–1
    signalQuality: number;              // 0–1
    composite: number;                  // weighted, see Slice 4
  };
}

export interface PathItem {
  resourceId: string;
  position: number;                     // 1-based within whole path
  role: PathRole;
}

export interface ContextPack {
  specVersion: "1.0";
  packId: string;                       // uuid
  createdAt: string;                    // ISO 8601
  intake: Intake;
  confidence: Confidence;
  confidenceNotes: string[];            // why downgraded, if applicable
  projectSummary: string;               // restated in clear product language
  resources: Resource[];                // 8–20 selected (fewer allowed if low-confidence)
  path: PathItem[];                     // every resource appears exactly once
  extractedPatterns: string[];          // bullets: what similar products emphasize
  artifactGuidance: string[];           // "what good PRDs/discovery briefs include"
  aiContextBlock: string;               // copy-paste prompt block (Markdown)
  stats: {
    candidatesConsidered: number;
    totalEstMinutes: number;            // must respect timeBudget ±20%
  };
}
```

### 2.2 JSON Schema
Generate a JSON Schema (draft 2020-12) from these types into `src/core/schema/pack.schema.json` and ship a `validatePack(obj): {valid, errors[]}` function (use `ajv`, pure-JS, ARM64-safe). Every pack emitted anywhere in the system MUST pass validation before being written to disk.

### 2.3 Portability rules
- Packs are self-contained JSON; no references to engine internals.
- A companion renderer emits `pack.md` (human-readable Markdown) from any valid pack JSON. Renderer lives in `src/core/packgen/render.ts`.

---

## 3. Stage Taxonomy v1

`src/core/taxonomy/stages.ts` — data, not code logic, so post-P0 stages are additive.

```typescript
export interface StageProfile {
  stage: Stage;
  goal: string;
  resourceMix: Record<ResourceType, number>;     // target proportions, sum ≈ 1
  pathEmphasis: Record<PathRole, number>;        // relative weight of each role
  relevanceCues: string[];                       // phrases boosting stageRelevance
  antiCues: string[];                            // phrases penalizing stageRelevance
  artifactGuidanceSeed: string[];                // baseline guidance bullets
}
```

**discovery profile:** goal = problem/market understanding. Mix biased to docs + examples (competitor/category orientation). Cues: market size, user pain, competitor, alternative, jobs-to-be-done, pricing landscape. Anti-cues: implementation detail, API reference, schema, deployment. Rule (Master 5.7): if intake describes a specific solution but stage=discovery, scoring still applies discovery cues — bias toward problem/market understanding.

**prd profile:** goal = readiness to specify. Mix biased to docs + examples of comparable product specs/feature pages; videos for UX walkthroughs. Cues: requirements, user stories, acceptance criteria, feature comparison, UX flow, scope, success metrics. Anti-cues: high-level market commentary, opinion pieces without product specifics.

Exact numeric values for mixes/weights: Codex proposes defaults in code with a `// TUNABLE` marker; Claude reviews at slice gate; tuning happens in Slice 7 against eval results.

---

## 4. Build Slices

### Slice 0 — Scaffold
**Build:** Repo per Section 1; TypeScript strict mode; Vitest; lint; `npm run build`, `npm test`, `npm run cli -- --help` all functional with a stub engine.
**Accept:** All three commands exit 0 in Termux. No native-module install failures.

### Slice 1 — Schema + Validator + Renderer
**Build:** Types (2.1), JSON Schema + ajv validator (2.2), Markdown renderer (2.3). Fixture: one hand-written valid pack + three invalid packs (missing field, path/resource mismatch, budget violation).
**Accept:** `npm test` — validator passes valid fixture, rejects all three invalids with specific errors; `render.ts` emits readable `pack.md` from the valid fixture; open `pack.md` on S24 and confirm structure (validator step).

### Slice 2 — Intake + Taxonomy
**Build:** Intake normalization (defaults, length checks, sentence-count heuristic) and stage taxonomy data per Section 3. Vague-input detection: description < 20 chars OR zero domain nouns → flag `lowConfidenceCandidate=true` carried into pipeline (Master 5.7).
**Accept:** Unit tests cover defaults, rejection of malformed intake, vague-input flagging, and both stage profiles loading.

### Slice 3 — Provider Abstraction + Curated Provider (resolves Master open item #3 for P0)
**Decision (controller-made, locked for P0):** P0 ships with a **CuratedListProvider** only; paid search APIs deferred. Rationale: zero capital, deterministic eval baseline, provider interface makes search APIs a drop-in at P1.

**Build:**
```typescript
export interface ResourceProvider {
  name: string;
  fetchCandidates(intake: Intake, cap: number): Promise<CandidateResource[]>;
}
```
- `CuratedListProvider` reads YAML files from `sources/` — each entry: url, title, type, tags[], domains[]. Matching = tag/domain overlap with intake keywords.
- Seed corpus: Rob + Claude author `sources/product-building.yaml` with 60–100 entries spanning discovery and PRD material (this is a controller deliverable, not Codex's — Codex builds the loader and matcher).
- Aggregator: dedupes by url-hash, caps candidate set at 60 (Master 5.2).
**Accept:** Given the OmniAgent-style fixture intake, aggregator returns 40–60 deduped candidates from the seed corpus; unit tests on dedupe and cap.

### Slice 4 — Scoring
**Build:** `score(candidate, intake, stageProfile)` producing the four scores in 2.1.
- `stageRelevance`: cue/anti-cue keyword scoring against stage profile (pure lexical for P0; no API cost).
- `topicalMatch`: token-overlap similarity between candidate tags/title and intake description (e.g., Jaccard or cosine on simple term vectors — no embeddings in P0).
- `signalQuality`: heuristic from curated metadata (source tier field in YAML: primary/official=1.0, reputable=0.7, other=0.4).
- `composite = 0.45*stageRelevance + 0.35*topicalMatch + 0.20*signalQuality` `// TUNABLE`
- Filter: drop composite < 0.35 `// TUNABLE`.
**Accept:** Deterministic ranking on fixtures; same intake → same ordering across runs; discovery vs prd stage on identical intake produces measurably different top-10 (test asserts ≤ 60% overlap).

### Slice 5 — Sequencer
**Build:** Select 8–20 from ranked candidates honoring (a) stage resourceMix targets, (b) timeBudget: Σ estMinutes within ±20% of budget, (c) sourcePreference weights. Assign PathRoles per stage pathEmphasis: orientation 2–3 → deepening 3–6 → comparative 2–3 → synthesis 1–2. Tiny-budget rule: if budget=15, floor drops to 5 items, prioritization aggressive (Master 5.7). Sparse-domain rule: if < 8 candidates clear the filter, emit smaller stack and set confidence=medium with note.
**Accept:** Tests for budget compliance, role ordering invariants (every resource exactly once; roles in canonical order), tiny-budget path, sparse-domain path.

### Slice 6 — Pack Generator
**Build:** Assemble ContextPack: projectSummary (template-based restatement for P0 — deterministic, no LLM call), per-resource rationale (template from role + scores + tags), extractedPatterns (aggregated from curated entries' `patterns[]` YAML field), artifactGuidance (taxonomy seed + stage), aiContextBlock (Markdown template embedding summary, patterns, ordered stack with rationales, and an instruction footer targeting the stage artifact). Confidence computed from flags accumulated upstream. Validate against schema; write `packs/<packId>.json` + `.md`.
**Accept:** End-to-end CLI run: `npm run cli -- compile --file fixtures/omniagent-intake.json` emits valid JSON + readable MD on S24. Schema validation enforced (corrupt a field in a test → write refused).

### Slice 7 — Eval Harness (phase-gate instrument)
**Build:** `src/eval/`:
1. `eval run --intake <file> --pack <file>` produces two prompt files: `with-pack.md` (aiContextBlock + artifact request) and `without-pack.md` (intake-only + identical artifact request). **No API calls in P0** — Rob executes both prompts manually in Claude (controller) and saves outputs into the run folder.
2. `eval score --run <dir>` presents a rubric scoring template; scores entered as JSON:
   - completeness (0–5), specificity (0–5), grounding (0–5), structuralQuality (0–5)
   - blind protocol: harness randomizes A/B labels and stores the key separately; scorer doesn't know which is which until `eval reveal`.
3. `eval report` aggregates runs: mean per-dimension delta, win rate.
**Accept:** Full cycle on 3 runs of the OmniAgent test case + 2 other fixture projects. **Phase gate:** with-pack wins ≥ 2/3 dimensions on average across runs. If gate fails → tuning loop on Slice 4/5 `// TUNABLE` values (bounded iteration: max 3 tuning rounds, then escalate to controller for design review).

### Slice 8 — MCP Adapter
**Build:** MCP server (stdio transport, official TypeScript SDK) exposing:
- tool `compile_context_pack(intake)` → returns pack JSON + rendered MD
- tool `list_packs()` / `get_pack(packId)`
- resource `pack://<packId>` exposing pack MD
Thin adapter only: zero logic beyond marshaling to `engine.compile()`.
**Accept:** Server registers and responds in Termux via MCP inspector (or Claude if connectable); `compile_context_pack` round-trips the fixture intake to a valid pack; core test suite untouched and green.

---

## 5. P0 Definition of Done

1. All 8 slices promoted through acceptance criteria on-device.
2. Eval gate passed (Slice 7) — recorded in `eval-runs/GATE.md` with numbers.
3. Pack spec v1 (schema file + this section 2) frozen; changes now require spec versioning.
4. Deviations log reviewed; zero unresolved decision forks.
5. Master Document amended to v1.1: P0 → complete; P1 planning unlocked (design-partner shortlist, search-API provider decision, MCP distribution).

---

## 6. Out of Scope for P0 (hard list)
LLM-based summarization/scoring (templates only), embeddings, paid search APIs, web dashboard/UI, auth, billing, multi-user anything, stages beyond discovery/PRD, autonomous resource crawling, pack marketplace.

---

*Controller deliverables owed alongside Codex execution:*
- Seed corpus `sources/product-building.yaml` (with Rob) — required before Slice 3 acceptance.
- Review at every slice gate.
- Manual LLM execution for Slice 7 eval runs.
