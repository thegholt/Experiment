import { PowerScoreList } from "@/components/PowerScoreList";
import { ScoreBadge } from "@/components/ScoreBadge";
import { getSources } from "@/lib/data";
import type { DevolvedParliamentView, DevolutionAreaView } from "@/lib/types";

function SourceLinks({ sourceIds }: { sourceIds: string[] }) {
  const sources = getSources(sourceIds);
  if (!sources.length) return <p className="text-sm text-brand-deep/50">No source links recorded.</p>;

  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-brand-deep/70">
      {sources.map((source) => (
        <li key={source.id}>
          {source.url ? (
            <a className="text-brand underline hover:text-brand-deep" href={source.url}>
              {source.title}
            </a>
          ) : (
            source.title
          )}
          {source.publisher ? <span> - {source.publisher}</span> : null}
        </li>
      ))}
    </ul>
  );
}

export function DevolutionAreaCard({ area }: { area: DevolutionAreaView }) {
  return (
    <article className="card border-t-4 border-t-brand p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            English devolution area
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-brand-deep">{area.name}</h2>
          <p className="mt-2 text-sm text-brand-deep/70">{area.areaType}</p>
        </div>
        <ScoreBadge score={area.score} />
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["Status", area.status],
          ["Has mayor", area.hasMayor ? "Yes" : "No"],
          ["Mayoral status", area.mayoralStatus],
          ["Council structure", area.councilStructure],
          ["Investment funds", area.investmentFunds],
          ["Economic performance", area.economicPerformance],
          ["Governance model", area.governanceModel],
          ["Last updated", area.lastUpdated]
        ].map(([label, value]) => (
          <div key={label} className="card-muted p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-brand">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-brand-deep">{value || "-"}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <PowerScoreList score={area.score} />
      </div>

      <div className="mt-6 grid gap-4 rounded-lg border border-brand-border bg-brand-tint p-4">
        <div>
          <h3 className="text-sm font-semibold text-brand-deep">Summary reasoning</h3>
          <p className="mt-2 text-sm leading-6 text-brand-deep/70">{area.score.summaryReasoning}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-brand-deep">Limitations</h3>
          <p className="mt-2 text-sm leading-6 text-brand-deep/70">
            {area.score.limitations.join("; ") || area.score.limitations}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-brand-deep">Sources</h3>
          <SourceLinks sourceIds={[...new Set([...area.sourceIds, ...area.score.sourceIds])]} />
        </div>
      </div>
    </article>
  );
}

export function DevolvedParliamentCard({ parliament }: { parliament: DevolvedParliamentView }) {
  return (
    <article className="card border-t-4 border-t-brand-deep p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Devolved parliament
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-brand-deep">{parliament.name}</h2>
          <p className="mt-2 text-sm text-brand-deep/70">{parliament.country}</p>
        </div>
        <ScoreBadge score={parliament.score} />
      </div>

      <dl className="mt-6 grid gap-3">
        {[
          ["Governance model", parliament.governanceModel],
          ["Legislative scope", parliament.legislativeScope],
          ["Fiscal scope", parliament.fiscalScope],
          ["Limitations", parliament.limitations],
          ["Last updated", parliament.lastUpdated]
        ].map(([label, value]) => (
          <div key={label} className="card-muted p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-brand">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-brand-deep">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <PowerScoreList score={parliament.score} />
      </div>

      <div className="mt-6 rounded-lg border border-brand-border bg-brand-tint p-4">
        <h3 className="text-sm font-semibold text-brand-deep">Summary reasoning</h3>
        <p className="mt-2 text-sm leading-6 text-brand-deep/70">{parliament.score.summaryReasoning}</p>
        <h3 className="mt-4 text-sm font-semibold text-brand-deep">Sources</h3>
        <SourceLinks sourceIds={[...new Set([...parliament.sourceIds, ...parliament.score.sourceIds])]} />
      </div>
    </article>
  );
}
