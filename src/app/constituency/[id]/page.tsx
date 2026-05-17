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
    <main className="flex-1 bg-brand-tint">
      <section className="page-hero px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="text-sm font-semibold text-white/80 no-underline transition hover:text-white"
          >
            ← Back to search
          </Link>
          <p className="eyebrow-on-dark mt-6">Parliamentary constituency</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{view.name}</h1>
          <p className="mt-3 text-base text-white/80">
            {view.country}
            {view.region ? ` - ${view.region}` : ""}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        <section className="card p-6">
          <h2 className="text-xl font-semibold text-brand-deep">Matched local authorities</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {view.localAuthorities.map((authority) => (
              <li key={authority.id} className="card-muted p-4">
                <p className="font-semibold text-brand-deep">{authority.name}</p>
                <p className="mt-1 text-sm text-brand-deep/70">{authority.type}</p>
              </li>
            ))}
          </ul>
        </section>

        <ConstituencyProfile view={view} />

        {explainers.length ? (
          <section className="rounded-xl border border-brand bg-brand/10 p-5">
            <h2 className="text-base font-semibold text-brand-deep">
              Boundary and devolution explainer
            </h2>
            <div className="mt-3 space-y-2">
              {explainers.map((explainer) => (
                <p key={explainer} className="text-sm leading-6 text-brand-deep/80">
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
