import "server-only";

import { normaliseCalendar, type Availability } from "@/lib/availability";
import type { Stay } from "@/lib/dates";
import { hostawayGet, hostawayPost } from "./client";

/**
 * A house's calendar and prices, read from Hostaway on the server so the
 * house page can show them without loading Hostaway's own widget.
 *
 * Both calls go through our API key. The key never reaches the browser: the
 * route handlers under /api/homes call these and pass on only the answer.
 */

/** How far ahead the calendar is loaded. Hostaway itself stops at about two years. */
export const CALENDAR_MONTHS = 18;

/** Today, then the same day of the month `months` later, both as YYYY-MM-DD. */
export function calendarWindow(now = new Date(), months = CALENDAR_MONTHS): { from: string; to: string } {
  const from = now.toISOString().slice(0, 10);
  const end = new Date(now);
  end.setUTCMonth(end.getUTCMonth() + months);
  return { from, to: end.toISOString().slice(0, 10) };
}

export async function getCalendar(listingId: number, currency: string): Promise<Availability> {
  const { from, to } = calendarWindow();
  const raw = await hostawayGet<unknown>(`/listings/${listingId}/calendar`, {
    // Five minutes: a booking made elsewhere disappears from our calendar
    // quickly, and three houses cost Hostaway one call each per five minutes.
    revalidate: 300,
    searchParams: { startDate: from, endDate: to },
  });
  const nights = normaliseCalendar(raw);
  if (nights.length === 0) {
    throw new Error(`Hostaway calendar for listing ${listingId} came back empty or unreadable.`);
  }
  return { currency, from, to, nights };
}

export type Quote = {
  currency: string;
  /** What the guest will be asked to pay at checkout. */
  total: number;
  /** The breakdown as Hostaway names it: nights, cleaning fee, taxes. */
  lines: Array<{ label: string; amount: number }>;
};

type PriceDetails = {
  totalPrice?: unknown;
  currency?: unknown;
  components?: unknown;
};

function labelOf(component: Record<string, unknown>): string {
  for (const key of ["title", "name", "type"]) {
    const value = component[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "Charge";
}

/**
 * Hostaway's own arithmetic for a stay - nightly rates, cleaning fee, taxes,
 * any length-of-stay or extra-guest rule the owner has set - so the number
 * on our page is the number on the payment form. We could add these up
 * ourselves from the calendar; we would be wrong the first time a rule
 * changed, and never know.
 */
export async function getQuote(listingId: number, stay: Stay, currency: string): Promise<Quote> {
  const result = await hostawayPost<PriceDetails>(`/listings/${listingId}/calendar/priceDetails`, {
    startingDate: stay.checkin,
    endingDate: stay.checkout,
    numberOfGuests: stay.guests,
    version: 2,
  });

  const total = typeof result.totalPrice === "number" ? result.totalPrice : Number(result.totalPrice);
  if (!Number.isFinite(total)) {
    // Log the shape, not the content, so an API change is diagnosable from the logs.
    console.error("[hostaway] priceDetails had no usable totalPrice. keys=", Object.keys(result));
    throw new Error("Hostaway price details had no total.");
  }

  const lines = (Array.isArray(result.components) ? result.components : [])
    .filter((c): c is Record<string, unknown> => Boolean(c) && typeof c === "object")
    .map((c) => {
      const amount = typeof c.total === "number" ? c.total : typeof c.value === "number" ? c.value : NaN;
      return { label: labelOf(c), amount };
    })
    .filter((line) => Number.isFinite(line.amount) && line.amount !== 0);

  return {
    currency: typeof result.currency === "string" && result.currency ? result.currency : currency,
    total,
    lines,
  };
}
