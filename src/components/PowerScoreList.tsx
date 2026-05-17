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
          <div
            key={key}
            className="rounded-md border border-brand-border bg-white p-3 transition hover:border-brand/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-brand-deep">{label}</h4>
              <span className="rounded-full border border-brand/30 bg-brand-tint px-2.5 py-1 text-xs font-semibold text-brand-deep">
                {item.score.toFixed(1)} / 10 - {item.label}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-brand-deep/70">{item.reasoning}</p>
          </div>
        );
      })}
    </div>
  );
}
