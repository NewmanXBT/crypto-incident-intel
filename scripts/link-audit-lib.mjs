import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const RETRYABLE_HEAD_STATUSES = new Set([403, 405, 429, 500, 501, 502, 503, 504]);
export const REACHABLE_BUT_BLOCKED_STATUSES = new Set([401, 403, 405, 406, 409, 429]);

export function classifyHttpStatus(status) {
  if (status >= 200 && status < 400) {
    return "ok";
  }

  if (REACHABLE_BUT_BLOCKED_STATUSES.has(status)) {
    return "blocked";
  }

  return "error";
}

export function shouldRetryWithGet(status) {
  return RETRYABLE_HEAD_STATUSES.has(status);
}

export function loadEvidenceUrls(datasetDir) {
  return readdirSync(datasetDir)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort()
    .flatMap((fileName) => {
      const absolutePath = path.join(datasetDir, fileName);
      const incident = JSON.parse(readFileSync(absolutePath, "utf8"));
      const evidence = Array.isArray(incident.evidence) ? incident.evidence : [];

      return evidence.map((entry) => ({
        fileName,
        incidentSlug: incident.slug,
        evidenceId: entry.id,
        sourceName: entry.sourceName,
        sourceUrl: entry.sourceUrl
      }));
    });
}
