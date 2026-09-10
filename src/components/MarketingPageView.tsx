import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "./Button";
import { Faqs } from "./Faqs";
import styles from "./MarketingPage.module.css";
import type { MarketingPage } from "@/content/types";
import { BOOKING_ENGINE_URL, CONTACT } from "@/lib/site";

/**
 * Renders any migrated page. One component, so the eight pages cannot drift
 * apart, and so moving this content into Sanity later changes only where the
 * data comes from - not a single layout decision.
 *
 * The words came from the old site; the structure did not. One reading column,
 * hairline rules, and a closing band on black.
 */
export function MarketingPageView({
  page,
  /** Optional slot rendered inside the reading column, e.g. the enquiry form. */
  form,
}: {
  page: MarketingPage;
  form?: ReactNode;
}) {
  const forOwners = page.audience === "owner";

  return (
    <article>
      <div className={styles.page}>
        <div className={styles.column}>
          <header className={styles.header}>
            <h1>{page.h1}</h1>
            <p className={styles.lede}>{page.lede}</p>
          </header>

          {page.image ? (
            <div className={styles.image}>
              <Image
                src={page.image.src}
                alt={page.image.alt}
                width={1800}
                height={1200}
                sizes="(max-width: 900px) 100vw, 42rem"
                priority
              />
            </div>
          ) : null}

          {page.sections.map((section, index) => (
            <section className={styles.section} key={`${section.heading ?? "s"}-${index}`}>
              {section.heading ? <h2>{section.heading}</h2> : null}

              {section.kind === "prose"
                ? section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))
                : null}

              {section.kind === "list" ? (
                <>
                  {section.intro ? <p>{section.intro}</p> : null}
                  <div className={styles.list}>
                    {section.items.map((item) => (
                      <div className={styles.item} key={item.title}>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </section>
          ))}

          {form}

          <Faqs faqs={page.faqs} />

          {page.related.length > 0 ? (
            <nav className={styles.related} aria-label="Related pages">
              <h2>Read next</h2>
              <div className={styles.relatedLinks}>
                {page.related.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}
        </div>
      </div>

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          {forOwners ? (
            <>
              <h2>Tell us about your home.</h2>
              <p>
                Message the team on WhatsApp with where the house is and how you use it. We
                answer in English and Spanish, usually within minutes.
              </p>
              <div className={styles.ctaActions}>
                <Button variant="gold" href={CONTACT.whatsappUrl}>
                  Talk to the team on WhatsApp
                </Button>
                <Button variant="onDark" href="/how-we-charge">
                  How we charge
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2>Find a home for your dates.</h2>
              <p>
                Check availability on our own booking engine, or send us your dates and we
                will tell you what suits the group.
              </p>
              <div className={styles.ctaActions}>
                <Button variant="gold" href={BOOKING_ENGINE_URL}>
                  Check availability
                </Button>
                <Button variant="onDark" href={CONTACT.whatsappUrl}>
                  Ask us on WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </article>
  );
}
