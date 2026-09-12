import "server-only";

import { fold, slugify } from "@/lib/slug";
import { AREA_NAMES } from "@/lib/site";
import { summariseCalendar } from "@/lib/availability";
import { calendarWindow, getCalendar } from "./calendar";
import { hostawayGet, isHostawayConfigured } from "./client";
import type { Home, HomePhoto, HostawayListing } from "./types";

/** Hostaway descriptions arrive as HTML. The site renders text, never raw HTML. */
function toPlainText(html: string | null | undefined): string | null {
  if (!html) return null;
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text.length > 0 ? text : null;
}

/** Map Hostaway's free-text city onto an area we actually serve, or null. */
function matchArea(listing: HostawayListing): string | null {
  const haystack = fold(
    [listing.city, listing.address, listing.name, listing.externalListingName]
      .filter(Boolean)
      .join(" "),
  );
  return AREA_NAMES.find((area) => haystack.includes(fold(area))) ?? null;
}

/**
 * Every image needs alt text (the build-time check in Phase 3 fails without it),
 * so we derive a description whenever Hostaway has no caption.
 */
function toPhotos(listing: HostawayListing, homeName: string, area: string | null): HomePhoto[] {
  const images = (listing.listingImages ?? [])
    .filter(
      (image): image is { url: string; caption?: string | null; sortOrder?: number | null } =>
        Boolean(image?.url),
    )
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const place = area ? `${homeName} in ${area}, Costa Rica` : `${homeName}, Costa Rica`;

  const photos: HomePhoto[] = images.map((image, index) => {
    const caption = image.caption?.trim() || null;
    return {
      url: image.url,
      alt: caption ? `${caption} - ${homeName}` : index === 0 ? place : `${place}, photo ${index + 1}`,
      caption,
    };
  });

  if (photos.length === 0 && listing.thumbnailUrl) {
    photos.push({ url: listing.thumbnailUrl, alt: place, caption: null });
  }
  return photos;
}

/**
 * Addresses the site once used for a house, by Hostaway id. Renaming a house
 * in Hostaway changes its address here; add the old one so links already
 * shared, indexed or bookmarked keep working. Never remove an entry.
 */
const LEGACY_HOME_SLUGS: Record<string, number> = {
  "8-personas-piscina-wifi-3-cuartos-4-banos": 580709,
  "sleeps-8-pool-privacy-wifi-tropical-gardens": 580720,
};

/** Every slug this house should answer to besides its own. */
function aliasesFor(listing: HostawayListing, slug: string): string[] {
  const fromNames = [listing.name, listing.externalListingName, listing.internalListingName]
    .map((value) => slugify(value?.trim() ?? ""))
    .filter((candidate) => candidate && candidate !== slug);
  const legacy = Object.entries(LEGACY_HOME_SLUGS)
    .filter(([, id]) => id === listing.id)
    .map(([old]) => old);
  return [...new Set([...fromNames, ...legacy])].filter((alias) => alias !== slug);
}

function toHome(listing: HostawayListing): Home {
  /*
   * The house's own name - "Casa Canto Ballena" - not the channel title.
   * Hostaway keeps both: `internalListingName` is the name in the dashboard,
   * what the office calls the house; `name` and `externalListingName` carry
   * the keyword-stuffed title written for Airbnb ("8 personas, piscina,
   * wifi | 3 cuartos, 4 baños"). Checked against a live build: `name` is
   * the channel title too. Our pages are ours, and a house should be called
   * by its name on them. Whoever adds a listing in Hostaway should give it
   * a name fit to print.
   */
  const name =
    listing.internalListingName?.trim() ||
    listing.name?.trim() ||
    listing.externalListingName?.trim() ||
    `Home ${listing.id}`;

  const area = matchArea(listing);
  const slug = slugify(name) || `home-${listing.id}`;

  return {
    id: listing.id,
    slug,
    aliases: aliasesFor(listing, slug),
    name,
    area,
    city: listing.city?.trim() || null,
    description: toPlainText(listing.description),
    bedrooms: listing.bedroomsNumber ?? null,
    bathrooms: listing.bathroomsNumber ?? null,
    sleeps: listing.personCapacity ?? null,
    basePrice: typeof listing.price === "number" && listing.price > 0 ? listing.price : null,
    // Filled in from the calendar by withAvailability; these are the defaults if it cannot be read.
    fromPrice: null,
    nextOpen: null,
    bookable: true,
    currency: listing.currencyCode?.trim() || "USD",
    geo:
      typeof listing.lat === "number" && typeof listing.lng === "number"
        ? { latitude: listing.lat, longitude: listing.lng }
        : null,
    amenities: (listing.listingAmenities ?? [])
      .map((amenity) => amenity?.amenityName?.trim())
      .filter((value): value is string => Boolean(value)),
    tags: toTags(listing),
    photos: toPhotos(listing, name, area),
  };
}

