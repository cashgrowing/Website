import type { Metadata } from "next";

import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "About WildRoots",
  alternates: { canonical: "/about" },
  // Empty pages stay out of the index until Phase 2 fills them.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Placeholder title="About WildRoots" note="A boutique management company on Costa Rica's South Pacific coast." />;
}
