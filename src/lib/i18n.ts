import { SITE_URL } from "./site";

/**
 * i18n groundwork. English ships now; Spanish is phase 2.
 *
 * Deliberately *not* done by moving every route under `/[locale]/`. English
 * URLs are the ones that already rank, and section 7 of the brief says to keep
 * them, so English stays at `/path` and Spanish will live at `/es/path` when it
 * arrives. That is the standard asymmetric setup and it costs no redirects.
 */
export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Locales with published content. Add "es" when Spanish pages actually exist. */
export const PUBLISHED_LOCALES: readonly Locale[] = ["en"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

/** `/how-we-charge` in es becomes `/es/how-we-charge`; en is unprefixed. */
export function localizedPath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  return locale === DEFAULT_LOCALE ? clean || "/" : `/${locale}${clean}`;
}

/**
 * Canonical plus hreflang for one page.
 *
 * Only published locales are advertised: pointing hreflang at a Spanish URL
 * that 404s is worse than having no hreflang at all. `x-default` goes to the
 * English page, which is what a visitor with no matching locale should get.
 */
export function alternatesFor(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of PUBLISHED_LOCALES) {
    languages[locale] = `${SITE_URL}${localizedPath(path, locale)}`;
  }
  languages["x-default"] = `${SITE_URL}${localizedPath(path, DEFAULT_LOCALE)}`;

  return {
    canonical: localizedPath(path, DEFAULT_LOCALE),
    languages,
  };
}
