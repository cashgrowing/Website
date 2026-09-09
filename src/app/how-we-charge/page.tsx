import type { Metadata } from "next";

import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "How we charge",
  alternates: { canonical: "/how-we-charge" },
  // Empty pages stay out of the index until Phase 2 fills them.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Placeholder title="How we charge" note="Three fees and nothing hidden: a one-time setup fee, a flat monthly management fee, and a share of the revenue we bring in." />;
}
