/**
 * Pure string helpers, deliberately free of `server-only` so they can be tested
 * directly. They touch no secrets and no I/O.
 */
const COMBINING_MARKS = /[̀-ͯ]/g;

/** Lowercase, strip accents, collapse to a URL-safe slug. "Bahía" -> "bahia". */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Accent- and case-insensitive form, for matching free text against known names. */
export function fold(input: string): string {
  return input.normalize("NFD").replace(COMBINING_MARKS, "").toLowerCase();
}
