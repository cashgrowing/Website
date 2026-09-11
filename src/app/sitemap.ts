import type { MetadataRoute } from "next";

import { getAllMarketingPages, getJournalPosts } from "@/content/source";
import { qualifyingPairs } from "@/lib/attributes";
import { qualifyingGroups } from "@/lib/groups";
import { getHomes } from "@/lib/hostaway/listings";
import { AREAS, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

/**
 * Only pages that carry real copy. Anything still a placeholder is noindex and
 * stays out of here until it has words.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [homes, marketingPages, posts] = await Promise.all([
    getHomes(),
    getAllMarketingPages(),
    getJournalPosts(),
  ]);

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    {
      url: `${SITE_URL}/homes`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...marketingPages.map((page) => ({
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
    ...qualifyingPairs(homes, AREAS).map((pair) => ({
      url: `${SITE_URL}/stay/${pair.areaSlug}/${pair.attribute.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    {
      url: `${SITE_URL}/homes/groups`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    ...qualifyingGroups(homes).map(({ group }) => ({
      url: `${SITE_URL}/homes/groups/${group.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
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
    ...posts.map((post) => ({
      url: `${SITE_URL}/journal/${post.slug}`,
      lastModified: new Date(`${post.publishedAt}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
