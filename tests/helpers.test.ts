import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { rateLimit } from "../src/lib/rate-limit.ts";
import { fold, slugify } from "../src/lib/slug.ts";

describe("slug helpers", () => {
  it("strips accents so Spanish place names give clean URLs", () => {
    // These become real URLs: /stay/bahia-ballena, not /stay/bah%C3%ADa-ballena.
    assert.equal(slugify("Bahía Ballena"), "bahia-ballena");
    assert.equal(slugify("Tres Ríos"), "tres-rios");
    assert.equal(slugify("Pérez Zeledón"), "perez-zeledon");
  });

  it("handles the punctuation that shows up in house names", () => {
    assert.equal(slugify("Casa Canto Ballena"), "casa-canto-ballena");
    assert.equal(slugify("The Whale's Tail"), "the-whales-tail");
    assert.equal(slugify("Casa  —  Nido   Tucán"), "casa-nido-tucan");
    assert.equal(slugify("  leading and trailing  "), "leading-and-trailing");
  });

  it("returns an empty string when there is nothing usable, so callers can fall back", () => {
    assert.equal(slugify("!!!"), "");
    assert.equal(slugify(""), "");
  });

  it("folds accents and case for matching free text", () => {
    assert.equal(fold("Bahía Ballena"), "bahia ballena");
    assert.ok(fold("Uvita, BAHÍA Ballena").includes(fold("Bahía Ballena")));
  });
});

describe("rate limiter", () => {
  it("allows up to the limit, then blocks", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      assert.equal(rateLimit(key, 5, 600).ok, true, `request ${i + 1} should pass`);
    }
    const blocked = rateLimit(key, 5, 600);
    assert.equal(blocked.ok, false);
    assert.ok(blocked.retryAfter > 0, "a blocked caller is told when to come back");
  });

  it("counts each key separately, so one abuser cannot lock out everyone", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    for (let i = 0; i < 6; i++) rateLimit(a, 5, 600);
    assert.equal(rateLimit(a, 5, 600).ok, false, "the abuser is blocked");
    assert.equal(rateLimit(b, 5, 600).ok, true, "an unrelated visitor is not");
  });

  it("lets the window expire", async () => {
    const key = `w-${Math.random()}`;
    // One-second window so the test does not sit waiting.
    for (let i = 0; i < 3; i++) rateLimit(key, 3, 1);
    assert.equal(rateLimit(key, 3, 1).ok, false);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    assert.equal(rateLimit(key, 3, 1).ok, true, "the window should have reset");
  });

  it("reports how many requests remain", () => {
    const key = `r-${Math.random()}`;
    assert.equal(rateLimit(key, 3, 600).remaining, 2);
    assert.equal(rateLimit(key, 3, 600).remaining, 1);
    assert.equal(rateLimit(key, 3, 600).remaining, 0);
  });
});
