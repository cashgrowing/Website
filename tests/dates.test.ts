import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  engineListingUrl,
  engineSearchUrl,
  readStay,
  stayQuery,
  withStay,
} from "../src/lib/dates.ts";

const ENGINE = "https://book.wildrootscr.com";

describe("carrying a guest's dates through to the booking engine", () => {
  it("reads a valid stay and defaults guests to two", () => {
    const stay = readStay(new URLSearchParams("checkin=2026-10-19&checkout=2026-10-22"));
    assert.deepEqual(stay, { checkin: "2026-10-19", checkout: "2026-10-22", guests: 2 });
  });

  it("refuses malformed or reversed dates rather than guessing", () => {
    assert.equal(readStay(new URLSearchParams("checkin=19/10/2026&checkout=2026-10-22")), null);
    assert.equal(readStay(new URLSearchParams("checkin=2026-10-22&checkout=2026-10-19")), null);
    assert.equal(readStay(new URLSearchParams("checkin=2026-10-19&checkout=2026-10-19")), null);
    assert.equal(readStay(new URLSearchParams("")), null);
    assert.equal(readStay(null), null);
  });

  it("clamps guests to something a house can hold", () => {
    const many = readStay(new URLSearchParams("checkin=2026-10-19&checkout=2026-10-22&guests=99"));
    assert.equal(many?.guests, 16);
    const none = readStay(new URLSearchParams("checkin=2026-10-19&checkout=2026-10-22&guests=0"));
    assert.equal(none?.guests, 2);
    const junk = readStay(new URLSearchParams("checkin=2026-10-19&checkout=2026-10-22&guests=abc"));
    assert.equal(junk?.guests, 2);
  });

  it("uses the parameter names the engine actually honours", () => {
    const stay = { checkin: "2026-10-19", checkout: "2026-10-22", guests: 2 };
    assert.equal(
      engineListingUrl(ENGINE, 581362, stay),
      "https://book.wildrootscr.com/listings/581362?start=2026-10-19&end=2026-10-22&numberOfGuests=2",
    );
    assert.equal(
      engineSearchUrl(ENGINE, stay),
      "https://book.wildrootscr.com/search?start=2026-10-19&end=2026-10-22&numberOfGuests=2",
    );
    // The engine ignores ?listingId= on its homepage and strands the guest there.
    assert.ok(!engineListingUrl(ENGINE, 581362, null).includes("listingId"));
    assert.equal(engineListingUrl(ENGINE, 581362, null), "https://book.wildrootscr.com/listings/581362");
  });

  it("passes the stay along our own links only when there is one", () => {
    const stay = { checkin: "2026-10-19", checkout: "2026-10-22", guests: 3 };
    assert.equal(withStay("/homes/casa", stay), `/homes/casa?${stayQuery(stay)}`);
    assert.equal(withStay("/homes/casa?x=1", stay), `/homes/casa?x=1&${stayQuery(stay)}`);
    assert.equal(withStay("/homes/casa", null), "/homes/casa");
  });
});
