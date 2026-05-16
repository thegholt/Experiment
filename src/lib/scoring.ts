import type { DevolutionScore, EmpowermentLabel, ScoreDomain } from "@/lib/types";

const WEIGHTS = {
  transport: 0.25,
  skills: 0.2,
  housingPlanning: 0.2,
  fiscalFunding: 0.2,
  governance: 0.15
} as const;

export function calculateOverallScore(scores: {
  transportScore: number;
  skillsScore: number;
  housingPlanningScore: number;
  fiscalFundingScore: number;
  governanceScore: number;
}) {
  const weighted =
    scores.transportScore * WEIGHTS.transport +
    scores.skillsScore * WEIGHTS.skills +
    scores.housingPlanningScore * WEIGHTS.housingPlanning +
    scores.fiscalFundingScore * WEIGHTS.fiscalFunding +
    scores.governanceScore * WEIGHTS.governance;

  return Math.round(weighted * 10) / 10;
}

export function getScoreLabel(score: number): EmpowermentLabel {
  if (score < 2) return "Minimal";
  if (score < 4) return "Limited";
  if (score < 6) return "Moderate";
  if (score < 8) return "Strong";
  return "Extensive";
}

export function getScoreValue(score: DevolutionScore, domain: ScoreDomain) {
  if (domain === "overall") return score.overallScore;
  return score[domain].score;
}

export function getDomainLabel(score: DevolutionScore, domain: ScoreDomain) {
  if (domain === "overall") return score.overallLabel;
  return score[domain].label;
}

export const scoreDomainLabels: Record<ScoreDomain, string> = {
  overall: "Overall Empowerment",
  transport: "Transport Powers",
  skills: "Skills Powers",
  housingPlanning: "Housing / Planning Powers",
  fiscalFunding: "Fiscal / Funding Flexibility",
  governance: "Governance Maturity"
};
