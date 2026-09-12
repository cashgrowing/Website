import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "../homes.module.css";
import { GroupTiles } from "@/components/GroupTiles";
import { qualifyingGroups } from "@/lib/groups";
import { getBookableHomes } from "@/lib/hostaway/listings";
import { alternatesFor } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Homes by what matters",
  description:
    "Vacation homes on Costa Rica's South Pacific coast grouped by what matters: a pool, an ocean view, room for eight, a walk to the beach.",
  alternates: alternatesFor("/homes/groups"),
  openGraph: {
    title: "Homes by what matters",
    url: "/homes/groups",
    images: [ogImage("Homes by what matters")],
  },
};

export const revalidate = 900;

export default async function GroupsIndexPage() {
  const homes = await getBookableHomes();
  const groups = qualifyingGroups(homes);
  // Nothing links here while no group narrows the choice; a direct visit gets a 404, not an empty page.
  if (groups.length === 0) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1>Homes by what matters</h1>
        <p>
          The same houses, sorted by the thing you are actually choosing on: a pool, a view,
          room for the whole group. Every list is drawn from the live listings.
        </p>
        <nav className={styles.areas} aria-label="Related pages">
          <Link href="/homes">Every home we look after</Link>
        </nav>
      </div>

      {groups.length > 0 ? (
        <GroupTiles groups={groups} />
      ) : (
        <p className={styles.empty}>
          A group appears here once three or more homes belong to it. Until then, every home is
          on the homes page.
        </p>
      )}

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Homes", path: "/homes" },
          { name: "Homes by what matters", path: "/homes/groups" },
        ])}
      />
    </div>
  );
}
