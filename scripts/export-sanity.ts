/**
 * Turn the copy committed in src/content into an NDJSON file Sanity can import.
 *
 * Run with plain node - Node 22+ strips types natively, so this needs no build
 * step and no extra dependency:
 *
 *   node scripts/export-sanity.ts
 *   cd studio && npx sanity dataset import ../sanity-content.ndjson production --replace
 *
 * Document ids are derived from the page path and post slug, so importing more
 * than once updates the same documents rather than creating duplicates.
 */
import { writeFileSync } from "node:fs";

import { JOURNAL_POSTS } from "../src/content/journal.ts";
import { MARKETING_PAGES } from "../src/content/pages.ts";

/** Sanity needs a stable _key on every array member so edits can be tracked. */
function key(prefix: string, index: number): string {
  return `${prefix}${index}`;
}

function slugifyPath(path: string): string {
  return path.replace(/^\//, "").replace(/\//g, "-") || "home";
}

const docs: Array<Record<string, unknown>> = [];

for (const page of MARKETING_PAGES) {
  docs.push({
    _id: `page-${slugifyPath(page.path)}`,
    _type: "marketingPage",
    path: page.path,
    title: page.title,
    description: page.description,
    h1: page.h1,
    lede: page.lede,
    audience: page.audience,
    ...(page.image ? { image: { _type: "pageImage", ...page.image } } : {}),
    sections: page.sections.map((section, i) =>
      section.kind === "prose"
        ? {
            _type: "proseSection",
            _key: key("s", i),
            ...(section.heading ? { heading: section.heading } : {}),
            paragraphs: section.paragraphs,
          }
        : {
            _type: "listSection",
            _key: key("s", i),
            heading: section.heading,
            ...(section.intro ? { intro: section.intro } : {}),
            items: section.items.map((item, j) => ({
              _type: "listItem",
              _key: key(`s${i}i`, j),
              title: item.title,
              body: item.body,
            })),
          },
    ),
    faqs: page.faqs.map((faq, i) => ({
      _type: "faq",
      _key: key("f", i),
      question: faq.question,
      answer: faq.answer,
    })),
    related: page.related.map((link, i) => ({
      _type: "relatedLink",
      _key: key("r", i),
      label: link.label,
      href: link.href,
    })),
  });
}

for (const post of JOURNAL_POSTS) {
  docs.push({
    _id: `post-${post.slug}`,
    _type: "journalPost",
    title: post.title,
    slug: { _type: "slug", current: post.slug },
    description: post.description,
    publishedAt: post.publishedAt,
    readingMinutes: post.readingMinutes,
    excerpt: post.excerpt,
    body: post.body.map((block, i) => ({
      _type: block.kind === "h2" ? "heading2" : block.kind === "note" ? "note" : "paragraph",
      _key: key("b", i),
      text: block.text,
    })),
    faqs: post.faqs.map((faq, i) => ({
      _type: "faq",
      _key: key("f", i),
      question: faq.question,
      answer: faq.answer,
    })),
    related: post.related.map((link, i) => ({
      _type: "relatedLink",
      _key: key("r", i),
      label: link.label,
      href: link.href,
    })),
  });
}

const out = docs.map((doc) => JSON.stringify(doc)).join("\n") + "\n";
writeFileSync("sanity-content.ndjson", out);

console.log(
  `Wrote sanity-content.ndjson: ${MARKETING_PAGES.length} pages, ${JOURNAL_POSTS.length} post(s).`,
);
