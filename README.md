# crypto-incident-intel

Structured intelligence for crypto exploits and theft incidents.

## Current State

The repo currently includes:
- a normalized incident schema
- a seed dataset of published incidents
- a validated file-backed incident repository
- search, incident, and protocol-risk browse surfaces
- data validation, tests, typecheck, build, and CI baselines

## Local Development

```bash
npm install
npm run validate:data
npm test
npm run lint
npm run typecheck
npm run build
npm run dev
```

## Key Files

- [PLAN.md](./PLAN.md): product and architecture direction
- [ENGINEERING_PLAN.md](./ENGINEERING_PLAN.md): implementation roadmap
- [DESIGN.md](./DESIGN.md): visual system for the product
- [incident.schema.json](./incident.schema.json): canonical incident contract
- [examples/](./examples): current seed dataset

## Notes

- Public search currently includes only incidents with `review.status = "published"`.
- The current data source is the local `examples/` directory; this is the boundary that future ingestion work will replace.
