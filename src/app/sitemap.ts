import type { MetadataRoute } from "next";

import { getHomes } from "@/lib/hostaway/listings";
import { AREAS, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

/** Pages that carry real copy. Phase 2 stubs are noindex and stay out of here. */
const STATIC_PATHS = ["/", "/homes"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const homes = await getHomes();

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
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
  ];
}
