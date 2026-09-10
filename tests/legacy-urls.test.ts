import { strict as assert } from "node:assert";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import nextConfig from "../next.config.ts";
import { JOURNAL_POSTS } from "../src/content/journal.ts";
import { AREAS } from "../src/lib/site.ts";

/**
 * Every URL the live Wix site publishes, read from its sitemap on 2026-09-09.
 *
 * This list exists because the brief's redirect map was incomplete: it named
 * two /post/ URLs, and the sitemap had a third. That one would have 404'd on
 * cutover, taking its ranking with it, and nothing would have noticed.
 *
 * Anything removed from here must be removed deliberately.
 */
const LEGACY_URLS = [
  "/",
  "/about",
  "/airbnb-management-costa-rica",
  "/blog",
  "/contact",
  "/post/humpback-whale-season-uvita",
  "/post/what-a-property-manager-does-costa-rica",
  "/property-management-costa-rica",
  "/property-manager-dominical",
  "/vacation-rental-management-uvita",
  "/vacation-rentals-bahia-ballena",
];

function staticRoutes(dir = "src/app", prefix = ""): string[] {
  const routes: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("_") || entry.name.startsWith("(") || entry.name.startsWith("["))
      continue;
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

/** Turn a Next redirect `source` into something testable. */
function matches(source: string, url: string): boolean {
  if (source === url) return true;
  // `/blog/:path*` should match /blog and anything under it.
  const wildcard = source.replace(/\/:[A-Za-z]+\*?$/, "");
  return source.includes(":") && (url === wildcard || url.startsWith(`${wildcard}/`));
}

describe("migration: no ranking URL is dropped", () => {
  it("keeps or redirects every URL the live Wix sitemap publishes", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const routes = knownRoutes();

    for (const url of LEGACY_URLS) {
      const kept = routes.has(url);
      const redirect = redirects.find((r) => matches(r.source, url));
      assert.ok(
        kept || redirect,
        `${url} is neither kept as a route nor redirected. It would 404 on cutover and lose its ranking.`,
      );
    }
  });

  it("sends every legacy redirect to a page that exists", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const routes = knownRoutes();

    for (const redirect of redirects) {
      if (redirect.destination.includes(":")) continue; // parameterised
      assert.ok(
        routes.has(redirect.destination),
        `${redirect.source} redirects to ${redirect.destination}, which is not a route. A 301 to a 404 is worse than no redirect.`,
      );
    }
  });

  it("uses 301 rather than 308 for every legacy redirect", async () => {
    // Google treats them alike; older tooling does not, and the brief says 301.
    const redirects = (await nextConfig.redirects?.()) ?? [];
    assert.ok(redirects.length > 0, "expected redirects to be configured");
    for (const redirect of redirects) {
      assert.equal(
        (redirect as { statusCode?: number }).statusCode,
        301,
        `${redirect.source} does not return 301`,
      );
    }
  });
});
