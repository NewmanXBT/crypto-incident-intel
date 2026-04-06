import { notFound } from "next/navigation";
import { sampleIncident } from "@/lib/sample-data";

type IncidentPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function IncidentPage({ params }: IncidentPageProps) {
  const { slug } = await params;

  if (slug !== sampleIncident.slug) {
    notFound();
  }

  return (
    <main className="shell detailShell">
      <section className="detailHeader">
        <div>
          <p className="eyebrow">{sampleIncident.protocol.name}</p>
          <h1>{sampleIncident.title}</h1>
          <p className="lede">{sampleIncident.summary}</p>
        </div>
        <dl className="snapshot">
          <div>
            <dt>Loss</dt>
            <dd>${sampleIncident.loss.usd.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Primary Type</dt>
            <dd>{sampleIncident.classification.primaryAttackType}</dd>
          </div>
          <div>
            <dt>Root Cause</dt>
            <dd>{sampleIncident.classification.rootCauseCategory}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{sampleIncident.status}</dd>
          </div>
        </dl>
      </section>

      <section className="detailGrid">
        <article className="panel">
          <h2>Attack Path</h2>
          <ol className="pathList">
            {sampleIncident.attackPath.map((step) => (
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
            {sampleIncident.evidence.map((item) => (
              <li key={item.id}>
                <strong>{item.sourceName}</strong>
                <p>{item.claimSupported}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
