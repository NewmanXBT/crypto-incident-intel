# Next Steps

## Immediate implementation order
1. Install dependencies and boot the Next.js app.
2. Replace `sample-data.ts` with a typed data access layer.
3. Add a search route backed by seed incidents.
4. Add schema validation in the ingestion path.
5. Introduce evidence-aware UI components before building grounded ask.

## Why this order
- It keeps the first slice boring: one app, one schema, one seed record.
- It proves the reading experience before adding retrieval complexity.
- It gives the repo a stable contract for future ingestion work.
