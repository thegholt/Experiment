import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import XLSX from "xlsx";

const workbookPath = process.argv[2] || "DevoDB.xlsx";
const outputPath = path.join("src", "generated", "devocompare-data.ts");
const reportPath = "import-report.json";

const allowed = {
  country: ["England", "Scotland", "Wales", "Northern Ireland"],
  localAuthorityType: [
    "District Council",
    "County Council",
    "Unitary Authority",
    "Metropolitan Borough",
    "London Borough",
    "City of London Corporation",
    "Scottish Council",
    "Welsh Council",
    "Northern Ireland District Council"
  ],
  areaType: [
    "No Current Deal",
    "Emerging / Proposed",
    "Non-Mayoral Foundation Strategic Authority",
    "Mayoral Combined Authority",
    "Mayoral Combined County Authority",
    "Established Mayoral Strategic Authority",
    "Greater London Authority"
  ],
  authorityKind: ["Devolution Area", "Devolved Parliament"],
  label: ["Minimal", "Limited", "Moderate", "Strong", "Extensive"]
};

const requiredColumns = {
  Constituencies: [
    "constituency_id",
    "constituency_name",
    "ons_constituency_code",
    "country",
    "region",
    "boundary_note",
    "source_ids"
  ],
  LocalAuthorities: [
    "authority_id",
    "authority_name",
    "authority_type",
    "ons_authority_code",
    "county_name",
    "region",
    "source_ids"
  ],
  ConstituencyAuthorityLinks: [
    "constituency_id",
    "authority_id",
    "relationship_type",
    "coverage_note",
    "source_ids"
  ],
  DevolutionAreas: [
    "devolution_area_id",
    "devolution_area_name",
    "area_type",
    "status",
    "has_mayor",
    "mayoral_status",
    "council_structure",
    "governance_model",
    "investment_funds",
    "economic_performance",
    "last_updated",
    "source_ids"
  ],
  AuthorityDevolutionLinks: [
    "authority_id",
    "devolution_area_id",
    "relationship_type",
    "start_date",
    "end_date",
    "note",
    "source_ids"
  ],
  DevolvedParliaments: [
    "devolved_parliament_id",
    "devolved_parliament_name",
    "country",
    "governance_model",
    "legislative_scope",
    "fiscal_scope",
    "limitations",
    "last_updated",
    "source_ids"
  ],
  ConstituencyDevolvedParliamentLinks: [
    "constituency_id",
    "devolved_parliament_id",
    "source_ids"
  ],
  PowerMatrix: [
    "authority_score_id",
    "authority_id",
    "authority_name",
    "authority_kind",
    "transport_score",
    "transport_label",
    "transport_reasoning",
    "skills_score",
    "skills_label",
    "skills_reasoning",
    "housing_planning_score",
    "housing_planning_label",
    "housing_planning_reasoning",
    "fiscal_funding_score",
    "fiscal_funding_label",
    "fiscal_funding_reasoning",
    "governance_score",
    "governance_label",
    "governance_reasoning",
    "overall_score",
    "overall_label",
    "summary_reasoning",
    "limitations",
    "source_ids",
    "last_updated"
  ],
  Sources: [
    "source_id",
    "source_title",
    "source_url",
    "publisher",
    "published_date",
    "retrieved_date",
    "notes"
  ],
  Metadata: ["key", "value"]
};

const sheetAliases = {
  ConstituencyDevolvedParliamentLinks: ["ConstDevolvedParliamentLinks"]
};

const errors = [];
const warnings = [];

