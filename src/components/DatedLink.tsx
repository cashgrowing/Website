"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { readStay, withStay } from "@/lib/dates";

type Props = { href: string; className?: string; children: ReactNode };

/**
 * A link to one of our own pages that carries the guest's dates along when
 * they arrived with some, so the house page opens with them already picked.
 *
 * Client-side only to read the address bar; the fallback is the same link
 * without dates, so the page prerenders and works without JavaScript.
 */
export function DatedLink(props: Props) {
  return (
    <Suspense fallback={<Anchor {...props} />}>
      <WithStay {...props} />
    </Suspense>
  );
}

function WithStay(props: Props) {
  const stay = readStay(useSearchParams());
  return <Anchor {...props} href={withStay(props.href, stay)} />;
}

function Anchor({ href, className, children }: Props) {
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
