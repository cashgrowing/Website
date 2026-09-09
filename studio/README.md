# WildRoots Studio

Where the words on the website are edited. Deployed separately from the site,
to its own address, so there is no admin login on wildrootscr.com.

## First time

```bash
cd studio
npm install
cp .env.example .env      # then paste the project id from sanity.io/manage
npm run dev               # http://localhost:3333
```

## Publishing the studio

```bash
npm run deploy            # publishes to https://wildroots.sanity.studio
```

## Loading the existing words into it

The site currently reads the copy committed in `src/content`. To move it into
Sanity so it can be edited:

```bash
npm run seed
```

It creates one document per page and one per journal post, and is safe to run
again — documents have fixed ids, so a second run updates rather than duplicates.

## How this connects to the site

The website reads from Sanity on the server and falls back to the committed
copy if Sanity is unreachable or a document fails validation. That means a
studio outage, a revoked token or a half-finished edit cannot blank a page.

For the site to read from Sanity, set in Vercel:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET` (`production`)
- `SANITY_API_READ_TOKEN` — only if the dataset is private

Environment changes need a redeploy to take effect, because the pages are
statically generated.

## Access

Google login only, managed at sanity.io/manage → Members. Keep the member list
short; everyone on it can change what the website says.
