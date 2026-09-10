/**
 * Proves the CMS round trip before anyone depends on it.
 *
 * Takes the NDJSON that would be imported into Sanity, applies the same
 * projection the site's GROQ queries apply, runs it through the *same*
 * validators the site uses, and checks the result is identical to the copy
 * committed in src/content.
 *
 * If this passes, a Sanity document produced by importing that file renders
 * exactly what the site renders today. If it fails, the schema, the projection
 * and the validators disagree - which is the failure that would otherwise show
 * up as a silently blank page after go-live.
 *
 *   node scripts/export-sanity.ts && node scripts/check-sanity-roundtrip.ts
 */
import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";

import { JOURNAL_POSTS } from "../src/content/journal.ts";
import { MARKETING_PAGES } from "../src/content/pages.ts";
import { journalPostSchema, marketingPageSchema, stripNulls } from "../src/content/validation.ts";

/** A raw NDJSON document. Shape is exactly what we are testing, so it stays loose. */
type Doc = Record<string, unknown>;

/** Mirrors `select(_type == "listSection" => "list", "prose")` in the GROQ. */
function projectSection(section: Doc): Doc {
  const kind = section._type === "listSection" ? "list" : "prose";
  const items = section.items as Doc[] | undefined;
  return {
    kind,
    heading: section.heading ?? null,
    intro: section.intro ?? null,
    paragraphs: section.paragraphs ?? null,
    items: items?.map((item) => ({ title: item.title, body: item.body })) ?? null,
  };
}

function projectBlock(block: Doc): Doc {
  const kind =
    block._type === "heading2" ? "h2" : block._type === "note" ? "note" : "p";
  return { kind, text: block.text };
}

function faqsOf(doc: Doc) {
  return (
    (doc.faqs as Doc[] | undefined)?.map((f) => ({ question: f.question, answer: f.answer })) ?? null
  );
}

function relatedOf(doc: Doc) {
  return (
    (doc.related as Doc[] | undefined)?.map((r) => ({ label: r.label, href: r.href })) ?? null
  );
}

const lines = readFileSync("sanity-content.ndjson", "utf8").trim().split("\n");
const docs: Doc[] = lines.map((line) => JSON.parse(line));

let checked = 0;

for (const doc of docs.filter((d) => d._type === "marketingPage")) {
  const projected = {
    path: doc.path,
    title: doc.title,
    description: doc.description,
    h1: doc.h1,
    lede: doc.lede,
    audience: doc.audience,
    image: doc.image
      ? { src: (doc.image as Doc).src, alt: (doc.image as Doc).alt }
      : null,
    sections: (doc.sections as Doc[] | undefined)?.map(projectSection) ?? null,
    faqs: faqsOf(doc),
    related: relatedOf(doc),
  };

  const parsed = marketingPageSchema.safeParse(stripNulls(projected));
  assert.ok(parsed.success, `${doc._id} failed validation: ${JSON.stringify(parsed.error?.issues)}`);

  const original = MARKETING_PAGES.find((p) => p.path === doc.path);
  assert.ok(original, `${doc._id}: no committed page at ${doc.path}`);
  assert.deepEqual(parsed.data, original, `${doc._id} does not round trip identically`);
  checked++;
}

for (const doc of docs.filter((d) => d._type === "journalPost")) {
  const projected = {
    slug: (doc.slug as Doc | undefined)?.current,
    title: doc.title,
    description: doc.description,
    publishedAt: doc.publishedAt,
    readingMinutes: doc.readingMinutes,
    excerpt: doc.excerpt,
    body: (doc.body as Doc[] | undefined)?.map(projectBlock) ?? null,
    faqs: faqsOf(doc),
    related: relatedOf(doc),
  };

  const parsed = journalPostSchema.safeParse(stripNulls(projected));
  assert.ok(parsed.success, `${doc._id} failed validation: ${JSON.stringify(parsed.error?.issues)}`);

  const slug = (doc.slug as Doc | undefined)?.current;
  const original = JOURNAL_POSTS.find((p) => p.slug === slug);
  assert.ok(original, `${doc._id}: no committed post`);
  assert.deepEqual(parsed.data, original, `${doc._id} does not round trip identically`);
  checked++;
}

console.log(`Round trip OK: ${checked} documents match the committed copy exactly.`);
