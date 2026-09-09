/**
 * A small fixed-window rate limiter held in module memory.
 *
 * Honest about what this is: serverless instances do not share memory, so the
 * real ceiling is roughly `limit x number of warm instances`. That is enough to
 * stop a script hammering one endpoint, and it is not a substitute for a shared
 * store. If enquiry spam ever becomes a real problem, move this to Upstash
 * Redis or Vercel KV - the call signature is designed not to change.
 *
 * Turnstile is the primary defence; this is the backstop for anything that gets
 * past it, and for the window before a Turnstile token is checked.
 *
 * No `server-only` here, unlike the modules that hold keys: this is a pure
 * algorithm touching no secrets, and it is worth being able to test directly.
 */
type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

/** Stop the map growing without bound on a long-lived instance. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, window] of buckets) {
    if (window.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets. Sent as Retry-After when blocked. */
  retryAfter: number;
};

export function rateLimit(key: string, limit = 5, windowSeconds = 600): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count > limit) {
    return { ok: false, remaining: 0, retryAfter };
  }
  return { ok: true, remaining: limit - existing.count, retryAfter };
}
