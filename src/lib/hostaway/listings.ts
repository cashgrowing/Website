import "server-only";

import { AREA_NAMES } from "@/lib/site";
import { hostawayGet, isHostawayConfigured } from "./client";
import type { Home, HomePhoto, HostawayListing } from "./types";

const COMBINING_MARKS = /[\u0300-\u036f]/g;

/** Lowercase, strip accents, collapse to a URL-safe slug. "Bahia" stays "bahia". */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fold(input: string): string {
  return input.normalize("NFD").replace(COMBINING_MARKS, "").toLowerCase();
}

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

  const photos: HomePhoto[] = images.map((image, index) => ({
    url: image.url,
    alt: image.caption?.trim()
      ? `${image.caption.trim()} - ${homeName}`
      : index === 0
        ? place
        : `${place}, photo ${index + 1}`,
  }));

  if (photos.length === 0 && listing.thumbnailUrl) {
    photos.push({ url: listing.thumbnailUrl, alt: place });
  }
  return photos;
}

function toHome(listing: HostawayListing): Home {
  // Prefer the guest-facing name; internal names are for the office, not the site.
  const name =
    listing.externalListingName?.trim() ||
    listing.name?.trim() ||
    listing.internalListingName?.trim() ||
    `Home ${listing.id}`;

  const area = matchArea(listing);

  return {
    id: listing.id,
    slug: slugify(name) || `home-${listing.id}`,
    name,
    area,
    city: listing.city?.trim() || null,
    description: toPlainText(listing.description),
    bedrooms: listing.bedroomsNumber ?? null,
    bathrooms: listing.bathroomsNumber ?? null,
    sleeps: listing.personCapacity ?? null,
    basePrice: typeof listing.price === "number" && listing.price > 0 ? listing.price : null,
    currency: listing.currencyCode?.trim() || "USD",
    geo:
      typeof listing.lat === "number" && typeof listing.lng === "number"
        ? { latitude: listing.lat, longitude: listing.lng }
        : null,
    amenities: (listing.listingAmenities ?? [])
      .map((amenity) => amenity?.amenityName?.trim())
      .filter((value): value is string => Boolean(value)),
    photos: toPhotos(listing, name, area),
  };
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
    const homes = listings.filter((listing) => listing?.id != null).map(toHome);
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

export async function getHomesByArea(area: string): Promise<Home[]> {
  const homes = await getHomes();
  return homes.filter((home) => home.area === area);
}
