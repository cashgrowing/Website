import Image from "next/image";
import Link from "next/link";

import styles from "./SiteFooter.module.css";
import { BRAND, CONTACT, FOOTER_COLUMNS, LOGOS } from "@/lib/site";

/** Black footer. The textured gold lockup is allowed here because the ground is black. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src={LOGOS.texturedGold}
            alt={`${BRAND.legalName} logo`}
            width={330}
            height={150}
            sizes="330px"
          />
          <address>
            Bahía Ballena, Uvita, Osa
            <br />
            {CONTACT.addressRegion}, Costa Rica
          </address>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div className={styles.col} key={column.heading}>
            <h2>{column.heading}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={`${column.heading}-${link.href}`}>
                  {/^https?:/.test(link.href) ? (
                    <a href={link.href} rel="noopener noreferrer" target="_blank">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className={styles.fine}>
          © {year} {BRAND.legalName} · WhatsApp{" "}
          <a href={CONTACT.whatsappUrl} rel="noopener noreferrer" target="_blank">
            {CONTACT.whatsappNumber}
          </a>{" "}
          · <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </p>
      </div>
    </footer>
  );
}
