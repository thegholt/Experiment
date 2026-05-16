import Link from "next/link";

export default function ConstituencyNotFound() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">Constituency not found</h1>
          <p className="mt-3 text-slate-600">
            The requested constituency is not present in the generated workbook data.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
