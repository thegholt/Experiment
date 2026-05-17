import { getConstituencyViews } from "@/lib/data";
import { getDomainLabel, getScoreValue } from "@/lib/scoring";
import type { DevolutionScore, ScoreDomain } from "@/lib/types";

function formatNumber(value: number) {
  return value.toFixed(1);
}

function range(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? formatNumber(min) : `${formatNumber(min)}-${formatNumber(max)}`;
}

function labelRange(scores: DevolutionScore[], domain: ScoreDomain) {
  const labels = scores.map((score) => getDomainLabel(score, domain));
  return labels[0] === labels[labels.length - 1]
    ? labels[0]
    : `${labels[0]} - ${labels[labels.length - 1]}`;
}

export function buildCompareRows(scoreDomain: ScoreDomain) {
  return getConstituencyViews()
    .map((view) => {
      const scores = view.primaryScores;
      const values = scores.map((score) => getScoreValue(score, scoreDomain));
      const sortedScores = [...scores].sort(
        (a, b) => getScoreValue(a, scoreDomain) - getScoreValue(b, scoreDomain)
      );
      const arrangements = view.devolvedParliament
        ? [view.devolvedParliament.name]
        : view.devolutionAreas.map((area) => area.name);

      return {
        constituencyId: view.id,
        constituencyName: view.name,
        country: view.country,
        selectedScore: range(values),
        selectedLabel: labelRange(sortedScores, scoreDomain),
        overallScore: range(scores.map((score) => score.overallScore)),
        arrangements,
        boundaryNote: view.hasMultipleDevolutionAreas
          ? "Spans multiple settlements"
          : view.crossesLocalAuthorityBoundaries
            ? "Spans local authorities"
            : view.hasMultipleTiersOnly
              ? "Multiple tiers of local government"
              : view.boundaryNote || "",
        sortValue: Math.max(...values)
      };
    })
    .sort((a, b) => b.sortValue - a.sortValue || a.constituencyName.localeCompare(b.constituencyName))
    .map((row, index) => ({ ...row, rank: index + 1 }));
}
