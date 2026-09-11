"use client";

import { useSearchParams } from "next/navigation";

import btn from "./Button.module.css";
import styles from "./AvailabilityHandoff.module.css";
import { engineSearchUrl, formatStayDate, readStay } from "@/lib/dates";

/**
 * Reads the dates the visitor typed into the strip on the home page and offers
 * one link to the booking engine's search with those dates already filled in.
 * The cards below carry the same dates on to each house.
 *
 * A client component so /homes itself stays static: the page is the same for
 * everyone, only this panel depends on the address bar.
 */
export function AvailabilityHandoff({ bookingEngineUrl }: { bookingEngineUrl: string }) {
  const stay = readStay(useSearchParams());
  if (!stay) return null;

  return (
    <aside className={styles.panel} aria-label="Your dates">
      <p className={styles.dates}>
        Checking <b>{formatStayDate(stay.checkin)}</b> to <b>{formatStayDate(stay.checkout)}</b>{" "}
        for {stay.guests} {stay.guests === 1 ? "guest" : "guests"}.
      </p>
      <p className={styles.note}>
        Tap any house below to see its calendar and price for these dates. Or see everything
        that is free at once.
      </p>
      <a
        className={`${btn.btn} ${btn.gold}`}
        href={engineSearchUrl(bookingEngineUrl, stay)}
        rel="noopener noreferrer"
      >
        See what is free on those dates
      </a>
    </aside>
  );
}
