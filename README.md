Packwright
Stage-aware context compiler — turns a project + stage into a sequenced, AI-ready context pack.
Status: P0 — engine + spec construction. Slice 0 (scaffold) complete.
What this is
Packwright compiles the optimal stack of resources (docs, videos, visuals, examples) for a specific stage of project work, sequences them into an executable path, and packages the result for use by both humans and AI tools. First wedge: product discovery → PRD.
Authority documents
SPEC.md — P0 build specification (executor contract)
STATE.md — current build state, deviations, pending forks
All architecture decisions live in SPEC.md and the Master Operating Document. No agent or contributor improvises beyond them.
Commands
npm run build — TypeScript compile
npm test — Vitest suite
npm run lint — ESLint (strict)
npm run cli — CLI adapter (stub in Slice 0)
Structure
Engine-core with thin adapters: src/core (schema, taxonomy, intake, providers, scoring, sequencer, packgen) is surface-agnostic; src/adapters (cli, mcp) marshal in and out. See SPEC.md §1.
