# WildRoots

The WildRoots Property Management website. `WILDROOTS-BUILD-BRIEF.md` is the
source of truth for every decision here; when the code and the brief disagree,
the brief wins.

- `SECURITY.md` — accounts needing 2FA, the domain lock, and how the enquiry
  form is defended. Read the first half even if you are not a developer.
- `LAUNCH.md` — the step-by-step launch runbook.
- `studio/README.md` — how to edit the words yourself.

---

## For the owner — what exists

**Working now**

- The homepage in the approved design, and nine content pages: property
  management, Uvita, Dominical, Ojochal, Airbnb, Bahía Ballena, whale season,
  about, contact, and how we charge.
- A journal with four posts, at `/journal`.
- `/homes`, a page per house, and area pages for Uvita, Dominical and Ojochal —
  all built automatically from Hostaway, so five homes or a hundred is the same
  amount of work.
- An enquiry form that saves to Supabase and can file each owner lead in
  ClickUp.
- Redirects from the old Wix addresses, so the pages that already rank keep
  their position.

**Waiting on you**

| What | Why it matters |
| --- | --- |
| **Photographs** | Every photo slot says what picture belongs there. Nothing is stock or AI-generated, by rule. |
| **Resend key** | Enquiries are stored in Supabase but no email reaches the inbox until `RESEND_API_KEY` and `INQUIRY_NOTIFY_TO` are set. |
| **Sanity import** | One sign-in, then two commands. See `studio/README.md`. |
| **A read of the words** | Especially the journal posts. They describe how the business works. |

**One decision left:** the filled gold button uses white text at a contrast of
4.39:1, just under the 4.5 accessibility threshold. Fixing it means slightly
darkening the brand gold. That is your call, not mine.

---

## For a developer

Next.js App Router, TypeScript, CSS Modules. Node 20.11+ (developed on 26).

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # 30 tests, Node's built-in runner
npm run build        # lint + tests + build
npm run sanity:check # prove the CMS round trip
npm run backup       # export Sanity and Supabase locally
```

### Layout

```
src/app/          routes, one folder per URL
src/components/   Button, header, footer, HomeCard, PhotoSlot, forms, analytics
src/content/      the words, as typed data; validation.ts guards CMS input
src/lib/          site facts, Hostaway, Supabase, Sanity, schema, i18n
studio/           Sanity Studio, its own workspace, deployed separately
tests/            the brief's hard rules, enforced on every build
scripts/          Sanity export, round-trip check, backups
```

### What the build refuses to ship

`npm run build` runs ESLint and the tests before Next, so these fail the deploy:

- An image without alt text, or a `PhotoSlot` given a `src` without an `alt`.
- Any person named in the content, a "no setup fees" claim, an Envision
  reference, a split brand name, or an invented statistic.
- A title over 60 characters rendered, or a description over 155.
- An internal link to a route that does not exist, an orphaned page, or a
  journal post linking to fewer than two service pages.

### Things that will surprise you

- **Content falls back.** Pages read from Sanity and fall back to `src/content`
  if it is unreachable or a document fails validation. An empty dataset renders
  the committed copy, which is why configuring Sanity before importing is safe.
- **`robots.txt` keys off the request host,** not `VERCEL_ENV`. Only
  `www.wildrootscr.com` invites crawlers; every preview URL is blocked, and the
  cutover needs no code change.
- **The CSP is not nonce-based, deliberately.** The reasoning and the conditions
  that should trigger a rethink are in `SECURITY.md`.
- **`NEXT_PUBLIC_*` is inlined at build time.** Adding one in Vercel without
  redeploying does nothing.
- **Keep this repo off iCloud-synced folders.** Desktop sync corrupted `.next`
  repeatedly by duplicating files mid-build.

### Still outstanding

Hostaway webhook signatures, Sentry or Vercel monitoring, and the area ×
attribute pages (which need real listing data to know when three homes match).
