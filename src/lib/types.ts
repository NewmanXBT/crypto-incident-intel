export type IncidentStatus =
  | "open"
  | "partially_recovered"
  | "recovered"
  | "closed"
  | "disputed";

export type ProtocolCategory =
  | "dex"
  | "lending"
  | "bridge"
  | "perp"
  | "liquid_staking"
  | "wallet"
  | "custody"
  | "stablecoin"
  | "infra"
  | "oracle"
  | "nft"
  | "cex";

export type AttackType =
  | "private_key_compromise"
  | "multisig_compromise"
  | "governance_takeover"
  | "upgrade_authority_abuse"
  | "smart_contract_bug"
  | "reentrancy"
  | "access_control_failure"
  | "oracle_manipulation"
  | "flash_loan_assisted"
  | "bridge_validation_failure"
  | "signature_verification_bug"
  | "frontend_compromise"
  | "supply_chain_compromise"
  | "social_engineering"
  | "insider_abuse"
  | "operational_error";

export type RootCauseCategory =
  | "key_management_failure"
  | "governance_design_failure"
  | "upgrade_centralization"
  | "authz_logic_failure"
  | "accounting_logic_failure"
  | "external_dependency_failure"
  | "unsafe_default_configuration"
  | "incomplete_input_validation"
  | "offchain_process_failure"
  | "incident_response_failure";

export type ReviewStatus =
  | "new"
  | "extracted"
  | "in_review"
  | "approved"
  | "published"
  | "revised";

export type ConfidenceLevel =
  | "confirmed_fact"
  | "high_confidence_inference"
  | "open_question";

export type EvidenceType =
  | "official_statement"
  | "postmortem"
  | "onchain"
  | "audit"
  | "media"
  | "research";

export type IncidentRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: IncidentStatus;
  occurredAt: string;
  discoveredAt: string;
  protocol: {
    name: string;
    category: ProtocolCategory;
    website?: string;
  };
  chainsInvolved: string[];
  loss: {
    usd: number;
    recoveredUsd: number;
    netLossUsd: number;
  };
  classification: {
    primaryAttackType: AttackType;
    rootCauseCategory: RootCauseCategory;
    initialAccessVector: string;
    privilegeGained: string;
    exploitMechanism: string;
  };
  impactScope: string[];
  response: {
    summary: string;
    actions: string[];
  };
  review: {
    status: ReviewStatus;
    confidenceScore: number;
    sourceCount: number;
    evidenceCoverageRatio: number;
    lastReviewedAt?: string;
  };
  attackPath: Array<{
    id: string;
    title: string;
    description: string;
    confidence: ConfidenceLevel;
  }>;
  evidence: Array<{
    id: string;
    sourceName: string;
    sourceUrl: string;
    claimSupported: string;
    evidenceType: EvidenceType;
  }>;
  similarIncidentHints: string[];
};
