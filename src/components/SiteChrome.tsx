import Link from "next/link";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-brand-deep/20 bg-brand-deep text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="group no-underline">
            <span className="block text-lg font-semibold tracking-tight text-white group-hover:text-brand-tint">
              DevoCompare
            </span>
            <span className="hidden text-xs text-white/70 sm:block">
              UK devolution policy dashboard
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-semibold text-white/90 no-underline transition hover:bg-white/10 hover:text-white"
            >
              Search
            </Link>
            <Link
              href="/compare"
              className="rounded-md border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white no-underline transition hover:bg-white hover:text-brand-deep"
            >
              Compare
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
