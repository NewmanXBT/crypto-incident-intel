import Link from "next/link";
import type { Route } from "next";
import { getProtocolRiskAnalogs } from "@/lib/incident-repository";

const checklist = [
  "Identify privileged roles and upgrade paths.",
  "Map the closest historical incidents by root cause and privilege pattern.",
  "Show evidence-backed caveats instead of fake precision."
];

const analogs = getProtocolRiskAnalogs();

export default function ProtocolRiskPage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Protocol Risk</p>
        <h1>Protocol Risk Profile</h1>
        <p className="lede">
          Placeholder route for architecture memo input, historical analog retrieval, and
          controls checklist output.
        </p>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Intended Inputs</h2>
          <ul className="list">
            <li>Protocol name</li>
            <li>Architecture memo</li>
            <li>Known trust assumptions</li>
          </ul>
        </article>

        <article className="panel">
          <h2>Output Contract</h2>
          <ul className="list">
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel">
        <h2>Current Analog Seeds</h2>
        <div className="resultStack">
          {analogs.map((incident) => (
            <Link
              className="resultCard"
              key={incident.id}
              href={`/incidents/${incident.slug}` as Route}
            >
              <div className="resultHeader">
                <div>
                  <p className="eyebrow compact">{incident.protocol.name}</p>
                  <h2>{incident.title}</h2>
                </div>
                <p className="resultLoss">{incident.classification.rootCauseCategory}</p>
              </div>
              <p className="cardCopy">{incident.classification.privilegeGained}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
