import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "../../homes/homes.module.css";
import { HomeCard } from "@/components/HomeCard";
import { getHomesByArea } from "@/lib/hostaway/listings";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { AREAS } from "@/lib/site";

export const revalidate = 900;
export const dynamicParams = false;

type Params = { params: Promise<{ area: string }> };

/** Management page each area links to - one of the internal linking rules. */
const MANAGEMENT_PAGE: Record<string, { href: string; label: string }> = {
  uvita: { href: "/vacation-rental-management-uvita", label: "Vacation rental management in Uvita" },
  dominical: { href: "/property-manager-dominical", label: "Property management in Dominical" },
  ojochal: { href: "/property-management-costa-rica", label: "Property management on this coast" },
};

export async function generateStaticParams() {
  return AREAS.filter((area) => area.slug).map((area) => ({ area: area.slug as string }));
}

function areaFromSlug(slug: string) {
  return AREAS.find((area) => area.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { area: slug } = await params;
  const area = areaFromSlug(slug);
  if (!area) return { title: "Area not found" };

  return {
    title: `Vacation rentals in ${area.name}, Costa Rica`,
    description: `Homes to rent in ${area.name} on Costa Rica's South Pacific coast, looked after and booked direct with the local WildRoots team.`,
    alternates: { canonical: `/stay/${area.slug}` },
  };
}

export default async function AreaPage({ params }: Params) {
  const { area: slug } = await params;
  const area = areaFromSlug(slug);
  if (!area) notFound();

  const homes = await getHomesByArea(area.name);
  const management = MANAGEMENT_PAGE[slug];

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1>Stay in {area.name}</h1>
        <p>
          Homes in {area.name} looked after by the WildRoots team. Booked direct, answered
          24/7, and walked every week whether a guest is in them or not.
        </p>
        <nav className={styles.areas} aria-label="Related pages">
          <Link href="/homes">All homes</Link>
          {management ? <Link href={management.href}>{management.label}</Link> : null}
          {AREAS.filter((other) => other.slug && other.slug !== slug).map((other) => (
            <Link key={other.slug} href={`/stay/${other.slug}`}>
              Stay in {other.name}
            </Link>
          ))}
        </nav>
      </div>

      {homes.length > 0 ? (
        <div className={styles.cards}>
          {homes.map((home, index) => (
            <HomeCard key={home.id} home={home} priority={index < 4} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          No {area.name} homes are live in Hostaway yet. As soon as one is, it appears here
          on its own.
        </p>
      )}

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Homes", path: "/homes" },
          { name: area.name, path: `/stay/${area.slug}` },
        ])}
      />
    </div>
  );
}
