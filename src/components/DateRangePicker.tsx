"use client";

import { useEffect, useId, useRef, useState } from "react";

import styles from "./DateRangePicker.module.css";

/**
 * One "Dates" field that opens a calendar: tap check-in, tap check-out, done.
 *
 * Written by hand rather than pulled from a library: it is two months of
 * buttons and a little arithmetic, and a date-picker package would be the
 * largest thing on the page. Dates are handled as YYYY-MM-DD strings built
 * from the visitor's local calendar, so nothing shifts by a day across time
 * zones. The surrounding form owns the hidden inputs it submits.
 *
 * Two homes: the strip under the hero, where it is a field that opens a
 * popover, and the booking rail on a house page, where it is `inline` - the
 * calendar is always open and knows which nights are taken.
 */

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}
function toISO(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}
function todayISO(): string {
  const now = new Date();
  return toISO(now.getFullYear(), now.getMonth(), now.getDate());
}
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]?.slice(0, 3)} ${d}${y !== new Date().getFullYear() ? `, ${y}` : ""}`;
}

type Month = { year: number; month: number };

function addMonths({ year, month }: Month, n: number): Month {
  const total = year * 12 + month + n;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

/** The month a YYYY-MM-DD string falls in, or this month when there is none. */
function monthOf(iso: string): Month {
  const match = /^(\d{4})-(\d{2})/.exec(iso);
  if (match) return { year: Number(match[1]), month: Number(match[2]) - 1 };
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

/** Which end of the stay the next tap sets. */
export type PickPhase = "checkin" | "checkout";

type Props = {
  checkin: string;
  checkout: string;
  onChange: (checkin: string, checkout: string) => void;
  /**
   * Days a guest may not tap right now, given what the tap would mean. The
   * house page answers from its calendar; the strip, which has no house yet,
   * leaves it out and every future day is open.
   */
  isBlocked?: (iso: string, phase: PickPhase) => boolean;
  /** A short price to print under a day, e.g. "$230". Null prints nothing. */
  priceOf?: (iso: string) => string | null;
  /** Always open, no field, one month: the calendar as a fixture of the page. */
  inline?: boolean;
};

/**
 * Controlled: the form that owns the hidden inputs owns the dates too, so it
 * can show the night count beside this field.
 */
export function DateRangePicker({ checkin, checkout, onChange, isBlocked, priceOf, inline = false }: Props) {
  const [open, setOpen] = useState(inline);
  const [view, setView] = useState<Month>(() => monthOf(checkin));
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  // Close on a click outside or on Escape - the two ways people expect.
  useEffect(() => {
    if (!open || inline) return;
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, inline]);

  const today = todayISO();
  const phase: PickPhase = !checkin || checkout ? "checkin" : "checkout";

  function pick(iso: string) {
    if (phase === "checkin" || iso <= checkin) {
      // Starting a new stay - or tapping a day before the start, which means the same.
      onChange(iso, "");
      return;
    }
    onChange(checkin, iso);
    if (!inline) setOpen(false);
  }

  /*
   * What a tap on this day would do decides whether it is allowed: during a
   * check-out pick, a day at or before the check-in starts a new stay, so it
   * is judged as a check-in.
   */
  function blocked(iso: string): boolean {
    if (!isBlocked) return false;
    const meaning: PickPhase = phase === "checkout" && iso > checkin ? "checkout" : "checkin";
    return isBlocked(iso, meaning);
  }

  function clear() {
    onChange("", "");
  }

  const summary = checkin
    ? `${shortDate(checkin)} → ${checkout ? shortDate(checkout) : "check-out"}`
    : "Check-in → Check-out";

  const months = inline ? [view] : [view, addMonths(view, 1)];

  return (
    <div className={`${styles.root} ${inline ? styles.inline : ""}`} ref={rootRef}>
      {inline ? null : (
        <button
          type="button"
          className={styles.field}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={labelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span id={labelId} className={styles.label}>
            Dates
          </span>
          <span className={checkin ? styles.value : styles.placeholder}>{summary}</span>
        </button>
      )}

      {open ? (
        <div
          className={inline ? styles.calendar : styles.popover}
          role={inline ? "group" : "dialog"}
          aria-label="Choose your dates"
        >
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Previous month"
              onClick={() => setView((v) => addMonths(v, -1))}
            >
              ←
            </button>
            <p className={styles.hint}>
              {!checkin
                ? "Tap your check-in day"
                : !checkout
                  ? "Now tap your check-out day"
                  : `${shortDate(checkin)} to ${shortDate(checkout)}`}
            </p>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Next month"
              onClick={() => setView((v) => addMonths(v, 1))}
            >
              →
            </button>
          </div>

          <div className={styles.months}>
            {months.map((month, index) => (
              <MonthGrid
                key={`${month.year}-${month.month}`}
                month={month}
                today={today}
                checkin={checkin}
                checkout={checkout}
                onPick={pick}
                blocked={blocked}
                priceOf={priceOf}
                secondary={index === 1}
              />
            ))}
          </div>

          <div className={styles.foot}>
            <button type="button" className={styles.textButton} onClick={clear}>
              Clear
            </button>
            {inline ? null : (
              <button type="button" className={styles.textButton} onClick={() => setOpen(false)}>
                Done
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MonthGrid({
  month,
  today,
  checkin,
  checkout,
  onPick,
  blocked,
  priceOf,
  secondary,
}: {
  month: Month;
  today: string;
  checkin: string;
  checkout: string;
  onPick: (iso: string) => void;
  blocked: (iso: string) => boolean;
  priceOf?: (iso: string) => string | null;
  secondary: boolean;
}) {
  const first = new Date(month.year, month.month, 1);
  const daysInMonth = new Date(month.year, month.month + 1, 0).getDate();
  const leading = first.getDay();
  const cells: Array<number | null> = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className={`${styles.month} ${secondary ? styles.secondary : ""}`}>
      <p className={styles.monthName}>
        {MONTHS[month.month]} {month.year}
      </p>
      <div className={`${styles.grid} ${priceOf ? styles.priced : ""}`} role="grid">
        {WEEKDAYS.map((day) => (
          <span key={day} className={styles.weekday} aria-hidden="true">
            {day}
          </span>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <span key={`blank-${index}`} />;
          const iso = toISO(month.year, month.month, day);
          const past = iso < today;
          const taken = !past && blocked(iso);
          const isStart = iso === checkin;
          const isEnd = iso === checkout;
          const inRange = Boolean(checkin && checkout && iso > checkin && iso < checkout);
          const price = !past && !taken && priceOf ? priceOf(iso) : null;
          const className = [
            styles.day,
            isStart || isEnd ? styles.selected : "",
            inRange ? styles.inRange : "",
            iso === today ? styles.today : "",
            taken ? styles.blocked : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={iso}
              type="button"
              className={className}
              disabled={past || taken}
              aria-pressed={isStart || isEnd}
              aria-label={`${MONTHS[month.month]} ${day}, ${month.year}${taken ? ", not available" : ""}${price ? `, ${price}` : ""}`}
              onClick={() => onPick(iso)}
            >
              <span>{day}</span>
              {price ? <span className={styles.dayPrice}>{price}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
