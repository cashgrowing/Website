import type { Metadata } from "next";

import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Property manager in Dominical",
  alternates: { canonical: "/property-manager-dominical" },
  // Empty pages stay out of the index until Phase 2 fills them.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Placeholder title="Property manager in Dominical" note="Looking after homes in Dominical and the surrounding hills." />;
}
