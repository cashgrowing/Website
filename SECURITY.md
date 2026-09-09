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

**Known gap — read before changing the CSP.** The brief asks for a nonce-based
policy. That is incompatible with the statically generated pages the brief also
requires: a nonce is minted per request, but prerendered HTML is written once at
build time with no nonce on it. Serving a nonce policy over that HTML was
measured to block all 16 of Next's inline hydration scripts — the page renders
and then never hydrates. Making it work means reading the nonce in the root
layout, which opts every page out of static rendering and gives up the ISR and
Core Web Vitals the brief demands.

Until that trade is decided, `script-src` carries `'unsafe-inline'`. What still
holds the line: no user-generated content is rendered anywhere, all content is
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

### Still outstanding

These are required by the brief and not yet built, because each depends on an
account or a key that does not exist yet:

- Rate limiting and Turnstile verification on every write route, once the
  enquiry form and its Supabase and ClickUp destinations exist.
- Zod validation on those route handlers. `zod` is already a dependency.
- Hostaway webhook signature verification.
- Supabase row-level security: enabled on every table, anon key able to insert
  enquiries only, nothing readable from the browser.
- Dependabot or Renovate, and Sentry or Vercel monitoring.
- Weekly automated export of Sanity content and the Supabase enquiries table.
