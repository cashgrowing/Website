import type { Metadata } from "next";
import Link from "next/link";

import styles from "./page.module.css";
import { Button } from "@/components/Button";
import { HomeCard } from "@/components/HomeCard";
import { PhotoSlot } from "@/components/PhotoSlot";
import { alternatesFor } from "@/lib/i18n";
import { getHomes } from "@/lib/hostaway/listings";
import { BOOKING_ENGINE_URL, CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "WildRoots | Vacation rental management, Uvita Costa Rica",
  description:
    "Vacation rental management and direct stays in Uvita, Dominical and Ojochal. Bilingual, on the ground, answering 24/7.",
  alternates: alternatesFor("/"),
};

/** Homes come from Hostaway; refresh the page every 15 minutes. */
export const revalidate = 900;

const PROOF = [
  {
    fact: "Answered within minutes",
    detail: "24/7 guest communication in English and Spanish",
  },
  {
    fact: "Walked every week",
    detail: "Booked or not, someone from the team is in your house",
  },
  {
    fact: "Three fees, no surprises",
    detail: "Setup, flat monthly, and a share of what we earn you",
  },
];

export default async function HomePage() {
  const homes = await getHomes();
  const featured = homes.slice(0, 4);

  return (
    <>
      {/* 2. Hero */}
      <section className={styles.hero}>
        <PhotoSlot
          fill
          className={styles.heroPhoto}
          src="/photos/hero-uvita-whales-tail.jpg"
          alt="The Whale's Tail sandbar curving into Bahía Ballena, seen from the air above Uvita on Costa Rica's South Pacific coast"
          brief="Uvita coastline over Bahía Ballena and the Whale's Tail."
          sizes="100vw"
          priority
        />
        {/*
          The brief asks for the textured gold lockup here, and also says never
          to put the textured file on a light background. Those agreed while the
          hero was a black placeholder. Against a real photograph with a bright
          sky it reads as washed out, so the more emphatic rule wins.

          The flat lockup sits in the header roughly forty pixels above this, so
          nothing is lost. Restore by putting the <Image> back if a darker hero
          photograph is chosen later.
        */}
        <div className={styles.heroCopy}>
          <h1>Your home on this coast, looked after properly.</h1>
          <p>
            Vacation rental management and direct stays in Uvita, Dominical and Ojochal.
            Bilingual, on the ground, and answering at 2am.
          </p>
          <div className={styles.actions}>
            <Button variant="gold" href="/homes">
              Find a home to stay in
            </Button>
            <Button variant="onDark" href="/property-management-costa-rica">
              Manage my home
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Two doors */}
      <section className={styles.doors} aria-label="Choose your path">
        <div className={styles.door}>
          <h2>
            Own a home here.
            <br />
            Live anywhere.
          </h2>
          <p>
            We market it, host every guest, keep it maintained and send you one clear
            statement a month. You keep the Airbnb account and the payouts.
          </p>
          <Button variant="gold" href={CONTACT.whatsappUrl}>
            Talk to the team on WhatsApp
          </Button>
        </div>
        <div className={styles.door}>
          <h2>
            Stay on the
            <br />
            Whale&rsquo;s Tail coast.
          </h2>
          <p>
            Book directly with the local team that looks after every house. The same homes
            you see on Airbnb, no platform fee, and a number that actually answers.
          </p>
          <Button variant="onDark" href={BOOKING_ENGINE_URL}>
            Check availability
          </Button>
        </div>
      </section>

      {/* 4. Proof strip */}
      <section className={styles.proof} aria-label="How we work">
        {PROOF.map((item) => (
          <div key={item.fact}>
            <h2>{item.fact}</h2>
            <p>{item.detail}</p>
          </div>
        ))}
      </section>

      {/* 5. Homes we look after */}
      <section className={styles.homes}>
        <div className={styles.homesHead}>
          <h2>Homes we look after</h2>
          <Link className={styles.more} href="/homes">
            See all homes
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className={styles.cards}>
            {featured.map((home, index) => (
              <HomeCard key={home.id} home={home} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>
              Homes appear here as soon as the Hostaway API key is added to the Vercel
              project. Nothing is hand-entered: every card is a live listing.
            </p>
          </div>
        )}
      </section>

      {/* 6. A higher standard of care */}
      <section className={styles.care}>
        <PhotoSlot
          className={styles.carePhoto}
          src="/photos/care-pool-casa-canto-ballena.jpg"
          alt="The pool and covered terrace at Casa Canto Ballena, a managed home in Bahía Ballena"
          brief="Pool at one of the managed homes."
          sizes="(max-width: 900px) 100vw, 50vw"
        />
        <div className={styles.careText}>
          <h2>A higher standard of care.</h2>
          <p>
            Every house is walked weekly whether it is booked or not. Pools, gardens, roofs,
            filters, gas. Problems get found before a guest does.
          </p>
          <p>Out of scope work is quoted before it starts and itemized on your statement.</p>
          <Button variant="onDark" href="/how-we-charge">
            How we charge
          </Button>
        </div>
      </section>

      {/* 7. Owner quote - placeholder until a real one is supplied and approved. */}
      <section className={styles.quote} aria-label="Owner quote">
        <blockquote>
          <p>Owner quote goes here.</p>
          <span className={styles.quoteNote}>
            Placeholder. Nothing is published until a homeowner supplies the words and
            approves them.
          </span>
        </blockquote>
        <PhotoSlot
          className={styles.quotePhoto}
          src="/photos/terrace-casa-canto-ballena.jpg"
          alt="The covered terrace at Casa Canto Ballena, with dining table and loungers beside the pool"
          brief="Covered terrace at a managed home."
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </section>
    </>
  );
}
