# Next Steps

## Immediate implementation order
1. Install dependencies and boot the Next.js app.
2. Replace the static JSON imports with a typed data access layer that reads a seed dataset directory.
3. Add schema validation in the ingestion path so seed records cannot drift from `incident.schema.json`.
4. Add evidence-aware UI components before building grounded ask.
5. Introduce filtering and ranking on the search page once the dataset has at least 10 incidents.

## Why this order
- It keeps the first slice boring: one app, one schema, a few seed records, no extra infra.
- It proves the reading experience and browse flow before adding retrieval complexity.
- It gives the repo a stable contract for future ingestion work.
