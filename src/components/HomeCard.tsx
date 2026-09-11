import Image from "next/image";
import Link from "next/link";

import styles from "./HomeCard.module.css";
import type { Home } from "@/lib/hostaway/types";

/*
 * Three line icons, drawn once here so every card on the site uses the same
 * ones. Stroke inherits the gold from the stylesheet; nothing is filled.
 * They are decorative - the text beside each one already says "3 bed".
 */
function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M3 18V8h18v10M3 12h18M6 8V6h12v2" />
    </svg>
  );
}
function BathIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6a2 2 0 0 1 4 0" />
    </svg>
  );
}
function GuestsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 19a6 6 0 0 1 12 0M14 19a4.5 4.5 0 0 1 7 0" />
    </svg>
  );
}

function formatPrice(home: Home): string {
  const amount = Math.round(home.basePrice ?? 0);
  return home.currency === "USD" ? `$${amount}` : `${amount} ${home.currency}`;
}

/**
 * The one home card. Homepage, /homes, area pages and grouped pages all use
 * it, so a change here is a change everywhere - which is the point.
 *
 * Facts come straight from Hostaway; a missing fact is left out rather than
 * guessed. A missing price says "On request" so the card never looks broken.
 */
export function HomeCard({ home, priority = false }: { home: Home; priority?: boolean }) {
  const cover = home.photos[0];
  const place = home.area ?? home.city;

  return (
    <Link className={styles.card} href={`/homes/${home.slug}`}>
      <div className={`${styles.frame} ${cover ? "" : styles.empty}`}>
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
            priority={priority}
          />
        ) : null}
      </div>

      <h3 className={styles.name}>{home.name}</h3>

      <p className={styles.facts}>
        {place ? <span>{place}</span> : null}
        {home.bedrooms ? (
          <span>
            <BedIcon />
            {home.bedrooms} bed
          </span>
        ) : null}
        {home.bathrooms ? (
          <span>
            <BathIcon />
            {home.bathrooms} bath
          </span>
        ) : null}
        {home.sleeps ? (
          <span>
            <GuestsIcon />
            sleeps {home.sleeps}
          </span>
        ) : null}
      </p>

      <p className={styles.price}>
        {home.basePrice ? (
          <>
            from <b>{formatPrice(home)}</b> / night
          </>
        ) : (
          <b>On request</b>
        )}
      </p>
    </Link>
  );
}
