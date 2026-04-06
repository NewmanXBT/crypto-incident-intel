import { notFound } from "next/navigation";
import { getIncidentBySlug } from "@/lib/incidents";

type IncidentPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function IncidentPage({ params }: IncidentPageProps) {
  const { slug } = await params;
  const incident = getIncidentBySlug(slug);

  if (!incident) {
    notFound();
  }

  return (
    <main className="shell detailShell">
      <section className="detailHeader">
        <div>
          <p className="eyebrow">{incident.protocol.name}</p>
          <h1>{incident.title}</h1>
          <p className="lede">{incident.summary}</p>
        </div>
        <dl className="snapshot">
          <div>
            <dt>Loss</dt>
            <dd>${incident.loss.usd.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Primary Type</dt>
            <dd>{incident.classification.primaryAttackType}</dd>
          </div>
          <div>
            <dt>Root Cause</dt>
            <dd>{incident.classification.rootCauseCategory}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{incident.status}</dd>
          </div>
        </dl>
      </section>

      <section className="detailGrid">
        <article className="panel">
          <h2>Attack Path</h2>
          <ol className="pathList">
            {incident.attackPath.map((step) => (
              <li key={step.id}>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </article>

        <article className="panel">
          <h2>Evidence</h2>
          <ul className="list">
            {incident.evidence.map((item) => (
              <li key={item.id}>
                <strong>{item.sourceName}</strong>
                <p>{item.claimSupported}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Response</h2>
          <p className="cardCopy">{incident.response.summary}</p>
          <ul className="list">
            {incident.response.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Similar Incident Hints</h2>
          <ul className="list">
            {incident.similarIncidentHints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
