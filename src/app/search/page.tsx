import Link from "next/link";
import type { Route } from "next";
import {
  ATTACK_TYPES,
  PROTOCOL_CATEGORIES,
  ROOT_CAUSE_CATEGORIES
} from "@/lib/incident-constants";
import {
  searchIncidents,
  type SearchFilters
} from "@/lib/incident-repository";

type SearchPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function toSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildFilters(params: Record<string, string | string[] | undefined>): SearchFilters {
  return {
    q: toSingleParam(params.q),
    chain: toSingleParam(params.chain),
    attackType: toSingleParam(params.attackType) as SearchFilters["attackType"],
    rootCause: toSingleParam(params.rootCause) as SearchFilters["rootCause"],
    protocolCategory: toSingleParam(params.protocolCategory) as SearchFilters["protocolCategory"],
    lossBand: toSingleParam(params.lossBand) as SearchFilters["lossBand"]
  };
}

const lossBands = [
  { value: "under_250m", label: "Under $250M" },
  { value: "250m_to_500m", label: "$250M to $500M" },
  { value: "over_500m", label: "Over $500M" }
];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const filters = buildFilters(resolvedSearchParams);
  const results = searchIncidents(filters);

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
          <h2>Filters</h2>
          <form className="filterForm" action="/search">
            <label className="field">
              <span className="fieldLabel">Query</span>
              <input defaultValue={filters.q} name="q" placeholder="bridge, validator, replay..." />
            </label>

            <label className="field">
              <span className="fieldLabel">Chain</span>
              <input defaultValue={filters.chain} name="chain" placeholder="Ethereum, Solana..." />
            </label>

            <label className="field">
              <span className="fieldLabel">Attack Type</span>
              <select defaultValue={filters.attackType ?? ""} name="attackType">
                <option value="">All</option>
                {ATTACK_TYPES.map((attackType) => (
                  <option key={attackType} value={attackType}>
                    {attackType}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="fieldLabel">Root Cause</span>
              <select defaultValue={filters.rootCause ?? ""} name="rootCause">
                <option value="">All</option>
                {ROOT_CAUSE_CATEGORIES.map((rootCause) => (
                  <option key={rootCause} value={rootCause}>
                    {rootCause}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="fieldLabel">Protocol Category</span>
              <select defaultValue={filters.protocolCategory ?? ""} name="protocolCategory">
                <option value="">All</option>
                {PROTOCOL_CATEGORIES.map((protocolCategory) => (
                  <option key={protocolCategory} value={protocolCategory}>
                    {protocolCategory}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="fieldLabel">Loss Band</span>
              <select defaultValue={filters.lossBand ?? ""} name="lossBand">
                <option value="">All</option>
                {lossBands.map((lossBand) => (
                  <option key={lossBand.value} value={lossBand.value}>
                    {lossBand.label}
                  </option>
                ))}
              </select>
            </label>

            <button className="buttonPrimary" type="submit">
              Apply Filters
            </button>
          </form>
        </aside>

        <section className="resultColumn">
          {results.length === 0 ? (
            <article className="panel">
              <h2>No incidents matched this filter set.</h2>
              <p className="cardCopy">
                Try broadening the chain, removing the loss band, or searching for a higher-level
                term like bridge, signer, or governance.
              </p>
            </article>
          ) : (
            results.map(({ incident, matchReasons }) => (
              <Link
                className="resultCard"
                key={incident.id}
                href={`/incidents/${incident.slug}` as Route}
              >
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
                    <dt>Privilege Path</dt>
                    <dd>{incident.classification.privilegeGained}</dd>
                  </div>
                </dl>

                <div className="reasonBlock">
                  <p className="fieldLabel">Why it matched</p>
                  <ul className="list compactList">
                    {matchReasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
