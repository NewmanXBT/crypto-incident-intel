import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  classifyHttpStatus,
  loadEvidenceUrls,
  shouldRetryWithGet
} from "../scripts/link-audit-lib.mjs";

const currentFile = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(currentFile), "..");

test("link audit status classification distinguishes ok blocked and broken links", () => {
  assert.equal(classifyHttpStatus(200), "ok");
  assert.equal(classifyHttpStatus(302), "ok");
  assert.equal(classifyHttpStatus(403), "blocked");
  assert.equal(classifyHttpStatus(429), "blocked");
  assert.equal(classifyHttpStatus(404), "error");
  assert.equal(classifyHttpStatus(500), "error");
});

test("link audit retries GET when HEAD is commonly blocked or unsupported", () => {
  assert.equal(shouldRetryWithGet(403), true);
  assert.equal(shouldRetryWithGet(405), true);
  assert.equal(shouldRetryWithGet(429), true);
  assert.equal(shouldRetryWithGet(404), false);
});

test("link audit discovers evidence URLs from the incident dataset", () => {
  const evidenceEntries = loadEvidenceUrls(path.join(rootDir, "examples"));

  assert.ok(evidenceEntries.length >= 15);
  assert.ok(
    evidenceEntries.some(
      (entry) =>
        entry.fileName === "sample-incident.json" &&
        entry.evidenceId === "ev_3" &&
        entry.sourceUrl === "https://rekt.news/wormhole-rekt/"
    )
  );
});
