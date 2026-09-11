import btn from "./Button.module.css";
import styles from "./AvailabilityStrip.module.css";

/**
 * Dates and guests on the first screen.
 *
 * A plain GET form, no JavaScript: it lands on /homes with the dates in the
 * address, and the hand-off there sends the guest on to the booking engine
 * with the same dates filled in. Sits under the hero on paper, ruled with
 * hairlines like everything else - deliberately not a dark box in the hero.
 */
export function AvailabilityStrip() {
  return (
    <form className={styles.strip} action="/homes" method="get" aria-label="Check availability">
      <label className={styles.field}>
        <span>Check-in</span>
        <input type="date" name="checkin" required />
      </label>
      <label className={styles.field}>
        <span>Check-out</span>
        <input type="date" name="checkout" required />
      </label>
      <label className={styles.field}>
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
