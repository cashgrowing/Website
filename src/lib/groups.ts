import type { Home } from "./hostaway/types";

/**
 * Pages that group homes by what matters to a guest: a pool, an ocean view,
 * room for eight. Cross-area, unlike the area x attribute pages in
 * attributes.ts, and driven entirely by Hostaway data - nothing is curated by
 * hand, so a page cannot go stale.
 *
 * A group exists only when it narrows the choice: at least three homes
 * belong to it, and not every home does. Below three it is a thin page; at
 * all of them it is the /homes list again under another heading, which is
 * what the owner saw with three houses and asked to have hidden. Groups come
 * back on their own once the portfolio is big enough for one to exclude
 * something.
 *
 * Deliberately not called "collections" anywhere a visitor can read: that is
 * a competitor's word.
 */
export type HomeGroup = {
  /** URL segment under /homes/groups/. */
  slug: string;
  /** The H1 and the tile label. */
  name: string;
  /** Under 60 characters once " | WildRoots" is appended. */
  title: string;
  /** Under 155 characters. */
  description: string;
  /** Opening paragraph. The Studio can override it per group. */
  intro: string;
  matches: (home: Home) => boolean;
};

/** Match against amenity names and owner-set tags together. */
function anyOf(patterns: RegExp[]): (home: Home) => boolean {
  return (home) =>
    [...home.amenities, ...home.tags].some((value) => patterns.some((p) => p.test(value)));
}

/*
 * The same wording rules as attributes.ts, written out here rather than
 * imported: the tests load this file directly under Node, which cannot follow
 * an extensionless import. Keep the two in step if Hostaway's wording changes.
 *
 * "Pool table" is a games room, not a pool; the lookahead keeps it out.
 */
const POOL = [/\bpool\b(?!\s*table)/i];

export const HOME_GROUPS: HomeGroup[] = [
  {
    slug: "pool-homes",
    name: "Homes with a pool",
    title: "Vacation homes with a pool, Uvita & Dominical",
    description:
      "Houses with their own pool on Costa Rica's South Pacific coast, cleaned and checked before every arrival. Book direct with the local team.",
    intro:
      "Every house here has its own pool, cleaned and chemically checked before each arrival and again during longer stays. Most sit in the hills above Uvita and Dominical, where the afternoon breeze does the rest.",
    matches: anyOf(POOL),
  },
  {
    slug: "ocean-view",
    name: "Homes with an ocean view",
    title: "Ocean view vacation homes, Uvita & Dominical",
    description:
      "Houses looking out over the Pacific from the hills above Uvita, Dominical and Ojochal. Looked after by the local team, booked direct.",
    intro:
      "The coast here rises fast, so a house ten minutes from the beach can look straight down onto the Whale's Tail. These are the ones that do.",
    matches: anyOf([/ocean\s*view/i, /sea\s*view/i, /\bview\s*of\s*the\s*(ocean|sea)\b/i]),
  },
  {
    slug: "sleeps-8-plus",
    name: "Homes that sleep 8 or more",
    title: "Large vacation homes for 8+ guests, Uvita",
    description:
      "Houses for big groups and two families on Costa Rica's South Pacific coast, with the kitchen, pool and bedrooms to match. Book direct.",
    intro:
      "Two families, a reunion, a surf trip with friends. These houses have the bedrooms, the bathrooms and the kitchen for it, and a team next door if anything needs sorting.",
    matches: (home) => (home.sleeps ?? 0) >= 8,
  },
  {
    slug: "walk-to-beach",
    name: "A short walk to the beach",
    title: "Vacation homes a walk from the beach, Uvita",
    description:
      "Houses close enough to walk to the sand in Uvita, Dominical and Bahía Ballena, with no car needed for the morning swim. Booked direct.",
    intro:
      "No car for the morning swim. These houses are close enough to walk to the sand, which on this coast is rarer than it sounds.",
    matches: anyOf([
      /walk(ing)?\s*(distance\s*)?to\s*(the\s*)?beach/i,
      /beach\s*front/i,
      /steps?\s*(from|to)\s*the\s*beach/i,
    ]),
  },
  {
    slug: "for-two",
    name: "Homes for two",
    title: "Vacation homes for two, Uvita & Dominical",
    description:
      "One-bedroom houses for a couple on Costa Rica's South Pacific coast: private, quiet, and looked after by the local team.",
    intro:
      "One bedroom, one pool, nobody else. These are the houses we send couples to.",
    matches: (home) => home.bedrooms === 1,
  },
];
/*
 * There is no pets group. The owner asked for it to go (2026-09-11); whether
 * a house takes dogs is a conversation, not a filter. Pets still appear as an
 * amenity on each house page, straight from Hostaway.
 */

/** The site-wide threshold. Below this, no page is built. */
export const MIN_HOMES_FOR_GROUP = 3;

export function getHomeGroup(slug: string): HomeGroup | undefined {
  return HOME_GROUPS.find((group) => group.slug === slug);
}

export function homesInGroup(homes: Home[], group: HomeGroup): Home[] {
  return homes.filter((home) => group.matches(home));
}

/**
 * Every group that clears the threshold AND leaves something out, with its
 * homes. The single source of truth for the routes, the sitemap, the tiles
 * and the links to them, so they cannot disagree.
 */
export function qualifyingGroups(homes: Home[]): Array<{ group: HomeGroup; homes: Home[] }> {
  return HOME_GROUPS.map((group) => ({ group, homes: homesInGroup(homes, group) })).filter(
    (entry) => entry.homes.length >= MIN_HOMES_FOR_GROUP && entry.homes.length < homes.length,
  );
}