/** Tags under either of the names Hostaway has used for them. */
function toTags(listing: HostawayListing): string[] {
  const raw = [
    ...(listing.listingTags ?? []).map((tag) => tag?.name),
    ...(listing.tags ?? []).map((tag) => (typeof tag === "string" ? tag : tag?.name)),
  ];
  return raw.map((tag) => tag?.trim()).filter((tag): tag is string => Boolean(tag));
}

/**
 * Read the house's calendar and set the "from" price and bookability from
 * it. A calendar that cannot be read leaves the defaults: the house stays
 * listed at its base price, which is what happened before calendars existed
 * here, rather than vanishing because Hostaway had a slow minute.
 */
async function withAvailability(home: Home): Promise<Home> {
  try {
    const { from } = calendarWindow();
    const calendar = await getCalendar(home.id, home.currency);
    const year = summariseCalendar(calendar.nights, from, 365);
    const horizon = summariseCalendar(calendar.nights, from, 548);
    return {
      ...home,
      fromPrice: year.fromPrice,
      nextOpen: horizon.nextOpen,
      bookable: year.openNights > 0,
    };
  } catch (error) {
    console.error(`[hostaway] calendar unreadable for ${home.name} (${home.id}); listing at base price:`, error);
    return home;
  }
}

/** Guarantee slugs stay unique even if two homes share a name. */
function withUniqueSlugs(homes: Home[]): Home[] {
  const seen = new Map<string, number>();
  return homes.map((home) => {
    const count = seen.get(home.slug) ?? 0;
    seen.set(home.slug, count + 1);
    return count === 0 ? home : { ...home, slug: `${home.slug}-${home.id}` };
  });
}

/**
 * All homes WildRoots looks after.
 *
 * Returns an empty array - rather than throwing - when Hostaway is not yet
 * connected or is having a bad day, so a preview deploy still renders. The
 * caller decides what to show in place of cards.
 */
export async function getHomes(): Promise<Home[]> {
  if (!isHostawayConfigured()) return [];

  try {
    const listings = await hostawayGet<HostawayListing[]>("/listings", {
      revalidate: 900,
      searchParams: { limit: 500, includeResources: 1 },
    });
    const homes = await Promise.all(
      listings.filter((listing) => listing?.id != null).map(toHome).map(withAvailability),
    );

    /*
     * Log the count on success, not only on failure. An empty array and a
     * failed call produce an identical empty page, so without this the two are
     * indistinguishable from the outside - which is exactly the ambiguity that
     * made connecting Hostaway take as long as it did.
     */
    const areas = homes.reduce<Record<string, number>>((acc, home) => {
      const key = home.area ?? home.city ?? "(unmatched)";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    console.log(
      `[hostaway] fetched ${listings.length} listing(s), mapped ${homes.length} home(s).`,
      `areas=${JSON.stringify(areas)}`,
      // The names the site will print, so a wrong pick shows up in the build log.
      `names=${JSON.stringify(homes.map((home) => home.name))}`,
      `from=${JSON.stringify(homes.map((home) => [home.name, home.fromPrice, home.bookable ? "open" : `booked until ${home.nextOpen ?? "?"}`]))}`,
    );

    return withUniqueSlugs(homes).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("[hostaway] Could not load listings:", error);
    return [];
  }
}

export async function getHomeBySlug(slug: string): Promise<Home | null> {
  const homes = await getHomes();
  return homes.find((home) => home.slug === slug) ?? null;
}

/** The house an old or alternative address belongs to, so the page can redirect. */
export async function getHomeByAlias(slug: string): Promise<Home | null> {
  const homes = await getHomes();
  return homes.find((home) => home.aliases.includes(slug)) ?? null;
}

/**
 * The homes to offer a guest: those with at least one open night in the
 * coming year. A house let long-term keeps its page (and its place in the
 * sitemap) but is not put in front of someone choosing dates. Should every
 * house be unbookable at once, the lists show all of them rather than a
 * blank page - the notice on each page then does the explaining.
 */
export async function getBookableHomes(): Promise<Home[]> {
  const homes = await getHomes();
  const open = homes.filter((home) => home.bookable);
  return open.length > 0 ? open : homes;
}

export async function getHomesByArea(area: string): Promise<Home[]> {
  const homes = await getBookableHomes();
  return homes.filter((home) => home.area === area);
}
