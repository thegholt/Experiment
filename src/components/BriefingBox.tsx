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
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          {briefing.split("\n")[0] || "Devolution Briefing"}
        </h2>
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          {copied ? "Copied" : "Copy briefing"}
        </button>
      </div>
      <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-sans text-sm leading-6 text-slate-700">
        {briefing}
      </pre>
    </section>
  );
}
