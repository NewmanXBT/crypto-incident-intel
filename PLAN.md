# Crypto Incident Intelligence Platform

## Working Title
`crypto-incident-intel`

## One-Line Product Definition
A structured intelligence layer for crypto exploits and theft events: every incident is normalized, comparable, and queryable.

## Product Thesis
The market already has incident reporting, postmortems, dashboards, and ad hoc X threads. What is still missing is a canonical system that turns each event into a consistent causal object:

- what failed
- how access was gained
- what privileges were abused
- how funds moved
- what response controls existed
- what eventually happened to user funds

The product should not behave like an "LLM Wikipedia." It should behave like a security intelligence system with a conversational interface on top.

## Users
### 1. Security researchers and auditors
Need fast access to structurally similar incidents and reusable failure patterns.

### 2. Investors and research teams
Need to compare a protocol's architecture against historical failure modes.

### 3. Protocol teams
Need a pre-launch and post-incident reference system for threat modeling and incident response.

### 4. Advanced users and analysts
Need to understand why an event happened without reading dozens of fragmented sources.

## Core Jobs To Be Done
1. Given a protocol, show which historical incidents it most resembles.
2. Given an attack pattern, show all comparable incidents and outcomes.
3. Given one incident, show the shortest high-confidence path from initial access to loss.
4. Given a protocol design, surface the most relevant historical failure modes.

## Non-Goals
- Not a generic crypto news site.
- Not a pure chatbot with ungrounded answers.
- Not a full onchain forensics product in v1.
- Not a broad consumer social product.
- Not a cross-domain security encyclopedia beyond crypto incidents in the first version.

## MVP Scope
The MVP will focus on 150-300 high-signal incidents from 2021-2026 across EVM, Solana, bridges, wallets, custody, and major DeFi protocols.

### Step 0 scope challenge
- Reuse existing public incident narratives and postmortems as source material instead of inventing a new reporting workflow.
- Keep the MVP as a search-first incident explorer with grounded Q&A layered on top; do not start with a chat-first product.
- Keep the initial system inside one web app and one database; do not introduce separate graph infrastructure, a dedicated search service, or a bespoke data pipeline platform.
- Treat 150-300 incidents as the upper bound for MVP planning, but prove the schema with the first 20 before scaling ingestion.
- Complexity guardrail: MVP should be implementable with one Next.js app, one Postgres database, one background worker path, and no more than two material infra dependencies beyond the model providers.

### MVP decisions locked for planning
- v1 will be public-read-only.
- v1 protocol risk input will support protocol names and freeform architecture descriptions, but not raw contract address ingestion.
- v1 launch will prioritize EVM plus Solana depth instead of broad multi-chain coverage.
- v1 ingestion will be human-in-the-loop for all critical fields.

### Must ship in v1
- canonical incident pages
- structured taxonomy and schema
- source-backed evidence model
- similarity search across incidents
- timeline and attack path view
- filter/search by chain, attack type, privilege path, and loss size
- LLM-powered grounded summaries and comparison answers

### Explicitly deferred from v1
- real-time alerting
- fully automated onchain tracing
- user accounts and collaboration workflows
- premium analyst workflows
- broad coverage of every small exploit

## User Experience
### Primary surfaces
1. Incident detail page
2. Search and filter page
3. Similar incidents page
4. Protocol risk profile page

### Primary interaction model
The product defaults to structured browsing, not chat. Chat is a secondary interaction layer that translates user intent into grounded retrieval over the incident graph.

## Information Architecture
```text
Home
|
+-- Search / Explore
|   |
|   +-- Filtered incident results
|   +-- Taxonomy entry points
|   +-- Saved query patterns (later)
|
+-- Incident
|   |
|   +-- Snapshot
|   +-- Attack path
|   +-- Evidence
|   +-- Fund flow
|   +-- Similar incidents
|   +-- Lessons
|
+-- Protocol Risk Profile
|   |
|   +-- Architecture summary
|   +-- Historical analogs
|   +-- Top failure patterns
|   +-- Controls checklist
|
+-- Ask
    |
    +-- Grounded answer
    +-- Supporting incidents
    +-- Evidence links
```

## Design Principles
- Trust before novelty: every important claim must be grounded in evidence.
- Structured first: pages should make comparison easier than reading a long article.
- Facts and inference must be visually distinct.
- Serious but not sterile: the product should feel like a research terminal, not a news blog.
- Mobile is supported, but desktop is the primary research environment for v1.

