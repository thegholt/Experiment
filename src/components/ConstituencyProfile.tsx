import type { ConstituencyView, LocalAuthorityType } from "@/lib/types";

const authorityRows: Array<[string, LocalAuthorityType]> = [
  ["District Council(s)", "District Council"],
  ["County Council(s)", "County Council"],
  ["Unitary Authority(s)", "Unitary Authority"],
  ["Metropolitan Borough(s)", "Metropolitan Borough"],
  ["London Borough(s)", "London Borough"],
  ["City of London Corporation", "City of London Corporation"],
  ["Scottish Council(s)", "Scottish Council"],
  ["Welsh Council(s)", "Welsh Council"],
  ["Northern Ireland District Council(s)", "Northern Ireland District Council"]
];

function namesFor(view: ConstituencyView, type: LocalAuthorityType) {
  const names = view.localAuthorities
    .filter((authority) => authority.type === type)
    .map((authority) => authority.name);
  return names.length ? names.join("; ") : "—";
}

export function ConstituencyProfile({ view }: { view: ConstituencyView }) {
  const devolutionAreas = view.devolutionAreas.map((area) => area.name).join("; ") || "—";
  const hasMayor = view.devolutionAreas.length
    ? view.devolutionAreas.some((area) => area.hasMayor)
      ? "Yes"
      : "No"
    : "—";

  const rows = [
    ...authorityRows.map(([label, type]) => [label, namesFor(view, type)]),
    ["Combined Authority / Devolution Area", devolutionAreas],
    ["Devolved Parliament", view.devolvedParliament?.name || "—"],
    ["Has Mayor", hasMayor]
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Constituency profile</h2>
      <dl className="mt-5 grid gap-0 overflow-hidden rounded-lg border border-slate-200 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="border-b border-slate-200 p-4 last:border-b-0 md:border-r">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
