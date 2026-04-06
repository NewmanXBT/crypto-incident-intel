import {
  ATTACK_TYPES,
  CONFIDENCE_LEVELS,
  EVIDENCE_TYPES,
  PROTOCOL_CATEGORIES,
  REVIEW_STATUSES,
  ROOT_CAUSE_CATEGORIES
} from "@/lib/incident-constants";
import type { IncidentRecord } from "@/lib/types";

const PUBLIC_REVIEW_STATUSES = new Set<IncidentRecord["review"]["status"]>(["published"]);

export type ValidationResult =
  | { ok: true }
  | {
      ok: false;
      errors: string[];
    };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

function isIsoDateTime(value: unknown) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function pushIf(condition: boolean, errors: string[], message: string) {
  if (condition) {
    errors.push(message);
  }
}

export function validateIncidentRecord(record: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isObject(record)) {
    return { ok: false, errors: ["Incident must be an object."] };
  }

  pushIf(!isNonEmptyString(record.id), errors, "Incident id must be a non-empty string.");
  pushIf(
    !isNonEmptyString(record.id) || !/^inc_[a-z0-9_]+$/.test(record.id as string),
    errors,
    "Incident id must match ^inc_[a-z0-9_]+$."
  );
  pushIf(!isNonEmptyString(record.slug), errors, "Incident slug must be a non-empty string.");
  pushIf(
    !isNonEmptyString(record.slug) || !/^[a-z0-9-]+$/.test(record.slug as string),
    errors,
    "Incident slug must match ^[a-z0-9-]+$."
  );
  pushIf(!isNonEmptyString(record.title), errors, "Incident title must be present.");
  pushIf(!isNonEmptyString(record.summary), errors, "Incident summary must be present.");
  pushIf(!isIsoDateTime(record.occurredAt), errors, "Incident occurredAt must be a valid ISO datetime.");
  pushIf(
    !isIsoDateTime(record.discoveredAt),
    errors,
    "Incident discoveredAt must be a valid ISO datetime."
  );

  const protocol = record.protocol;
  if (!isObject(protocol)) {
    errors.push("Incident protocol must be an object.");
  } else {
    pushIf(!isNonEmptyString(protocol.name), errors, "Protocol name must be present.");
    pushIf(
      typeof protocol.category !== "string" || !PROTOCOL_CATEGORIES.includes(protocol.category),
      errors,
      `Protocol category must be one of: ${PROTOCOL_CATEGORIES.join(", ")}.`
    );
    pushIf(
      protocol.website !== undefined && !isNonEmptyString(protocol.website),
      errors,
      "Protocol website, if present, must be a non-empty string."
    );
  }

  pushIf(
    !Array.isArray(record.chainsInvolved) || record.chainsInvolved.length === 0,
    errors,
    "Incident chainsInvolved must be a non-empty array."
  );

  const loss = record.loss;
  if (!isObject(loss)) {
    errors.push("Incident loss must be an object.");
  } else {
    pushIf(!isFiniteNumber(loss.usd) || (loss.usd as number) < 0, errors, "Loss usd must be >= 0.");
    pushIf(
      !isFiniteNumber(loss.recoveredUsd) || (loss.recoveredUsd as number) < 0,
      errors,
      "Loss recoveredUsd must be >= 0."
    );
    pushIf(
      !isFiniteNumber(loss.netLossUsd) || (loss.netLossUsd as number) < 0,
      errors,
      "Loss netLossUsd must be >= 0."
    );
    if (
      isFiniteNumber(loss.usd) &&
      isFiniteNumber(loss.recoveredUsd) &&
      isFiniteNumber(loss.netLossUsd) &&
      Math.abs((loss.usd as number) - (loss.recoveredUsd as number) - (loss.netLossUsd as number)) >
        1
    ) {
      errors.push("Loss netLossUsd must equal usd - recoveredUsd within rounding tolerance.");
    }
  }

  const classification = record.classification;
  if (!isObject(classification)) {
    errors.push("Incident classification must be an object.");
  } else {
    pushIf(
      typeof classification.primaryAttackType !== "string" ||
        !ATTACK_TYPES.includes(classification.primaryAttackType),
      errors,
      `Primary attack type must be one of: ${ATTACK_TYPES.join(", ")}.`
    );
    pushIf(
      typeof classification.rootCauseCategory !== "string" ||
        !ROOT_CAUSE_CATEGORIES.includes(classification.rootCauseCategory),
      errors,
      `Root cause category must be one of: ${ROOT_CAUSE_CATEGORIES.join(", ")}.`
    );
    pushIf(
      !isNonEmptyString(classification.initialAccessVector),
      errors,
      "Initial access vector must be present."
    );
    pushIf(
      !isNonEmptyString(classification.privilegeGained),
      errors,
      "Privilege gained must be present."
    );
    pushIf(
      !isNonEmptyString(classification.exploitMechanism),
      errors,
      "Exploit mechanism must be present."
    );
  }

  pushIf(
    !Array.isArray(record.impactScope) || record.impactScope.length === 0,
    errors,
    "Incident impactScope must be a non-empty array."
  );

  const response = record.response;
  if (!isObject(response)) {
    errors.push("Incident response must be an object.");
  } else {
    pushIf(!isNonEmptyString(response.summary), errors, "Response summary must be present.");
    pushIf(
      !Array.isArray(response.actions) ||
        response.actions.length === 0 ||
        response.actions.some((action) => !isNonEmptyString(action)),
      errors,
      "Response actions must be a non-empty array of strings."
    );
  }

  const review = record.review;
  if (!isObject(review)) {
    errors.push("Incident review must be an object.");
  } else {
    pushIf(
      typeof review.status !== "string" || !REVIEW_STATUSES.includes(review.status),
      errors,
      `Review status must be one of: ${REVIEW_STATUSES.join(", ")}.`
    );
    pushIf(
      !isFiniteNumber(review.confidenceScore) ||
        (review.confidenceScore as number) < 0 ||
        (review.confidenceScore as number) > 1,
      errors,
      "Review confidenceScore must be between 0 and 1."
    );
    pushIf(
      !Number.isInteger(review.sourceCount) || (review.sourceCount as number) < 1,
      errors,
      "Review sourceCount must be an integer >= 1."
    );
    pushIf(
      !isFiniteNumber(review.evidenceCoverageRatio) ||
        (review.evidenceCoverageRatio as number) < 0 ||
        (review.evidenceCoverageRatio as number) > 1,
      errors,
      "Review evidenceCoverageRatio must be between 0 and 1."
    );
    pushIf(
      review.lastReviewedAt !== undefined && !isIsoDateTime(review.lastReviewedAt),
      errors,
      "Review lastReviewedAt, if present, must be a valid ISO datetime."
    );
  }

  const evidenceIds = new Set<string>();
  const evidence = record.evidence;
  if (!Array.isArray(evidence) || evidence.length === 0) {
    errors.push("Incident evidence must be a non-empty array.");
  } else {
    evidence.forEach((item, index) => {
      if (!isObject(item)) {
        errors.push(`Evidence item ${index} must be an object.`);
        return;
      }

      pushIf(!isNonEmptyString(item.id), errors, `Evidence item ${index} must include an id.`);
      if (isNonEmptyString(item.id)) {
        const evidenceId = item.id as string;

        if (evidenceIds.has(evidenceId)) {
          errors.push(`Evidence id ${evidenceId} must be unique within an incident.`);
        }
        evidenceIds.add(evidenceId);
      }

      pushIf(
        !isNonEmptyString(item.sourceName),
        errors,
        `Evidence item ${index} must include sourceName.`
      );
      pushIf(
        !isNonEmptyString(item.sourceUrl),
        errors,
        `Evidence item ${index} must include sourceUrl.`
      );
      pushIf(
        !isNonEmptyString(item.claimSupported),
        errors,
        `Evidence item ${index} must include claimSupported.`
      );
      pushIf(
        typeof item.evidenceType !== "string" || !EVIDENCE_TYPES.includes(item.evidenceType),
        errors,
        `Evidence item ${index} evidenceType must be one of: ${EVIDENCE_TYPES.join(", ")}.`
      );
    });
  }

  const attackPath = record.attackPath;
  if (!Array.isArray(attackPath) || attackPath.length === 0) {
    errors.push("Incident attackPath must be a non-empty array.");
  } else {
    const attackPathIds = new Set<string>();

    attackPath.forEach((step, index) => {
      if (!isObject(step)) {
        errors.push(`Attack path step ${index} must be an object.`);
        return;
      }

      pushIf(!isNonEmptyString(step.id), errors, `Attack path step ${index} must include id.`);
      if (isNonEmptyString(step.id)) {
        const stepId = step.id as string;

        if (attackPathIds.has(stepId)) {
          errors.push(`Attack path step id ${stepId} must be unique within an incident.`);
        }
        attackPathIds.add(stepId);
      }

      pushIf(
        !isNonEmptyString(step.title),
        errors,
        `Attack path step ${index} must include title.`
      );
      pushIf(
        !isNonEmptyString(step.description),
        errors,
        `Attack path step ${index} must include description.`
      );
      pushIf(
        typeof step.confidence !== "string" || !CONFIDENCE_LEVELS.includes(step.confidence),
        errors,
        `Attack path step ${index} confidence must be one of: ${CONFIDENCE_LEVELS.join(", ")}.`
      );

      const evidenceRefs = step.evidenceRefs;
      if (!Array.isArray(evidenceRefs) || evidenceRefs.length === 0) {
        errors.push(`Attack path step ${index} must include at least one evidenceRef.`);
      } else {
        evidenceRefs.forEach((evidenceRef, evidenceIndex) => {
          if (!isNonEmptyString(evidenceRef)) {
            errors.push(
              `Attack path step ${index} evidenceRef ${evidenceIndex} must be a non-empty string.`
            );
          } else if (!evidenceIds.has(evidenceRef)) {
            errors.push(`Attack path step ${index} references unknown evidence id ${evidenceRef}.`);
          }
        });
      }
    });
  }

  pushIf(
    !Array.isArray(record.similarIncidentHints) ||
      record.similarIncidentHints.some((hint) => !isNonEmptyString(hint)),
    errors,
    "similarIncidentHints must be an array of non-empty strings."
  );

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

export function isPublicIncident(record: IncidentRecord) {
  return PUBLIC_REVIEW_STATUSES.has(record.review.status);
}
