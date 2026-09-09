import "server-only";

/**
 * Hostaway API client. Server-only by construction: this module imports
 * `server-only`, so any accidental import from a client component fails the
 * build rather than shipping the key to a browser.
 *
 * Auth is OAuth 2.0 client credentials. The access token is long-lived, so we
 * cache it in module scope and refresh a minute before it expires.
 */

const API_BASE = "https://api.hostaway.com/v1";

type CachedToken = { value: string; expiresAt: number };
let cachedToken: CachedToken | null = null;
let inFlight: Promise<string> | null = null;

export class HostawayNotConfiguredError extends Error {
  constructor() {
    super("Hostaway credentials are not set (HOSTAWAY_ACCOUNT_ID / HOSTAWAY_API_KEY).");
    this.name = "HostawayNotConfiguredError";
  }
}

export function isHostawayConfigured(): boolean {
  return Boolean(process.env.HOSTAWAY_ACCOUNT_ID && process.env.HOSTAWAY_API_KEY);
}

async function requestToken(): Promise<string> {
  /*
   * Trimmed deliberately. Pasting a key into a dashboard field very often
   * carries a trailing newline or space, and a credential that is right except
   * for one invisible character fails identically to one that is wrong.
   */
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID?.trim();
  const apiKey = process.env.HOSTAWAY_API_KEY?.trim();
  if (!accountId || !apiKey) throw new HostawayNotConfiguredError();

  const res = await fetch(`${API_BASE}/accessTokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: accountId,
      client_secret: apiKey,
      scope: "general",
    }),
    // Token requests are never cached by the data cache.
    cache: "no-store",
  });

  if (!res.ok) {
    /*
     * Hostaway explains the refusal in the body; the status alone does not.
     * Logged alongside the shape of the credentials - never their value - so a
     * truncated paste or a stray character is visible without exposing the key.
     */
    const detail = await res.text().catch(() => "");
    const raw = process.env.HOSTAWAY_API_KEY ?? "";
    console.error(
      "[hostaway] auth rejected.",
      `accountId=${accountId}`,
      `keyLength=${apiKey.length}`,
      `keyHadSurroundingWhitespace=${raw !== raw.trim()}`,
      `response=${detail.slice(0, 300)}`,
    );
    throw new Error(`Hostaway auth failed: ${res.status} ${res.statusText} ${detail.slice(0, 200)}`);
  }

  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error("Hostaway auth returned no access_token.");

  const ttlSeconds = json.expires_in ?? 60 * 60 * 24;
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + (ttlSeconds - 60) * 1000,
  };
  return cachedToken.value;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  // Collapse concurrent refreshes into one request.
  inFlight ??= requestToken().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

export type HostawayFetchOptions = {
  /** Seconds before Next.js revalidates the cached response. */
  revalidate?: number;
  searchParams?: Record<string, string | number | undefined>;
};

/** GET a Hostaway endpoint and return its `result` payload. */
export async function hostawayGet<T>(
  path: string,
  { revalidate = 900, searchParams }: HostawayFetchOptions = {},
): Promise<T> {
  const token = await getAccessToken();

  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    },
    next: { revalidate, tags: ["hostaway"] },
  });

  if (res.status === 401) {
    // Token rejected — drop it so the next call re-authenticates.
    cachedToken = null;
  }
  if (!res.ok) {
    throw new Error(`Hostaway GET ${path} failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { status?: string; result?: T };
  if (json.result === undefined) {
    throw new Error(`Hostaway GET ${path} returned no result.`);
  }
  return json.result;
}
