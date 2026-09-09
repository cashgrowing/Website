import type { MetadataRoute } from "next";
import { headers } from "next/headers";

import { SITE_URL } from "@/lib/site";

/** Read per request so the answer depends on the host actually being served. */
export const dynamic = "force-dynamic";

/**
 * Only the canonical hostname invites crawlers.
 *
 * Gating on VERCEL_ENV was wrong: Vercel labels the deploy "production" from
 * the moment the project exists, so every website-*.vercel.app URL was served
 * `Allow: /` while the real site was still on Wix - exactly the duplicate
 * content this file is meant to prevent. Checking the request host instead
 * blocks every preview and every *.vercel.app URL, and needs no code change at
 * launch: attaching the domain flips it on by itself.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host")?.toLowerCase().split(":")[0] ?? "";
  const canonicalHost = new URL(SITE_URL).hostname.toLowerCase();

  if (host !== canonicalHost) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
