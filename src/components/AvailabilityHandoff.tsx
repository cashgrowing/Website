"use client";

import { useSearchParams } from "next/navigation";

import btn from "./Button.module.css";
import styles from "./AvailabilityHandoff.module.css";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Reads the dates the visitor typed into the strip on the home page and offers
 * one link to the booking engine with those dates already filled in.
 *
 * A client component so /homes itself stays static: the page is the same for
 * everyone, only this panel depends on the address bar. The booking engine
 * accepts `start`, `end` and `numberOfGuests` on its /search route - checked
 * against the live engine, since it silently ignores anything else.
 */
export function AvailabilityHandoff({ bookingEngineUrl }: { bookingEngineUrl: string }) {
  const params = useSearchParams();
  const checkin = params.get("checkin") ?? "";
  const checkout = params.get("checkout") ?? "";
  const guests = Math.min(16, Math.max(1, Number.parseInt(params.get("guests") ?? "2", 10) || 2));

  if (!ISO_DATE.test(checkin) || !ISO_DATE.test(checkout) || checkout <= checkin) return null;

  const url = new URL("/search", bookingEngineUrl);
  url.searchParams.set("start", checkin);
  url.searchParams.set("end", checkout);
  url.searchParams.set("numberOfGuests", String(guests));

  return (
    <aside className={styles.panel} aria-label="Your dates">
      <p className={styles.dates}>
        Checking <b>{formatDate(checkin)}</b> to <b>{formatDate(checkout)}</b> for {guests}{" "}
        {guests === 1 ? "guest" : "guests"}.
      </p>
      <p className={styles.note}>
        Live availability and prices are on our booking engine. Every home below is the same
        house, run by the same team.
      </p>
      <a className={`${btn.btn} ${btn.gold}`} href={url.toString()} rel="noopener noreferrer">
        See what is free on those dates
      </a>
    </aside>
  );
}
