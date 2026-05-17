"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildCompareRows } from "@/lib/compare";
import { scoreDomainLabels } from "@/lib/scoring";
import type { ScoreDomain } from "@/lib/types";

const domains = Object.keys(scoreDomainLabels) as ScoreDomain[];

export function CompareTable() {
  const [domain, setDomain] = useState<ScoreDomain>("overall");
  const rows = useMemo(() => buildCompareRows(domain), [domain]);

  return (
    <div className="space-y-5">
      <div className="card p-4">
        <fieldset>
          <legend className="text-sm font-semibold text-brand-deep">
            Rank by empowerment dimension
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {domains.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDomain(item)}
                className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  domain === item
                    ? "border-brand-deep bg-brand-deep text-white"
                    : "border-brand-border bg-white text-brand-deep hover:border-brand hover:bg-brand-tint"
                }`}
              >
                {scoreDomainLabels[item]}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-border text-left text-sm">
            <thead className="bg-brand-deep text-xs uppercase tracking-wide text-white">
              <tr>
                {[
                  "Rank",
                  "Constituency",
                  "Selected score",
                  "Selected label",
                  "Overall Empowerment Score",
                  "Relevant devolution area(s) or devolved parliament",
                  "Country",
                  "Split / boundary note"
                ].map((heading) => (
                  <th key={heading} scope="col" className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border bg-white">
              {rows.map((row, index) => (
                <tr
                  key={row.constituencyId}
                  className={`align-top ${index % 2 === 1 ? "bg-brand-tint/50" : ""}`}
                >
                  <td className="px-4 py-3 font-semibold text-brand-deep">{row.rank}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/constituency/${row.constituencyId}`}
                      className="font-semibold text-brand no-underline hover:text-brand-deep"
                    >
                      {row.constituencyName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-deep">{row.selectedScore}</td>
                  <td className="px-4 py-3 text-brand-deep/80">{row.selectedLabel}</td>
                  <td className="px-4 py-3 text-brand-deep/80">{row.overallScore}</td>
                  <td className="px-4 py-3 text-brand-deep/80">{row.arrangements.join("; ")}</td>
                  <td className="px-4 py-3 text-brand-deep/80">{row.country}</td>
                  <td className="px-4 py-3 text-brand-deep/80">{row.boundaryNote || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm leading-6 text-brand-deep/70">
        Constituencies that cross more than one devolution geography are shown with the full range
        of applicable scores. The table is sorted by the higher score in that range. For Scotland,
        Wales and Northern Ireland, the devolved parliament is treated as the primary devolution
        layer.
      </p>
    </div>
  );
}
