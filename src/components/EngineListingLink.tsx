"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { engineListingUrl, readStay } from "@/lib/dates";

type Props = {
  listingId: number;
  bookingEngineUrl: string;
  className?: string;
  children: ReactNode;
};

/**
 * A home card's link: straight to the booking engine's page for that house,
 * where the calendar, the price and the Book button are - not to our own
 * page about it, which cannot take a booking and was one click too many.
 *
 * Carries the guest's dates when they arrived with some. Client-side only to
 * read the address bar; the fallback is the same link without dates.
 */
export function EngineListingLink(props: Props) {
  return (
    <Suspense fallback={<Anchor {...props} href={engineListingUrl(props.bookingEngineUrl, props.listingId, null)} />}>
      <WithStay {...props} />
    </Suspense>
  );
}

function WithStay(props: Props) {
  const stay = readStay(useSearchParams());
  return <Anchor {...props} href={engineListingUrl(props.bookingEngineUrl, props.listingId, stay)} />;
}

function Anchor({ href, className, children }: Props & { href: string }) {
  return (
    <a className={className} href={href} rel="noopener noreferrer">
      {children}
    </a>
  );
}
