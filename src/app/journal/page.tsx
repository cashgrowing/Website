import type { Metadata } from "next";
import Link from "next/link";

import styles from "./journal.module.css";
import { getJournalPosts } from "@/content/source";
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

export default async function JournalIndexPage() {
  const posts = await getJournalPosts();

  return (
    <div className={styles.page}>
      <div className={styles.column}>
        <header className={styles.header}>
          <h1>Journal</h1>
          <p>
            Notes on owning, renting and looking after a home on this coast. Written from
            Uvita, by the team that does the work.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className={styles.list}>
            {posts.map((post) => (
              <Link className={styles.entry} href={`/journal/${post.slug}`} key={post.slug}>
                <p className={styles.meta}>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  {" · "}
                  {post.readingMinutes} min read
                </p>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No posts yet.</p>
        )}
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
