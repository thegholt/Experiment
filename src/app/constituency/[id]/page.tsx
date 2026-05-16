import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DevolvedParliamentCard,
  DevolutionAreaCard
} from "@/components/ArrangementCards";
import { ArrangementComparison } from "@/components/ArrangementComparison";
import { BriefingBox } from "@/components/BriefingBox";
import { ConstituencyProfile } from "@/components/ConstituencyProfile";
import { buildPolicyBriefing } from "@/lib/briefing";
import { buildBoundaryExplainer } from "@/lib/boundary";
import { getAllConstituencies, getConstituencyView } from "@/lib/data";

export function generateStaticParams() {
  return getAllConstituencies().map((constituency) => ({ id: constituency.id }));
}

export default async function ConstituencyPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const view = getConstituencyView(id);
  if (!view) notFound();

  const explainers = buildBoundaryExplainer(view);
  const briefing = buildPolicyBriefing(view);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        <Link href="/" className="text-sm font-semibold text-slate-700 underline hover:text-slate-950">
          Back to search
        </Link>

        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Parliamentary constituency
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">{view.name}</h1>
          <p className="mt-3 text-base text-slate-600">
            {view.country}
            {view.region ? ` - ${view.region}` : ""}
          </p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Matched local authorities</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {view.localAuthorities.map((authority) => (
              <li key={authority.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{authority.name}</p>
                <p className="mt-1 text-sm text-slate-600">{authority.type}</p>
              </li>
            ))}
          </ul>
        </section>

        <ConstituencyProfile view={view} />

        {explainers.length ? (
          <section className="rounded-xl border border-slate-300 bg-slate-100 p-5">
            <h2 className="text-base font-semibold text-slate-900">Boundary and devolution explainer</h2>
            <div className="mt-3 space-y-2">
              {explainers.map((explainer) => (
                <p key={explainer} className="text-sm leading-6 text-slate-700">
                  {explainer}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {view.devolvedParliament ? (
          <DevolvedParliamentCard parliament={view.devolvedParliament} />
        ) : null}

        {view.devolutionAreas.map((area) => (
          <DevolutionAreaCard key={area.id} area={area} />
        ))}

        <ArrangementComparison view={view} />
        <BriefingBox briefing={briefing} />
      </div>
    </main>
  );
}
