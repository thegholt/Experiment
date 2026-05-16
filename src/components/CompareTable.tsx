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
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">Rank by empowerment dimension</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {domains.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDomain(item)}
                className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                  domain === item
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {scoreDomainLabels[item]}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
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
            <tbody className="divide-y divide-slate-200">
              {rows.map((row) => (
                <tr key={row.constituencyId} className="align-top">
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.rank}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/constituency/${row.constituencyId}`}
                      className="font-semibold text-slate-900 underline hover:text-slate-600"
                    >
                      {row.constituencyName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.selectedScore}</td>
                  <td className="px-4 py-3 text-slate-700">{row.selectedLabel}</td>
                  <td className="px-4 py-3 text-slate-700">{row.overallScore}</td>
                  <td className="px-4 py-3 text-slate-700">{row.arrangements.join("; ")}</td>
                  <td className="px-4 py-3 text-slate-700">{row.country}</td>
                  <td className="px-4 py-3 text-slate-700">{row.boundaryNote || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm leading-6 text-slate-600">
        Constituencies that cross more than one devolution geography are shown with the full range
        of applicable scores. The table is sorted by the higher score in that range. For Scotland,
        Wales and Northern Ireland, the devolved parliament is treated as the primary devolution
        layer.
      </p>
    </div>
  );
}