function writeReport(dataset, status) {
  const report = {
    status,
    workbookPath,
    generatedAt: new Date().toISOString(),
    errors,
    warnings,
    counts: dataset
      ? {
          constituencies: dataset.constituencies.length,
          localAuthorities: dataset.localAuthorities.length,
          constituencyAuthorityLinks: dataset.constituencyAuthorityLinks.length,
          devolutionAreas: dataset.devolutionAreas.length,
          authorityDevolutionLinks: dataset.authorityDevolutionLinks.length,
          devolvedParliaments: dataset.devolvedParliaments.length,
          constituencyDevolvedParliamentLinks:
            dataset.constituencyDevolvedParliamentLinks.length,
          scores: dataset.scores.length,
          sources: dataset.sources.length
        }
      : {}
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

function value(row, key) {
  const raw = row[key];
  if (raw === undefined || raw === null) return "";
  return String(raw).trim();
}

function parseIds(raw) {
  return String(raw || "")
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBool(raw) {
  const normalised = String(raw || "").trim().toLowerCase();
  return ["true", "yes", "y", "1"].includes(normalised);
}

function parseNumber(raw, context) {
  const text = String(raw ?? "").trim();
  if (!text) return undefined;
  const number = Number(text);
  if (!Number.isFinite(number)) {
    errors.push(`ERROR: ${context} is "${text}"; expected a number.`);
    return undefined;
  }
  return number;
}

function calculateOverallScore(scores) {
  return (
    Math.round(
      (scores.transportScore * 0.25 +
        scores.skillsScore * 0.2 +
        scores.housingPlanningScore * 0.2 +
        scores.fiscalFundingScore * 0.2 +
        scores.governanceScore * 0.15) *
        10
    ) / 10
  );
}

function getScoreLabel(score) {
  if (score < 2) return "Minimal";
  if (score < 4) return "Limited";
  if (score < 6) return "Moderate";
  if (score < 8) return "Strong";
  return "Extensive";
}

function resolveSheetName(workbook, sheetName) {
  if (workbook.SheetNames.includes(sheetName)) return sheetName;
  for (const alias of sheetAliases[sheetName] || []) {
    if (workbook.SheetNames.includes(alias)) return alias;
  }
  return sheetName;
}

function sheetRows(workbook, sheetName) {
  const resolvedName = resolveSheetName(workbook, sheetName);
  const sheet = workbook.Sheets[resolvedName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
}

function requireEnum(actual, choices, context) {
  if (!choices.includes(actual)) {
    errors.push(`ERROR: ${context} "${actual}"; expected ${choices.join(", ")}.`);
  }
}

function validateUnique(items, key, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item[key]) errors.push(`ERROR: ${label} row has blank ${key}.`);
    if (seen.has(item[key])) errors.push(`ERROR: Duplicate ${label} id "${item[key]}".`);
    seen.add(item[key]);
  }
}

function ensureSourceIds(sourceIds, sourceIdSet, context) {
  for (const sourceId of sourceIds) {
    if (!sourceIdSet.has(sourceId)) {
      errors.push(`ERROR: ${context} references missing source_id "${sourceId}".`);
    }
  }
}

if (!fs.existsSync(workbookPath)) {
  errors.push(`ERROR: Workbook not found at ${workbookPath}.`);
  writeReport(undefined, "failed");
  process.exit(1);
}

const workbook = XLSX.readFile(workbookPath, { cellDates: false });
for (const [sheetName, columns] of Object.entries(requiredColumns)) {
  const resolvedName = resolveSheetName(workbook, sheetName);
  if (!workbook.SheetNames.includes(resolvedName)) {
    errors.push(`ERROR: Missing required sheet "${sheetName}".`);
    continue;
  }
  const rows = sheetRows(workbook, sheetName);
  const first = rows[0] || {};
  const actualColumns = new Set(Object.keys(first));
  for (const column of columns) {
    if (!actualColumns.has(column)) {
      errors.push(`ERROR: Sheet "${sheetName}" missing required column "${column}".`);
    }
  }
}

if (errors.length) {
  writeReport(undefined, "failed");
  process.exit(1);
}

const sources = sheetRows(workbook, "Sources").map((row) => ({
  id: value(row, "source_id"),
  title: value(row, "source_title"),
  url: value(row, "source_url") || undefined,
  publisher: value(row, "publisher") || undefined,
  publishedDate: value(row, "published_date") || undefined,
  retrievedDate: value(row, "retrieved_date") || undefined,
  notes: value(row, "notes") || undefined
}));
validateUnique(sources, "id", "Source");
const sourceIdSet = new Set(sources.map((source) => source.id));

const constituencies = sheetRows(workbook, "Constituencies").map((row) => {
  const country = value(row, "country");
  requireEnum(country, allowed.country, `country for constituency "${value(row, "constituency_name")}"`);
  return {
    id: value(row, "constituency_id"),
    name: value(row, "constituency_name"),
    onsCode: value(row, "ons_constituency_code") || undefined,
    country,
    region: value(row, "region") || undefined,
    boundaryNote: value(row, "boundary_note") || undefined,
    sourceIds: parseIds(value(row, "source_ids"))
  };
});
validateUnique(constituencies, "id", "Constituency");

const localAuthorities = sheetRows(workbook, "LocalAuthorities").map((row) => {
  const type = value(row, "authority_type");
  requireEnum(type, allowed.localAuthorityType, `authority_type for "${value(row, "authority_name")}"`);
  return {
    id: value(row, "authority_id"),
    name: value(row, "authority_name"),
    type,
    onsCode: value(row, "ons_authority_code") || undefined,
    countyName: value(row, "county_name") || undefined,
    region: value(row, "region") || undefined,
    sourceIds: parseIds(value(row, "source_ids"))
  };
});
validateUnique(localAuthorities, "id", "LocalAuthority");

const constituencyAuthorityLinks = sheetRows(workbook, "ConstituencyAuthorityLinks").map((row) => ({
  constituencyId: value(row, "constituency_id"),
  authorityId: value(row, "authority_id"),
  relationshipType: value(row, "relationship_type") || undefined,
  coverageNote: value(row, "coverage_note") || undefined,
  sourceIds: parseIds(value(row, "source_ids"))
}));

const devolutionAreas = sheetRows(workbook, "DevolutionAreas").map((row) => {
  const areaType = value(row, "area_type");
  requireEnum(areaType, allowed.areaType, `area_type for "${value(row, "devolution_area_name")}"`);
  return {
    id: value(row, "devolution_area_id"),
    name: value(row, "devolution_area_name"),
    areaType,
    status: value(row, "status"),
    hasMayor: parseBool(value(row, "has_mayor")),
    mayoralStatus: value(row, "mayoral_status"),
    councilStructure: value(row, "council_structure"),
    governanceModel: value(row, "governance_model"),
    investmentFunds: value(row, "investment_funds"),
    economicPerformance: value(row, "economic_performance"),
    lastUpdated: value(row, "last_updated"),
    sourceIds: parseIds(value(row, "source_ids"))
  };
});
validateUnique(devolutionAreas, "id", "DevolutionArea");

const authorityDevolutionLinks = sheetRows(workbook, "AuthorityDevolutionLinks").map((row) => ({
  authorityId: value(row, "authority_id"),
  devolutionAreaId: value(row, "devolution_area_id"),
  relationshipType: value(row, "relationship_type") || undefined,
  startDate: value(row, "start_date") || undefined,
  endDate: value(row, "end_date") || undefined,
  note: value(row, "note") || undefined,
  sourceIds: parseIds(value(row, "source_ids"))
}));

const devolvedParliaments = sheetRows(workbook, "DevolvedParliaments").map((row) => {
  const country = value(row, "country");
  if (country === "England") {
    errors.push(`ERROR: Devolved parliament "${value(row, "devolved_parliament_name")}" cannot use England.`);
  }
  requireEnum(country, ["Scotland", "Wales", "Northern Ireland"], `country for devolved parliament "${value(row, "devolved_parliament_name")}"`);
  return {
    id: value(row, "devolved_parliament_id"),
    name: value(row, "devolved_parliament_name"),
    country,
    governanceModel: value(row, "governance_model"),
    legislativeScope: value(row, "legislative_scope"),
    fiscalScope: value(row, "fiscal_scope"),
    limitations: value(row, "limitations"),
    lastUpdated: value(row, "last_updated"),
    sourceIds: parseIds(value(row, "source_ids"))
  };
});
validateUnique(devolvedParliaments, "id", "DevolvedParliament");

const constituencyDevolvedParliamentLinks = sheetRows(
  workbook,
  "ConstituencyDevolvedParliamentLinks"
).map((row) => ({
  constituencyId: value(row, "constituency_id"),
  devolvedParliamentId: value(row, "devolved_parliament_id"),
  sourceIds: parseIds(value(row, "source_ids"))
}));

const scores = sheetRows(workbook, "PowerMatrix").map((row) => {
  const authorityName = value(row, "authority_name");
  const context = `"${authorityName}"`;
  const authorityKind = value(row, "authority_kind");
  requireEnum(authorityKind, allowed.authorityKind, `authority_kind for ${context}`);

  const domainScores = {
    transportScore: parseNumber(value(row, "transport_score"), `transport_score for ${context}`),
    skillsScore: parseNumber(value(row, "skills_score"), `skills_score for ${context}`),
    housingPlanningScore: parseNumber(
      value(row, "housing_planning_score"),
      `housing_planning_score for ${context}`
    ),
    fiscalFundingScore: parseNumber(
      value(row, "fiscal_funding_score"),
      `fiscal_funding_score for ${context}`
    ),
    governanceScore: parseNumber(value(row, "governance_score"), `governance_score for ${context}`)
  };

  for (const [key, score] of Object.entries(domainScores)) {
    if (score === undefined) errors.push(`ERROR: ${key} for ${context} is required.`);
    else if (score < 0 || score > 10) {
      errors.push(`ERROR: ${key} for ${context} is ${score}; expected 0-10.`);
    }
  }

  const labels = {
    transportLabel: value(row, "transport_label"),
    skillsLabel: value(row, "skills_label"),
    housingPlanningLabel: value(row, "housing_planning_label"),
    fiscalFundingLabel: value(row, "fiscal_funding_label"),
    governanceLabel: value(row, "governance_label"),
    overallLabel: value(row, "overall_label")
  };
  for (const [key, label] of Object.entries(labels)) {
    requireEnum(label, allowed.label, `${key} for ${context}`);
  }

  const calculatedOverall = calculateOverallScore(domainScores);
  const workbookOverall = parseNumber(value(row, "overall_score"), `overall_score for ${context}`);
  if (workbookOverall !== undefined && Math.abs(workbookOverall - calculatedOverall) > 0.2) {
    errors.push(
      `ERROR: overall_score for ${context} is ${workbookOverall.toFixed(1)} but calculated score is ${calculatedOverall.toFixed(1)}.`
    );
  }
  if (labels.overallLabel !== getScoreLabel(workbookOverall ?? calculatedOverall)) {
    warnings.push(
      `WARNING: overall_label for ${context} is "${labels.overallLabel}" but score maps to "${getScoreLabel(workbookOverall ?? calculatedOverall)}".`
    );
  }

  return {
    authorityScoreId: value(row, "authority_score_id"),
    authorityId: value(row, "authority_id"),
    authorityName,
    authorityKind,
    transport: {
      score: domainScores.transportScore ?? 0,
      label: labels.transportLabel,
      reasoning: value(row, "transport_reasoning")
    },
    skills: {
      score: domainScores.skillsScore ?? 0,
      label: labels.skillsLabel,
      reasoning: value(row, "skills_reasoning")
    },
    housingPlanning: {
      score: domainScores.housingPlanningScore ?? 0,
      label: labels.housingPlanningLabel,
      reasoning: value(row, "housing_planning_reasoning")
    },
    fiscalFunding: {
      score: domainScores.fiscalFundingScore ?? 0,
      label: labels.fiscalFundingLabel,
      reasoning: value(row, "fiscal_funding_reasoning")
    },
    governance: {
      score: domainScores.governanceScore ?? 0,
      label: labels.governanceLabel,
      reasoning: value(row, "governance_reasoning")
    },
    overallScore: workbookOverall ?? calculatedOverall,
    overallLabel: labels.overallLabel,
    summaryReasoning: value(row, "summary_reasoning"),
    limitations: parseIds(value(row, "limitations")),
    sourceIds: parseIds(value(row, "source_ids")),
    lastUpdated: value(row, "last_updated") || undefined
  };
});
validateUnique(scores, "authorityScoreId", "PowerMatrix");

const metadata = Object.fromEntries(
  sheetRows(workbook, "Metadata").map((row) => [value(row, "key"), value(row, "value")])
);

const constituencyIds = new Set(constituencies.map((item) => item.id));
const authorityIds = new Set(localAuthorities.map((item) => item.id));
const devolutionAreaIds = new Set(devolutionAreas.map((item) => item.id));
const devolvedParliamentIds = new Set(devolvedParliaments.map((item) => item.id));
const scoreAuthorityIds = new Set(scores.map((item) => item.authorityId));

for (const item of [
  ...constituencies,
  ...localAuthorities,
  ...devolutionAreas,
  ...devolvedParliaments,
  ...sources,
  ...scores
]) {
  if ("sourceIds" in item) ensureSourceIds(item.sourceIds, sourceIdSet, item.name || item.authorityName);
}
for (const link of [...constituencyAuthorityLinks, ...authorityDevolutionLinks, ...constituencyDevolvedParliamentLinks]) {
  ensureSourceIds(link.sourceIds, sourceIdSet, JSON.stringify(link));
}

for (const link of constituencyAuthorityLinks) {
  if (!constituencyIds.has(link.constituencyId)) {
    errors.push(`ERROR: ConstituencyAuthorityLinks references missing constituency_id "${link.constituencyId}".`);
  }
  if (!authorityIds.has(link.authorityId)) {
    errors.push(`ERROR: ConstituencyAuthorityLinks references missing authority_id "${link.authorityId}".`);
  }
}
for (const constituency of constituencies) {
  if (!constituencyAuthorityLinks.some((link) => link.constituencyId === constituency.id)) {
    errors.push(`ERROR: Constituency "${constituency.name}" has no authority link.`);
  }
}

for (const link of authorityDevolutionLinks) {
  if (!authorityIds.has(link.authorityId)) {
    errors.push(`ERROR: AuthorityDevolutionLinks references missing authority_id "${link.authorityId}".`);
  }
  if (!devolutionAreaIds.has(link.devolutionAreaId)) {
    errors.push(`ERROR: Authority "${link.authorityId}" links to missing devolution_area_id "${link.devolutionAreaId}".`);
  }
}

const englishAuthorityIds = new Set();
for (const link of constituencyAuthorityLinks) {
  const constituency = constituencies.find((item) => item.id === link.constituencyId);
  if (constituency?.country === "England") englishAuthorityIds.add(link.authorityId);
}
for (const authorityId of englishAuthorityIds) {
  if (!authorityDevolutionLinks.some((link) => link.authorityId === authorityId)) {
    const authority = localAuthorities.find((item) => item.id === authorityId);
    errors.push(`ERROR: English local authority "${authority?.name || authorityId}" has no devolution area link or explicit No Current Deal link.`);
  }
}

for (const link of constituencyDevolvedParliamentLinks) {
  if (!constituencyIds.has(link.constituencyId)) {
    errors.push(`ERROR: ConstituencyDevolvedParliamentLinks references missing constituency_id "${link.constituencyId}".`);
  }
  if (!devolvedParliamentIds.has(link.devolvedParliamentId)) {
    errors.push(`ERROR: ConstituencyDevolvedParliamentLinks references missing devolved_parliament_id "${link.devolvedParliamentId}".`);
  }
}
for (const constituency of constituencies) {
  const links = constituencyDevolvedParliamentLinks.filter((link) => link.constituencyId === constituency.id);
  if (constituency.country === "England" && links.length) {
    errors.push(`ERROR: Constituency "${constituency.name}" is in England but has a devolved parliament link.`);
  }
  if (constituency.country !== "England" && !links.length) {
    errors.push(`ERROR: Constituency "${constituency.name}" is in ${constituency.country} but has no devolved parliament link.`);
  }
}

for (const area of devolutionAreas) {
  if (!scoreAuthorityIds.has(area.id)) {
    errors.push(`ERROR: Devolution area "${area.id}" missing PowerMatrix row.`);
  }
}
for (const parliament of devolvedParliaments) {
  if (!scoreAuthorityIds.has(parliament.id)) {
    errors.push(`ERROR: Devolved parliament "${parliament.id}" missing PowerMatrix row.`);
  }
}
for (const score of scores) {
  if (score.authorityKind === "Devolution Area" && !devolutionAreaIds.has(score.authorityId)) {
    errors.push(`ERROR: PowerMatrix row "${score.authorityScoreId}" references missing devolution_area_id "${score.authorityId}".`);
  }
  if (score.authorityKind === "Devolved Parliament" && !devolvedParliamentIds.has(score.authorityId)) {
    errors.push(`ERROR: PowerMatrix row "${score.authorityScoreId}" references missing devolved_parliament_id "${score.authorityId}".`);
  }
}

const dataset = {
  constituencies,
  localAuthorities,
  constituencyAuthorityLinks,
  devolutionAreas,
  authorityDevolutionLinks,
  devolvedParliaments,
  constituencyDevolvedParliamentLinks,
  scores,
  sources,
  metadata
};

if (errors.length) {
  writeReport(dataset, "failed");
  process.exit(1);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  `import type { Dataset } from "@/lib/types";\n\nexport const dataset = ${JSON.stringify(dataset, null, 2)} satisfies Dataset;\n`
);
writeReport(dataset, "success");
console.log(`Imported ${constituencies.length} constituencies from ${workbookPath}.`);
console.log(`Generated ${outputPath} and ${reportPath}.`);
if (warnings.length) {
  console.warn(`${warnings.length} warning(s) written to ${reportPath}.`);
}
