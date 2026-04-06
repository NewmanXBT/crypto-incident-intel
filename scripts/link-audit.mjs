import path from "node:path";
import process from "node:process";
import { classifyHttpStatus, loadEvidenceUrls, shouldRetryWithGet } from "./link-audit-lib.mjs";

const DATASET_DIR = path.join(process.cwd(), "examples");
const REQUEST_TIMEOUT_MS = Number(process.env.LINK_AUDIT_TIMEOUT_MS ?? 12_000);
const USER_AGENT =
  process.env.LINK_AUDIT_USER_AGENT ??
  "crypto-incident-intel-link-audit/0.1 (+https://github.com/NewmanXBT/crypto-incident-intel)";

async function fetchWithTimeout(url, method) {
  const response = await fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
  });

  return response;
}

async function auditLink(entry) {
  const headResponse = await fetchWithTimeout(entry.sourceUrl, "HEAD");
  const headClassification = classifyHttpStatus(headResponse.status);

  if (headClassification === "ok" || headClassification === "blocked") {
    return {
      ...entry,
      ok: true,
      status: headResponse.status,
      method: "HEAD",
      classification: headClassification
    };
  }

  if (!shouldRetryWithGet(headResponse.status)) {
    return {
      ...entry,
      ok: false,
      status: headResponse.status,
      method: "HEAD",
      classification: headClassification
    };
  }

  const getResponse = await fetchWithTimeout(entry.sourceUrl, "GET");
  const getClassification = classifyHttpStatus(getResponse.status);

  return {
    ...entry,
    ok: getClassification !== "error",
    status: getResponse.status,
    method: "GET",
    classification: getClassification
  };
}

function formatResultLine(result) {
  const prefix = result.ok ? "PASS" : "FAIL";
  const suffix =
    result.classification === "blocked" ? "reachable but bot-blocked" : result.classification;

  return `${prefix} [${result.status} via ${result.method}] ${result.fileName}#${result.evidenceId} ${result.sourceUrl} (${suffix})`;
}

async function main() {
  const evidenceEntries = loadEvidenceUrls(DATASET_DIR);
  const failures = [];
  const warnings = [];

  for (const entry of evidenceEntries) {
    try {
      const result = await auditLink(entry);

      if (result.ok) {
        if (result.classification === "blocked") {
          warnings.push(result);
        }
        continue;
      }

      failures.push(result);
    } catch (error) {
      failures.push({
        ...entry,
        ok: false,
        method: "HEAD",
        status: "ERR",
        classification: "error",
        errorMessage: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const summary = `Audited ${evidenceEntries.length} evidence links across ${new Set(
    evidenceEntries.map((entry) => entry.fileName)
  ).size} incident files.`;

  if (warnings.length > 0) {
    console.warn(summary);
    console.warn(`${warnings.length} links were reachable but blocked automated verification:`);
    for (const warning of warnings) {
      console.warn(formatResultLine(warning));
    }
  } else {
    console.log(summary);
  }

  if (failures.length > 0) {
    console.error(`${failures.length} broken evidence links detected:`);
    for (const failure of failures) {
      const detail = "errorMessage" in failure ? ` (${failure.errorMessage})` : "";
      console.error(`${formatResultLine(failure)}${detail}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("All evidence links passed link audit.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
