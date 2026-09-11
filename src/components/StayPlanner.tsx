"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { Button } from "./Button";
import btn from "./Button.module.css";
import { DateRangePicker, type PickPhase } from "./DateRangePicker";
import styles from "./StayPlanner.module.css";
import {
  canArrive,
  canDepart,
  checkStay,
  formatMoney,
  indexNights,
  nightsBetween,
  type Availability,
} from "@/lib/availability";
import { engineCheckoutUrl, engineListingUrl, readStay, stayQuery, type Stay } from "@/lib/dates";
import type { Quote } from "@/lib/hostaway/calendar";

type Props = {
  listingId: number;
  /** Hostaway's guest limit for the house; the guests menu stops there. */
  sleeps: number | null;
  currency: string;
  bookingEngineUrl: string;
  whatsappUrl: string;
};

/**
 * The booking rail on a house page: the house's own calendar, a guest count,
 * the price for the stay, and one button to the engine's payment form with
 * all of it filled in.
 *
 * Everything before payment happens here, on our page, in our type. Payment
 * itself cannot: Hostaway does not allow its checkout inside another site,
 * so "Book these dates" opens the engine's form with the dates and guests
 * already set - the guest types nothing twice.
 *
 * Reads the address bar for dates carried from the strip, so it is a client
 * component wrapped in Suspense; the prerendered fallback is the same rail
 * with nothing chosen yet, which is what most guests see first anyway.
 */
export function StayPlanner(props: Props) {
  return (
    <Suspense fallback={<Planner {...props} initialStay={null} />}>
      <WithStay {...props} />
    </Suspense>
  );
}

function WithStay(props: Props) {
  const stay = readStay(useSearchParams());
  return <Planner {...props} initialStay={stay} />;
}

type QuoteState = { for: string; value: Quote | "failed" };

/** "$230" in a calendar cell; other currencies show the number alone - the cell is small. */
function cellPrice(amount: number, currency: string): string {
  const whole = Math.round(amount).toLocaleString("en-US");
  return currency === "USD" ? `$${whole}` : whole;
}

