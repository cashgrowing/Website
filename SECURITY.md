# Security

Two audiences. The first half is for the owner and needs no technical
knowledge. The second is for whoever works on the code.

---

## For the owner

### Accounts that must have two-factor authentication

If someone gets into one of these, they can take the website down, redirect it
somewhere else, or read your guests' details. Turn on 2FA for every one, and use
an authenticator app rather than SMS where the account offers it.

| Account | Why it matters if someone gets in |
| --- | --- |
| **Domain registrar** | The worst one. Control of the domain is control of the website and any email on it. |
| **Cloudflare** | Points the domain at the site. Someone here can send visitors anywhere. |
| **GitHub** | Holds the code. Someone here can change what the site says or does. |
| **Vercel** | Runs the site and holds the keys listed below. |
| **Hostaway** | Your bookings, guests and calendars. |
| **Sanity** *(when set up)* | The words on the site. |
| **Supabase** *(when set up)* | Owner and guest enquiries. |
| **Google account** | Search Console, Analytics, and the login for several of the above. |

### Lock the domain

At the registrar, turn on **registrar lock** (sometimes "transfer lock" or
"clientTransferProhibited"). It stops anyone moving the domain to another
company, which is the usual way a domain gets stolen. Also confirm the contact
email on the domain is one you actually read, and that auto-renew is on — an
expired domain is the most common way a working site suddenly disappears.

### Never paste a key into a chat or an email

Keys belong in Vercel's **Settings → Environment Variables** and nowhere else.
Anything pasted into a message can end up in a backup, a screenshot or a search
index. If a key is ever exposed, the fix is to rotate it in the service that
issued it, not to delete the message.

### If something looks wrong

Signs worth acting on: the site redirects somewhere unexpected, content changes
that nobody made, or a login alert you did not trigger. First step is to change
the password and revoke active sessions on the affected account, then tell
whoever maintains the site.

---

## For whoever maintains this

### Secrets

- Every secret lives in Vercel environment variables. `.env*` is gitignored;
  only `.env.example` is committed, and it holds names, never values.
- `src/lib/hostaway/*` imports `server-only`, so an accidental import from a
  client component fails the build instead of shipping a key to a browser.
- Nothing prefixed `NEXT_PUBLIC_` is a secret. That prefix means the value is
  compiled into the browser bundle and visible to anyone.

### Headers

Set in `next.config.ts` and applied to every route: Content-Security-Policy,
HSTS with preload, `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options: DENY`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`.

**Decided: no nonce, keep static rendering.** Reasoning below; revisit it if the
site ever renders user-generated content, renders HTML from the CMS, or loads a
third-party script.

**The gap, and why it is acceptable here.** The brief asks for a nonce-based
policy. That is incompatible with the statically generated pages the brief also
requires: a nonce is minted per request, but prerendered HTML is written once at
build time with no nonce on it. Serving a nonce policy over that HTML was
measured to block all 16 of Next's inline hydration scripts — the page renders
and then never hydrates. Making it work means reading the nonce in the root
layout, which opts every page out of static rendering and gives up the ISR and
Core Web Vitals the brief demands.

So `script-src` carries `'unsafe-inline'`. What still holds the line: no user-generated content is rendered anywhere, all content is
typed data rather than HTML, `object-src 'none'` and `base-uri 'self'` close the
classic escalation paths, and `connect-src 'self'` plus `form-action 'self'`
prevent exfiltration to another origin.

### Crawling

`src/app/robots.ts` allows crawling only when the request host is the canonical
domain. Every preview URL, every `*.vercel.app` URL and localhost get
`Disallow: /`. This needs no change at launch — attaching the domain switches it
on by itself.

### Enforced at build time

`npm run build` runs `eslint .` first, so these fail the deploy rather than
shipping:

- **Alt text.** `jsx-a11y/alt-text` is promoted from warning to error.
- **`PhotoSlot` props.** A `src` without an `alt` is a type error, not a slot
  that quietly renders the placeholder instead of the photograph.

### The enquiry form

`POST /api/inquiries` is the only endpoint that writes. It fails closed: if
Supabase or Turnstile is not configured it refuses every request with 503, and
the form is not rendered at all. An unprotected public write endpoint is worse
than no form.

Order of checks, each verified against the running server:

1. **Configured?** Otherwise 503 before any work happens.
2. **Rate limit** — 5 submissions per IP per 10 minutes, checked before the
   Turnstile call so a flood cannot run up Cloudflare requests. Fixed window
   held in module memory; see the caveat in `src/lib/rate-limit.ts`.
3. **Schema** — parsed with zod. Anything unexpected is rejected with 400.
4. **Honeypot** — a field people never see. Answers 200 and stores nothing, so
   the bot records a success rather than retrying.
5. **Turnstile** — verified server-side with Cloudflare. A network failure
   counts as *not* verified: it refuses rather than falling open.
6. **Store** — written to Supabase from the server with the service role key.
   If the write fails the submitter is told, never told it arrived.
7. **ClickUp** — best effort, after the row is safe. An outage there cannot turn
   a stored lead into a failed submission.

The browser never holds a Supabase key and never talks to Supabase. RLS is on
with no policies at all, so anon and authenticated can neither read nor write;
only the service role can. This is stricter than the anon-insert approach the
brief suggested.

Submitter IPs are never stored. A SHA-256 of the IP plus `INQUIRY_IP_SALT` is,
and only when that salt is set — enough to spot abuse, not enough to identify
someone.

**Environment variables only take effect after a redeploy.** The pages are
statically generated, so adding keys in Vercel without redeploying leaves the
form hidden and the endpoint refusing.

### Still outstanding

Required by the brief, still unbuilt, each waiting on something:

- Hostaway webhook signature verification — waiting on Hostaway being connected.
- Shared-store rate limiting (Upstash or Vercel KV) if form spam ever justifies
  it. The in-memory limiter is per-instance.
- Sentry or Vercel monitoring for errors.
- Weekly automated export of Sanity content and the Supabase enquiries table.
- Sanity itself, and moving the page copy out of `src/content` into it.
