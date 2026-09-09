import type { MetadataRoute } from "next";

import { getJournalPosts } from "@/content/journal";
import { MARKETING_PAGES } from "@/content/pages";
import { getHomes } from "@/lib/hostaway/listings";
import { AREAS, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

/**
 * Only pages that carry real copy. Anything still a placeholder is noindex and
 * stays out of here until it has words.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const homes = await getHomes();

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    {
      url: `${SITE_URL}/homes`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...MARKETING_PAGES.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...AREAS.filter((area) => area.slug).map((area) => ({
      url: `${SITE_URL}/stay/${area.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...homes.map((home) => ({
      url: `${SITE_URL}/homes/${home.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/journal`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...getJournalPosts().map((post) => ({
      url: `${SITE_URL}/journal/${post.slug}`,
      lastModified: new Date(`${post.publishedAt}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
