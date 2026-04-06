import sampleIncident from "../../examples/sample-incident.json";
import nomadIncident from "../../examples/nomad-2022-bridge-replay.json";
import roninIncident from "../../examples/ronin-2022-validator-compromise.json";
import type { IncidentRecord } from "@/lib/types";

export const incidents: IncidentRecord[] = [
  roninIncident as IncidentRecord,
  sampleIncident as IncidentRecord,
  nomadIncident as IncidentRecord
];

export function getIncidentBySlug(slug: string) {
  return incidents.find((incident) => incident.slug === slug);
}

export function getFeaturedIncidents() {
  return incidents
    .slice()
    .sort((left, right) => right.loss.usd - left.loss.usd);
}

export function getProtocolRiskAnalogs(limit = 3) {
  return getFeaturedIncidents().slice(0, limit);
}
