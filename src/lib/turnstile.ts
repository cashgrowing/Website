import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Secrets arrive by paste into a dashboard, and a paste routinely carries a
 * trailing space or newline. Sent as-is, Cloudflare rejects the secret as
 * invalid - which looks exactly like a bot being refused.
 */
function secret(): string {
  return process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
}

export function isTurnstileConfigured(): boolean {
  return Boolean(secret() && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());
}

/**
 * Verify a Turnstile token with Cloudflare.
 *
 * Returns false on a network failure rather than throwing: a write endpoint
 * should refuse the request when it cannot confirm the caller is human, not
 * fall open.
 */
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const key = secret();
  if (!key || !token) {
    // Every refusal says why; a silent `false` looks exactly like a bot.
    console.error("[turnstile] refused before siteverify:", JSON.stringify({ hasSecret: Boolean(key), tokenLength: token.length }));
    return false;
  }

  try {
    const body = new URLSearchParams({ secret: key, response: token });
    if (ip) body.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    const json = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      "error-codes"?: string[];
      hostname?: string;
    };
    if (!res.ok || json.success !== true) {
      /*
       * Cloudflare says why it refused: invalid-input-secret (the secret does
       * not belong to this widget), timeout-or-duplicate (token expired or
       * reused), invalid-input-response, and so on. Without this line a
       * failure is indistinguishable from a bot. Never includes the secret.
       */
      /*
       * The secret's shape, never its value. Site key and secret both begin
       * `0x4AAAAAA`, so pasting the site key into the secret field is an easy
       * mistake - and a secret is 35 characters where a site key is about 24.
       */
      console.error(
        "[turnstile] siteverify refused:",
        JSON.stringify({
          errors: json["error-codes"] ?? [],
          hostname: json.hostname ?? null,
          secretLength: key.length,
          secretIsTheSiteKey: key === process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
        }),
      );
    }
    return json.success === true;
  } catch (error) {
    console.error("[turnstile] verification failed:", error);
    return false;
  }
}
