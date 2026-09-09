import type { Faq, JournalPost } from "@/content/types";
import { AREA_NAMES, BRAND, CONTACT, SITE_URL, SOCIAL } from "./site";

/** Stable @id for the business node, referenced by every other node on the site. */
export const BUSINESS_ID = `${SITE_URL}/#business`;

/**
 * Site-wide ProfessionalService node.
 *
 * Deliberately omits priceRange, aggregateRating and review: the brief forbids
 * inventing any of them, and none have been supplied.
 */
export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: BRAND.legalName,
    alternateName: BRAND.name,
    url: `${SITE_URL}/`,
    description: BRAND.tagline,
    telephone: CONTACT.telephone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: CONTACT.addressLocality,
      addressRegion: CONTACT.addressRegion,
      addressCountry: CONTACT.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CONTACT.geo.latitude,
      longitude: CONTACT.geo.longitude,
    },
    areaServed: AREA_NAMES.map((name) => ({ "@type": "Place", name })),
    knowsLanguage: ["en", "es"],
    sameAs: [...SOCIAL],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** FAQPage node. Required on any page that carries FAQs. */
export function faqPageSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * Article node for a journal post.
 *
 * Authored by the organisation, never a person: the brief forbids naming anyone
 * on the site, and the Wix original carried a personal byline here.
 */
export function articleSchema(post: JournalPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/journal/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "en",
    author: { "@id": BUSINESS_ID },
    publisher: { "@id": BUSINESS_ID },
    isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/journal#blog`, name: `${BRAND.name} Journal` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/journal/${post.slug}` },
  };
}

/** Render a JSON-LD block. Values are ours, never user input. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
