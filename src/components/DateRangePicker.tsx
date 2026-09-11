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
 * zones. The two hidden inputs are what the surrounding form submits.
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

export function DateRangePicker({
  initialCheckin = "",
  initialCheckout = "",
}: {
  initialCheckin?: string;
  initialCheckout?: string;
}) {
  const [open, setOpen] = useState(false);
  const [checkin, setCheckin] = useState(initialCheckin);
  const [checkout, setCheckout] = useState(initialCheckout);
  const [view, setView] = useState<Month>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  // Close on a click outside or on Escape - the two ways people expect.
  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  const today = todayISO();

  function pick(iso: string) {
    if (!checkin || checkout) {
      // Starting a new stay.
      setCheckin(iso);
      setCheckout("");
      return;
    }
    if (iso <= checkin) {
      // Tapped a day before the start: treat it as a new start.
      setCheckin(iso);
      return;
    }
    setCheckout(iso);
    setOpen(false);
  }

  function clear() {
    setCheckin("");
    setCheckout("");
  }

  const summary = checkin
    ? `${shortDate(checkin)} → ${checkout ? shortDate(checkout) : "check-out"}`
    : "Check-in → Check-out";

  return (
    <div className={styles.root} ref={rootRef}>
      <input type="hidden" name="checkin" value={checkin} />
      <input type="hidden" name="checkout" value={checkout} />

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

      {open ? (
        <div className={styles.popover} role="dialog" aria-label="Choose your dates">
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
            {[view, addMonths(view, 1)].map((month, index) => (
              <MonthGrid
                key={`${month.year}-${month.month}`}
                month={month}
                today={today}
                checkin={checkin}
                checkout={checkout}
                onPick={pick}
                secondary={index === 1}
              />
            ))}
          </div>

          <div className={styles.foot}>
            <button type="button" className={styles.textButton} onClick={clear}>
              Clear
            </button>
            <button type="button" className={styles.textButton} onClick={() => setOpen(false)}>
              Done
            </button>
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
  secondary,
}: {
  month: Month;
  today: string;
  checkin: string;
  checkout: string;
  onPick: (iso: string) => void;
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
      <div className={styles.grid} role="grid">
        {WEEKDAYS.map((day) => (
          <span key={day} className={styles.weekday} aria-hidden="true">
            {day}
          </span>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <span key={`blank-${index}`} />;
          const iso = toISO(month.year, month.month, day);
          const past = iso < today;
          const isStart = iso === checkin;
          const isEnd = iso === checkout;
          const inRange = Boolean(checkin && checkout && iso > checkin && iso < checkout);
          const className = [
            styles.day,
            isStart || isEnd ? styles.selected : "",
            inRange ? styles.inRange : "",
            iso === today ? styles.today : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={iso}
              type="button"
              className={className}
              disabled={past}
              aria-pressed={isStart || isEnd}
              aria-label={`${MONTHS[month.month]} ${day}, ${month.year}`}
              onClick={() => onPick(iso)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