function Planner({
  listingId,
  sleeps,
  currency,
  bookingEngineUrl,
  whatsappUrl,
  initialStay,
}: Props & { initialStay: Stay | null }) {
  const [checkin, setCheckin] = useState(initialStay?.checkin ?? "");
  const [checkout, setCheckout] = useState(initialStay?.checkout ?? "");
  const [guests, setGuests] = useState(initialStay?.guests ?? 2);
  const [availability, setAvailability] = useState<Availability | "failed" | null>(null);
  const [quote, setQuote] = useState<QuoteState | null>(null);

  // The house's calendar, once per visit.
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/homes/${listingId}/calendar`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: Availability) => setAvailability(data))
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setAvailability("failed");
      });
    return () => controller.abort();
  }, [listingId]);

  const index = useMemo(
    () => (availability && availability !== "failed" ? indexNights(availability.nights) : null),
    [availability],
  );

  const maxGuests = sleeps && sleeps > 0 ? Math.min(sleeps, 16) : 16;
  const stay: Stay | null =
    checkin && checkout && checkout > checkin ? { checkin, checkout, guests } : null;
  const verdict = index && stay ? checkStay(index, checkin, checkout) : null;
  /*
   * With no calendar loaded (still loading, or Hostaway is having a bad day)
   * the guest may still book: the payment form checks the dates itself and
   * says so if they are gone. Better than a rail that refuses everything.
   */
  const bookable = stay !== null && (verdict === null || verdict.ok);
  const stayKey = stay ? `${stay.checkin}|${stay.checkout}|${stay.guests}` : "";

  // Hostaway's total for the stay, asked once the dates settle.
  useEffect(() => {
    if (!stayKey || !bookable) return;
    const [start, end, count] = stayKey.split("|");
    const controller = new AbortController();
    const timer = setTimeout(() => {
      const query = stayQuery({ checkin: start ?? "", checkout: end ?? "", guests: Number(count) });
      fetch(`/api/homes/${listingId}/quote?${query}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((data: Quote) => setQuote({ for: stayKey, value: data }))
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === "AbortError") return;
          setQuote({ for: stayKey, value: "failed" });
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [stayKey, bookable, listingId]);

  // Keep the address in step, so the page can be shared or returned to with the dates intact.
  useEffect(() => {
    const url = new URL(window.location.href);
    const before = url.search;
    for (const name of ["checkin", "checkout", "guests"]) url.searchParams.delete(name);
    if (checkin && checkout && checkout > checkin) {
      url.searchParams.set("checkin", checkin);
      url.searchParams.set("checkout", checkout);
      url.searchParams.set("guests", String(guests));
    }
    if (url.search !== before) window.history.replaceState(window.history.state, "", url);
  }, [checkin, checkout, guests]);

  const isBlocked = index
    ? (iso: string, phase: PickPhase) =>
        phase === "checkin" ? !canArrive(index, iso) : !canDepart(index, checkin, iso)
    : undefined;
  const priceOf = index
    ? (iso: string) => {
        const night = index.get(iso);
        return night?.available && night.price !== null ? cellPrice(night.price, currency) : null;
      }
    : undefined;

  const nights = nightsBetween(checkin, checkout);
  const currentQuote = quote && quote.for === stayKey ? quote.value : null;

  return (
    <div className={styles.planner}>
      <DateRangePicker
        inline
        checkin={checkin}
        checkout={checkout}
        onChange={(nextCheckin, nextCheckout) => {
          setCheckin(nextCheckin);
          setCheckout(nextCheckout);
        }}
        isBlocked={isBlocked}
        priceOf={priceOf}
      />

      <div className={styles.row}>
        <div className={styles.cell} aria-live="polite">
          <span>Nights</span>
          <b className={nights === null ? styles.placeholder : undefined}>{nights ?? "—"}</b>
        </div>
        <label className={styles.cell}>
          <span>Guests</span>
          <select value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.summary} aria-live="polite">
        {!stay ? (
          availability === "failed" ? (
            <p>We could not load the calendar just now. Choose dates anyway; the next page will confirm them.</p>
          ) : (
            <p>Choose your dates to see the price.</p>
          )
        ) : verdict && !verdict.ok ? (
          <p>
            {verdict.reason === "unavailable"
              ? "Those dates include a night that is already booked."
              : verdict.reason === "min-stay"
                ? `This house asks for at least ${verdict.minStay} nights from that check-in.`
                : verdict.reason === "no-arrival"
                  ? "Stays cannot start on that day. Try the day before or after."
                  : "Stays cannot end on that day. Try the day before or after."}
          </p>
        ) : (
          <>
            <p className={styles.nightsLine}>
              <b>
                {verdict?.ok && verdict.total !== null
                  ? `${verdict.nights} ${verdict.nights === 1 ? "night" : "nights"} · ${formatMoney(verdict.total, currency)}`
                  : `${nights} ${nights === 1 ? "night" : "nights"}`}
              </b>
            </p>
            {currentQuote === null ? (
              <p>Adding the cleaning fee and taxes…</p>
            ) : currentQuote === "failed" ? (
              <p>Cleaning fee and taxes are added on the next page.</p>
            ) : (
              <>
                {currentQuote.lines.length > 0 ? (
                  <dl className={styles.lines}>
                    {currentQuote.lines.map((line) => (
                      <div key={`${line.label}-${line.amount}`}>
                        <dt>{line.label}</dt>
                        <dd>{formatMoney(line.amount, currentQuote.currency)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <p className={styles.total}>
                  Total <b>{formatMoney(currentQuote.total, currentQuote.currency)}</b>
                </p>
              </>
            )}
          </>
        )}
      </div>

      <div className={styles.actions}>
        {stay && bookable ? (
          <Button variant="gold" href={engineCheckoutUrl(bookingEngineUrl, listingId, stay)}>
            Book these dates
          </Button>
        ) : (
          <button type="button" className={`${btn.btn} ${btn.gold}`} disabled>
            {stay ? "Choose other dates" : "Choose your dates"}
          </button>
        )}
        <Button variant="outline" href={whatsappUrl}>
          Ask us on WhatsApp
        </Button>
      </div>

      <p className={styles.fine}>
        Payment is on our own booking site. Same house, same team, no platform fee.
      </p>
      <noscript>
        <p className={styles.fine}>
          This calendar needs JavaScript.{" "}
          <a href={engineListingUrl(bookingEngineUrl, listingId, null)}>Check availability on our booking site</a>{" "}
          instead.
        </p>
      </noscript>
    </div>
  );
}
