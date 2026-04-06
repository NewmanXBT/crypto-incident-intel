# TODOs

## Deferred Work

### Private Analyst Notes
- What: Add authenticated analyst-only notes and workspace collaboration.
- Why: Research teams may want internal context that should not appear in public incident records.
- Pros: Better team workflows and higher retention for professional users.
- Cons: Requires auth, permissions, moderation, and a second trust model.
- Context: Deferred because MVP value should come from public canonical incident quality first.
- Depends on / blocked by: Stable public incident model and clear user segmentation.

### Raw Contract Address Intake
- What: Accept raw onchain addresses as protocol risk profile input.
- Why: Power users may want to analyze unknown or emerging deployments directly from chain identifiers.
- Pros: Stronger analyst workflow and better fit for due diligence use cases.
- Cons: Normalization, attribution, and chain metadata complexity rise sharply.
- Context: Deferred because v1 should first prove ontology fit on named protocols and architecture memos.
- Depends on / blocked by: Reliable protocol/entity resolution pipeline.

### Rich Fund Flow Visualization
- What: Add interactive multi-hop fund flow graphing beyond minimal transfer summaries.
- Why: Some incidents are best understood through asset movement, not only textual attack paths.
- Pros: Improves forensic readability and analyst trust.
- Cons: High UX and infrastructure complexity for uncertain incremental MVP value.
- Context: Deferred because minimal fund flow summaries are sufficient to validate the core product wedge.
- Depends on / blocked by: Canonical entity graph quality and better transaction labeling.
