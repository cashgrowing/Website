/** Shape of the Hostaway listing payload we rely on. Fields we ignore are omitted. */
export type HostawayListing = {
  id: number;
  name?: string | null;
  externalListingName?: string | null;
  internalListingName?: string | null;
  description?: string | null;
  city?: string | null;
  state?: string | null;
  countryCode?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  bedroomsNumber?: number | null;
  bathroomsNumber?: number | null;
  personCapacity?: number | null;
  price?: number | null;
  currencyCode?: string | null;
  thumbnailUrl?: string | null;
  listingImages?: Array<{
    id?: number;
    url?: string | null;
    caption?: string | null;
    sortOrder?: number | null;
  }> | null;
  listingAmenities?: Array<{ amenityId?: number; amenityName?: string | null }> | null;
  /**
   * Owner-set tags. Hostaway has exposed these under more than one name over
   * time, so both shapes are read; whichever is present wins.
   */
  listingTags?: Array<{ id?: number; name?: string | null }> | null;
  tags?: Array<string | { name?: string | null }> | null;
};

/** A photo we are willing to render. `alt` is always populated. */
export type HomePhoto = {
  url: string;
  alt: string;
  /** The owner's own words about the photo, when Hostaway has them. Shown under it. */
  caption: string | null;
};

/**
 * The domain object the site renders. Nothing outside `src/lib/hostaway`
 * should touch a raw Hostaway field.
 */
export type Home = {
  id: number;
  slug: string;
  /**
   * Other addresses this house has answered to - slugs of its channel title
   * and of names it had before - so an old link redirects instead of 404ing.
   */
  aliases: string[];
  name: string;
  /** Matched against AREAS when Hostaway's city maps to an area we serve. */
  area: string | null;
  city: string | null;
  description: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sleeps: number | null;
  /** Hostaway's base nightly rate. Null when Hostaway has not published one. */
  basePrice: number | null;
  currency: string;
  geo: { latitude: number; longitude: number } | null;
  amenities: string[];
  /** Owner-set Hostaway tags, e.g. "walk to beach". Empty when none are set. */
  tags: string[];
  photos: HomePhoto[];
};
