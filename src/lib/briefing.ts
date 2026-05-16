import type { ConstituencyView, DevolutionScore, LocalAuthorityType } from "@/lib/types";

const domainNames = {
  transport: "transport",
  skills: "skills",
  housingPlanning: "housing and planning",
  fiscalFunding: "fiscal and funding flexibility",
  governance: "governance maturity"
} as const;

const authorityTypes: LocalAuthorityType[] = [
  "District Council",
  "County Council",
  "Unitary Authority",
  "Metropolitan Borough",
  "London Borough",
  "City of London Corporation",
  "Scottish Council",
  "Welsh Council",
  "Northern Ireland District Council"
];

function list(items: string[]) {
  if (!items.length) return "no recorded bodies";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function strongestAndWeakest(score: DevolutionScore) {
  const domains = Object.entries(domainNames).map(([key, label]) => ({
    key: key as keyof typeof domainNames,
    label,
    score: score[key as keyof typeof domainNames].score
  }));
  const sorted = domains.sort((a, b) => b.score - a.score);
  return { strongest: sorted[0], weakest: sorted.at(-1)! };
}

export function buildPolicyBriefing(view: ConstituencyView) {
  const primaryScore = view.primaryScores[0];
  const structure = authorityTypes
    .map((type) => {
      const names = view.localAuthorities
        .filter((authority) => authority.type === type)
        .map((authority) => authority.name);
      return names.length ? `${type}: ${list(names)}` : undefined;
    })
    .filter(Boolean)
    .join("; ");

  const arrangements = view.devolvedParliament
    ? `${view.name} sits within ${view.country} and is primarily covered by ${view.devolvedParliament.name} for devolved policy areas.`
    : view.devolutionAreas.length
      ? `${view.name} is covered by ${list(view.devolutionAreas.map((area) => area.name))}.`
      : `${view.name} has no recorded strategic devolution arrangement.`;

  const { strongest, weakest } = strongestAndWeakest(primaryScore);
  const implications = view.devolvedParliament
    ? "Local policy work should distinguish Westminster responsibilities from devolved policy areas, while retaining local authority delivery context."
    : "Policy work should test whether local transport, skills, housing and funding decisions sit with councils, a strategic authority, or central government programmes.";

  return [
    `Devolution Briefing: ${view.name}`,
    "",
    `Local government structure: ${structure || "No local authority structure recorded."}`,
    `Devolution status: ${arrangements}`,
    view.devolvedParliament
      ? `Devolved parliament status: ${view.devolvedParliament.legislativeScope}`
      : "Devolved parliament status: Not applicable for England.",
    `Powers summary: ${primaryScore.summaryReasoning}`,
    `Strongest empowerment domain: ${strongest.label} (${strongest.score.toFixed(1)}/10).`,
    `Weakest empowerment domain: ${weakest.label} (${weakest.score.toFixed(1)}/10).`,
    `Policy implications: ${implications}`,
    "Suggested questions for policymakers:",
    "1. Which institution is accountable for the power or funding stream being discussed?",
    "2. Does the constituency cross a boundary that could complicate delivery or representation?",
    "3. Which missing or constrained power most affects local delivery priorities?"
  ].join("\n");
}
