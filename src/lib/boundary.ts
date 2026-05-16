import type { ConstituencyView } from "@/lib/types";

export const mismatchExplainer =
  "This constituency crosses more than one local government or devolution geography. DevoCompare shows each relevant arrangement rather than forcing a single answer.";

export function buildBoundaryExplainer(view: ConstituencyView) {
  const notes: string[] = [];

  if (view.hasMultipleDevolutionAreas) {
    notes.push(mismatchExplainer);
  } else if (view.hasMultipleLocalAuthorities) {
    notes.push(
      "This constituency crosses local authority boundaries, but the relevant authorities sit within the same devolution geography."
    );
  }

  if (view.devolvedParliament) {
    notes.push(
      "This constituency is in Scotland, Wales or Northern Ireland, so devolved parliament powers are shown as the primary devolution layer. Local authority information is still shown separately."
    );
  }

  if (view.boundaryNote) notes.push(view.boundaryNote);

  return notes;
}
