import Link from "next/link";

export default function ConstituencyNotFound() {
  return (
    <main className="flex-1 bg-brand-tint">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="card p-8">
          <h1 className="text-3xl font-semibold text-brand-deep">Constituency not found</h1>
          <p className="mt-3 text-brand-deep/70">
            The requested constituency is not present in the generated workbook data.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-md border border-brand-border bg-brand px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-brand-deep"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
