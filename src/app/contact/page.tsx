import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InquirySection } from "@/components/InquirySection";
import styles from "@/components/MarketingPage.module.css";
import { MarketingPageView } from "@/components/MarketingPageView";
import { getMarketingPage } from "@/content/source";
import { alternatesFor } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbSchema, faqPageSchema } from "@/lib/schema";

const PATH = "/contact";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getMarketingPage(PATH);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: alternatesFor(PATH),
    openGraph: {
      title: page.title,
      description: page.description,
      url: PATH,
      images: [ogImage(page.h1)],
    },
  };
}

export default async function Page() {
  const page = await getMarketingPage(PATH);
  if (!page) notFound();

  return (
    <>
      <MarketingPageView
        page={page}
        intro={
          <p className={styles.redirect}>
            This page is for homeowners. Looking for a place to stay?{" "}
            <Link href="/homes">See the homes</Link> or message us on WhatsApp.
          </p>
        }
        form={<InquirySection kind="owner" sourcePath={PATH} />}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: PATH },
        ])}
      />
      {page.faqs.length > 0 ? <JsonLd data={faqPageSchema(page.faqs)} /> : null}
    </>
  );
}
