# WildRoots

The new WildRoots Property Management website. `WILDROOTS-BUILD-BRIEF.md` in this
folder is the source of truth for every decision here; when something in the code
disagrees with the brief, the brief wins.

---

## For the owner — what exists right now

This is **Phase 1**: the skeleton. It is meant to be looked at, not launched.

**What works**

- The homepage, in the black / gold / brown design that was approved, in the order
  agreed: hero, the two doors, the three facts, the homes, the care band, the quote.
- `/homes` and a page for every single house, built automatically from Hostaway.
  No page is typed by hand, so 5 homes or 105 homes is the same amount of work.
- Area pages at `/stay/uvita`, `/stay/dominical`, `/stay/ojochal`.
- The header, the footer, and every link between them.

**What is deliberately still empty**

- **Photographs.** Every photo slot shows a grey panel that says what picture belongs
  there. Nothing is stock and nothing is AI-generated, per the rule in the brief.
  Drop the real files into `public/photos` and they appear.
- **The homes themselves.** They show up the moment the Hostaway API key is added to
  Vercel. Until then those sections say so.
- **The words on the management, about, contact and journal pages.** Those come across
  from the current site in Phase 2 and then live in the CMS, where they can be edited
  without a developer. Right now those pages are polite placeholders, and they are
  marked so Google ignores them.
- **The owner quote.** It stays an obvious placeholder until a real homeowner supplies
  the words and approves them.

**Two things needed to move forward**

1. The Hostaway API key — pasted into Vercel's settings, not into a chat message.
2. The photos: the "WildRoots Website Photos" Drive folder, or a Wix Media Manager
   export.

---

## For a developer

Next.js (App Router) + TypeScript. CSS Modules, no CSS framework — the design system
is small and locked, and tokens live in `src/app/globals.css`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

Node 20.11 or newer.

### Layout

```
src/app/                 routes; one folder per URL
src/components/          Button, SiteHeader, SiteFooter, HomeCard, PhotoSlot
src/lib/site.ts          contact details, areas, nav, footer — change facts here only
src/lib/schema.tsx       JSON-LD helpers
src/lib/hostaway/        server-only API client and the Home domain type
design/                  the approved mock and the three logo files
public/brand/            the logos the site actually serves
```

### Rules the code enforces

- `src/lib/hostaway/*` imports `server-only`, so a Hostaway key can never reach a
  browser bundle — an accidental client import fails the build instead.
- `PhotoSlot` renders a labelled empty panel rather than inventing an image.
- `HomeCard` and the property page print a price only when Hostaway actually has one.
  No JSON-LD carries `priceRange`, a rating or a review, because none were supplied.
- `robots.ts` blocks crawlers on every deploy except production, so preview links
  never compete with the live site.
- Redirects from the old Wix URLs live in `next.config.ts`.

### Environment

Copy `.env.example` to `.env.local` for local work. Real values live only in Vercel.
`.env*` is gitignored — never commit a key.

### Still to come

Phase 2: Sanity schema and studio, the content migration, the inquiry form
(Supabase + ClickUp + Turnstile), availability widgets. Phase 3: the full JSON-LD set,
OG images, the alt-text build check, CSP and the rest of the security headers,
monitoring and backups, and `SECURITY.md`.
