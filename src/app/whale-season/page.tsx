import type { Metadata } from "next";

import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Whale season on the Ballena coast",
  alternates: { canonical: "/whale-season" },
  // Empty pages stay out of the index until Phase 2 fills them.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Placeholder title="Whale season on the Ballena coast" note="When the humpbacks pass Uvita, and where to stay while they do." />;
}
