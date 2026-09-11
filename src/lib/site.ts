/**
 * Single source of truth for the facts that appear in navigation, the footer,
 * JSON-LD and the WhatsApp handoff. Change them here, not in a component.
 *
 * Rule from the brief: the company speaks as "WildRoots" or "the team".
 * No person is ever named anywhere in this file or anything built from it.
 */

/**
 * Read an origin from the environment, falling back when it is missing *or
 * blank*. A variable that exists with an empty value is the common case in a
 * hosting dashboard - `??` alone would let "" through and `new URL("")` throws
 * at module scope, which fails the whole build.
 */
function origin(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return (trimmed && trimmed.length > 0 ? trimmed : fallback).replace(/\/+$/, "");
}

export const SITE_URL = origin(process.env.NEXT_PUBLIC_SITE_URL, "https://www.wildrootscr.com");

export const BOOKING_ENGINE_URL = origin(
  process.env.NEXT_PUBLIC_BOOKING_ENGINE_URL,
  "https://book.wildrootscr.com",
);

export const BRAND = {
  name: "WildRoots",
  legalName: "WildRoots Property Management",
  tagline: "Vacation rental management on Costa Rica's South Pacific coast",
} as const;

export const CONTACT = {
  whatsappNumber: "+506 8734-7178",
  whatsappUrl: "https://wa.me/50687347178",
  telephone: "+50687347178",
  email: "info@wildrootscr.com",
  addressLocality: "Uvita",
  addressRegion: "Puntarenas",
  addressCountry: "CR",
  geo: { latitude: 9.1559, longitude: -83.7547 },
} as const;

export const SOCIAL = [
  "https://www.instagram.com/wildroots.cr/",
  "https://www.facebook.com/profile.php?id=61567292953732",
] as const;

/** Areas served. `slug` drives /stay/[area]; areas without one are named only. */
export const AREAS = [
  { name: "Uvita", slug: "uvita" },
  { name: "Dominical", slug: "dominical" },
  { name: "Ojochal", slug: "ojochal" },
  { name: "Bahía Ballena", slug: null },
  { name: "Tres Ríos", slug: null },
] as const;

export const AREA_NAMES = AREAS.map((a) => a.name);

/**
 * Guests first. The main menu speaks to people looking for a place to stay;
 * homeowners get one clearly labelled door of their own (OWNER_LINK), shown
 * beside the WhatsApp button. No page tries to talk to both.
 */
export const NAV = [
  { label: "Homes", href: "/homes" },
  { label: "Areas", href: "/stay/uvita" },
  { label: "Guest services", href: "/guest-services" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
] as const;

export const OWNER_LINK = { label: "For homeowners", href: "/property-management-costa-rica" } as const;

export const FOOTER_COLUMNS = [
  {
    heading: "For guests",
    links: [
      { label: "All homes", href: "/homes" },
      { label: "Homes by what matters", href: "/homes/groups" },
      { label: "Guest services", href: "/guest-services" },
      { label: "Bahía Ballena", href: "/vacation-rentals-bahia-ballena" },
      { label: "Whale season", href: "/whale-season" },
      { label: "Check availability", href: BOOKING_ENGINE_URL },
    ],
  },
  {
    heading: "For homeowners",
    links: [
      { label: "Property management", href: "/property-management-costa-rica" },
      { label: "How we charge", href: "/how-we-charge" },
      { label: "Management in Uvita", href: "/vacation-rental-management-uvita" },
      { label: "Management in Dominical", href: "/property-manager-dominical" },
      { label: "Send an enquiry", href: "/contact" },
      { label: "Talk to the team", href: CONTACT.whatsappUrl },
    ],
  },
  {
    heading: "Areas we serve",
    links: [
      { label: "Uvita", href: "/stay/uvita" },
      { label: "Dominical", href: "/stay/dominical" },
      { label: "Ojochal", href: "/stay/ojochal" },
      { label: "Bahía Ballena", href: "/vacation-rentals-bahia-ballena" },
    ],
  },
] as const;

export const LOGOS = {
  /** Flat gold lockup — header, and anywhere on a light background. */
  flatGold: "/brand/WildRoots-PM-imagotipo-PANTONE-871-C.png",
  /** Textured gold lockup — on black only (hero, footer). Never on paper. */
  texturedGold: "/brand/WildRoots-PM-imagotipo-gold.png",
  /** Black lockup — print and OG fallback only. */
  black: "/brand/WildRoots-PM-imagotipo-negro.png",
} as const;
