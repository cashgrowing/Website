# WildRoots Property Management — website rebuild brief

This file is the source of truth for the build. Read it fully before writing any code. When a decision here conflicts with a default, this file wins.

## 1. What this is

A new public website for WildRoots Property Management, a boutique short-term-rental management company on Costa Rica's South Pacific coast (Uvita, Bahía Ballena, Dominical, Ojochal, Tres Ríos). It replaces a Wix site at https://www.wildrootscr.com.

Two funnels, equal weight:
- Homeowners who want their house managed. Conversion = WhatsApp conversation (+506 8734-7178, https://wa.me/50687347178).
- Guests who want to book a stay. Conversion = availability check and checkout on Hostaway's booking engine at book.wildrootscr.com.

Must scale to 100+ homes without hand-building pages. Property pages are generated from Hostaway data.

The owner is not a developer. He reviews on preview links and edits words in the CMS. Explain what you are doing in plain language, one step at a time, and never ask him to run commands you can run yourself.

## 2. Hard rules

- Do not mention any person by name anywhere on the site. The company speaks as "WildRoots" or "the team". No "Aaron", no founder name, no staff names.
- Never claim "no setup fees". The fee model is: one-time setup fee, flat monthly management fee, booking commission as a share of revenue. Show the model, not numbers.
- Never reference Envision Festival.
- Real photography only wherever a house or the team is shown. No AI-generated people or houses. The image IMG_1297 (framed card showing a wifi password) must never be used.
- Brand name is one word: WildRoots.
- No testimonials or statistics that have not been supplied by the owner. Leave clearly marked placeholders.

## 3. Architecture

Front end and back end are separated. The public site holds no secrets and no database access.

- Front end: Next.js (latest stable, App Router), TypeScript, deployed on Vercel. Pages are statically generated with incremental revalidation. Styling with CSS modules or Tailwind, one approach only.
- Data layer (private): server-only functions and route handlers that hold the Hostaway and CMS credentials, fetch listings, calendar and pricing, and write inquiries. The browser never receives a key. Hostaway API: https://api.hostaway.com/v1 (OAuth 2.0 client credentials).
- CMS: Sanity, hosted studio on its own URL (not on wildrootscr.com), Google login only. Holds marketing pages, blog posts, FAQs, area pages, settings. Owner edits here.
- Database: Supabase for inquiries and owner leads, row-level security on, service role key server-side only.
- Checkout: Hostaway Booking Engine on book.wildrootscr.com. Hostaway search and calendar widgets embedded on property pages. Do not iframe checkout; hand off.
- Edge: Cloudflare in front of Vercel. DNS, WAF, bot protection, Turnstile on forms.
- Leads: every homeowner inquiry creates a ClickUp task via webhook (owner will supply list ID).
- Analytics: GA4 + Google Search Console + existing Facebook Pixel. Load analytics after interaction or via a consent-aware loader so it does not hurt Core Web Vitals.

## 4. Security checklist (implement all)

- All secrets in Vercel environment variables. Never commit a key. Add .env* to .gitignore on day one.
- Strict security headers: Content-Security-Policy (nonce-based), Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors none.
- Rate limiting on every route handler that writes (inquiries, contact). Turnstile verification server-side.
- Validate all inputs with a schema (zod). Reject anything unexpected.
- Verify Hostaway webhook signatures before processing.
- Supabase: RLS enabled on every table; anon key can insert inquiries only; nothing readable from the browser.
- Dependabot or Renovate enabled. Sentry (or Vercel monitoring) for errors.
- No admin routes on the public domain. Sanity Studio lives at a separate host.
- Automated weekly export of Sanity content and the Supabase inquiries table.
- Document for the owner (in SECURITY.md) which accounts need 2FA and the domain lock.

## 5. SEO requirements (this site is an SEO machine)

- Every page server-rendered to full HTML. No client-only content that matters for ranking.
- Core Web Vitals green on mobile: LCP under 2.5s, CLS near 0, INP under 200ms. Hero image preloaded, next/image everywhere, AVIF/WebP, explicit dimensions, fonts self-hosted with font-display swap.
- Programmatic pages from data: /homes/[slug] per property; /stay/[area] per area; area × attribute pages (e.g. pool homes in Uvita) only when at least 3 homes match; seasonal pages (whale season) from CMS.
- Structured data on every page via JSON-LD: ProfessionalService (site-wide, @id https://www.wildrootscr.com/#business, Uvita, Puntarenas, geo 9.1559 / -83.7547, 24/7, sameAs Instagram https://www.instagram.com/wildroots.cr/ and Facebook https://www.facebook.com/profile.php?id=61567292953732, telephone +506 8734-7178, email info@wildrootscr.com, areaServed Uvita, Dominical, Ojochal, Bahía Ballena, Tres Ríos, knowsLanguage en/es). VacationRental or LodgingBusiness per home with geo, amenities, bedrooms. FAQPage on any page with FAQs. BreadcrumbList site-wide. Article on posts. Do not invent priceRange, ratings or reviews.
- Automatic sitemap.xml, robots.txt, canonical tags, Open Graph and Twitter cards with generated OG images per page.
- Internal linking rules: every area page links to its homes and to the management page for that area; every home links to its area; footer carries an "Areas we serve" block; blog posts link to at least two service pages.
- Titles under 60 characters, meta descriptions under 155, one H1 per page, headings in order.
- Alt text required on every image (build-time check that fails if missing).
- Built for i18n from day one (locale in routing, hreflang helpers) but ship English only. Spanish is phase 2.
- 301 redirect map (section 7) live at launch. Keep the old URL for any page that already ranks.
- Hostaway → Google Vacation Rentals feed enabled (owner does this in Hostaway; document the steps).

## 6. Design system (locked — do not reinterpret)

Reference mock: wildroots-single-hero.html in this folder. Match it.

Palette
- Black #141210 — hero backdrop, doors band, footer
- Gold #877750 (Pantone 871 C) — the only accent: buttons, rules, links, the seam
- Brown #3A2E22 — second dark: one content band and secondary text
- Tan #B8A181 — hover state, kickers on dark
- Light tan #D0BCA9 — hairlines on paper
- Paper #FCFBF8 — background of all reading sections. Never pure white for page background.
- Never green. Never alternating coloured bands.

Type
- One family: Avenir Light for headings and body if a web licence is available; otherwise Figtree (Google Fonts) self-hosted, weights 300/400/500. No serif anywhere on the site.
- Five sizes only: 60/36/26/17/14 on desktop, scaled down on mobile. Headings weight 300. Left-aligned. Line length under 70 characters.
- No all-caps labels, no eyebrow labels above headings, no italic single words.

Components
- Square corners everywhere. No drop shadows. No gradients except the dark scrim over hero photos.
- Buttons: gold fill, white text, hover tan. Secondary: 1px gold outline. On dark: outline in gold with tan text.
- Photos full-bleed when they are the subject; text stays measured. One photo per section, matching the copy.
- Motion: one page-load reveal on the hero only. No per-section fade-ins. Respect prefers-reduced-motion.

Logo rules
- Header (white): flat gold lockup WildRoots-PM-imagotipo-PANTONE-871-C.png, height 64px desktop / 48px mobile, links home.
- On black only (hero top-right, footer): textured WildRoots-PM-imagotipo-gold.png. Never the textured file on a light background.
- Black lockup WildRoots-PM-imagotipo-negro.png for print/OG fallback only.

Homepage order
1. Header (white, flat gold lockup, nav Homes / Management / Areas / About / Journal, black "WhatsApp us" button)
2. Hero: full-bleed Uvita coastline photo, textured logo top-right, headline low-left "Your home on this coast, looked after properly.", two buttons "Find a home to stay in" (gold) and "Manage my home" (outline)
3. Two doors on black: "Own a home here. Live anywhere." / "Stay on the Whale's Tail coast.", one gold rule between
4. Proof strip on paper, three facts (answered within minutes / walked every week / three fees, no surprises)
5. Homes we look after — cards from Hostaway
6. "A higher standard of care" band in brown with one photo
7. Owner quote (placeholder until supplied)
8. Footer on black: textured logo, Homeowners / Guests / Areas we serve columns, contact line

## 7. Site map and redirects

Homeowner funnel
- /property-management-costa-rica (Management) — keep URL
- /vacation-rental-management-uvita — keep
- /property-manager-dominical — keep
- /airbnb-management-costa-rica — keep
- /how-we-charge — new
- /about — keep, no names
- /contact — keep, WhatsApp first

Guest funnel
- /homes — all homes from Hostaway
- /homes/[slug] — one per home
- /stay/uvita, /stay/dominical, /stay/ojochal — area pages
- /vacation-rentals-bahia-ballena — keep URL (guest page)
- /whale-season — seasonal landing

Journal
- /journal — index with H1
- /journal/[slug]
- 301: /post/what-a-property-manager-does-costa-rica → /journal/what-a-property-manager-does-costa-rica
- 301: /post/property-management-long-term-rental-solutions → same target as above
- 301: /blog → /journal
- /es/* → drop (was already 404 on Wix)

## 8. Content to migrate

Pull the live copy from https://www.wildrootscr.com for the pages above (including the FAQ blocks on the five keyword pages and their FAQPage schema) and load it into Sanity. Preserve wording; remove any personal name. Photos: the owner has a Google Drive folder "WildRoots Website Photos" and per-property libraries; ask him to drop the ones you need into the repo's /public/photos with the existing web-friendly names, or export from Wix Media Manager.

## 9. Build order

Phase 1 — Skeleton (goal: a preview link with real homes)
1. Repo, Next.js app, design tokens, header and footer, homepage layout with placeholder photos.
2. Hostaway connection server-side; /homes and /homes/[slug] rendering real listings.
3. Deploy to Vercel, share preview link.

Phase 2 — Content and funnels
4. Sanity schema and studio; migrate the eight pages, FAQs and the journal.
5. Owner funnel pages, inquiry form → Supabase + ClickUp, Turnstile, rate limits.
6. Guest funnel: area pages, availability widgets, book.wildrootscr.com handoff.

Phase 3 — SEO and hardening
7. All JSON-LD, sitemap, OG images, redirects, alt-text check, Lighthouse to green on mobile.
8. Security headers, CSP, monitoring, backups, SECURITY.md.

Phase 4 — Launch
9. Cloudflare DNS cutover, redirects verified, Search Console submitted, Wix unpublished.

After every phase, stop and ask the owner to review the preview link before continuing.

## 10. Accounts the owner has created

GitHub, Vercel, Cloudflare, Hostaway API key, 2FA on all. Ask him for: the Hostaway key (paste into Vercel env, not chat), the domain registrar name, the Sanity login email, the ClickUp list for leads.
