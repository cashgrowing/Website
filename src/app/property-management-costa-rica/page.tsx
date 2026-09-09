import type { Metadata } from "next";

import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Property management in Costa Rica",
  alternates: { canonical: "/property-management-costa-rica" },
  // Empty pages stay out of the index until Phase 2 fills them.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Placeholder title="Property management in Costa Rica" note="How WildRoots manages a home on the South Pacific coast: marketing, guest hosting, weekly checks and one clear statement a month." />;
}
