import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "../journal.module.css";
import { Faqs } from "@/components/Faqs";
import { getJournalPost, getJournalPosts } from "@/content/journal";
import { alternatesFor } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, articleSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schema";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return getJournalPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: alternatesFor(`/journal/${post.slug}`),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/journal/${post.slug}`,
      publishedTime: post.publishedAt,
      images: [ogImage(post.title, "WildRoots Journal")],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function JournalPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  return (
    <article className={styles.page}>
      <div className={styles.column}>
        <p className={styles.crumbs}>
          <Link href="/journal">Journal</Link>
        </p>

        <header className={styles.postHeader}>
          <h1>{post.title}</h1>
          {/* No byline: the company speaks as WildRoots, never as a person. */}
          <p className={styles.postMeta}>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {" · "}
            {post.readingMinutes} min read
          </p>
        </header>

        <div className={styles.body}>
          {post.body.map((block, index) => {
            if (block.kind === "h2") return <h2 key={index}>{block.text}</h2>;
            if (block.kind === "note")
              return (
                <p className={styles.note} key={index}>
                  {block.text}
                </p>
              );
            return <p key={index}>{block.text}</p>;
          })}
        </div>

        <Faqs faqs={post.faqs} />

        {post.related.length > 0 ? (
          <nav className={styles.related} aria-label="Related pages">
            <h2>Read next</h2>
            <div className={styles.relatedLinks}>
              {post.related.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}
      </div>

      <JsonLd data={articleSchema(post)} />
      {post.faqs.length > 0 ? <JsonLd data={faqPageSchema(post.faqs)} /> : null}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
          { name: post.title, path: `/journal/${post.slug}` },
        ])}
      />
    </article>
  );
}
