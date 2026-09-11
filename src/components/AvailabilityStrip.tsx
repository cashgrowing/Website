import btn from "./Button.module.css";
import { DateRangePicker } from "./DateRangePicker";
import styles from "./AvailabilityStrip.module.css";

/**
 * Dates and guests on the first screen.
 *
 * A plain GET form: it lands on /homes with the dates in the address, and the
 * hand-off there sends the guest on to the booking engine with the same dates
 * filled in. Sits under the hero on paper, ruled with hairlines like
 * everything else - deliberately not a dark box in the hero.
 *
 * The dates field is one control that opens a calendar (tap check-in, tap
 * check-out); it submits two hidden inputs, so the form needs nothing else.
 */
export function AvailabilityStrip() {
  return (
    <form className={styles.strip} action="/homes" method="get" aria-label="Check availability">
      <div className={styles.field}>
        <DateRangePicker />
      </div>
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
