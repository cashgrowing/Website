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
};

/** A photo we are willing to render. `alt` is always populated. */
export type HomePhoto = {
  url: string;
  alt: string;
};

/**
 * The domain object the site renders. Nothing outside `src/lib/hostaway`
 * should touch a raw Hostaway field.
 */
export type Home = {
  id: number;
  slug: string;
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
  photos: HomePhoto[];
};
