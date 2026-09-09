import type { Metadata } from "next";

import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Vacation rental management in Uvita",
  alternates: { canonical: "/vacation-rental-management-uvita" },
  // Empty pages stay out of the index until Phase 2 fills them.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Placeholder title="Vacation rental management in Uvita" note="Managing a vacation rental in Uvita and Bahía Ballena, with a team that lives here." />;
}
