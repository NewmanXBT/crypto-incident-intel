import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { isPublicIncident, validateIncidentRecord } from "@/lib/incident-validation";
import type { IncidentRecord } from "@/lib/types";

const DATASET_DIR = path.join(process.cwd(), "examples");

function readIncidentFiles() {
  return readdirSync(DATASET_DIR)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort();
}

function parseIncidentFile(fileName: string): IncidentRecord {
  const absolutePath = path.join(DATASET_DIR, fileName);
  const parsed = JSON.parse(readFileSync(absolutePath, "utf8")) as unknown;
  const validation = validateIncidentRecord(parsed);

  if (!validation.ok) {
    const details = validation.errors.map((error) => `- ${error}`).join("\n");
    throw new Error(`Invalid incident file ${fileName}:\n${details}`);
  }

  return parsed as IncidentRecord;
}

export const loadIncidents = cache(() => {
  return readIncidentFiles().map(parseIncidentFile);
});

export function getPublishedIncidents() {
  return loadIncidents().filter(isPublicIncident);
}

export function getIncidentBySlug(slug: string) {
  return getPublishedIncidents().find((incident) => incident.slug === slug);
}

export function getFeaturedIncidents(limit?: number) {
  const incidents = getPublishedIncidents()
    .slice()
    .sort((left, right) => right.loss.usd - left.loss.usd);

  return typeof limit === "number" ? incidents.slice(0, limit) : incidents;
}

export function getProtocolRiskAnalogs(limit = 3) {
  return getFeaturedIncidents(limit);
}

export type SearchFilters = {
  q?: string;
  chain?: string;
  attackType?: IncidentRecord["classification"]["primaryAttackType"];
  rootCause?: IncidentRecord["classification"]["rootCauseCategory"];
  protocolCategory?: IncidentRecord["protocol"]["category"];
  lossBand?: "under_250m" | "250m_to_500m" | "over_500m";
};

export type IncidentSearchResult = {
  incident: IncidentRecord;
  matchReasons: string[];
};

function matchesLossBand(usdLoss: number, lossBand?: SearchFilters["lossBand"]) {
  if (!lossBand) {
    return true;
  }

  if (lossBand === "under_250m") {
    return usdLoss < 250_000_000;
  }

  if (lossBand === "250m_to_500m") {
    return usdLoss >= 250_000_000 && usdLoss <= 500_000_000;
  }

  return usdLoss > 500_000_000;
}

export function searchIncidents(filters: SearchFilters): IncidentSearchResult[] {
  const query = filters.q?.trim().toLowerCase();

  return getPublishedIncidents()
    .map((incident) => {
      const reasons: string[] = [];

      if (query) {
        const haystack = [
          incident.title,
          incident.summary,
          incident.protocol.name,
          incident.classification.primaryAttackType,
          incident.classification.rootCauseCategory,
          incident.classification.privilegeGained
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(query)) {
          return null;
        }

        reasons.push(`Matches "${filters.q}" in the normalized incident record.`);
      }

      if (filters.chain) {
        const matched = incident.chainsInvolved.some(
          (chain) => chain.toLowerCase() === filters.chain?.toLowerCase()
        );
        if (!matched) {
          return null;
        }
        reasons.push(`Touches ${filters.chain}.`);
      }

      if (filters.attackType) {
        if (incident.classification.primaryAttackType !== filters.attackType) {
          return null;
        }
        reasons.push(`Shares attack type ${filters.attackType}.`);
      }

      if (filters.rootCause) {
        if (incident.classification.rootCauseCategory !== filters.rootCause) {
          return null;
        }
        reasons.push(`Shares root cause ${filters.rootCause}.`);
      }

      if (filters.protocolCategory) {
        if (incident.protocol.category !== filters.protocolCategory) {
          return null;
        }
        reasons.push(`Belongs to protocol category ${filters.protocolCategory}.`);
      }

      if (!matchesLossBand(incident.loss.usd, filters.lossBand)) {
        return null;
      }

      if (filters.lossBand) {
        reasons.push(`Falls inside loss band ${filters.lossBand}.`);
      }

      if (reasons.length === 0) {
        reasons.push("Included in the published incident corpus.");
      }

      return { incident, matchReasons: reasons };
    })
    .filter((result): result is IncidentSearchResult => result !== null)
    .sort((left, right) => right.incident.loss.usd - left.incident.loss.usd);
}

export function getSimilarIncidents(slug: string, limit = 3) {
  const target = getIncidentBySlug(slug);
  if (!target) {
    return [];
  }

  return getPublishedIncidents()
    .filter((incident) => incident.slug !== slug)
    .map((incident) => {
      let score = 0;

      if (incident.protocol.category === target.protocol.category) {
        score += 2;
      }

      if (
        incident.classification.primaryAttackType === target.classification.primaryAttackType
      ) {
        score += 3;
      }

      if (
        incident.classification.rootCauseCategory === target.classification.rootCauseCategory
      ) {
        score += 3;
      }

      const sharedChains = incident.chainsInvolved.filter((chain) =>
        target.chainsInvolved.includes(chain)
      );
      score += sharedChains.length;

      return { incident, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || right.incident.loss.usd - left.incident.loss.usd)
    .slice(0, limit)
    .map((entry) => entry.incident);
}
