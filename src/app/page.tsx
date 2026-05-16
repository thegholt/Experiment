import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { getAllConstituencies } from "@/lib/data";

const cards = [
  "Mayoral status",
  "Local government structure",
  "Powers and funding",
  "Devolved parliaments",
  "Policy briefing"
];

export default function Home() {
  const constituencies = getAllConstituencies();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <Link
          href="/compare"
          className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-100"
        >
          Compare constituencies
        </Link>

        <div className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            UK devolution policy dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            DevoCompare
          </h1>
          <p className="mt-5 text-xl leading-8 text-slate-700">
            Search a parliamentary constituency to understand its devolution arrangements, powers
            and governance.
          </p>
          <p className="mt-5 text-base leading-7 text-slate-600">
            MPs represent constituencies, while devolution is built around local authorities,
            strategic authorities and devolved parliaments. DevoCompare shows every relevant layer
            when those boundaries do not align.
          </p>
        </div>

        <div className="mt-10 max-w-2xl">
          <SearchBox constituencies={constituencies} />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {cards.map((card) => (
            <div key={card} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">{card}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Evidence-led constituency context drawn from the Excel workbook.
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center text-sm text-slate-500">
        Prototype using Excel-backed data. Source-backed datasets to follow.
      </footer>
    </main>
  );
}
