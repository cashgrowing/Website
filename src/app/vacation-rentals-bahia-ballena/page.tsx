import type { Metadata } from "next";

import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Vacation rentals in Bahía Ballena",
  alternates: { canonical: "/vacation-rentals-bahia-ballena" },
  // Empty pages stay out of the index until Phase 2 fills them.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Placeholder title="Vacation rentals in Bahía Ballena" note="Homes to rent in Bahía Ballena, at the foot of the Whale's Tail." />;
}
