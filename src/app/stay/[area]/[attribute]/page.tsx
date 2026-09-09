import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "../../../homes/homes.module.css";
import { HomeCard } from "@/components/HomeCard";
import { getAttribute, homesWithAttribute, qualifyingPairs } from "@/lib/attributes";
import { getHomes } from "@/lib/hostaway/listings";
import { alternatesFor } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { AREAS } from "@/lib/site";

export const revalidate = 900;
/**
 * False on purpose. Only pairs that clear the three-home threshold get built,
 * so anything else must 404 rather than be rendered on demand as a thin page.
 */
export const dynamicParams = false;

type Params = { params: Promise<{ area: string; attribute: string }> };

const MANAGEMENT_PAGE: Record<string, { href: string; label: string }> = {
  uvita: { href: "/vacation-rental-management-uvita", label: "Vacation rental management in Uvita" },
  dominical: { href: "/property-manager-dominical", label: "Property manager in Dominical" },
  ojochal: {
    href: "/vacation-rental-management-ojochal",
    label: "Vacation rental management in Ojochal",
  },
};

export async function generateStaticParams() {
  const homes = await getHomes();
  return qualifyingPairs(homes, AREAS).map((pair) => ({
    area: pair.areaSlug,
    attribute: pair.attribute.slug,
  }));
}

function areaFromSlug(slug: string) {
  return AREAS.find((area) => area.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { area: areaSlug, attribute: attributeSlug } = await params;
  const area = areaFromSlug(areaSlug);
  const attribute = getAttribute(attributeSlug);
  if (!area || !attribute) return { title: "Not found" };

  const path = `/stay/${area.slug}/${attribute.slug}`;
  const title = `${attribute.label} in ${area.name}`;

  return {
    title,
    description: `${attribute.blurb} In ${area.name}, on Costa Rica's South Pacific coast, booked direct with the local team.`.slice(
      0,
      155,
    ),
    alternates: alternatesFor(path),
    openGraph: { title, url: path, images: [ogImage(title)] },
  };
}

export default async function AttributePage({ params }: Params) {
  const { area: areaSlug, attribute: attributeSlug } = await params;
  const area = areaFromSlug(areaSlug);
  const attribute = getAttribute(attributeSlug);
  if (!area || !attribute) notFound();

  const homes = await getHomes();
  const matching = homesWithAttribute(
    homes.filter((home) => home.area === area.name),
    attribute,
  );
  // Listings change; a pair that qualified at build time may not any more.
  if (matching.length === 0) notFound();

  const management = MANAGEMENT_PAGE[areaSlug];

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1>
          {attribute.label} in {area.name}
        </h1>
        <p>
          {attribute.blurb} Every one is looked after by the same local team, walked weekly and
          answered 24/7.
        </p>
        <nav className={styles.areas} aria-label="Related pages">
          <Link href={`/stay/${area.slug}`}>All homes in {area.name}</Link>
          <Link href="/homes">Every home we look after</Link>
          {management ? <Link href={management.href}>{management.label}</Link> : null}
        </nav>
      </div>

      <div className={styles.cards}>
        {matching.map((home, index) => (
          <HomeCard key={home.id} home={home} priority={index < 4} />
        ))}
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Homes", path: "/homes" },
          { name: area.name, path: `/stay/${area.slug}` },
          { name: attribute.label, path: `/stay/${area.slug}/${attribute.slug}` },
        ])}
      />
    </div>
  );
}
