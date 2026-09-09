import type { Metadata } from "next";

import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Contact WildRoots",
  alternates: { canonical: "/contact" },
  // Empty pages stay out of the index until Phase 2 fills them.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Placeholder title="Contact WildRoots" note="WhatsApp is the fastest way to reach the team, day or night." />;
}
