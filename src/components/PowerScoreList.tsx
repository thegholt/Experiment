import type { DevolutionScore } from "@/lib/types";

const rows = [
  ["Transport", "transport"],
  ["Skills", "skills"],
  ["Housing/planning", "housingPlanning"],
  ["Fiscal/funding", "fiscalFunding"],
  ["Governance", "governance"]
] as const;

export function PowerScoreList({ score }: { score: DevolutionScore }) {
  return (
    <div className="grid gap-3">
      {rows.map(([label, key]) => {
        const item = score[key];
        return (
          <div key={key} className="rounded-md border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {item.score.toFixed(1)} / 10 - {item.label}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.reasoning}</p>
          </div>
        );
      })}
    </div>
  );
}
