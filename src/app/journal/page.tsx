import type { Metadata } from "next";

import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Journal",
  alternates: { canonical: "/journal" },
  // Empty pages stay out of the index until Phase 2 fills them.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Placeholder title="Journal" note="Notes on owning, renting and looking after a home on this coast." />;
}
