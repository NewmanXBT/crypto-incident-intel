import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { formatTokenLabel } from "@/lib/format";
import { getIncidentBySlug, getSimilarIncidents } from "@/lib/incident-repository";

type IncidentPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function IncidentPage({ params }: IncidentPageProps) {
  const { slug } = await params;
  const incident = getIncidentBySlug(slug);
  const similarIncidents = getSimilarIncidents(slug, 3);

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
            <dd>{formatTokenLabel(incident.classification.primaryAttackType)}</dd>
          </div>
          <div>
            <dt>Root Cause</dt>
            <dd>{formatTokenLabel(incident.classification.rootCauseCategory)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{formatTokenLabel(incident.status)}</dd>
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
          <ul className="list evidenceList">
            {incident.evidence.map((item) => (
              <li key={item.id}>
                <a className="evidenceLink" href={item.sourceUrl} rel="noreferrer" target="_blank">
                  <strong>{item.sourceName}</strong>
                </a>
                <p className="evidenceMeta">{formatTokenLabel(item.evidenceType)}</p>
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
            {similarIncidents.length > 0
              ? similarIncidents.map((relatedIncident) => (
                  <li key={relatedIncident.id}>
                    <Link href={`/incidents/${relatedIncident.slug}` as Route}>
                      {relatedIncident.title}
                    </Link>
                  </li>
                ))
              : incident.similarIncidentHints.map((hint) => <li key={hint}>{hint}</li>)}
          </ul>
        </article>
      </section>
    </main>
  );
}
