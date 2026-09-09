import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * Generated Open Graph card, one per page via ?title= and ?kicker=.
 *
 * Typography and the brand palette only - no photography. A share card is not
 * the place to imply a house we have no picture of, and the brief allows real
 * photography only wherever a home is shown.
 */
export const runtime = "nodejs";

const BLACK = "#141210";
const GOLD = "#877750";
const TAN = "#b8a181";
const PAPER = "#fcfbf8";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const title = (params.get("title") ?? "WildRoots").slice(0, 120);
  const kicker = (params.get("kicker") ?? "WildRoots Property Management").slice(0, 80);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BLACK,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: TAN, letterSpacing: 0.5 }}>
          {kicker}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 62 : 76,
            lineHeight: 1.08,
            color: PAPER,
            maxWidth: 960,
            fontWeight: 300,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* The one gold rule, matching the seam used across the site. */}
          <div style={{ display: "flex", height: 1, width: 220, background: GOLD }} />
          <div style={{ display: "flex", marginTop: 22, fontSize: 24, color: TAN }}>
            Uvita · Dominical · Ojochal · Costa Rica
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Immutable per query string; safe to cache hard at the edge.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
