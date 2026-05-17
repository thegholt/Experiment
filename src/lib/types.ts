export type EmpowermentLabel =
  | "Minimal"
  | "Limited"
  | "Moderate"
  | "Strong"
  | "Extensive";

export type AuthorityKind = "Devolution Area" | "Devolved Parliament";

export type Country = "England" | "Scotland" | "Wales" | "Northern Ireland";

export type LocalAuthorityType =
  | "District Council"
  | "County Council"
  | "Unitary Authority"
  | "Metropolitan Borough"
  | "London Borough"
  | "City of London Corporation"
  | "Scottish Council"
  | "Welsh Council"
  | "Northern Ireland District Council";

export type Constituency = {
  id: string;
  name: string;
  onsCode?: string;
  country: Country;
  region?: string;
  boundaryNote?: string;
  sourceIds: string[];
};

export type LocalAuthority = {
  id: string;
  name: string;
  type: LocalAuthorityType;
  onsCode?: string;
  countyName?: string;
  region?: string;
  sourceIds: string[];
};

export type ConstituencyAuthorityLink = {
  constituencyId: string;
  authorityId: string;
  relationshipType?: string;
  coverageNote?: string;
  sourceIds: string[];
};

export type DevolutionArea = {
  id: string;
  name: string;
  areaType: string;
  status: string;
  hasMayor: boolean;
  mayoralStatus: string;
  councilStructure: string;
  governanceModel: string;
  investmentFunds: string;
  economicPerformance: string;
  lastUpdated: string;
  sourceIds: string[];
};

export type AuthorityDevolutionLink = {
  authorityId: string;
  devolutionAreaId: string;
  relationshipType?: string;
  startDate?: string;
  endDate?: string;
  note?: string;
  sourceIds: string[];
};

export type DevolvedParliament = {
  id: string;
  name: string;
  country: Exclude<Country, "England">;
  governanceModel: string;
  legislativeScope: string;
  fiscalScope: string;
  limitations: string;
  lastUpdated: string;
  sourceIds: string[];
};

export type ConstituencyDevolvedParliamentLink = {
  constituencyId: string;
  devolvedParliamentId: string;
  sourceIds: string[];
};

export type PowerCategoryScore = {
  score: number;
  label: EmpowermentLabel;
  reasoning: string;
};

export type DevolutionScore = {
  authorityScoreId: string;
  authorityId: string;
  authorityName: string;
  authorityKind: AuthorityKind;
  transport: PowerCategoryScore;
  skills: PowerCategoryScore;
  housingPlanning: PowerCategoryScore;
  fiscalFunding: PowerCategoryScore;
  governance: PowerCategoryScore;
  overallScore: number;
  overallLabel: EmpowermentLabel;
  summaryReasoning: string;
  limitations: string[];
  sourceIds: string[];
  lastUpdated?: string;
};

export type Source = {
  id: string;
  title: string;
  url?: string;
  publisher?: string;
  publishedDate?: string;
  retrievedDate?: string;
  notes?: string;
};

export type DevolutionAreaView = DevolutionArea & {
  score: DevolutionScore;
};

export type DevolvedParliamentView = DevolvedParliament & {
  score: DevolutionScore;
};

export type ConstituencyView = {
  id: string;
  name: string;
  country: Country;
  region?: string;
  localAuthorities: LocalAuthority[];
  devolutionAreas: DevolutionAreaView[];
  devolvedParliament?: DevolvedParliamentView;
  boundaryNote?: string;
  hasMultipleLocalAuthorities: boolean;
  crossesLocalAuthorityBoundaries: boolean;
  hasMultipleTiersOnly: boolean;
  hasMultipleDevolutionAreas: boolean;
  primaryScores: DevolutionScore[];
};

export type ScoreDomain =
  | "overall"
  | "transport"
  | "skills"
  | "housingPlanning"
  | "fiscalFunding"
  | "governance";

export type Dataset = {
  constituencies: Constituency[];
  localAuthorities: LocalAuthority[];
  constituencyAuthorityLinks: ConstituencyAuthorityLink[];
  devolutionAreas: DevolutionArea[];
  authorityDevolutionLinks: AuthorityDevolutionLink[];
  devolvedParliaments: DevolvedParliament[];
  constituencyDevolvedParliamentLinks: ConstituencyDevolvedParliamentLink[];
  scores: DevolutionScore[];
  sources: Source[];
  metadata: Record<string, string>;
};
