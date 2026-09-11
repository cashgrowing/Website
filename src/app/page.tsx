import type { Metadata } from "next";
import Link from "next/link";

import styles from "./page.module.css";
import { AvailabilityStrip } from "@/components/AvailabilityStrip";
import { Button } from "@/components/Button";
import { GroupTiles } from "@/components/GroupTiles";
import { HomeCard } from "@/components/HomeCard";
import { PhotoSlot } from "@/components/PhotoSlot";
import { qualifyingGroups } from "@/lib/groups";
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

/**
 * What an owner gets, every month. Four items because there are four things;
 * the numbers are a count, not a sequence. Every line is something the team
 * actually does - nothing here is aspiration.
 */
const OWNER_POINTS = [
  {
    title: "Weekly walk-through",
    body: "Pools, gardens, roofs, filters, gas. Problems get found before a guest does.",
  },
  {
    title: "Guest hosting, 24/7",
    body: "Every message answered in English and Spanish, including the ones at 2am.",
  },
  {
    title: "Maintenance and vendors",
    body: "Quoted before it starts, done by people we already work with, itemized on your statement.",
  },
  {
    title: "One monthly statement",
    body: "Income, costs and what was done, on one page.",
  },
];

export default async function HomePage() {
  const homes = await getHomes();
  const featured = homes.slice(0, 4);
  const groups = qualifyingGroups(homes);

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
          <h1>Homes on the Whale&rsquo;s Tail coast, cared for like our own.</h1>
          <p>
            Vacation rental management and direct stays in Uvita, Dominical and Ojochal. On
            the ground, bilingual, answering at 2am.
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

      {/* 2b. Dates and guests, on paper under the hero. */}
      <AvailabilityStrip />

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

      {/* 4. Proof strip - three true sentences, never a number. */}
      <section className={styles.proof} aria-label="How we work">
        {PROOF.map((item) => (
          <div key={item.fact}>
            <h2>{item.fact}</h2>
            <p>{item.detail}</p>
          </div>
        ))}
      </section>

      {/* 5. Homes we look after */}
      <section className={styles.band}>
        <div className={styles.bandHead}>
          <div>
            <h2>Homes we look after</h2>
            <p className={styles.sectionIntro}>
              A small number of houses between Dominical and Ojochal, walked weekly whether a
              guest is in them or not.
            </p>
          </div>
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

      {/*
        5b. Grouped homes. Shown only when two or more groups clear the
        three-home threshold - a section with a single tile would look thin,
        and the group page itself still exists and is linked from /homes.
      */}
      {groups.length >= 2 ? (
        <section className={`${styles.band} ${styles.groups}`}>
          <div className={styles.bandHead}>
            <div>
              <h2>Find the right home for the trip.</h2>
              <p className={styles.sectionIntro}>
                The same houses, grouped by the thing you are choosing on. Every list is drawn
                from the live listings.
              </p>
            </div>
            <Link className={styles.more} href="/homes/groups">
              Homes by what matters
            </Link>
          </div>
          <GroupTiles groups={groups} />
        </section>
      ) : null}

      {/* 6. What looking after a home means - the owner section. */}
      <section className={styles.owner} aria-labelledby="owner-heading">
        <div className={styles.ownerText}>
          <h2 id="owner-heading">What looking after your home means.</h2>
          <p className={styles.sectionIntro}>
            Four things happen every month, whether the house is booked or not.
          </p>
          <ol className={styles.ownerList}>
            {OWNER_POINTS.map((point, index) => (
              <li key={point.title}>
                <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.ownerActions}>
            <Button variant="gold" href={CONTACT.whatsappUrl}>
              Talk to the team on WhatsApp
            </Button>
            <span>
              Or write to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </span>
          </div>
        </div>
        <PhotoSlot
          className={styles.ownerPhoto}
          src="/photos/care-pool-casa-canto-ballena.jpg"
          alt="The pool and covered terrace at Casa Canto Ballena, a managed home in Bahía Ballena"
          brief="Pool at one of the managed homes."
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </section>
    </>
  );
}
