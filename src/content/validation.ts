import { z } from "zod";

import type { JournalPost, MarketingPage } from "./types";

/**
 * Runtime validation for content coming from the CMS.
 *
 * Kept out of source.ts, and free of `server-only`, so the same rules can be
 * exercised by scripts and tests. Whatever validates here is exactly what the
 * site accepts - a check that used its own copy of the rules would prove
 * nothing.
 */

const faq = z.object({ question: z.string(), answer: z.string() });
const related = z.object({ label: z.string(), href: z.string() });

const section = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("prose"),
    heading: z.string().optional(),
    paragraphs: z.array(z.string()),
  }),
  z.object({
    kind: z.literal("list"),
    heading: z.string(),
    intro: z.string().optional(),
    items: z.array(z.object({ title: z.string(), body: z.string() })),
  }),
]);

export const marketingPageSchema: z.ZodType<MarketingPage> = z.object({
  path: z.string(),
  title: z.string(),
  description: z.string(),
  h1: z.string(),
  lede: z.string(),
  sections: z.array(section),
  faqs: z.array(faq),
  related: z.array(related),
  audience: z.enum(["owner", "guest"]),
  image: z.object({ src: z.string(), alt: z.string() }).optional(),
});

export const journalPostSchema: z.ZodType<JournalPost> = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  publishedAt: z.string(),
  readingMinutes: z.number(),
  excerpt: z.string(),
  body: z.array(
    z.discriminatedUnion("kind", [
      z.object({ kind: z.literal("h2"), text: z.string() }),
      z.object({ kind: z.literal("p"), text: z.string() }),
      z.object({ kind: z.literal("note"), text: z.string() }),
    ]),
  ),
  faqs: z.array(faq),
  related: z.array(related),
});

/*
 * `kind` is derived from the object's _type rather than stored as a field, so
 * editors never see a redundant "which kind of section is this" input that
 * must agree with the block they already chose.
 */
/**
 * GROQ returns null for any projected field a document does not have. Optional
 * fields in the schemas are `undefined`-shaped, so strip nulls before parsing
 * rather than making every optional field nullable.
 */
export function stripNulls(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripNulls);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => [k, stripNulls(v)]),
    );
  }
  return value;
}

