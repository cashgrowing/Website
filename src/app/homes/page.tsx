import type { Metadata } from "next";
import Link from "next/link";

import styles from "./homes.module.css";
import { HomeCard } from "@/components/HomeCard";
import { getHomes } from "@/lib/hostaway/listings";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { AREAS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vacation rentals in Uvita, Dominical and Ojochal",
  description:
    "Every home WildRoots looks after on Costa Rica's South Pacific coast. Book direct with the local team, no platform fee.",
  alternates: { canonical: "/homes" },
};

export const revalidate = 900;

export default async function HomesPage() {
  const homes = await getHomes();

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1>Homes on the Whale&rsquo;s Tail coast</h1>
        <p>
          Every house here is looked after by the same local team, walked weekly and
          answered 24/7. Book direct and the platform fee stays in your pocket.
        </p>
        <nav className={styles.areas} aria-label="Areas we serve">
          {AREAS.filter((area) => area.slug).map((area) => (
            <Link key={area.slug} href={`/stay/${area.slug}`}>
              Stay in {area.name}
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
          Listings load straight from Hostaway. They appear here as soon as the API key is
          added to the Vercel project.
        </p>
      )}

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Homes", path: "/homes" },
        ])}
      />
    </div>
  );
}
