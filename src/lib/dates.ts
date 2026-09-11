/**
 * The dates a guest typed into the availability strip, carried through the
 * whole chain: strip -> /homes -> a house -> the engine's checkout, so nobody
 * types them twice.
 *
 * Plain data and plain functions, safe on the server and in the browser, and
 * exercised directly by the tests.
 */
export type Stay = { checkin: string; checkout: string; guests: number };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type ParamsLike = { get(name: string): string | null };

/** Null unless both dates are well-formed and check-out follows check-in. */
export function readStay(params: ParamsLike | null | undefined): Stay | null {
  if (!params) return null;
  const checkin = params.get("checkin") ?? "";
  const checkout = params.get("checkout") ?? "";
  if (!ISO_DATE.test(checkin) || !ISO_DATE.test(checkout) || checkout <= checkin) return null;
  const guests = Math.min(16, Math.max(1, Number.parseInt(params.get("guests") ?? "", 10) || 2));
  return { checkin, checkout, guests };
}

/** The query string our own pages pass along, e.g. "checkin=…&checkout=…&guests=2". */
export function stayQuery(stay: Stay): string {
  return new URLSearchParams({
    checkin: stay.checkin,
    checkout: stay.checkout,
    guests: String(stay.guests),
  }).toString();
}

/** Append the stay to one of our own paths. */
export function withStay(href: string, stay: Stay | null): string {
  if (!stay) return href;
  return `${href}${href.includes("?") ? "&" : "?"}${stayQuery(stay)}`;
}

/*
 * The booking engine honours exactly these names on exactly these routes,
 * checked against the live engine: `?listingId=` on the homepage is ignored
 * and strands the guest on a search form, and `checkIn`/`checkOut` are
 * ignored everywhere.
 */
function engineParams(url: URL, stay: Stay | null): string {
  if (stay) {
    url.searchParams.set("start", stay.checkin);
    url.searchParams.set("end", stay.checkout);
    url.searchParams.set("numberOfGuests", String(stay.guests));
  }
  return url.toString();
}

/** The engine's page for one house, with the guest's dates when known. */
export function engineListingUrl(base: string, listingId: number, stay: Stay | null): string {
  return engineParams(new URL(`/listings/${listingId}`, base), stay);
}

/** The engine's search results, with the guest's dates when known. */
export function engineSearchUrl(base: string, stay: Stay | null): string {
  return engineParams(new URL("/search", base), stay);
}

/**
 * The engine's payment form for one house - the page after its calendar.
 * Only reachable with a stay: without dates the form has nothing to charge
 * for, so callers link to the house's engine page instead. Verified live:
 * `/checkout/581362?start&end&numberOfGuests=4` opens "Finalize your
 * booking" with those dates, four guests and the full price breakdown.
 */
export function engineCheckoutUrl(base: string, listingId: number, stay: Stay): string {
  return engineParams(new URL(`/checkout/${listingId}`, base), stay);
}

export function formatStayDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
