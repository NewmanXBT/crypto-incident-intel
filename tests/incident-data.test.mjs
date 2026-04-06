import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";

const rootDir = "/Users/wuenbang/Desktop/crypto-incident-intel";

test("incident dataset validates successfully", () => {
  const output = execFileSync("node", ["scripts/validate-data.mjs"], {
    cwd: rootDir,
    encoding: "utf8"
  });

  assert.match(output, /Validated 3 incident files\./);
});

test("validation script fails on broken evidence reference", () => {
  const payload = {
    id: "inc_test_invalid_reference",
    slug: "test-invalid-reference",
    title: "Broken Evidence Reference",
    summary: "Synthetic invalid incident for validator coverage.",
    status: "closed",
    occurredAt: "2026-01-01T00:00:00Z",
    discoveredAt: "2026-01-01T01:00:00Z",
    protocol: { name: "Test", category: "bridge" },
    chainsInvolved: ["Ethereum"],
    loss: { usd: 1, recoveredUsd: 0, netLossUsd: 1 },
    classification: {
      primaryAttackType: "bridge_validation_failure",
      rootCauseCategory: "unsafe_default_configuration",
      initialAccessVector: "synthetic",
      privilegeGained: "synthetic",
      exploitMechanism: "synthetic"
    },
    impactScope: ["bridged_assets"],
    response: { summary: "synthetic", actions: ["synthetic"] },
    review: {
      status: "published",
      confidenceScore: 0.8,
      sourceCount: 1,
      evidenceCoverageRatio: 0.8
    },
    evidence: [
      {
        id: "ev_1",
        sourceName: "Synthetic",
        sourceUrl: "https://example.com",
        claimSupported: "Synthetic",
        evidenceType: "research"
      }
    ],
    attackPath: [
      {
        id: "step_1",
        title: "Synthetic",
        description: "Synthetic",
        confidence: "confirmed_fact",
        evidenceRefs: ["ev_missing"]
      }
    ],
    similarIncidentHints: ["Synthetic"]
  };

  const snippet = `
    const payload = ${JSON.stringify(payload)};
    const fs = require("node:fs");
    const path = require("node:path");
    const rootDir = ${JSON.stringify(rootDir)};
    const badFile = path.join(rootDir, "examples", "zzz-invalid-test.json");
    fs.writeFileSync(badFile, JSON.stringify(payload, null, 2));
    try {
      require("node:child_process").execFileSync("node", ["scripts/validate-data.mjs"], {
        cwd: rootDir,
        encoding: "utf8"
      });
      process.exitCode = 2;
    } catch (error) {
      process.stdout.write(error.stderr || "");
    } finally {
      fs.unlinkSync(badFile);
    }
  `;

  const output = execFileSync("node", ["-e", snippet], { cwd: rootDir, encoding: "utf8" });
  assert.match(output, /references unknown evidence ev_missing/);
});
