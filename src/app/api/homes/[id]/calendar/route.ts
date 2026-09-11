import { NextResponse } from "next/server";

import { getCalendar } from "@/lib/hostaway/calendar";
import { getHomes } from "@/lib/hostaway/listings";

export const runtime = "nodejs";
/** The window starts today, so this cannot be baked at build time. */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/homes/{hostawayId}/calendar
 *
 * Eighteen months of nights for one of our houses: which are free, what each
 * costs, and the house's minimum stay. Read by the calendar on the house page.
 *
 * Only ids that belong to a house we list are answered, so the endpoint
 * cannot be used to read other Hostaway accounts' calendars through our key.
 */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  if (!/^\d{1,12}$/.test(id)) {
    return NextResponse.json({ error: "Not a house we list." }, { status: 404 });
  }

  const home = (await getHomes()).find((candidate) => candidate.id === Number(id));
  if (!home) {
    return NextResponse.json({ error: "Not a house we list." }, { status: 404 });
  }

  try {
    const availability = await getCalendar(home.id, home.currency);
    return NextResponse.json(availability, {
      headers: {
        // Shared for five minutes at the edge; a stale copy is served while a
        // fresh one is fetched, so a guest never waits on Hostaway.
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
      },
    });
  } catch (error) {
    console.error(`[calendar] could not load listing ${home.id}:`, error);
    return NextResponse.json(
      { error: "The calendar is not available right now." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
