import type { Home } from "./hostaway/types";

/**
 * Area x attribute pages, e.g. pool homes in Uvita.
 *
 * Section 5 of the brief allows these "only when at least 3 homes match". That
 * threshold is the whole point: a page listing one house is a thin page, and a
 * site full of thin pages ranks worse than a site without them. The rule is
 * enforced in generateStaticParams, so a page that would be thin is never built
 * rather than being built and hidden.
 *
 * Matching is done against Hostaway's amenity names, which are free text and
 * vary between accounts, so each attribute carries patterns rather than one
 * exact string.
 */
export type Attribute = {
  slug: string;
  /** Used in the H1: "{label} in Uvita". */
  label: string;
  /** One sentence for the meta description and the page's opening line. */
  blurb: string;
  patterns: RegExp[];
};

export const ATTRIBUTES: Attribute[] = [
  {
    slug: "pool-homes",
    label: "Homes with a pool",
    blurb: "Houses with their own pool, cleaned and chemically checked before every arrival.",
    // Negative lookahead: Hostaway amenity lists contain "Pool table", and a
    // guest who books a "pool home" and finds a games room has a real complaint.
    patterns: [/\bpool\b(?!\s*table)/i],
  },
  {
    slug: "ocean-view-homes",
    label: "Homes with an ocean view",
    blurb: "Houses looking out over the water, most of them in the hills above the bay.",
    patterns: [/ocean\s*view/i, /sea\s*view/i, /\bview\s*of\s*the\s*(ocean|sea)\b/i],
  },
  {
    slug: "pet-friendly-homes",
    label: "Homes that take pets",
    blurb: "Houses where the owner allows dogs, so the whole household can travel.",
    patterns: [/pets?\s*(allowed|friendly|welcome)/i, /\bdog\s*friendly\b/i],
  },
  {
    slug: "homes-with-air-conditioning",
    label: "Homes with air conditioning",
    blurb: "Houses with cooled bedrooms, which matters more here than most guests expect.",
    patterns: [/air\s*conditioning/i, /\bA\/?C\b/],
  },
];

/** The brief's threshold. Below this, no page is built. */
export const MIN_HOMES_FOR_ATTRIBUTE_PAGE = 3;

export function getAttribute(slug: string): Attribute | undefined {
  return ATTRIBUTES.find((attribute) => attribute.slug === slug);
}

export function homeHasAttribute(home: Home, attribute: Attribute): boolean {
  return home.amenities.some((amenity) =>
    attribute.patterns.some((pattern) => pattern.test(amenity)),
  );
}

export function homesWithAttribute(homes: Home[], attribute: Attribute): Home[] {
  return homes.filter((home) => homeHasAttribute(home, attribute));
}

/**
 * Every area/attribute pair that clears the threshold. The single source of
 * truth for both the routes and the sitemap, so the two cannot disagree.
 */
export function qualifyingPairs(
  homes: Home[],
  areas: ReadonlyArray<{ name: string; slug: string | null }>,
): Array<{ area: string; areaSlug: string; attribute: Attribute; homes: Home[] }> {
  const pairs = [];
  for (const area of areas) {
    if (!area.slug) continue;
    const inArea = homes.filter((home) => home.area === area.name);
    for (const attribute of ATTRIBUTES) {
      const matching = homesWithAttribute(inArea, attribute);
      if (matching.length >= MIN_HOMES_FOR_ATTRIBUTE_PAGE) {
        pairs.push({ area: area.name, areaSlug: area.slug, attribute, homes: matching });
      }
    }
  }
  return pairs;
}
