import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import styles from "./home.module.css";
import { HouseGallery } from "@/components/HouseGallery";
import { PhotoSlot } from "@/components/PhotoSlot";
import { StayPlanner } from "@/components/StayPlanner";
import { alternatesFor } from "@/lib/i18n";
import { getHomeByAlias, getHomeBySlug, getHomes } from "@/lib/hostaway/listings";
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

/**
 * The house at this address. An address the house used to have - its
 * channel title, or a name it had before a rename in Hostaway - sends the
 * visitor on to the current one rather than to a dead end.
 */
async function resolveHome(slug: string): Promise<Home> {
  const home = await getHomeBySlug(slug);
  if (home) return home;
  const renamed = await getHomeByAlias(slug);
  if (renamed) permanentRedirect(`/homes/${renamed.slug}`);
  notFound();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const home = await resolveHome(slug);

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

/** "December 2027" from a YYYY-MM-DD string. */
function formatMonth(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export default async function HomeDetailPage({ params }: Params) {
  const { slug } = await params;
  const home = await resolveHome(slug);
  // The calendar's cheapest open night when we have it; Hostaway's base rate otherwise.
  const from = home.fromPrice ?? home.basePrice;

  const where = home.area ?? home.city;
  const areaSlug = AREAS.find((area) => area.name === home.area)?.slug ?? null;
  const paragraphs = home.description?.split("\n\n").filter(Boolean).slice(0, 6) ?? [];

  return (
    <article>
      {home.photos.length > 0 ? (
        <HouseGallery photos={home.photos} name={home.name} />
      ) : (
        <PhotoSlot
          className={styles.noPhoto}
          brief={`Lead photograph of ${home.name}. Pull it from the property library in Hostaway or the owner's Drive folder.`}
          sizes="100vw"
          priority
        />
      )}

      {/*
        Three areas: the title block, the reading matter, and the booking
        rail. Beside each other on wide screens; on a phone the rail comes
        straight after the title, so the calendar is where a guest looks
        first and the paragraphs follow for anyone who reads on.
      */}
      <div className={styles.body}>
        <header className={styles.head}>
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
        </header>

        <div className={styles.rest}>
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

        <aside className={styles.rail} aria-label="Book this house">
          <h2>Check the dates</h2>
          {from ? (
            <p className={styles.price}>
              from {home.currency === "USD" ? "$" : ""}
              {Math.round(from)}
              {home.currency === "USD" ? "" : ` ${home.currency}`} / night
            </p>
          ) : (
            <p className={styles.price}>Price on request</p>
          )}
          {!home.bookable ? (
            <p className={styles.booked}>
              {home.nextOpen
                ? `Booked until ${formatMonth(home.nextOpen)}. Stays from then on can be booked below, or ask us on WhatsApp.`
                : "Not taking bookings at the moment. Ask us on WhatsApp about future dates."}
            </p>
          ) : null}
          <StayPlanner
            listingId={home.id}
            sleeps={home.sleeps}
            currency={home.currency}
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
