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

/**
 * Figtree, fetched from Google Fonts so the card is set in the site's own face
 * rather than ImageResponse's default sans.
 *
 * Two things make this safe. The font is requested for only the characters on
 * the card, so the payload is small; and every failure falls back to the default
 * font rather than erroring, because a card in the wrong typeface is a small
 * problem and a card that 500s is a broken link preview.
 *
 * Cards are cached immutably per query string, so this runs once per distinct
 * title rather than per request.
 */
async function loadFigtree(text: string): Promise<ArrayBuffer | null> {
  try {
    const url =
      "https://fonts.googleapis.com/css2?family=Figtree:wght@300" +
      `&text=${encodeURIComponent(text)}`;
    // An old user agent makes Google serve TrueType; modern ones get woff2,
    // which the image renderer cannot read.
    const css = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" },
      next: { revalidate: 86400 },
    }).then((res) => (res.ok ? res.text() : ""));

    const src = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!src) return null;

    const font = await fetch(src, { next: { revalidate: 86400 } });
    return font.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

const BLACK = "#141210";
const GOLD = "#877750";
const TAN = "#b8a181";
const PAPER = "#fcfbf8";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const title = (params.get("title") ?? "WildRoots").slice(0, 120);
  const kicker = (params.get("kicker") ?? "WildRoots Property Management").slice(0, 80);

  const figtree = await loadFigtree(`${title}${kicker}Uvita · Dominical · Ojochal · Costa Rica`);

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
          fontFamily: figtree ? "Figtree" : undefined,
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
      ...(figtree
        ? { fonts: [{ name: "Figtree", data: figtree, weight: 300 as const, style: "normal" as const }] }
        : {}),
      headers: {
        // Immutable per query string; safe to cache hard at the edge.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
