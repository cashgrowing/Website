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
import { CONTACT, OWNER_LINK } from "@/lib/site";

export const metadata: Metadata = {
  title: "WildRoots | Vacation rental management, Uvita Costa Rica",
  description:
    "Vacation rental management and direct stays in Uvita, Dominical and Ojochal. A local team that answers, day or night, in English and Spanish.",
  alternates: alternatesFor("/"),
};

/** Homes come from Hostaway; refresh the page every 15 minutes. */
export const revalidate = 900;

/**
 * The homepage speaks to guests. Homeowners get one clearly marked door at the
 * end of it, and their own front page behind it (OWNER_LINK).
 */
export default async function HomePage() {
  const homes = await getHomes();
  const featured = homes.slice(0, 4);
  const groups = qualifyingGroups(homes);

  return (
    <>
      {/* 1. Hero */}
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
            Direct stays in Uvita, Dominical and Ojochal, from the local team that looks
            after every house.
          </p>
          <div className={styles.actions}>
            <Button variant="gold" href="/homes">
              Find a home to stay in
            </Button>
            <Button variant="onDark" href="/guest-services">
              What a stay includes
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Dates and guests, on paper under the hero. */}
      <AvailabilityStrip />

      {/* 3. Homes to stay in */}
      <section className={styles.band}>
        <div className={styles.bandHead}>
          <div>
            <h2>Homes to stay in</h2>
            <p className={styles.sectionIntro}>
              A small number of houses between Dominical and Ojochal, each looked after by the
              team you will be talking to.
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
        4. Grouped homes. Shown only when two or more groups clear the
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

      {/* 5. The homeowners' door - the one place on this page that is not for guests. */}
      <section className={styles.ownerBand} aria-labelledby="owner-band-heading">
        <div className={styles.ownerBandInner}>
          <p className={styles.kicker}>For homeowners</p>
          <h2 id="owner-band-heading">Own a home on this coast?</h2>
          <p>
            We look after it, host every guest, keep it maintained and send you one clear
            statement a month. You keep the Airbnb account and the payouts.
          </p>
          <div className={styles.actions}>
            <Button variant="gold" href={CONTACT.whatsappUrl}>
              Talk to the team on WhatsApp
            </Button>
            <Button variant="onDark" href={OWNER_LINK.href}>
              How we look after homes
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
