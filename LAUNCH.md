# Launch

Phase 4 of the build brief. Written to be followed in order, by someone who is
not a developer.

Do not start this until the preview link has been reviewed and approved.

---

## Before you begin

Three things must be true, or launch will go badly.

**1. The homes are showing.** Open `/homes` on the preview link. If it says
listings will appear once Hostaway is connected, the Hostaway keys in Vercel are
missing or empty. Launching with an empty `/homes` means launching without the
guest funnel.

**2. The photographs are in.** Every empty photo slot on the preview says what
picture belongs there. A site that launches with grey panels where the coast
should be will not convert, whatever the words say.

**3. Someone has read the words.** Particularly the journal posts and the
management pages. They describe how the business works, and only you can confirm
they are accurate.

---

## Step 1 — Google Vacation Rentals feed

Do this **before** the DNS cutover. It takes Google time to process, and there
is no reason to wait.

This is done in Hostaway, not in the website.

1. In Hostaway, open **Marketplace** (or **Channels**, depending on your version)
   and find **Google Vacation Rentals**.
2. Connect it, and authorise it against the Google account that owns Search
   Console for `wildrootscr.com` — the same Google account, not a different one.
   Getting this wrong is the most common cause of the feed never appearing.
3. Select which listings to include. Include every listing that is live on the
   website.
4. Confirm each listing has the fields Google requires: address, latitude and
   longitude, photographs, and a rate. Listings missing any of these are
   silently dropped from the feed rather than rejected loudly.
5. Submit. Google typically takes several days to a few weeks to begin showing
   properties.

If Hostaway's menu does not match the above, the integration has been renamed —
search Hostaway's help for "Google Vacation Rentals" rather than guessing.

---

## Step 2 — Point the domain at the new site

In Vercel, open the project, then **Settings → Domains**, and add
`www.wildrootscr.com` and `wildrootscr.com`. Vercel will show you the DNS
records it wants.

In Cloudflare, open the DNS tab for `wildrootscr.com` and change the existing
records to the ones Vercel gave you. You are replacing the records that
currently point at Wix.

Leave the Cloudflare proxy (the orange cloud) **on**.

Two things happen automatically as soon as this takes effect:

- `robots.txt` starts inviting search engines, because it only does so on the
  real domain. Every preview URL stays blocked, and needs no change.
- The share cards and canonical tags already point at `wildrootscr.com`, so
  nothing there needs updating.

DNS changes usually take minutes but can take a few hours.

---

## Step 3 — Check the redirects actually work

Once the domain resolves to the new site, open each of these. Each should land
on the new page, not a 404:

- `wildrootscr.com/post/what-a-property-manager-does-costa-rica`
- `wildrootscr.com/post/property-management-long-term-rental-solutions`
- `wildrootscr.com/blog`

All three return a permanent redirect, which is what tells Google to move the
ranking across rather than treating the new page as unrelated.

Also check the five pages that already rank still work at their old addresses:
`/property-management-costa-rica`, `/vacation-rental-management-uvita`,
`/property-manager-dominical`, `/airbnb-management-costa-rica`,
`/vacation-rentals-bahia-ballena`. These URLs were deliberately kept.

---

## Step 4 — Search Console

1. Go to Google Search Console and select the `wildrootscr.com` property.
2. Submit `https://www.wildrootscr.com/sitemap.xml` under **Sitemaps**.
3. Use **URL Inspection** on the homepage and request indexing.
4. Over the following week, watch **Pages** for anything reported as an error.
   A handful of "crawled, not indexed" entries early on is normal.

---

## Step 5 — Unpublish Wix

Only after steps 2 to 4 are confirmed working.

Unpublish the Wix site. Do not delete the account yet — keep it for at least a
month in case something needs checking against the old version.

---

## Step 6 — Switch on the backups

In GitHub, open **Settings → Secrets and variables → Actions** and add:

- `SANITY_PROJECT_ID` = `6pybhi99`
- `SANITY_DATASET` = `production`
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

The weekly backup then runs every Monday. You can trigger it once by hand from
the **Actions** tab to confirm it works.

Note the enquiries backup contains real people's names, emails and phone
numbers. Keep the repository private.

---

## After launch, in the first week

- Read `SECURITY.md` and turn on two-factor authentication for every account
  listed there. Lock the domain at the registrar.
- Check Search Console for crawl errors.
- Watch the first few enquiries actually arrive — send one yourself from the
  contact page and confirm it reaches Supabase, and ClickUp if that is connected.
