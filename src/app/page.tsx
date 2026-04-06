import Link from "next/link";
import { sampleIncident } from "@/lib/sample-data";

const entryPoints = [
  {
    href: `/incidents/${sampleIncident.slug}`,
    label: "Open Sample Incident",
    description: "Read the canonical incident page skeleton backed by the sample record."
  },
  {
    href: "/protocol-risk",
    label: "Open Protocol Risk Surface",
    description: "See the placeholder structure for the protocol risk workflow."
  }
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Structured Intelligence Layer</p>
        <h1>Crypto Incident Intel</h1>
        <p className="lede">
          Search-first research product for normalized exploit incidents, evidence-backed summaries,
          and protocol risk analogs.
        </p>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Current Build Slice</h2>
          <ul className="list">
            <li>Canonical incident schema</li>
            <li>Sample incident seed</li>
            <li>Minimal route structure for search, incident, and protocol risk</li>
          </ul>
        </article>

        <article className="panel">
          <h2>Next Steps</h2>
          <ul className="list">
            <li>Seed the first 20 incidents</li>
            <li>Back search results with a real data store</li>
            <li>Replace placeholders with evidence-aware components</li>
          </ul>
        </article>
      </section>

      <section className="panel">
        <h2>Entry Points</h2>
        <div className="cardRow">
          {entryPoints.map((entry) => (
            <Link className="cardLink" key={entry.href} href={entry.href}>
              <span className="cardLabel">{entry.label}</span>
              <span className="cardCopy">{entry.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
