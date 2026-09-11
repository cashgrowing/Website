import "server-only";
import type { z } from "zod";

import { JOURNAL_POSTS } from "./journal";
import { MARKETING_PAGES } from "./pages";
import type { JournalPost, MarketingPage } from "./types";
import { journalPostSchema, marketingPageSchema, stripNulls } from "./validation";
import { sanityQuery } from "@/lib/sanity";

/**
 * Where the words come from.
 *
 * Sanity first, the copy committed in src/content second. The fallback is not
 * a nicety: a CMS outage, a revoked token or a half-finished edit must never
 * take the site down or blank a page, and the committed copy is always a
 * complete, correct version of the site.
 *
 * Everything Sanity returns is validated before it is rendered. A malformed
 * document falls back rather than throwing - one bad edit should cost one
 * stale page, not the whole site.
 */

const MARKETING_PROJECTION = `{
  path, title, description, h1, lede, audience,
  image{ src, alt },
  "sections": sections[]{
    "kind": select(_type == "listSection" => "list", "prose"),
    heading, intro, paragraphs, items[]{ title, body }
  },
  "faqs": faqs[]{ question, answer },
  "related": related[]{ label, href }
}`;

const JOURNAL_PROJECTION = `{
  "slug": slug.current, category, title, description, publishedAt, readingMinutes, excerpt,
  "body": body[]{
    "kind": select(_type == "heading2" => "h2", _type == "note" => "note", "p"),
    text
  },
  "faqs": faqs[]{ question, answer },
  "related": related[]{ label, href }
}`;

/** Log once with enough detail to find the offending document, then fall back. */
function validated<T>(
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  value: unknown,
  label: string,
): T | null {
  if (value == null) return null;
  const parsed = schema.safeParse(stripNulls(value));
  if (parsed.success) return parsed.data;
  console.error(`[content] ${label} failed validation, using committed copy:`, parsed.error.issues);
  return null;
}

export async function getMarketingPage(path: string): Promise<MarketingPage | undefined> {
  const fromSanity = await sanityQuery<unknown>(
    `*[_type == "marketingPage" && path == $path][0]${MARKETING_PROJECTION}`,
    { params: { path } },
  );
  const page = validated(marketingPageSchema, fromSanity, `marketingPage ${path}`);
  return page ?? MARKETING_PAGES.find((candidate) => candidate.path === path);
}

export async function getAllMarketingPages(): Promise<MarketingPage[]> {
  const fromSanity = await sanityQuery<unknown[]>(
    `*[_type == "marketingPage"]${MARKETING_PROJECTION}`,
  );
  if (Array.isArray(fromSanity) && fromSanity.length > 0) {
    const pages = fromSanity
      .map((doc, i) => validated(marketingPageSchema, doc, `marketingPage[${i}]`))
      .filter((page): page is MarketingPage => page !== null);
    // Logged on success as well as failure: Sanity content and the committed
    // copy render identically by design, so the build log is the only place
    // that shows which one a deploy actually used.
    console.log(`[content] ${pages.length} of ${fromSanity.length} marketing page(s) from Sanity.`);
    if (pages.length > 0) return pages;
  }
  return MARKETING_PAGES;
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  const fromSanity = await sanityQuery<unknown[]>(
    `*[_type == "journalPost" && !(_id in path("drafts.**"))] | order(publishedAt desc)${JOURNAL_PROJECTION}`,
  );
  if (Array.isArray(fromSanity) && fromSanity.length > 0) {
    const posts = fromSanity
      .map((doc, i) => validated(journalPostSchema, doc, `journalPost[${i}]`))
      .filter((post): post is JournalPost => post !== null);
    console.log(`[content] ${posts.length} of ${fromSanity.length} journal post(s) from Sanity.`);
    if (posts.length > 0) return posts;
  }
  return [...JOURNAL_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * The opening paragraph of a grouped-homes page, when an editor has written
 * one in the Studio. Null means "use the fallback in groups.ts". Anything but
 * a non-empty string is treated as absent, so a half-finished edit cannot
 * blank the page.
 */
export async function getHomeGroupIntro(slug: string): Promise<string | null> {
  const intro = await sanityQuery<unknown>(`*[_type == "homeGroup" && slug == $slug][0].intro`, {
    params: { slug },
  });
  return typeof intro === "string" && intro.trim().length > 0 ? intro.trim() : null;
}

export async function getJournalPost(slug: string): Promise<JournalPost | undefined> {
  const fromSanity = await sanityQuery<unknown>(
    `*[_type == "journalPost" && slug.current == $slug && !(_id in path("drafts.**"))][0]${JOURNAL_PROJECTION}`,
    { params: { slug } },
  );
  const post = validated(journalPostSchema, fromSanity, `journalPost ${slug}`);
  return post ?? JOURNAL_POSTS.find((candidate) => candidate.slug === slug);
}
