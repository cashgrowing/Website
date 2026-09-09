import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarketingPageView } from "@/components/MarketingPageView";
import { getMarketingPage } from "@/content/pages";
import { JsonLd, breadcrumbSchema, faqPageSchema } from "@/lib/schema";

const PATH = "/contact";

export async function generateMetadata(): Promise<Metadata> {
  const page = getMarketingPage(PATH);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: PATH },
    openGraph: { title: page.title, description: page.description, url: PATH },
  };
}

export default function Page() {
  const page = getMarketingPage(PATH);
  if (!page) notFound();

  return (
    <>
      <MarketingPageView page={page} />
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
