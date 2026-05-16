import Link from "next/link";
import { CompareTable } from "@/components/CompareTable";

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/" className="text-sm font-semibold text-slate-700 underline hover:text-slate-950">
          Back to search
        </Link>
        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Constituency comparison
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Rank constituencies by empowerment
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Select a dimension to compare the primary empowerment layer for each constituency. Split
            constituencies show the full score range rather than a forced single answer.
          </p>
        </div>

        <div className="mt-8">
          <CompareTable />
        </div>
      </div>
    </main>
  );
}
