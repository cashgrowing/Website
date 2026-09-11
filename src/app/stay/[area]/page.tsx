import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "../../homes/homes.module.css";
import stay from "../stay.module.css";
import { Faqs } from "@/components/Faqs";
import { HomeCard } from "@/components/HomeCard";
import { alternatesFor } from "@/lib/i18n";
import { GOOD_TO_KNOW, getAreaContent } from "@/content/areas";
import { getHomesByArea } from "@/lib/hostaway/listings";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { AREAS } from "@/lib/site";

export const revalidate = 900;
export const dynamicParams = false;

type Params = { params: Promise<{ area: string }> };

/** Management page each area links to - one of the internal linking rules. */
const MANAGEMENT_PAGE: Record<string, { href: string; label: string }> = {
  uvita: { href: "/vacation-rental-management-uvita", label: "Vacation rental management in Uvita" },
  dominical: { href: "/property-manager-dominical", label: "Property management in Dominical" },
  ojochal: { href: "/vacation-rental-management-ojochal", label: "Vacation rental management in Ojochal" },
};

export async function generateStaticParams() {
  return AREAS.filter((area) => area.slug).map((area) => ({ area: area.slug as string }));
}

function areaFromSlug(slug: string) {
  return AREAS.find((area) => area.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { area: slug } = await params;
  const area = areaFromSlug(slug);
  if (!area) return { title: "Area not found" };

  const content = getAreaContent(slug);

  return {
    title: `Vacation rentals in ${area.name}, Costa Rica`,
    description:
      content?.description ??
      `Homes to rent in ${area.name} on Costa Rica's South Pacific coast, looked after and booked direct with the local WildRoots team.`,
    alternates: alternatesFor(`/stay/${area.slug}`),
    openGraph: {
      title: `Stay in ${area.name}`,
      url: `/stay/${area.slug}`,
      images: [ogImage(`Stay in ${area.name}`)],
    },
  };
}

export default async function AreaPage({ params }: Params) {
  const { area: slug } = await params;
  const area = areaFromSlug(slug);
  if (!area) notFound();

  const homes = await getHomesByArea(area.name);
  const management = MANAGEMENT_PAGE[slug];
  const content = getAreaContent(slug);

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1>Stay in {area.name}</h1>
        <p>
          {content?.lede ??
            `Homes in ${area.name} looked after by the WildRoots team, booked direct.`}
        </p>
        <nav className={styles.areas} aria-label="Related pages">
          <Link href="/homes">All homes</Link>
          <Link href="/guest-services">Guest services</Link>
          {management ? <Link href={management.href}>{management.label}</Link> : null}
          {AREAS.filter((other) => other.slug && other.slug !== slug).map((other) => (
            <Link key={other.slug} href={`/stay/${other.slug}`}>
              Stay in {other.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Houses first; the guide to the area follows for whoever wants it. */}
      {homes.length > 0 ? (
        <div className={styles.cards}>
          {homes.map((home, index) => (
            <HomeCard key={home.id} home={home} priority={index < 4} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          No {area.name} homes are live in Hostaway yet. As soon as one is, it appears here
          on its own.
        </p>
      )}

      {content ? (
        <div className={`${stay.column} ${styles.after}`}>
          <div className={stay.intro}>
            {content.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <section className={stay.nearby}>
            <h2>{content.nearbyHeading}</h2>
            <div className={stay.list}>
              {content.nearby.map((place) => (
                <div className={stay.item} key={place.name}>
                  <h3>
                    {place.name}
                    {place.protected ? (
                      <span className={stay.protected} title="Protected land or regulated activity">
                        protected
                      </span>
                    ) : null}
                  </h3>
                  <p>{place.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={stay.nearby}>
            <h2>Getting here</h2>
            <div className={stay.list}>
              {content.gettingHere.map((item) => (
                <div className={stay.item} key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={stay.nearby}>
            <h2>Good to know</h2>
            <div className={stay.list}>
              {GOOD_TO_KNOW.map((item) => (
                <div className={stay.item} key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {content && content.faqs.length > 0 ? (
        <div className={stay.column}>
          <Faqs faqs={content.faqs} heading={`Staying in ${area.name}`} />
        </div>
      ) : null}

      {content && content.faqs.length > 0 ? <JsonLd data={faqPageSchema(content.faqs)} /> : null}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Homes", path: "/homes" },
          { name: area.name, path: `/stay/${area.slug}` },
        ])}
      />
    </div>
  );
}
