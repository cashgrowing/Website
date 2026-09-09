import { strict as assert } from "node:assert";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import { JOURNAL_POSTS } from "../src/content/journal.ts";
import { MARKETING_PAGES } from "../src/content/pages.ts";
import { alternatesFor, localizedPath } from "../src/lib/i18n.ts";
import { AREAS } from "../src/lib/site.ts";

/** " | WildRoots" is appended by the title template in the root layout. */
const SUFFIX = " | WildRoots".length;

/** Static routes, read from the app directory rather than kept in a list here. */
function staticRoutes(dir = "src/app", prefix = ""): string[] {
  const routes: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("_") || entry.name.startsWith("(")) continue;
    if (entry.name.startsWith("[")) continue; // dynamic, handled separately
    const path = `${prefix}/${entry.name}`;
    if (existsSync(join(dir, entry.name, "page.tsx"))) routes.push(path);
    routes.push(...staticRoutes(join(dir, entry.name), path));
  }
  return routes;
}

function knownRoutes(): Set<string> {
  const routes = new Set<string>(["/", ...staticRoutes()]);
  for (const area of AREAS) if (area.slug) routes.add(`/stay/${area.slug}`);
  for (const post of JOURNAL_POSTS) routes.add(`/journal/${post.slug}`);
  return routes;
}

describe("brief section 5: SEO requirements", () => {
  it("keeps every rendered title under 60 characters", () => {
    for (const page of MARKETING_PAGES) {
      const length = page.title.length + SUFFIX;
      assert.ok(length < 60, `${page.path} title renders at ${length}: "${page.title}"`);
    }
    for (const post of JOURNAL_POSTS) {
      const length = post.title.length + SUFFIX;
      assert.ok(length < 60, `${post.slug} title renders at ${length}: "${post.title}"`);
    }
  });

  it("keeps every meta description under 155 characters", () => {
    for (const page of MARKETING_PAGES) {
      assert.ok(
        page.description.length <= 155,
        `${page.path} description is ${page.description.length}`,
      );
    }
    for (const post of JOURNAL_POSTS) {
      assert.ok(
        post.description.length <= 155,
        `${post.slug} description is ${post.description.length}`,
      );
    }
  });

  it("gives every page exactly one H1", () => {
    for (const page of MARKETING_PAGES) {
      assert.ok(page.h1.trim().length > 0, `${page.path} has no H1`);
      // Section headings render as H2, so an H1 cannot appear twice.
      for (const section of page.sections) {
        assert.notEqual(section.heading, page.h1, `${page.path} repeats its H1 as a section`);
      }
    }
  });

  it("points every internal link at a route that exists", () => {
    const routes = knownRoutes();
    const check = (href: string, where: string) => {
      if (/^https?:/.test(href)) return;
      // /homes/[slug] comes from Hostaway, so only the prefix can be checked here.
      if (href.startsWith("/homes/")) return;
      assert.ok(routes.has(href), `${where} links to ${href}, which is not a route`);
    };

    for (const page of MARKETING_PAGES) {
      page.related.forEach((link) => check(link.href, `page ${page.path}`));
    }
    for (const post of JOURNAL_POSTS) {
      post.related.forEach((link) => check(link.href, `post ${post.slug}`));
    }
  });

  it("links every journal post to at least two service pages", () => {
    // Section 5: "blog posts link to at least two service pages".
    const servicePages = new Set(
      MARKETING_PAGES.filter((p) => p.audience === "owner").map((p) => p.path),
    );
    for (const post of JOURNAL_POSTS) {
      const hits = post.related.filter((link) => servicePages.has(link.href));
      assert.ok(hits.length >= 2, `${post.slug} links to ${hits.length} service page(s), needs 2`);
    }
  });

  it("leaves no page an orphan", () => {
    // Every marketing page should be reachable from another page's links.
    const linked = new Set<string>();
    for (const page of MARKETING_PAGES) page.related.forEach((l) => linked.add(l.href));
    for (const post of JOURNAL_POSTS) post.related.forEach((l) => linked.add(l.href));

    for (const page of MARKETING_PAGES) {
      assert.ok(linked.has(page.path), `${page.path} is not linked from any other page`);
    }
  });

  it("builds hreflang only for locales that are published", () => {
    const alternates = alternatesFor("/how-we-charge");
    assert.equal(alternates.canonical, "/how-we-charge");
    assert.ok(alternates.languages.en?.endsWith("/how-we-charge"));
    assert.ok(alternates.languages["x-default"]?.endsWith("/how-we-charge"));
    // Spanish is phase 2: advertising a URL that 404s is worse than no hreflang.
    assert.equal(alternates.languages.es, undefined);
  });

  it("keeps English URLs unprefixed and puts Spanish under /es", () => {
    assert.equal(localizedPath("/about"), "/about");
    assert.equal(localizedPath("/about", "es"), "/es/about");
    assert.equal(localizedPath("/", "en"), "/");
    assert.equal(localizedPath("/", "es"), "/es");
  });
});
