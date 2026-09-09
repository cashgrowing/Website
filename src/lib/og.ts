import { BRAND } from "./site";

export type OgImage = { url: string; width: number; height: number; alt: string };

/**
 * Descriptor for a page's generated share card.
 *
 * Relative on purpose: `metadataBase` in the root layout resolves it against
 * the canonical origin, so the card a crawler fetches always points at the real
 * domain rather than whichever preview URL rendered the page.
 */
export function ogImage(title: string, kicker: string = BRAND.legalName): OgImage {
  const params = new URLSearchParams({ title, kicker });
  return {
    url: `/og?${params.toString()}`,
    width: 1200,
    height: 630,
    alt: `${title} — ${BRAND.name}`,
  };
}
