import type { Metadata } from "next";
import { Figtree } from "next/font/google";

import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { alternatesFor } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, professionalServiceSchema } from "@/lib/schema";
import { BRAND, SITE_URL } from "@/lib/site";

/**
 * One family, three weights. next/font self-hosts the files at build time and
 * sets font-display: swap, so there is no third-party font request at runtime.
 * Swap this for Avenir if a web licence is ever bought - nothing else changes.
 */
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WildRoots | Vacation rental management, Uvita Costa Rica",
    template: `%s | ${BRAND.name}`,
  },
  description:
    "Vacation rental management and direct stays in Uvita, Dominical and Ojochal. A local team that answers, day or night, in English and Spanish.",
  alternates: alternatesFor("/"),
  openGraph: {
    type: "website",
    siteName: BRAND.legalName,
    locale: "en_US",
    url: "/",
    images: [ogImage("Homes on the Whale's Tail coast, cared for like our own.")],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <JsonLd data={professionalServiceSchema()} />
        <Analytics
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </body>
    </html>
  );
}
