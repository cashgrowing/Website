import type { Metadata } from "next";
import Link from "next/link";

import styles from "./homes.module.css";
import stay from "../stay/stay.module.css";
import { Faqs } from "@/components/Faqs";
import { HomeCard } from "@/components/HomeCard";
import { alternatesFor } from "@/lib/i18n";
import { BOOKING_DIRECT, EVERY_STAY, HOMES_FAQS, HOMES_INTRO } from "@/content/homes";
import { getHomes } from "@/lib/hostaway/listings";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { AREAS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vacation rentals in Uvita, Dominical, Ojochal",
  description:
    "Every home WildRoots looks after on Costa Rica's South Pacific coast. Book direct with the local team, no platform fee.",
  alternates: alternatesFor("/homes"),
  openGraph: {
    title: "Homes on the Whale's Tail coast",
    url: "/homes",
    images: [ogImage("Homes on the Whale's Tail coast")],
  },
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

      <div className={stay.column}>
        <div className={stay.intro}>
          {HOMES_INTRO.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        <section className={stay.nearby}>
          <h2>What booking direct actually means</h2>
          <div className={stay.list}>
            {BOOKING_DIRECT.map((point) => (
              <div className={stay.item} key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={stay.nearby}>
          <h2>What every stay includes</h2>
          <div className={stay.list}>
            {EVERY_STAY.map((point) => (
              <div className={stay.item} key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <h2 className={stay.homesHeading}>The homes</h2>

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

      <div className={stay.column}>
        <Faqs faqs={HOMES_FAQS} heading="Booking a home here" />
      </div>

      <JsonLd data={faqPageSchema(HOMES_FAQS)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Homes", path: "/homes" },
        ])}
      />
    </div>
  );
}
