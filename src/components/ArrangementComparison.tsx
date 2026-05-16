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
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Arrangement summary</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Authority name", item.name],
            ["Authority type", item.type],
            ["Status", item.status],
            ["Mayoral status", item.mayoralStatus],
            ["Overall score", item.score.overallScore.toFixed(1)],
            ["Overall label", item.score.overallLabel]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
              <dd className="mt-1 text-sm text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Comparison across arrangements</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
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
          <tbody className="divide-y divide-slate-200">
            {arrangements.map((item) => (
              <tr key={item.name}>
                <td className="px-3 py-3 font-medium text-slate-900">{item.name}</td>
                <td className="px-3 py-3 text-slate-700">{item.type}</td>
                <td className="px-3 py-3 text-slate-700">{item.status}</td>
                <td className="px-3 py-3 text-slate-700">{item.mayoralStatus}</td>
                <td className="px-3 py-3">{item.score.transport.score.toFixed(1)}</td>
                <td className="px-3 py-3">{item.score.skills.score.toFixed(1)}</td>
                <td className="px-3 py-3">{item.score.housingPlanning.score.toFixed(1)}</td>
                <td className="px-3 py-3">{item.score.fiscalFunding.score.toFixed(1)}</td>
                <td className="px-3 py-3">{item.score.governance.score.toFixed(1)}</td>
                <td className="px-3 py-3 font-semibold">{item.score.overallScore.toFixed(1)}</td>
                <td className="px-3 py-3">{item.score.overallLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
