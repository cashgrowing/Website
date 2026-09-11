import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  canArrive,
  canDepart,
  checkStay,
  formatMoney,
  indexNights,
  lastCheckout,
  nightsBetween,
  normaliseCalendar,
  type Night,
} from "../src/lib/availability.ts";

function night(date: string, overrides: Partial<Night> = {}): Night {
  return {
    date,
    available: true,
    price: 230,
    minStay: 1,
    closedOnArrival: false,
    closedOnDeparture: false,
    ...overrides,
  };
}

/* October 2026: 1st to 10th free except the 5th, with a rule or two along the way. */
const OCTOBER = indexNights([
  night("2026-10-01", { minStay: 3 }),
  night("2026-10-02"),
  night("2026-10-03", { closedOnDeparture: true }),
  night("2026-10-04"),
  night("2026-10-05", { available: false }),
  night("2026-10-06", { closedOnArrival: true }),
  night("2026-10-07", { price: 300 }),
  night("2026-10-08", { price: 300 }),
  night("2026-10-09", { price: null }),
  night("2026-10-10"),
]);

describe("reading Hostaway's calendar", () => {
  it("accepts the API's array and the engine's object keyed by date", () => {
    const fromArray = normaliseCalendar([
      { date: "2026-10-02", isAvailable: 1, price: 230, minimumStay: 3, closedOnArrival: null },
      { date: "2026-10-01", isAvailable: 0, status: "reserved", price: 230, minimumStay: 3 },
    ]);
    const fromObject = normaliseCalendar({
      "2026-10-02": { date: "2026-10-02", isAvailable: 1, price: 230, minimumStay: 3 },
      "2026-10-01": { date: "2026-10-01", isAvailable: 0, price: 230, minimumStay: 3 },
    });
    for (const nights of [fromArray, fromObject]) {
      assert.deepEqual(
        nights.map((n) => [n.date, n.available, n.price, n.minStay]),
        [
          ["2026-10-01", false, 230, 3],
          ["2026-10-02", true, 230, 3],
        ],
      );
    }
  });

  it("drops what it cannot read and never invents a minimum stay", () => {
    const nights = normaliseCalendar([null, { date: "not a date" }, { date: "2026-10-01T00:00:00", status: "available", minimumStay: 0 }]);
    assert.deepEqual(nights, [
      { date: "2026-10-01", available: true, price: null, minStay: 1, closedOnArrival: false, closedOnDeparture: false },
    ]);
    assert.deepEqual(normaliseCalendar("nonsense"), []);
  });
});

describe("which days a guest may tap", () => {
  it("lets a stay start on a free night that is open for arrival", () => {
    assert.equal(canArrive(OCTOBER, "2026-10-01"), true);
    assert.equal(canArrive(OCTOBER, "2026-10-05"), false, "booked night");
    assert.equal(canArrive(OCTOBER, "2026-10-06"), false, "closed on arrival");
    assert.equal(canArrive(OCTOBER, "2026-12-25"), false, "nothing loaded for that day");
  });

  it("lets a stay end on the morning the next booking begins, and no later", () => {
    assert.equal(lastCheckout(OCTOBER, "2026-10-02"), "2026-10-05");
    assert.equal(canDepart(OCTOBER, "2026-10-02", "2026-10-05"), true);
    assert.equal(canDepart(OCTOBER, "2026-10-02", "2026-10-06"), false);
    assert.equal(canDepart(OCTOBER, "2026-10-02", "2026-10-03"), false, "closed on departure");
    assert.equal(canDepart(OCTOBER, "2026-10-02", "2026-10-02"), false, "same day");
  });
});

describe("the verdict on a whole stay", () => {
  it("adds up the nightly rates of a good stay", () => {
    assert.deepEqual(checkStay(OCTOBER, "2026-10-01", "2026-10-04"), { ok: true, nights: 3, total: 690 });
    assert.deepEqual(checkStay(OCTOBER, "2026-10-07", "2026-10-09"), { ok: true, nights: 2, total: 600 });
  });

  it("leaves the total blank when a night has no published rate", () => {
    assert.deepEqual(checkStay(OCTOBER, "2026-10-08", "2026-10-10"), { ok: true, nights: 2, total: null });
  });

  it("refuses stays that cross a booked night or break the house's rules", () => {
    assert.deepEqual(checkStay(OCTOBER, "2026-10-03", "2026-10-07"), { ok: false, reason: "unavailable" });
    assert.deepEqual(checkStay(OCTOBER, "2026-10-01", "2026-10-03"), { ok: false, reason: "min-stay", minStay: 3 });
    assert.deepEqual(checkStay(OCTOBER, "2026-10-06", "2026-10-08"), { ok: false, reason: "no-arrival" });
    assert.deepEqual(checkStay(OCTOBER, "2026-10-02", "2026-10-03"), { ok: false, reason: "no-departure" });
    assert.deepEqual(checkStay(OCTOBER, "2026-10-04", "2026-10-02"), { ok: false, reason: "unavailable" });
  });
});

describe("small helpers", () => {
  it("counts nights and formats money the way the cards do", () => {
    assert.equal(nightsBetween("2026-10-19", "2026-10-22"), 3);
    assert.equal(nightsBetween("2026-10-22", "2026-10-19"), null);
    assert.equal(nightsBetween("", "2026-10-19"), null);
    assert.equal(formatMoney(690, "USD"), "$690");
    assert.equal(formatMoney(1005.7, "USD"), "$1,005.70");
    assert.equal(formatMoney(690, "EUR"), "690 EUR");
  });
});