## UX Hierarchy Per Page
### Incident page
1. What happened
2. How it happened
3. How much was lost and recovered
4. What evidence supports the story
5. Which incidents are structurally similar

### Search page
1. Query and filters
2. Result set with meaningful facets
3. Why each result matched

### Protocol risk page
1. Architecture summary
2. Closest historical analogs
3. Main control failures to worry about

## Screen-Level Layout Notes
### Search and explore
```text
+----------------------------------------------------------------------------------+
| Query bar                             | Fast filters: chain / type / loss / role |
+----------------------------+-----------------------------------------------------+
| Sticky facet rail          | Result list                                         |
| - attack type              | - title, loss, chain                               |
| - root cause               | - why it matched                                   |
| - privilege gained         | - confidence/evidence density                      |
| - response outcome         | - quick compare checkbox                           |
+----------------------------+-----------------------------------------------------+
```

### Incident detail
```text
+----------------------------------------------------------------------------------+
| Title + amount + chain + status                                                  |
+----------------------------------+-----------------------------------------------+
| Snapshot rail                    | Attack path narrative                         |
| - date                           | 1. initial access                             |
| - loss / recovered               | 2. privilege gained                           |
| - primary type                   | 3. exploit execution                          |
| - root cause                     | 4. funds moved                                |
+----------------------------------+-----------------------------------------------+
| Evidence table                                                                   |
+----------------------------------------------------------------------------------+
| Similar incidents table                  | Lessons / controls checklist           |
+----------------------------------------------------------------------------------+
```

### Protocol risk profile
```text
+----------------------------------------------------------------------------------+
| Input: protocol name or architecture memo                                         |
+----------------------------------------------------------------------------------+
| Architecture summary                | Confidence / evidence caveats              |
+------------------------------------+---------------------------------------------+
| Historical analogs                 | Controls checklist                          |
+------------------------------------+---------------------------------------------+
| Suggested next investigations                                                     |
+----------------------------------------------------------------------------------+
```

## Interaction States
```text
FEATURE                | LOADING                          | EMPTY                                  | ERROR                                      | SUCCESS                               | PARTIAL
-----------------------|----------------------------------|----------------------------------------|--------------------------------------------|---------------------------------------|--------------------------------------------
Search results         | Skeleton rows + active filters   | "No matching incidents" + clear action | Query failed + retry + keep current query  | Ranked results with match rationale   | Results loaded but some facets unavailable
Incident page          | Skeleton snapshot + timeline     | N/A                                    | Incident unavailable + source fallback     | Full incident narrative and evidence  | Some evidence or fund flow still pending
Protocol risk profile  | Loading architecture analysis    | "No profile yet" + analyze CTA         | Analysis failed + fallback to incidents    | Analog incidents + controls checklist | Incidents shown without full profile
Grounded ask           | Streaming answer with citations  | Prompt suggestions                      | Retrieval/answering failed + retry         | Answer with supporting evidence       | Answer available but low-confidence flag
```

## Emotional Arc
```text
STEP | USER DOES                     | USER FEELS             | PRODUCT MUST DELIVER
-----|-------------------------------|------------------------|------------------------------
1    | Lands on product              | Skeptical              | Immediate clarity and seriousness
2    | Opens an incident             | Curious                | Fast orientation in under 30 seconds
3    | Traces attack path            | Focused                | Clear causal structure
4    | Checks supporting evidence    | Trust-seeking          | Confidence through citations
5    | Compares similar incidents    | Pattern recognition    | Insight, not just information
6    | Uses protocol risk profile    | Decision-oriented      | Actionable historical analogy
```

## Responsive Behavior
- Desktop is the default research layout with sticky filters and split-pane reading where helpful.
- Tablet collapses the left rail into a slide-over filter drawer while keeping result rationale visible.
- Mobile converts dense tables into stacked comparison rows with section jump links for snapshot, attack path, evidence, and similar incidents.
- Mobile incident pages keep the top snapshot compact and pin a "Jump to evidence" action because trust is the main mobile pain point.

## Accessibility Details
- Search results must be fully navigable by keyboard without opening a mouse-only comparison mode.
- Attack path steps use semantic ordered lists so screen readers preserve causal order.
- Fact, inference, and unresolved claim states use text labels and icons in addition to color.
- Evidence citations expose source name, date, and claim support text to assistive tech.
- Streaming grounded answers announce status changes accessibly and expose citation links in reading order.

