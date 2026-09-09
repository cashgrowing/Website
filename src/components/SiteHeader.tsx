"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "./Button";
import styles from "./SiteHeader.module.css";
import { CONTACT, LOGOS, NAV } from "@/lib/site";

/**
 * White header with the flat gold lockup. The textured logo is never used on a
 * light background - see the logo rules in the brief.
 *
 * This is a client component only so the small-screen menu can open. Every link
 * is rendered into the HTML either way, so nothing here is invisible to a crawler.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link className={styles.logo} href="/" aria-label="WildRoots, home">
          <Image
            src={LOGOS.flatGold}
            alt="WildRoots Property Management"
            width={320}
            height={64}
            priority
          />
        </Link>

        <button
          className={styles.toggle}
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav className={styles.nav} id="site-nav" data-open={open} aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a
            className={styles.mobileCta}
            href={CONTACT.whatsappUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp us
          </a>
        </nav>

        <Button className={styles.cta} variant="black" href={CONTACT.whatsappUrl}>
          WhatsApp us
        </Button>
      </div>
    </header>
  );
}
