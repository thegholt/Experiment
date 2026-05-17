import type { LocalAuthority, LocalAuthorityType } from "@/lib/types";

const DISTRICT_LEVEL_TYPES: LocalAuthorityType[] = [
  "District Council",
  "Metropolitan Borough",
  "London Borough"
];

const SAME_TIER_GROUPS: LocalAuthorityType[][] = [
  DISTRICT_LEVEL_TYPES,
  ["County Council"],
  ["Unitary Authority"],
  ["Scottish Council"],
  ["Welsh Council"],
  ["Northern Ireland District Council"],
  ["City of London Corporation"]
];

function countByTypes(authorities: LocalAuthority[], types: LocalAuthorityType[]) {
  return authorities.filter((authority) => types.includes(authority.type)).length;
}

function hasType(authorities: LocalAuthority[], types: LocalAuthorityType[]) {
  return authorities.some((authority) => types.includes(authority.type));
}

/** True when the constituency spans more than one peer local authority (e.g. two districts). */
export function crossesLocalAuthorityBoundaries(authorities: LocalAuthority[]) {
  if (authorities.length <= 1) return false;

  for (const types of SAME_TIER_GROUPS) {
    if (countByTypes(authorities, types) > 1) return true;
  }

  const hasCounty = hasType(authorities, ["County Council"]);
  const hasDistrict = hasType(authorities, DISTRICT_LEVEL_TYPES);
  const hasUnitary = hasType(authorities, ["Unitary Authority"]);
  const hasCityOfLondon = hasType(authorities, ["City of London Corporation"]);

  if (hasUnitary && (hasCounty || hasDistrict)) return true;
  if (hasCityOfLondon && authorities.length > 1) return true;

  return false;
}

/** True when multiple linked authorities are stacked tiers only (e.g. county + single district). */
export function hasMultipleTiersOnly(authorities: LocalAuthority[]) {
  return authorities.length > 1 && !crossesLocalAuthorityBoundaries(authorities);
}