## Data Model
### Core tables
1. `incidents`
2. `entities`
3. `incident_entities`
4. `attack_paths`
5. `evidence`
6. `fund_flows`
7. `labels`

### Canonical incident fields
```text
id
slug
title
summary
occurred_at
discovered_at
chain_family
chains_involved
protocol_category
incident_status
loss_usd
recovered_usd
net_loss_usd
primary_attack_type
root_cause_category
initial_access_vector
privilege_gained
exploit_mechanism
impact_scope
response_summary
recovery_summary
confidence_score
canonical_source_url
created_at
updated_at
```

### Additional required fields before implementation
```text
source_count
evidence_coverage_ratio
review_status
reviewed_by
last_reviewed_at
public_notes
internal_notes
```

## Taxonomy V1
### Protocol categories
- dex
- lending
- bridge
- perp
- liquid_staking
- wallet
- custody
- stablecoin
- infra
- oracle
- nft
- cex

### Attack types
- private_key_compromise
- multisig_compromise
- governance_takeover
- upgrade_authority_abuse
- smart_contract_bug
- reentrancy
- access_control_failure
- oracle_manipulation
- flash_loan_assisted
- bridge_validation_failure
- signature_verification_bug
- frontend_compromise
- supply_chain_compromise
- social_engineering
- insider_abuse
- operational_error

### Root cause categories
- key_management_failure
- governance_design_failure
- upgrade_centralization
- authz_logic_failure
- accounting_logic_failure
- external_dependency_failure
- unsafe_default_configuration
- incomplete_input_validation
- offchain_process_failure
- incident_response_failure

## Evidence Model
Each claim in an incident should resolve to one of three layers:

1. Confirmed fact
2. High-confidence inference
3. Open question / unresolved claim

Every claim shown in the UI must have an evidence backlink. Unsupported claims do not ship.

## LLM Role
### LLM is allowed to do
- source summarization
- field extraction drafts
- attack path drafts
- similarity candidate generation
- grounded natural-language answers

### LLM is not allowed to do
- invent facts
- perform ungrounded attacker attribution
- override structured evidence
- silently collapse uncertainty

## Retrieval and Similarity
Similarity should combine three layers:

1. structured taxonomy overlap
2. attack path overlap
3. semantic similarity of grounded summaries

```text
similarity_score =
0.45 * taxonomy_overlap
+ 0.35 * attack_path_overlap
+ 0.20 * semantic_similarity
```

## Ingestion Workflow
```text
Raw Sources
   |
   v
Collector
   |
   v
LLM Extraction Draft
   |
   v
Human Review of Critical Fields
   |
   v
Canonical Incident Record
   |
   +--> Search Index
   +--> Similarity Index
   +--> Incident Page
```

### Ingestion states
```text
new -> extracted -> in_review -> approved -> published -> revised
```

### Review rules
- `loss_usd`, `recovered_usd`, `root_cause_category`, `privilege_gained`, and any attacker identity claim require human approval.
- Incidents with unresolved evidence conflicts can publish only if the conflict is surfaced explicitly on the page.
- Any answer generation path must exclude `new`, `extracted`, and `in_review` incidents from public retrieval.

## System Architecture
### Proposed stack
- frontend: Next.js app router
- backend: Next.js server actions / route handlers for MVP
- database: Postgres
- search: Postgres full-text plus vector index for MVP
- embeddings: hosted embedding model
- LLM: grounded answer generation with citations
- jobs: simple queue-backed ingestion workers after initial manual seeding

### Why this stack
The MVP should bias toward boring, integrated primitives. The product's risk is ontology quality and evidence discipline, not infrastructure throughput.

### Architecture boundaries
- Web app owns public read flows and admin review flows for MVP.
- Postgres is the system of record for incidents, evidence, and reviewer decisions.
- Vector search is an index attached to incident/evidence records, not a second source of truth.
- Background jobs own extraction, embedding refresh, and similarity materialization.
- LLM calls are best-effort enrichments around a deterministic retrieval core.

## Architecture Diagram
```text
                 +----------------------+
                 |  Source Documents    |
                 | rekt / postmortems / |
                 | blogs / reports      |
                 +----------+-----------+
                            |
                            v
                 +----------------------+
                 | Ingestion Pipeline   |
                 | extract -> review    |
                 +----------+-----------+
                            |
                            v
+-------------+    +----------------------+    +----------------------+
| User Query  +--->| Retrieval Layer      +--->| Grounded Answering   |
+------+------+    | SQL + vector + graph |    | summary + citations  |
       |           +----------+-----------+    +----------+-----------+
       |                      |                           |
       v                      v                           v
+-------------+    +----------------------+    +----------------------+
| UI Surfaces |    | Postgres             |    | Similarity Engine    |
| pages/chat  |    | incidents + evidence |    | structured + semantic|
+-------------+    +----------------------+    +----------------------+
```

