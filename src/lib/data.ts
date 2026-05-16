import { dataset } from "@/generated/devocompare-data";
import type {
  ConstituencyView,
  Dataset,
  DevolutionAreaView,
  DevolvedParliamentView,
  LocalAuthority,
  ScoreDomain
} from "@/lib/types";
import { getScoreValue } from "@/lib/scoring";

const data: Dataset = dataset;

const constituencyById = new Map(data.constituencies.map((item) => [item.id, item]));
const authorityById = new Map(data.localAuthorities.map((item) => [item.id, item]));
const devolutionAreaById = new Map(data.devolutionAreas.map((item) => [item.id, item]));
const devolvedParliamentById = new Map(
  data.devolvedParliaments.map((item) => [item.id, item])
);
const scoreByAuthorityId = new Map(data.scores.map((item) => [item.authorityId, item]));

function uniqueById<T extends { id: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

export function getAllConstituencies() {
  return data.constituencies;
}

export function getConstituencyById(id: string) {
  return constituencyById.get(id);
}

export function getSources(sourceIds: string[]) {
  const sourceMap = new Map(data.sources.map((source) => [source.id, source]));
  return sourceIds
    .map((id) => sourceMap.get(id))
    .filter((source): source is NonNullable<typeof source> => Boolean(source));
}

export function getLocalAuthoritiesForConstituency(constituencyId: string) {
  return data.constituencyAuthorityLinks
    .filter((link) => link.constituencyId === constituencyId)
    .map((link) => authorityById.get(link.authorityId))
    .filter((authority): authority is LocalAuthority => Boolean(authority));
}

export function getDevolutionAreasForConstituency(constituencyId: string) {
  const authorityIds = new Set(
    getLocalAuthoritiesForConstituency(constituencyId).map((authority) => authority.id)
  );

  const views = data.authorityDevolutionLinks
    .filter((link) => authorityIds.has(link.authorityId))
    .map((link) => {
      const area = devolutionAreaById.get(link.devolutionAreaId);
      const score = scoreByAuthorityId.get(link.devolutionAreaId);
      return area && score ? ({ ...area, score } satisfies DevolutionAreaView) : undefined;
    })
    .filter((area): area is DevolutionAreaView => Boolean(area));

  return uniqueById(views);
}

export function getDevolvedParliamentForConstituency(constituencyId: string) {
  const link = data.constituencyDevolvedParliamentLinks.find(
    (item) => item.constituencyId === constituencyId
  );
  if (!link) return undefined;

  const parliament = devolvedParliamentById.get(link.devolvedParliamentId);
  const score = scoreByAuthorityId.get(link.devolvedParliamentId);
  return parliament && score
    ? ({ ...parliament, score } satisfies DevolvedParliamentView)
    : undefined;
}

export function getScoresForConstituency(constituencyId: string) {
  const parliament = getDevolvedParliamentForConstituency(constituencyId);
  const areaScores = getDevolutionAreasForConstituency(constituencyId).map((area) => area.score);
  return parliament ? [parliament.score, ...areaScores] : areaScores;
}

export function getPrimaryScoresForConstituency(constituencyId: string) {
  const parliament = getDevolvedParliamentForConstituency(constituencyId);
  if (parliament) return [parliament.score];
  return getDevolutionAreasForConstituency(constituencyId).map((area) => area.score);
}

export function constituencyHasMultipleLocalAuthorities(constituencyId: string) {
  return getLocalAuthoritiesForConstituency(constituencyId).length > 1;
}

export function constituencyHasMultipleDevolutionAreas(constituencyId: string) {
  return getDevolutionAreasForConstituency(constituencyId).length > 1;
}

export function getConstituencyPowerScore(constituencyId: string, scoreDomain: ScoreDomain) {
  const values = getPrimaryScoresForConstituency(constituencyId).map((score) =>
    getScoreValue(score, scoreDomain)
  );
  if (!values.length) return undefined;

  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

export function getConstituencyView(constituencyId: string): ConstituencyView | undefined {
  const constituency = getConstituencyById(constituencyId);
  if (!constituency) return undefined;

  const localAuthorities = getLocalAuthoritiesForConstituency(constituencyId);
  const devolutionAreas = getDevolutionAreasForConstituency(constituencyId);
  const devolvedParliament = getDevolvedParliamentForConstituency(constituencyId);

  return {
    id: constituency.id,
    name: constituency.name,
    country: constituency.country,
    region: constituency.region,
    boundaryNote: constituency.boundaryNote,
    localAuthorities,
    devolutionAreas,
    devolvedParliament,
    hasMultipleLocalAuthorities: localAuthorities.length > 1,
    hasMultipleDevolutionAreas: devolutionAreas.length > 1,
    primaryScores: devolvedParliament
      ? [devolvedParliament.score]
      : devolutionAreas.map((area) => area.score)
  };
}

export function getConstituencyViews() {
  return data.constituencies
    .map((constituency) => getConstituencyView(constituency.id))
    .filter((view): view is ConstituencyView => Boolean(view));
}
