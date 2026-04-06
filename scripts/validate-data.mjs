import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const datasetDir = path.join(rootDir, "examples");
const incidentSchema = JSON.parse(
  readFileSync(path.join(rootDir, "incident.schema.json"), "utf8")
);

const protocolCategories = incidentSchema.properties.protocol.properties.category.enum;
const attackTypes = incidentSchema.properties.classification.properties.primaryAttackType.enum;
const rootCauseCategories =
  incidentSchema.properties.classification.properties.rootCauseCategory.enum;
const reviewStatuses = incidentSchema.properties.review.properties.status.enum;
const evidenceTypes = incidentSchema.properties.evidence.items.properties.evidenceType.enum;
const confidenceLevels = incidentSchema.properties.attackPath.items.properties.confidence.enum;

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isIsoDateTime(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function validateIncidentRecord(record) {
  const errors = [];

  if (!isObject(record)) {
    return ["Incident must be an object."];
  }

  if (!isNonEmptyString(record.id) || !/^inc_[a-z0-9_]+$/.test(record.id)) {
    errors.push("Incident id must match ^inc_[a-z0-9_]+$.");
  }

  if (!isNonEmptyString(record.slug) || !/^[a-z0-9-]+$/.test(record.slug)) {
    errors.push("Incident slug must match ^[a-z0-9-]+$.");
  }

  if (!isIsoDateTime(record.occurredAt) || !isIsoDateTime(record.discoveredAt)) {
    errors.push("Incident occurredAt/discoveredAt must be valid ISO datetimes.");
  }

  if (!isObject(record.protocol) || !protocolCategories.includes(record.protocol.category)) {
    errors.push("Incident protocol category is invalid.");
  }

  if (!Array.isArray(record.chainsInvolved) || record.chainsInvolved.length === 0) {
    errors.push("chainsInvolved must be non-empty.");
  }

  if (!isObject(record.loss)) {
    errors.push("loss must be an object.");
  } else {
    if (
      !isFiniteNumber(record.loss.usd) ||
      !isFiniteNumber(record.loss.recoveredUsd) ||
      !isFiniteNumber(record.loss.netLossUsd)
    ) {
      errors.push("loss fields must be numeric.");
    } else if (
      Math.abs(record.loss.usd - record.loss.recoveredUsd - record.loss.netLossUsd) > 1
    ) {
      errors.push("netLossUsd must equal usd - recoveredUsd within tolerance.");
    }
  }

  if (
    !isObject(record.classification) ||
    !attackTypes.includes(record.classification.primaryAttackType) ||
    !rootCauseCategories.includes(record.classification.rootCauseCategory)
  ) {
    errors.push("classification contains invalid taxonomy values.");
  }

  if (
    !isObject(record.review) ||
    !reviewStatuses.includes(record.review.status) ||
    !isFiniteNumber(record.review.confidenceScore) ||
    record.review.confidenceScore < 0 ||
    record.review.confidenceScore > 1 ||
    !Number.isInteger(record.review.sourceCount) ||
    record.review.sourceCount < 1 ||
    !isFiniteNumber(record.review.evidenceCoverageRatio) ||
    record.review.evidenceCoverageRatio < 0 ||
    record.review.evidenceCoverageRatio > 1
  ) {
    errors.push("review fields are invalid.");
  }

  const evidenceIds = new Set();
  if (!Array.isArray(record.evidence) || record.evidence.length === 0) {
    errors.push("evidence must be non-empty.");
  } else {
    record.evidence.forEach((item, index) => {
      if (
        !isObject(item) ||
        !isNonEmptyString(item.id) ||
        !isNonEmptyString(item.sourceName) ||
        !isNonEmptyString(item.sourceUrl) ||
        !isNonEmptyString(item.claimSupported) ||
        !evidenceTypes.includes(item.evidenceType)
      ) {
        errors.push(`evidence[${index}] is invalid.`);
        return;
      }

      if (evidenceIds.has(item.id)) {
        errors.push(`Duplicate evidence id ${item.id}.`);
      }
      evidenceIds.add(item.id);
    });
  }

  if (!Array.isArray(record.attackPath) || record.attackPath.length === 0) {
    errors.push("attackPath must be non-empty.");
  } else {
    const stepIds = new Set();
    record.attackPath.forEach((step, index) => {
      if (
        !isObject(step) ||
        !isNonEmptyString(step.id) ||
        !isNonEmptyString(step.title) ||
        !isNonEmptyString(step.description) ||
        !confidenceLevels.includes(step.confidence)
      ) {
        errors.push(`attackPath[${index}] is invalid.`);
        return;
      }

      if (stepIds.has(step.id)) {
        errors.push(`Duplicate attack path id ${step.id}.`);
      }
      stepIds.add(step.id);

      if (!Array.isArray(step.evidenceRefs) || step.evidenceRefs.length === 0) {
        errors.push(`attackPath[${index}] must include evidenceRefs.`);
      } else {
        step.evidenceRefs.forEach((evidenceRef) => {
          if (!evidenceIds.has(evidenceRef)) {
            errors.push(`attackPath[${index}] references unknown evidence ${evidenceRef}.`);
          }
        });
      }
    });
  }

  return errors;
}

const fileNames = readdirSync(datasetDir)
  .filter((fileName) => fileName.endsWith(".json"))
  .sort();

let hasErrors = false;

for (const fileName of fileNames) {
  const absolutePath = path.join(datasetDir, fileName);
  const record = JSON.parse(readFileSync(absolutePath, "utf8"));
  const errors = validateIncidentRecord(record);

  if (errors.length > 0) {
    hasErrors = true;
    console.error(`\n${fileName}`);
    errors.forEach((error) => console.error(`- ${error}`));
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log(`Validated ${fileNames.length} incident files.`);
