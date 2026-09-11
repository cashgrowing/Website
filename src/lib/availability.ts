/**
 * A house's calendar as the site reasons about it: one record per night,
 * and the rules for which stays those nights allow.
 *
 * Plain data and plain functions with no imports, so the same code runs on
 * the server (normalising what Hostaway sends), in the browser (deciding
 * which days a guest may tap) and under the Node test runner.
 */

/** One night. `price` is the nightly rate Hostaway publishes for it. */
export type Night = {
  date: string;
  available: boolean;
  price: number | null;
  /** Fewest nights a stay starting on this night may have. */
  minStay: number;
  /** A stay may not start on this day. */
  closedOnArrival: boolean;
  /** A stay may not end on this day. */
  closedOnDeparture: boolean;
};

export type Availability = {
  currency: string;
  /** First and last dates covered, inclusive. Outside them nothing is known. */
  from: string;
  to: string;
  nights: Night[];
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function truthy(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Hostaway's calendar has arrived in two shapes: the documented API returns
 * an array of day objects; the booking engine's own endpoint returns an
 * object keyed by date. Both carry the same fields. Anything unrecognisable
 * is dropped rather than guessed, and the result is sorted by date.
 */
export function normaliseCalendar(raw: unknown): Night[] {
  const items: unknown[] = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object"
      ? Object.values(raw as Record<string, unknown>)
      : [];

  const nights: Night[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const day = item as Record<string, unknown>;
    const date = typeof day.date === "string" ? day.date.slice(0, 10) : "";
    if (!ISO_DATE.test(date)) continue;

    const available =
      day.isAvailable !== undefined ? truthy(day.isAvailable) : day.status === "available";
    const minStay = numberOrNull(day.minimumStay);

    nights.push({
      date,
      available,
      price: numberOrNull(day.price),
      minStay: minStay && minStay > 0 ? Math.round(minStay) : 1,
      closedOnArrival: truthy(day.closedOnArrival),
      closedOnDeparture: truthy(day.closedOnDeparture),
    });
  }
  return nights.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/** Nights keyed by date, for the lookups below. */
export function indexNights(nights: Night[]): Map<string, Night> {
  return new Map(nights.map((night) => [night.date, night]));
}

/** Whole nights between two YYYY-MM-DD strings, or null when either is missing. */
export function nightsBetween(checkin: string, checkout: string): number | null {
  if (!checkin || !checkout) return null;
  const nights = Math.round(
    (Date.parse(`${checkout}T00:00:00Z`) - Date.parse(`${checkin}T00:00:00Z`)) / 86_400_000,
  );
  return nights > 0 ? nights : null;
}

/** The day after a YYYY-MM-DD string, without touching local time zones. */
export function nextDay(iso: string): string {
  return new Date(Date.parse(`${iso}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
}

/**
 * Whether a guest may start a stay on this day. Unknown days (outside what
 * was loaded) are treated as closed: better to refuse a tap than to send
 * someone to a checkout that will refuse them.
 */
export function canArrive(index: Map<string, Night>, iso: string): boolean {
  const night = index.get(iso);
  return Boolean(night && night.available && !night.closedOnArrival);
}

/**
 * The last day a stay starting on `checkin` may end: the morning after the
 * last free night in a row. A guest may check out on the day a booked night
 * begins - the house is theirs until that morning.
 */
export function lastCheckout(index: Map<string, Night>, checkin: string): string {
  let day = checkin;
  while (index.get(day)?.available) day = nextDay(day);
  return day;
}

/** Whether a stay from `checkin` may end on `iso`. */
export function canDepart(index: Map<string, Night>, checkin: string, iso: string): boolean {
  if (iso <= checkin) return false;
  const night = index.get(iso);
  if (night?.closedOnDeparture) return false;
  return iso <= lastCheckout(index, checkin);
}

export type StayCheck =
  | { ok: true; nights: number; total: number | null }
  | { ok: false; reason: "unavailable" | "min-stay" | "no-arrival" | "no-departure"; minStay?: number };

/**
 * The verdict on a whole stay, and the sum of its nightly rates when every
 * night has one. The total is nightly rates only - cleaning fee and taxes are
 * Hostaway's to add, and the quote endpoint asks it to.
 */
export function checkStay(index: Map<string, Night>, checkin: string, checkout: string): StayCheck {
  const nights = nightsBetween(checkin, checkout);
  if (!nights) return { ok: false, reason: "unavailable" };

  const first = index.get(checkin);
  if (!first || !first.available) return { ok: false, reason: "unavailable" };
  if (first.closedOnArrival) return { ok: false, reason: "no-arrival" };
  if (nights < first.minStay) return { ok: false, reason: "min-stay", minStay: first.minStay };
  if (index.get(checkout)?.closedOnDeparture) return { ok: false, reason: "no-departure" };

  let total: number | null = 0;
  for (let day = checkin; day < checkout; day = nextDay(day)) {
    const night = index.get(day);
    if (!night || !night.available) return { ok: false, reason: "unavailable" };
    total = total === null || night.price === null ? null : total + night.price;
  }
  return { ok: true, nights, total };
}

/** "$690" for dollars; "690 EUR" for anything else, the way the cards do it. */
export function formatMoney(amount: number, currency: string): string {
  const whole = Number.isInteger(amount)
    ? String(amount)
    : amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency === "USD" ? `$${whole}` : `${whole} ${currency}`;
}
