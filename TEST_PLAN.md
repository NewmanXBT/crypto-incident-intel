# Test Plan
Generated from `PLAN.md` for MVP planning.

## Affected Pages/Routes
- `/` or `/search` — verify search, filters, result rationale, and zero-result recovery paths.
- `/incidents/[slug]` — verify snapshot, attack path ordering, evidence display, and similar incidents.
- `/protocol-risk` — verify name-based and memo-based analysis inputs plus low-confidence handling.
- `/ask` or ask module within search — verify grounded answers cite approved evidence only.
- `/admin/incidents/[id]/review` — verify human approval workflow for critical fields.

## Key Interactions To Verify
- Search by text and filters, then broaden filters from the empty state.
- Open an incident and trace every top-level claim back to supporting evidence.
- Compare similar incidents and confirm the explanation for the match is visible.
- Submit a vague protocol risk prompt and verify the system asks for better input instead of fabricating precision.
- Trigger a grounded ask response with thin evidence and verify a low-confidence warning is shown.

## Edge Cases
- Conflicting source documents with different loss amounts.
- Incident page with incomplete fund flow data.
- Retrieval error during grounded ask.
- Missing embeddings for a newly published incident.
- Long titles, dense entity sets, and multi-chain incidents.

## Critical Paths
- Source ingestion -> human review -> publish canonical incident -> incident appears in search.
- Published incident -> similarity index refresh -> similar incidents render with rationale.
- User question -> retrieve approved evidence -> produce grounded answer with citations.
- Protocol memo input -> retrieve analog incidents -> render controls checklist and caveats.
