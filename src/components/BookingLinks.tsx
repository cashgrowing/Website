"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Button } from "./Button";
import { engineListingUrl, formatStayDate, readStay, type Stay } from "@/lib/dates";

type Props = {
  listingId: number;
  bookingEngineUrl: string;
  whatsappUrl: string;
  className?: string;
};

/**
 * The two ways to act on a house: the booking engine, and WhatsApp.
 *
 * Sends the guest to the engine's page for THIS house - not its homepage -
 * with their dates already filled in when they arrived with some. A client
 * component only so it can read the address bar; the fallback renders the
 * same links without dates, so the page works with no JavaScript at all.
 */
export function BookingLinks(props: Props) {
  return (
    <Suspense fallback={<Links {...props} stay={null} />}>
      <WithStay {...props} />
    </Suspense>
  );
}

function WithStay(props: Props) {
  const stay = readStay(useSearchParams());
  return <Links {...props} stay={stay} />;
}

function Links({ listingId, bookingEngineUrl, whatsappUrl, className, stay }: Props & { stay: Stay | null }) {
  return (
    <div className={className}>
      <Button variant="gold" href={engineListingUrl(bookingEngineUrl, listingId, stay)}>
        {stay
          ? `Check ${formatStayDate(stay.checkin)} to ${formatStayDate(stay.checkout)}`
          : "Check availability"}
      </Button>
      <Button variant="outline" href={whatsappUrl}>
        Ask us on WhatsApp
      </Button>
    </div>
  );
}
