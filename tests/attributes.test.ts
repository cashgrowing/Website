import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  ATTRIBUTES,
  MIN_HOMES_FOR_ATTRIBUTE_PAGE,
  getAttribute,
  homeHasAttribute,
  qualifyingPairs,
} from "../src/lib/attributes.ts";
import type { Home } from "../src/lib/hostaway/types.ts";

/** Minimal Home; only area and amenities matter to this logic. */
function home(id: number, area: string | null, amenities: string[]): Home {
  return {
    id,
    slug: `home-${id}`,
    name: `Home ${id}`,
    area,
    city: area,
    description: null,
    bedrooms: 2,
    bathrooms: 1,
    sleeps: 4,
    basePrice: null,
    currency: "USD",
    geo: null,
    amenities,
    photos: [],
  };
}

const AREAS = [
  { name: "Uvita", slug: "uvita" },
  { name: "Dominical", slug: "dominical" },
  { name: "Bahía Ballena", slug: null },
] as const;

describe("area x attribute pages", () => {
  it("builds nothing when there are no homes", () => {
    // The state the site is in today, before Hostaway is connected.
    assert.deepEqual(qualifyingPairs([], AREAS), []);
  });

  it("refuses to build a page for fewer than three homes", () => {
    // Section 5's threshold. A page listing one house is a thin page, and thin
    // pages drag down the pages that are not.
    const two = [home(1, "Uvita", ["Pool"]), home(2, "Uvita", ["Private pool"])];
    assert.deepEqual(qualifyingPairs(two, AREAS), []);
  });

  it("builds the page at exactly three", () => {
    const three = [
      home(1, "Uvita", ["Pool"]),
      home(2, "Uvita", ["Private pool"]),
      home(3, "Uvita", ["Shared pool", "Wifi"]),
    ];
    const pairs = qualifyingPairs(three, AREAS);
    assert.equal(pairs.length, 1);
    assert.equal(pairs[0]?.attribute.slug, "pool-homes");
    assert.equal(pairs[0]?.areaSlug, "uvita");
    assert.equal(pairs[0]?.homes.length, MIN_HOMES_FOR_ATTRIBUTE_PAGE);
  });

  it("counts each area separately", () => {
    // Two pools in Uvita and two in Dominical is four homes and no page.
    const split = [
      home(1, "Uvita", ["Pool"]),
      home(2, "Uvita", ["Pool"]),
      home(3, "Dominical", ["Pool"]),
      home(4, "Dominical", ["Pool"]),
    ];
    assert.deepEqual(qualifyingPairs(split, AREAS), []);
  });

  it("ignores areas with no page of their own", () => {
    // Bahía Ballena has no /stay route, so it cannot have attribute pages.
    const homes = [1, 2, 3, 4].map((i) => home(i, "Bahía Ballena", ["Pool"]));
    assert.deepEqual(qualifyingPairs(homes, AREAS), []);
  });

  it("ignores homes whose area Hostaway did not resolve", () => {
    const homes = [1, 2, 3].map((i) => home(i, null, ["Pool"]));
    assert.deepEqual(qualifyingPairs(homes, AREAS), []);
  });

  it("matches the amenity wording Hostaway actually produces", () => {
    const pool = getAttribute("pool-homes")!;
    for (const wording of ["Pool", "Private pool", "Shared Pool", "Swimming pool", "POOL"]) {
      assert.ok(homeHasAttribute(home(1, "Uvita", [wording]), pool), `should match "${wording}"`);
    }
    // A games room is not a pool.
    assert.equal(homeHasAttribute(home(1, "Uvita", ["Pool table"]), pool), false);
    assert.equal(homeHasAttribute(home(1, "Uvita", ["Pool table", "Private pool"]), pool), true);

    const view = getAttribute("ocean-view-homes")!;
    for (const wording of ["Ocean view", "Sea view", "ocean views"]) {
      assert.ok(homeHasAttribute(home(1, "Uvita", [wording]), view), `should match "${wording}"`);
    }
    assert.equal(homeHasAttribute(home(1, "Uvita", ["Garden view"]), view), false);

    const pets = getAttribute("pet-friendly-homes")!;
    assert.ok(homeHasAttribute(home(1, "Uvita", ["Pets allowed"]), pets));
    assert.ok(homeHasAttribute(home(1, "Uvita", ["Dog friendly"]), pets));
    assert.equal(homeHasAttribute(home(1, "Uvita", ["No pets"]), pets), false);
  });

  it("gives every attribute a unique slug and a description that fits a meta tag", () => {
    const slugs = ATTRIBUTES.map((a) => a.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const attribute of ATTRIBUTES) {
      assert.ok(attribute.blurb.length <= 120, `${attribute.slug} blurb is too long to compose`);
      assert.ok(/^[a-z0-9-]+$/.test(attribute.slug), `${attribute.slug} is not URL-safe`);
    }
  });
});
