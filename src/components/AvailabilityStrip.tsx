"use client";

import { useState } from "react";

import btn from "./Button.module.css";
import { DateRangePicker } from "./DateRangePicker";
import styles from "./AvailabilityStrip.module.css";
import { nightsBetween } from "@/lib/availability";

/**
 * Dates and guests on the first screen: Dates · Nights · Guests · button.
 *
 * A plain GET form: it lands on /homes with the dates in the address, and the
 * hand-off there sends the guest on to the booking engine with the same dates
 * filled in. Sits under the hero on paper, ruled with hairlines like
 * everything else - deliberately not a dark box in the hero.
 *
 * The nights cell is arithmetic on the two dates, shown so a guest can see
 * the stay they are about to search for before they search for it.
 */
export function AvailabilityStrip() {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const nights = nightsBetween(checkin, checkout);

  return (
    <form className={styles.strip} action="/homes" method="get" aria-label="Check availability">
      <input type="hidden" name="checkin" value={checkin} />
      <input type="hidden" name="checkout" value={checkout} />

      <div className={`${styles.field} ${styles.dates}`}>
        <DateRangePicker
          checkin={checkin}
          checkout={checkout}
          onChange={(nextCheckin, nextCheckout) => {
            setCheckin(nextCheckin);
            setCheckout(nextCheckout);
          }}
        />
      </div>

      <div className={`${styles.field} ${styles.nights}`} aria-live="polite">
        <span>Nights</span>
        <b className={nights === null ? styles.placeholder : undefined}>
          {nights === null ? "—" : nights}
        </b>
      </div>

      <label className={`${styles.field} ${styles.guests}`}>
        <span>Guests</span>
        <input type="number" name="guests" min={1} max={16} defaultValue={2} inputMode="numeric" />
      </label>

      <div className={styles.go}>
        <button type="submit" className={`${btn.btn} ${btn.black}`}>
          Check availability
        </button>
      </div>
    </form>
  );
}
