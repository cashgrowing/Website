"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, type ComponentProps } from "react";

import { readStay, withStay } from "@/lib/dates";

type Props = ComponentProps<typeof Link> & { href: string };

/**
 * A next/link that keeps the guest's dates in the address as they move from
 * a list of homes to one home. Without dates it is a plain link.
 *
 * Wraps its own Suspense boundary so any static page can use it without
 * arranging one, and the fallback is the same link without dates - never a
 * gap where a link should be.
 */
export function DatedLink(props: Props) {
  return (
    <Suspense fallback={<Link {...props} />}>
      <DatedLinkInner {...props} />
    </Suspense>
  );
}

function DatedLinkInner({ href, ...rest }: Props) {
  const stay = readStay(useSearchParams());
  return <Link href={withStay(href, stay)} {...rest} />;
}
