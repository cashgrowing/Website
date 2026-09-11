import { NextResponse, type NextRequest } from "next/server";

import { readStay } from "@/lib/dates";
import { getQuote } from "@/lib/hostaway/calendar";
import { getHomes } from "@/lib/hostaway/listings";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * GET /api/homes/{hostawayId}/quote?checkin&checkout&guests
 *
 * Hostaway's total for a stay, with its breakdown, so the house page can
 * show the same number the payment form will. One call per change of dates
 * or guests, which is why it is rate limited per connection: Hostaway
 * allows 400 price calculations per ten seconds for the whole account.
 */
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!/^\d{1,12}$/.test(id)) {
    return NextResponse.json({ error: "Not a house we list." }, { status: 404 });
  }

  const stay = readStay(request.nextUrl.searchParams);
  if (!stay) {
    return NextResponse.json({ error: "Choose a check-in and a check-out first." }, { status: 400 });
  }

  const limit = rateLimit(`quote:${clientIp(request)}`, 60, 60);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many price checks from this connection. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const home = (await getHomes()).find((candidate) => candidate.id === Number(id));
  if (!home) {
    return NextResponse.json({ error: "Not a house we list." }, { status: 404 });
  }

  try {
    const quote = await getQuote(home.id, stay, home.currency);
    return NextResponse.json(quote, {
      // The same dates asked twice in two minutes get the same answer.
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error(`[quote] could not price listing ${home.id} for ${stay.checkin}..${stay.checkout}:`, error);
    return NextResponse.json(
      { error: "We could not price those dates right now." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
