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
    <main className="flex-1 bg-brand-tint">
      <section className="page-hero px-6 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow-on-dark">UK devolution policy dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">DevoCompare</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-white/90">
            Search a parliamentary constituency to understand its devolution arrangements, powers
            and governance.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            MPs represent constituencies, while devolution is built around local authorities,
            strategic authorities and devolved parliaments. DevoCompare shows every relevant layer
            when those boundaries do not align.
          </p>
          <Link
            href="/compare"
            className="mt-8 inline-flex rounded-md border border-white/30 bg-white px-4 py-2 text-sm font-semibold text-brand-deep no-underline shadow-sm transition hover:bg-brand-tint"
          >
            Compare constituencies
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <div className="max-w-2xl">
          <SearchBox constituencies={constituencies} />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {cards.map((card) => (
            <div
              key={card}
              className="card border-t-4 border-t-brand p-5 transition hover:border-t-brand-light hover:shadow-md"
            >
              <h2 className="text-sm font-semibold text-brand-deep">{card}</h2>
              <p className="mt-3 text-sm leading-6 text-brand-deep/70">
                Evidence-led constituency context drawn from the Excel workbook.
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-brand-border bg-white px-6 py-6 text-center text-sm text-brand-deep/60">
        Prototype using Excel-backed data. Source-backed datasets to follow.
      </footer>
    </main>
  );
}