## Failure Modes To Design For
- Source extraction produces a plausible but wrong root cause.
- Multiple sources disagree on loss size or timeline.
- Similarity search returns semantically similar but causally irrelevant incidents.
- A user asks a broad question that should resolve to search, not a confident answer.
- An incident exists with incomplete public evidence.

## Failure Mode Matrix
```text
CODEPATH                    | FAILURE                              | TEST? | ERROR HANDLING? | USER IMPACT
----------------------------|--------------------------------------|-------|-----------------|-------------------------------
Search query                | Filter/query mismatch                | yes   | yes             | Incorrect or empty results
Incident rendering          | Missing evidence join                | yes   | yes             | Partial page with visible gap
Similarity ranking          | Embedding drift / bad overlap        | yes   | partial         | Weak recommendations
Grounded ask                | Prompt injection in source text      | yes   | yes             | Wrong answer if unguarded
Grounded ask                | Retrieval returns thin evidence      | yes   | yes             | Low-confidence answer banner
Protocol risk profile       | Input too vague                      | yes   | yes             | Guided fallback instead of fake precision
Ingestion approval          | Reviewer misses critical conflict    | partial | partial        | Bad canonical record
```

## Reviewable UI Spec
### Search page
- Dense, research-grade table/list hybrid rather than generic marketing cards.
- Filters remain visible on desktop.
- Each result shows why it matched.
- Empty state suggests example queries and taxonomy pivots.

### Incident page
- Snapshot rail at the top.
- Attack path rendered as a numbered narrative sequence.
- Evidence section clearly separates direct sources from inferred conclusions.
- Similar incidents shown as compact comparative rows, not decorative cards.

### Protocol risk page
- Input can be a protocol name or architecture description.
- Output is a structured memo with analog incidents and controls checklist.
- Low-confidence answers are clearly labeled.

### Empty states
- Search empty state: "No incidents matched this filter set" plus one-click actions to broaden by chain, attack type, or loss range.
- Protocol risk empty state: explain what inputs work best and provide two realistic examples.
- Similar incidents empty state: explain that the record lacks enough normalized structure yet and point users to evidence or taxonomy pages.

### Error states
- Search failures preserve the current query and filters.
- Incident page failures show the canonical source links if the synthesized page is unavailable.
- Grounded ask failures fall back to linked incident search instead of a generic error toast.

## Accessibility and Responsive Requirements
- Full keyboard navigation across filters, tabs, and evidence links.
- Minimum 44px tap targets on mobile.
- Clear focus states for every interactive control.
- Color is never the only signal distinguishing fact vs inference.
- Incident and search pages should reflow intentionally for tablet and mobile, not just stack blindly.

## Security and Trust Requirements
- Evidence and claim rendering must resist prompt injection from source text.
- Stored source text should be treated as untrusted input.
- Generated answers must cite only retrieved, approved evidence objects.
- Admin ingestion workflows require explicit human approval for critical fields.
- Every canonical incident change should be versioned.

## Engineering Plan
### Phase 0 deliverables
- `incident.schema.json`
- one sample `incident.json`
- one sample `protocol-risk-profile.json`
- ingestion reviewer checklist
- seed dataset manifest for first 20 incidents

### Phase 1 implementation slices
1. Data model and seed fixtures
2. Incident detail page
3. Search and filter page
4. Admin review flow
5. Evidence rendering and citation model

### Phase 2 implementation slices
1. Similarity computation and explanation
2. Grounded ask flow
3. Protocol risk profile
4. Quality metrics and reviewer tooling

## Test Diagram
```text
USER FLOW / CODEPATH
|
+-- Search incidents
|   +-- query text only
|   +-- query + filters
|   +-- zero-result path
|   +-- backend retrieval error
|
+-- Read incident
|   +-- snapshot renders
|   +-- attack path renders in order
|   +-- evidence links support visible claims
|   +-- partial evidence path
|
+-- Compare similar incidents
|   +-- similarity ranking exists
|   +-- rationale visible
|   +-- low-confidence similarity fallback
|
+-- Ask grounded question
|   +-- retrieved evidence supports answer
|   +-- low-confidence answer path
|   +-- prompt injection defense path
|
+-- Generate protocol risk profile
    +-- valid protocol name
    +-- freeform architecture memo
    +-- vague input fallback
```

