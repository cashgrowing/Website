import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "../../homes.module.css";
import { HomeCard } from "@/components/HomeCard";
import { getHomeGroupIntro } from "@/content/source";
import { getHomeGroup, homesInGroup, qualifyingGroups } from "@/lib/groups";
import { getBookableHomes, getHomes } from "@/lib/hostaway/listings";
import { alternatesFor } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 900;
/** Only groups that clear the threshold are built; anything else must 404. */
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const homes = await getHomes();
  return qualifyingGroups(homes).map(({ group }) => ({ slug: group.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const group = getHomeGroup(slug);
  if (!group) return { title: "Not found" };
  const path = `/homes/groups/${group.slug}`;
  return {
    title: group.title,
    description: group.description,
    alternates: alternatesFor(path),
    openGraph: { title: group.name, url: path, images: [ogImage(group.name)] },
  };
}

export default async function GroupPage({ params }: Params) {
  const { slug } = await params;
  const group = getHomeGroup(slug);
  if (!group) notFound();

  const [homes, editedIntro] = await Promise.all([getBookableHomes(), getHomeGroupIntro(group.slug)]);
  const matching = homesInGroup(homes, group);
  // Listings change; a group that qualified at build time may be empty now.
  if (matching.length === 0) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1>{group.name}</h1>
        <p>{editedIntro ?? group.intro}</p>
        <nav className={styles.areas} aria-label="Related pages">
          <Link href="/homes/groups">Homes by what matters</Link>
          <Link href="/homes">Every home we look after</Link>
        </nav>
      </div>

      <div className={styles.cards}>
        {matching.map((home, index) => (
          <HomeCard key={home.id} home={home} priority={index < 4} />
        ))}
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Homes", path: "/homes" },
          { name: "Homes by what matters", path: "/homes/groups" },
          { name: group.name, path: `/homes/groups/${group.slug}` },
        ])}
      />
    </div>
  );
}
