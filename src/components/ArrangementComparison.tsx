import type { ConstituencyView } from "@/lib/types";

export function ArrangementComparison({ view }: { view: ConstituencyView }) {
  const arrangements = view.devolvedParliament
    ? [
        {
          name: view.devolvedParliament.name,
          type: "Devolved Parliament",
          status: view.devolvedParliament.country,
          mayoralStatus: "Not applicable",
          score: view.devolvedParliament.score
        }
      ]
    : view.devolutionAreas.map((area) => ({
        name: area.name,
        type: area.areaType,
        status: area.status,
        mayoralStatus: area.mayoralStatus,
        score: area.score
      }));

  if (arrangements.length <= 1) {
    const item = arrangements[0];
    return (
      <section className="card p-6">
        <h2 className="text-xl font-semibold text-brand-deep">Arrangement summary</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Authority name", item.name],
            ["Authority type", item.type],
            ["Status", item.status],
            ["Mayoral status", item.mayoralStatus],
            ["Overall score", item.score.overallScore.toFixed(1)],
            ["Overall label", item.score.overallLabel]
          ].map(([label, value]) => (
            <div key={label} className="card-muted p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-brand">{label}</dt>
              <dd className="mt-1 text-sm text-brand-deep">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  return (
    <section className="card overflow-hidden p-0">
      <div className="border-b border-brand-border bg-brand-tint px-6 py-4">
        <h2 className="text-xl font-semibold text-brand-deep">Comparison across arrangements</h2>
      </div>
      <div className="overflow-x-auto p-6 pt-4">
        <table className="min-w-full divide-y divide-brand-border text-left text-sm">
          <thead className="bg-brand-deep text-xs uppercase tracking-wide text-white">
            <tr>
              {[
                "Authority name",
                "Authority type",
                "Status",
                "Mayoral status",
                "Transport",
                "Skills",
                "Housing/planning",
                "Fiscal/funding",
                "Governance",
                "Overall score",
                "Overall label"
              ].map((heading) => (
                <th key={heading} scope="col" className="px-3 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border bg-white">
            {arrangements.map((item, index) => (
              <tr key={item.name} className={index % 2 === 1 ? "bg-brand-tint/50" : ""}>
                <td className="px-3 py-3 font-medium text-brand-deep">{item.name}</td>
                <td className="px-3 py-3 text-brand-deep/80">{item.type}</td>
                <td className="px-3 py-3 text-brand-deep/80">{item.status}</td>
                <td className="px-3 py-3 text-brand-deep/80">{item.mayoralStatus}</td>
                <td className="px-3 py-3 text-brand-deep">{item.score.transport.score.toFixed(1)}</td>
                <td className="px-3 py-3 text-brand-deep">{item.score.skills.score.toFixed(1)}</td>
                <td className="px-3 py-3 text-brand-deep">
                  {item.score.housingPlanning.score.toFixed(1)}
                </td>
                <td className="px-3 py-3 text-brand-deep">
                  {item.score.fiscalFunding.score.toFixed(1)}
                </td>
                <td className="px-3 py-3 text-brand-deep">{item.score.governance.score.toFixed(1)}</td>
                <td className="px-3 py-3 font-semibold text-brand">{item.score.overallScore.toFixed(1)}</td>
                <td className="px-3 py-3 text-brand-deep/80">{item.score.overallLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
