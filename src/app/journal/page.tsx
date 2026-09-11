import type { Metadata } from "next";
import Link from "next/link";

import styles from "./journal.module.css";
import { getJournalPosts } from "@/content/source";
import { JOURNAL_CATEGORY_LABELS, type JournalPost } from "@/content/types";
import { alternatesFor } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on owning, renting and looking after a vacation home on Costa Rica's South Pacific coast, written from Uvita.",
  alternates: alternatesFor("/journal"),
  openGraph: {
    title: "Journal",
    url: "/journal",
    images: [ogImage("Notes from this coast", "WildRoots Journal")],
  },
};

/** Dates are rendered on the server so the markup is identical for every visitor. */
function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Two lanes, one page. Guests (and pieces about the coast itself) first,
 * owners second, each under its own heading, so a reader never has to sort
 * the other audience's articles out of their way.
 */
const LANES = [
  {
    id: "guests",
    heading: "For guests",
    intro: "When to come, what to expect, and what the coast is like month by month.",
    includes: (post: JournalPost) => post.category !== "owners",
  },
  {
    id: "owners",
    heading: "For homeowners",
    intro: "What it takes to run a house here well, written from doing it.",
    includes: (post: JournalPost) => post.category === "owners",
  },
];

export default async function JournalIndexPage() {
  const posts = await getJournalPosts();

  return (
    <div className={styles.page}>
      <div className={styles.column}>
        <header className={styles.header}>
          <h1>Journal</h1>
          <p>
            Notes on staying, owning and looking after a home on this coast. Written from
            Uvita, by the team that does the work.
          </p>
          <nav className={styles.lanes} aria-label="Sections">
            {LANES.map((lane) => (
              <a key={lane.id} href={`#${lane.id}`}>
                {lane.heading}
              </a>
            ))}
          </nav>
        </header>

        {LANES.map((lane) => {
          const entries = posts.filter(lane.includes);
          if (entries.length === 0) return null;
          return (
            <section key={lane.id} id={lane.id} className={styles.lane}>
              <h2 className={styles.laneHeading}>{lane.heading}</h2>
              <p className={styles.laneIntro}>{lane.intro}</p>
              <div className={styles.list}>
                {entries.map((post) => (
                  <Link className={styles.entry} href={`/journal/${post.slug}`} key={post.slug}>
                    <p className={styles.meta}>
                      <span className={styles.category}>
                        {JOURNAL_CATEGORY_LABELS[post.category]}
                      </span>
                      {" · "}
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      {" · "}
                      {post.readingMinutes} min read
                    </p>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
        {posts.length === 0 ? <p className={styles.empty}>No posts yet.</p> : null}
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
        ])}
      />
    </div>
  );
}
