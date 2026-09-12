import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { HOME_GROUPS, MIN_HOMES_FOR_GROUP, getHomeGroup, qualifyingGroups } from "../src/lib/groups.ts";
import type { Home } from "../src/lib/hostaway/types.ts";

function home(
  id: number,
  overrides: Partial<Pick<Home, "amenities" | "tags" | "sleeps" | "bedrooms" | "area">> = {},
): Home {
  return {
    id,
    slug: `home-${id}`,
    aliases: [],
    name: `Home ${id}`,
    area: overrides.area ?? "Uvita",
    city: "Uvita",
    description: null,
    bedrooms: overrides.bedrooms ?? 2,
    bathrooms: 1,
    sleeps: overrides.sleeps ?? 4,
    basePrice: null,
    fromPrice: null,
    nextOpen: null,
    bookable: true,
    currency: "USD",
    geo: null,
    amenities: overrides.amenities ?? [],
    tags: overrides.tags ?? [],
    photos: [],
  };
}

describe("grouped home pages", () => {
  it("builds nothing when there are no homes", () => {
    assert.deepEqual(qualifyingGroups([]), []);
  });

  it("refuses a group below three homes and builds it at exactly three", () => {
    const two = [home(1, { amenities: ["Pool"] }), home(2, { amenities: ["Private pool"] })];
    const without = home(9, { amenities: [] });
    assert.deepEqual(qualifyingGroups([...two, without]), []);

    const three = [...two, home(3, { amenities: ["Swimming pool"] })];
    const groups = qualifyingGroups([...three, without]);
    assert.equal(groups.length, 1);
    assert.equal(groups[0]?.group.slug, "pool-homes");
    assert.equal(groups[0]?.homes.length, MIN_HOMES_FOR_GROUP);
  });

  it("hides a group that every home belongs to - it would be the full list again", () => {
    const allPools = [
      home(1, { amenities: ["Pool"] }),
      home(2, { amenities: ["Pool"] }),
      home(3, { amenities: ["Pool"] }),
    ];
    assert.deepEqual(qualifyingGroups(allPools), []);
    assert.equal(qualifyingGroups([...allPools, home(4, { amenities: [] })]).length, 1);
  });

  it("counts across areas, unlike the area pages", () => {
    const split = [
      home(1, { amenities: ["Pool"], area: "Uvita" }),
      home(2, { amenities: ["Pool"], area: "Dominical" }),
      home(3, { amenities: ["Pool"], area: "Ojochal" }),
      home(4, { amenities: [], area: "Uvita" }),
    ];
    assert.equal(qualifyingGroups(split).length, 1);
  });

  it("matches capacity and bedroom counts from Hostaway's numbers", () => {
    const big = getHomeGroup("sleeps-8-plus")!;
    assert.ok(big.matches(home(1, { sleeps: 8 })));
    assert.ok(big.matches(home(1, { sleeps: 12 })));
    assert.equal(big.matches(home(1, { sleeps: 7 })), false);
    assert.equal(big.matches(home(1, { sleeps: null as unknown as number })), false);

    const two = getHomeGroup("for-two")!;
    assert.ok(two.matches(home(1, { bedrooms: 1 })));
    assert.equal(two.matches(home(1, { bedrooms: 2 })), false);
  });

  it("reads owner-set tags as well as amenities", () => {
    const beach = getHomeGroup("walk-to-beach")!;
    assert.ok(beach.matches(home(1, { tags: ["Walk to beach"] })));
    assert.ok(beach.matches(home(1, { tags: ["walking distance to the beach"] })));
    assert.ok(beach.matches(home(1, { amenities: ["Beachfront"] })));
    assert.equal(beach.matches(home(1, { amenities: ["Beach towels"] })), false);

    const view = getHomeGroup("ocean-view")!;
    assert.ok(view.matches(home(1, { tags: ["Ocean view"] })));
    assert.ok(view.matches(home(1, { amenities: ["Sea view"] })));
    assert.equal(view.matches(home(1, { amenities: ["Garden view"] })), false);
  });

  it("keeps a games room out of the pool group", () => {
    const pool = getHomeGroup("pool-homes")!;
    assert.equal(pool.matches(home(1, { amenities: ["Pool table"] })), false);
    assert.ok(pool.matches(home(1, { amenities: ["Pool table", "Private pool"] })));
  });

  it("gives every group a URL-safe slug and search text that fits", () => {
    const slugs = HOME_GROUPS.map((g) => g.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const group of HOME_GROUPS) {
      assert.ok(/^[a-z0-9-]+$/.test(group.slug), `${group.slug} is not URL-safe`);
      assert.ok(group.title.length + " | WildRoots".length < 60, `${group.slug} title too long`);
      assert.ok(group.description.length <= 155, `${group.slug} description too long`);
      assert.ok(!/collection/i.test(`${group.name} ${group.intro}`), `${group.slug} uses the competitor's word`);
    }
  });
});
