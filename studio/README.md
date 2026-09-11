# WildRoots Studio

Where the words on the website are edited. Deployed separately from the site,
to its own address, so there is no admin login on wildrootscr.com.

Project `6pybhi99`, dataset `production`.

## First time

The one step that needs a person: signing in. It opens a browser.

```bash
npx sanity login          # Google
```

Then:

```bash
cd studio
npm install
cp .env.example .env      # project id is already filled in
npm run dev               # http://localhost:3333
```

## Publishing the studio

```bash
npm run deploy            # publishes to https://wildroots.sanity.studio
```

## Loading the existing words into it

The site reads the copy committed in `src/content` until Sanity has it. To load
(or reload) it, from the repository root:

```bash
npm run sanity:check                     # writes sanity-content.ndjson and proves it round-trips
cd studio && npx sanity dataset import ../sanity-content.ndjson production --replace
```

It creates one document per page and one per journal post, and is safe to run
again — documents have fixed ids, so a second run updates rather than duplicates.
Done on 2026-09-11: 11 pages and 8 posts imported, and the site reads them.

Sign in with the Google account that owns the project (the one listed under
Members at sanity.io/manage). Any other account signs in fine and then fails
every command with "missing required grant".

## How this connects to the site

The website reads from Sanity on the server and falls back to the committed
copy if Sanity is unreachable or a document fails validation. That means a
studio outage, a revoked token or a half-finished edit cannot blank a page.

For the site to read from Sanity, set in Vercel:

- `SANITY_PROJECT_ID` = `6pybhi99`
- `SANITY_DATASET` = `production`

No read token is needed: the dataset is public today, so the site reads it
without a secret. Add `SANITY_API_READ_TOKEN` only if the dataset is ever made
private.

Setting these before importing anything is safe — an empty dataset falls back to
the committed copy, which is exactly what the site shows now. Verified.

Environment changes need a redeploy to take effect, because the pages are
statically generated.

## Access

Google login only, managed at sanity.io/manage → Members. Keep the member list
short; everyone on it can change what the website says.
