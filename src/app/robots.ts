import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Preview deploys must never be crawled - two copies of the same pages would
 * compete with each other in search. Only the production deploy invites robots.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
