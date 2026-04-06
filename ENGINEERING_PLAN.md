# Engineering Plan

## Summary

The repo is moving from a static prototype to a maintainable incident intelligence system.

Implementation order:
1. Data foundation
2. Search runtime
3. Project infrastructure
4. Ingestion and review workflow
5. Grounded intelligence

The current implementation has completed the first meaningful slice of phases 1-3:
- typed incident domain model
- file-backed dataset loader
- strict validation and referential integrity checks
- published-only public dataset boundary
- search runtime over the seed dataset
- tests, lint, typecheck, build, and CI baseline

## Phase 1: Data Foundation

Goals:
- make incident records enforceable, not just descriptive
- ensure future ingestion cannot silently drift from the canonical contract
- guarantee public browse surfaces only render validated, published records

Implemented:
- `incident.schema.json` defines the canonical incident wire shape
- `src/lib/types.ts` defines the typed domain model
- `src/lib/incident-validation.ts` validates:
  - required fields
  - taxonomy values
  - loss arithmetic
  - evidence uniqueness
  - attack-path evidence references
- `src/lib/incident-repository.ts` loads incidents from `examples/` and exposes:
  - `loadIncidents`
  - `getPublishedIncidents`
  - `getIncidentBySlug`
  - `searchIncidents`
  - `getSimilarIncidents`

Rules:
- only `review.status = "published"` records enter public browse/search
- attack-path steps must reference valid evidence ids
- invalid incident files fail validation immediately

## Phase 2: Search Runtime

Goals:
- make the product genuinely search-first before adding LLM behavior
- expose explicit match rationale rather than opaque ranking

Implemented:
- `/search` now runs against the validated published dataset
- filters supported today:
  - query
  - chain
  - attack type
  - root cause
  - protocol category
  - loss band
- search results display match reasons
- incident detail pages can render local similar-incident suggestions

Next:
- add stronger ranking logic
- move from hand-authored hints to real similarity scoring
- add more incidents so search/ranking behavior becomes meaningful

## Phase 3: Project Infrastructure

Goals:
- make the repo safe to evolve
- ensure data, code, and UI changes all have automated checks

Implemented:
- `.env.example`
- `.eslintrc.json`
- `.github/workflows/ci.yml`
- `npm run validate:data`
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- README updated with current setup and repo conventions

Current CI contract:
1. install dependencies
2. validate dataset
3. run tests
4. lint
5. typecheck
6. build

## Remaining Work

### Ingestion and review workflow
- add source document model
- add draft extraction format
- add reviewer checklist and publish gate
- add revision history

### Grounded intelligence
- add retrieval contract over approved evidence only
- add grounded answer schema with citations
- add confidence gating and fallback behavior
- add evaluation fixtures for answer quality

### Product depth
- expand the seed dataset from 3 incidents to a real research corpus
- improve evidence presentation
- upgrade similarity from heuristics to a stronger retrieval layer

## Acceptance Baseline

Any future feature work should preserve these checks:
- `npm run validate:data`
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

If a change breaks any of these, the feature is not ready.
