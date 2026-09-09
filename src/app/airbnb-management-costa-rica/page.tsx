import type { Metadata } from "next";

import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Airbnb management in Costa Rica",
  alternates: { canonical: "/airbnb-management-costa-rica" },
  // Empty pages stay out of the index until Phase 2 fills them.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Placeholder title="Airbnb management in Costa Rica" note="You keep the Airbnb account and the payouts. We do the work behind them." />;
}
