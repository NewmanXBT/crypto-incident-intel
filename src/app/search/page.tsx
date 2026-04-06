import Link from "next/link";
import { incidents } from "@/lib/incidents";

export default function SearchPage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Explore Incidents</p>
        <h1>Search The Seed Dataset</h1>
        <p className="lede">
          A search-first view over normalized incidents. This slice is still static, but it already
          shows the intended density: attack type, root cause, loss, and why a record matters.
        </p>
      </section>

      <section className="searchLayout">
        <aside className="panel filterPanel">
          <h2>Current Filter Model</h2>
          <ul className="list">
            <li>Chain</li>
            <li>Attack type</li>
            <li>Root cause</li>
            <li>Loss band</li>
            <li>Privilege gained</li>
          </ul>
        </aside>

        <section className="resultColumn">
          {incidents.map((incident) => (
            <Link className="resultCard" key={incident.id} href={`/incidents/${incident.slug}`}>
              <div className="resultHeader">
                <div>
                  <p className="eyebrow compact">{incident.protocol.category}</p>
                  <h2>{incident.title}</h2>
                </div>
                <p className="resultLoss">${incident.loss.usd.toLocaleString()}</p>
              </div>

              <p className="cardCopy">{incident.summary}</p>

              <dl className="metaStrip">
                <div>
                  <dt>Attack Type</dt>
                  <dd>{incident.classification.primaryAttackType}</dd>
                </div>
                <div>
                  <dt>Root Cause</dt>
                  <dd>{incident.classification.rootCauseCategory}</dd>
                </div>
                <div>
                  <dt>Why it matches</dt>
                  <dd>{incident.classification.privilegeGained}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}
