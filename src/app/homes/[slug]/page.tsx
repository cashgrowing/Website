import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "./home.module.css";
import { BookingLinks } from "@/components/BookingLinks";
import { PhotoSlot } from "@/components/PhotoSlot";
import { alternatesFor } from "@/lib/i18n";
import { getHomeBySlug, getHomes } from "@/lib/hostaway/listings";
import type { Home } from "@/lib/hostaway/types";
import { BUSINESS_ID, JsonLd, breadcrumbSchema } from "@/lib/schema";
import { AREAS, BOOKING_ENGINE_URL, CONTACT, SITE_URL } from "@/lib/site";

export const revalidate = 900;
/** A home added in Hostaway after the last build renders on first request. */
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const homes = await getHomes();
  return homes.map((home) => ({ slug: home.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const home = await getHomeBySlug(slug);
  if (!home) return { title: "Home not found" };

  const where = home.area ?? home.city ?? "Costa Rica";
  const summary = home.description?.split("\n")[0]?.trim();

  return {
    // Kept short so the rendered title stays under 60 characters with the suffix.
    title: `${home.name}, ${where}`,
    description:
      summary && summary.length > 60
        ? summary.slice(0, 152).trimEnd() + "..."
        : `Book ${home.name} in ${where} direct with the local team that looks after it.`,
    alternates: alternatesFor(`/homes/${home.slug}`),
    openGraph: {
      title: `${home.name}, ${where}`,
      url: `/homes/${home.slug}`,
      images: home.photos[0] ? [{ url: home.photos[0].url }] : undefined,
    },
  };
}

/** LodgingBusiness node. No priceRange, no rating, no review - none are supplied. */
function lodgingSchema(home: Home) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${SITE_URL}/homes/${home.slug}#lodging`,
    name: home.name,
    url: `${SITE_URL}/homes/${home.slug}`,
    ...(home.description ? { description: home.description.slice(0, 500) } : {}),
    ...(home.photos.length > 0 ? { image: home.photos.slice(0, 6).map((p) => p.url) } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: home.area ?? home.city ?? CONTACT.addressLocality,
      addressRegion: CONTACT.addressRegion,
      addressCountry: CONTACT.addressCountry,
    },
    ...(home.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: home.geo.latitude,
            longitude: home.geo.longitude,
          },
        }
      : {}),
    ...(home.bedrooms ? { numberOfRooms: home.bedrooms } : {}),
    ...(home.sleeps
      ? { occupancy: { "@type": "QuantitativeValue", maxValue: home.sleeps } }
      : {}),
    ...(home.amenities.length > 0
      ? {
          amenityFeature: home.amenities.map((name) => ({
            "@type": "LocationFeatureSpecification",
            name,
            value: true,
          })),
        }
      : {}),
    provider: { "@id": BUSINESS_ID },
  };
}

export default async function HomeDetailPage({ params }: Params) {
  const { slug } = await params;
  const home = await getHomeBySlug(slug);
  if (!home) notFound();

  const [lead, ...rest] = home.photos;
  const secondary = rest.slice(0, 2);
  const where = home.area ?? home.city;
  const areaSlug = AREAS.find((area) => area.name === home.area)?.slug ?? null;
  const paragraphs = home.description?.split("\n\n").filter(Boolean).slice(0, 6) ?? [];

  return (
    <article>
      <div className={styles.gallery}>
        {lead ? (
          <div className={`${styles.shot} ${styles.lead}`}>
            <Image
              src={lead.url}
              alt={lead.alt}
              fill
              sizes="(max-width: 1000px) 100vw, 66vw"
              priority
            />
          </div>
        ) : (
          <PhotoSlot
            className={`${styles.shot} ${styles.lead}`}
            brief={`Lead photograph of ${home.name}. Pull it from the property library in Hostaway or the owner's Drive folder.`}
            sizes="(max-width: 1000px) 100vw, 66vw"
            priority
          />
        )}
        {secondary.length > 0 ? (
          <div className={styles.stack}>
            {secondary.map((photo) => (
              <div className={styles.shot} key={photo.url}>
                <Image src={photo.url} alt={photo.alt} fill sizes="(max-width: 1000px) 50vw, 33vw" />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.body}>
        <div>
          <p className={styles.crumbs}>
            <Link href="/homes">Homes</Link>
            {where ? ` · ${where}` : null}
          </p>
          <h1 className={styles.title}>{home.name}</h1>

          <ul className={styles.facts}>
            {where ? <li>{where}</li> : null}
            {home.bedrooms ? <li>{home.bedrooms} bedrooms</li> : null}
            {home.bathrooms ? <li>{home.bathrooms} bathrooms</li> : null}
            {home.sleeps ? <li>Sleeps {home.sleeps}</li> : null}
          </ul>

          {/*
            On a phone the booking rail lands at the very bottom, after every
            paragraph and amenity. This bar puts the price and the two actions
            under the title, where a guest looks first; the rail stays below
            for anyone who reads the whole page. Hidden on wide screens, where
            the rail sits beside the text.
          */}
          <div className={styles.bookingBar}>
            {home.basePrice ? (
              <p className={styles.price}>
                from {home.currency === "USD" ? "$" : ""}
                {Math.round(home.basePrice)}
                {home.currency === "USD" ? "" : ` ${home.currency}`} / night
              </p>
            ) : (
              <p className={styles.price}>Price on request</p>
            )}
            <BookingLinks
              className={styles.railActions}
              listingId={home.id}
              bookingEngineUrl={BOOKING_ENGINE_URL}
              whatsappUrl={CONTACT.whatsappUrl}
            />
          </div>

          {paragraphs.length > 0 ? (
            <div className={styles.prose}>
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {home.amenities.length > 0 ? (
            <section className={styles.amenities}>
              <h2>What the house has</h2>
              <ul>
                {home.amenities.map((amenity) => (
                  <li key={amenity}>{amenity}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {areaSlug ? (
            <p className={styles.areaLink}>
              More places to stay in <Link href={`/stay/${areaSlug}`}>{home.area}</Link>.
            </p>
          ) : null}
        </div>

        <aside className={styles.rail}>
          <h2>Check the dates</h2>
          {home.basePrice ? (
            <p className={styles.price}>
              from {home.currency === "USD" ? "$" : ""}
              {Math.round(home.basePrice)}
              {home.currency === "USD" ? "" : ` ${home.currency}`} / night
            </p>
          ) : null}
          <p>
            Availability and checkout run on our own booking engine. Same house, same team,
            no platform fee.
          </p>
          <BookingLinks
            className={styles.railActions}
            listingId={home.id}
            bookingEngineUrl={BOOKING_ENGINE_URL}
            whatsappUrl={CONTACT.whatsappUrl}
          />
        </aside>
      </div>

      <JsonLd data={lodgingSchema(home)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Homes", path: "/homes" },
          { name: home.name, path: `/homes/${home.slug}` },
        ])}
      />
    </article>
  );
}
