import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { LocalAuthority } from "./types.ts";
import {
  crossesLocalAuthorityBoundaries,
  hasMultipleTiersOnly
} from "./local-authorities.ts";

function authority(
  id: string,
  type: LocalAuthority["type"],
  countyName?: string
): LocalAuthority {
  return { id, name: id, type, countyName, sourceIds: [] };
}

describe("crossesLocalAuthorityBoundaries", () => {
  it("is false for a single authority", () => {
    assert.equal(
      crossesLocalAuthorityBoundaries([authority("gravesham-borough-council", "District Council")]),
      false
    );
  });

  it("is false for county plus one district (Gravesham pattern)", () => {
    const authorities = [
      authority("gravesham-borough-council", "District Council", "Kent County Council"),
      authority("kent-county-council", "County Council")
    ];
    assert.equal(crossesLocalAuthorityBoundaries(authorities), false);
    assert.equal(hasMultipleTiersOnly(authorities), true);
  });

  it("is true for two districts plus a county (Sevenoaks pattern)", () => {
    const authorities = [
      authority("sevenoaks-district-council", "District Council", "Kent County Council"),
      authority("dartford-borough-council", "District Council", "Kent County Council"),
      authority("kent-county-council", "County Council")
    ];
    assert.equal(crossesLocalAuthorityBoundaries(authorities), true);
    assert.equal(hasMultipleTiersOnly(authorities), false);
  });

  it("is true for two unitary authorities", () => {
    const authorities = [
      authority("westmorland-and-furness-council", "Unitary Authority"),
      authority("cumberland-council", "Unitary Authority")
    ];
    assert.equal(crossesLocalAuthorityBoundaries(authorities), true);
  });

  it("is true for county, district and unitary", () => {
    const authorities = [
      authority("example-county-council", "County Council"),
      authority("example-district-council", "District Council"),
      authority("example-unitary-council", "Unitary Authority")
    ];
    assert.equal(crossesLocalAuthorityBoundaries(authorities), true);
  });
});
