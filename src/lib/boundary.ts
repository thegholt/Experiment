import type { ConstituencyView } from "@/lib/types";
import {
  crossesLocalAuthorityBoundaries,
  hasMultipleTiersOnly
} from "@/lib/local-authorities";

export const mismatchExplainer =
  "This constituency crosses more than one local government or devolution geography. DevoCompare shows each relevant arrangement rather than forcing a single answer.";

export const sameDevolutionCrossingExplainer =
  "This constituency crosses local authority boundaries, but the relevant authorities sit within the same devolution geography.";

export const multiTierExplainer =
  "This area operates with more than one tier of local authorities.";

export function buildBoundaryExplainer(view: ConstituencyView) {
  const notes: string[] = [];
  const crossesBoundaries = crossesLocalAuthorityBoundaries(view.localAuthorities);
  const multiTierOnly = hasMultipleTiersOnly(view.localAuthorities);

  if (view.hasMultipleDevolutionAreas) {
    notes.push(mismatchExplainer);
  } else if (crossesBoundaries) {
    notes.push(sameDevolutionCrossingExplainer);
  } else if (multiTierOnly) {
    notes.push(multiTierExplainer);
  }

  if (view.devolvedParliament) {
    notes.push(
      "This constituency is in Scotland, Wales or Northern Ireland, so devolved parliament powers are shown as the primary devolution layer. Local authority information is still shown separately."
    );
  }

  if (view.boundaryNote) notes.push(view.boundaryNote);

  return notes;
}
