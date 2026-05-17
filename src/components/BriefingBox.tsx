"use client";

import { useState } from "react";

export function BriefingBox({ briefing }: { briefing: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(briefing);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-brand-deep">
          {briefing.split("\n")[0] || "Devolution Briefing"}
        </h2>
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-brand-border bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-deep"
        >
          {copied ? "Copied" : "Copy briefing"}
        </button>
      </div>
      <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-brand-border bg-brand-tint p-4 font-sans text-sm leading-6 text-brand-deep/80">
        {briefing}
      </pre>
    </section>
  );
}
