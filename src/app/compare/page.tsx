import Link from "next/link";
import { CompareTable } from "@/components/CompareTable";

export default function ComparePage() {
  return (
    <main className="flex-1 bg-brand-tint">
      <section className="page-hero px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="text-sm font-semibold text-white/80 no-underline transition hover:text-white"
          >
            ← Back to search
          </Link>
          <p className="eyebrow-on-dark mt-6">Constituency comparison</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Rank constituencies by empowerment
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">
            Select a dimension to compare the primary empowerment layer for each constituency. Split
            constituencies show the full score range rather than a forced single answer.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <CompareTable />
      </div>
    </main>
  );
}
