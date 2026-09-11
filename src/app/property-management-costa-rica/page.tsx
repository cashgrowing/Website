import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarketingPageView } from "@/components/MarketingPageView";
import { OwnerPoints } from "@/components/OwnerPoints";
import { getMarketingPage } from "@/content/source";
import { alternatesFor } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbSchema, faqPageSchema } from "@/lib/schema";

const PATH = "/property-management-costa-rica";

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
      {/* The owners' front page: what they get comes before the longer read. */}
      <MarketingPageView page={page} intro={<OwnerPoints />} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Property management", path: PATH },
        ])}
      />
      {page.faqs.length > 0 ? <JsonLd data={faqPageSchema(page.faqs)} /> : null}
    </>
  );
}
