import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { JOURNAL_POSTS } from "../src/content/journal.ts";
import { MARKETING_PAGES } from "../src/content/pages.ts";
import {
  journalPostSchema,
  marketingPageSchema,
  stripNulls,
} from "../src/content/validation.ts";

/**
 * The committed copy is the fallback the site drops to whenever Sanity is
 * unreachable. If it ever stopped satisfying the validators, that fallback
 * would fail exactly when it is needed.
 */
describe("committed content is valid against the CMS validators", () => {
  it("accepts every marketing page", () => {
    for (const page of MARKETING_PAGES) {
      const parsed = marketingPageSchema.safeParse(page);
      assert.ok(parsed.success, `${page.path}: ${JSON.stringify(parsed.error?.issues)}`);
    }
  });

  it("accepts every journal post", () => {
    for (const post of JOURNAL_POSTS) {
      const parsed = journalPostSchema.safeParse(post);
      assert.ok(parsed.success, `${post.slug}: ${JSON.stringify(parsed.error?.issues)}`);
    }
  });

  it("has no duplicate paths or slugs", () => {
    const paths = MARKETING_PAGES.map((p) => p.path);
    assert.equal(new Set(paths).size, paths.length, "two pages share a path");
    const slugs = JOURNAL_POSTS.map((p) => p.slug);
    assert.equal(new Set(slugs).size, slugs.length, "two posts share a slug");
  });
});

describe("validators reject what the CMS could get wrong", () => {
  it("rejects a page missing its opening line", () => {
    const { lede: _lede, ...withoutLede } = MARKETING_PAGES[0]!;
    assert.equal(marketingPageSchema.safeParse(withoutLede).success, false);
  });

  it("rejects an unknown section kind", () => {
    const broken = {
      ...MARKETING_PAGES[0]!,
      sections: [{ kind: "carousel", heading: "Nope", paragraphs: [] }],
    };
    assert.equal(marketingPageSchema.safeParse(broken).success, false);
  });

  it("rejects an audience the layout cannot render", () => {
    const broken = { ...MARKETING_PAGES[0]!, audience: "investor" };
    assert.equal(marketingPageSchema.safeParse(broken).success, false);
  });

  it("rejects a post whose reading time is not a number", () => {
    const broken = { ...JOURNAL_POSTS[0]!, readingMinutes: "six" };
    assert.equal(journalPostSchema.safeParse(broken).success, false);
  });

  it("strips the nulls GROQ returns for absent optional fields", () => {
    const projected = {
      ...MARKETING_PAGES[0]!,
      sections: [{ kind: "prose", heading: null, intro: null, paragraphs: ["Hello."], items: null }],
    };
    // Without stripNulls this fails: optional fields are undefined-shaped.
    assert.equal(marketingPageSchema.safeParse(projected).success, false);
    assert.equal(marketingPageSchema.safeParse(stripNulls(projected)).success, true);
  });
});
