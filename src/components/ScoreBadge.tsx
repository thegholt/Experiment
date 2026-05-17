import type { DevolutionScore } from "@/lib/types";

export function ScoreBadge({ score }: { score: DevolutionScore }) {
  return (
    <div className="rounded-lg border border-brand-border bg-brand-tint p-4">
      <p className="text-sm font-semibold text-brand-deep">
        Overall Empowerment Score: {score.overallScore.toFixed(1)} / 10
      </p>
      <p className="mt-1 text-sm text-brand">Label: {score.overallLabel}</p>
      <p className="mt-3 text-xs leading-5 text-brand-deep/60">
        Indicative policy judgement based on the depth of powers, funding flexibility and
        governance maturity. This is not an official government classification.
      </p>
    </div>
  );
}