## Test Coverage Requirements
- Unit tests for schema validation, evidence gating, similarity scoring, and prompt-injection guardrails.
- Integration tests for search retrieval, incident rendering, grounded ask retrieval-to-answer path, and protocol risk profile generation.
- Snapshot or structured rendering tests for fact vs inference UI states.
- Seed-data contract tests to guarantee required incident fields are present before publish.
- Regression fixtures for at least five representative incident classes: signer compromise, governance abuse, bridge validation failure, contract bug, and frontend compromise.

## Metrics
### Product metrics
- time to orient on an incident
- % of sessions using similarity exploration
- % of grounded answers with clicked citations
- repeat usage from researchers and protocol teams

### Quality metrics
- extraction precision on critical fields
- evidence coverage per incident
- hallucination rate in grounded answers
- similarity relevance judged by expert reviewers

## Delivery Plan
### Phase 0: ontology and seed set
- define schema v1
- define taxonomy v1
- hand-curate first 20 incidents
- validate evidence model

### Phase 1: canonical incident explorer
- build ingestion editor
- build incident page
- build search and filter surface
- build evidence and timeline UI

### Phase 2: similarity and protocol risk profile
- implement similarity ranking
- implement grounded ask
- implement protocol risk profile flow

## Test Plan
### Core product paths
1. Search for incidents by attack type and loss range.
2. Open an incident and verify all top-level claims are evidence-backed.
3. Compare similar incidents and verify ranking rationale is visible.
4. Ask a question and verify the answer cites only retrieved evidence.
5. Generate a protocol risk profile and verify uncertainty handling.

### Edge cases
- no results
- partial evidence
- conflicting source documents
- stale or missing embeddings
- low-confidence answer path
- long protocol names and unusually dense entity graphs

## Code Quality Expectations
- Prefer explicit schemas and validation over flexible untyped ingestion blobs.
- Keep retrieval, ranking, and rendering boundaries separate enough to test independently.
- Avoid introducing a dedicated graph database until Postgres plus normalized joins prove insufficient.
- Minimize abstraction count early; one clear incident domain module is better than many thin services.

## Performance Expectations
- Search results should return fast enough for interactive filtering on the seed dataset without a dedicated search cluster.
- Similarity ranking should precompute or cache top related incidents per record after publish.
- Grounded ask should cap retrieved evidence count to control latency and cost.
- Embedding refresh and similarity recompute should happen asynchronously off the request path.

## NOT in scope
- Full SOC-style alerting because it expands the product from historical intelligence into real-time infrastructure.
- Automated forensic attribution because legal and epistemic risk is too high for MVP.
- Cross-chain graph visualization beyond minimal fund flow because it would consume an innovation token before ontology fit is proven.
- Consumer-friendly editorial storytelling because the initial wedge is research utility, not media reach.
- Raw contract address ingestion because it creates normalization and attribution complexity before schema fit is proven.
- Private analyst workspaces because collaboration workflow would distract from public intelligence quality.

## What already exists
- `rekt.news` and similar sources provide incident narratives and indexes, but not canonical structured comparison.
- Official postmortems provide direct evidence but are fragmented and inconsistent.
- Onchain analytics providers provide slices of fund tracing, but not a reusable incident ontology.
- Generic LLM chat can summarize incidents, but cannot be trusted as a canonical incident memory layer without structured grounding.

## Open Questions
1. What level of manual review throughput is acceptable before automation pressure starts pushing architecture changes?
2. Should the first public release optimize for credibility with a narrow, deeply reviewed corpus or for breadth with more visible coverage gaps?
3. When should private analyst notes become a product priority relative to public-read utility?

## Next Concrete Build Steps
1. Create `incident.schema.json`.
2. Create one sample canonical incident JSON document.
3. Create seed ingestion checklist for human reviewers.
4. Build search-first UI wireframe in the repo after plan review is complete.
5. Implement the seed ingestion/admin review loop before the public ask experience.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | not run | not run |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | not run | not run |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | scope reduced to boring MVP, 0 critical gaps, test diagram added |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 6/10 -> 8/10, desktop-first research IA and states clarified |

**UNRESOLVED:** 3 product-level questions remain in `Open Questions`.
**VERDICT:** ENG + DESIGN CLEARED for MVP planning. CEO review optional if you want to revisit wedge and go-to-market before implementation.
