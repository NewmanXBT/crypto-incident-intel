import incidentSchema from "../../incident.schema.json";

type SchemaEnumRecord = Record<string, { enum?: string[] }>;

const rootProperties = incidentSchema.properties as Record<string, unknown>;
const classificationProperties = (
  rootProperties.classification as { properties: SchemaEnumRecord }
).properties;
const protocolProperties = (
  rootProperties.protocol as { properties: SchemaEnumRecord }
).properties;
const reviewProperties = (rootProperties.review as { properties: SchemaEnumRecord }).properties;
const evidenceItems = rootProperties.evidence as {
  items: { properties: SchemaEnumRecord };
};
const attackPathItems = rootProperties.attackPath as {
  items: { properties: SchemaEnumRecord };
};

export const PROTOCOL_CATEGORIES = protocolProperties.category?.enum ?? [];
export const ATTACK_TYPES = classificationProperties.primaryAttackType?.enum ?? [];
export const ROOT_CAUSE_CATEGORIES = classificationProperties.rootCauseCategory?.enum ?? [];
export const REVIEW_STATUSES = reviewProperties.status?.enum ?? [];
export const EVIDENCE_TYPES = evidenceItems.items.properties.evidenceType?.enum ?? [];
export const CONFIDENCE_LEVELS = attackPathItems.items.properties.confidence?.enum ?? [];
