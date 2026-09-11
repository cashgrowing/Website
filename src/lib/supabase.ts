import "server-only";

import type { InquiryInput } from "./inquiries";

/**
 * Supabase writes, over the REST API with plain fetch.
 *
 * No client library on purpose: one HTTP call does not justify a dependency,
 * and the smaller the surface that ever sees the service role key, the better.
 *
 * `server-only` above means an accidental import from a client component fails
 * the build rather than shipping the key to a browser.
 */
/** Pasted values are trimmed: a stray newline makes a valid key fail auth. */
function supabaseUrl(): string {
  return process.env.SUPABASE_URL?.trim().replace(/\/+$/, "") ?? "";
}
function serviceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && serviceKey());
}

/**
 * Headers for a server-side Supabase request.
 *
 * Supabase issues two kinds of secret: the legacy `service_role` key, which is
 * a JWT (starts `eyJ`), and the newer `sb_secret_...` key, which is not. The
 * legacy key goes in both `apikey` and `Authorization`; the new one belongs in
 * `apikey` only, and sending it as a Bearer token gets it rejected as a
 * malformed JWT. Handle both so it does not matter which one gets pasted.
 */
export function supabaseHeaders(key: string): Record<string, string> {
  const headers: Record<string, string> = { apikey: key };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  return headers;
}

export type StoredInquiry = InquiryInput & {
  sourcePath?: string;
  userAgent?: string;
  ipHash?: string;
};

/** Insert one enquiry. Returns the new row's id, or null if the write failed. */
export async function insertInquiry(inquiry: StoredInquiry): Promise<string | null> {
  const url = supabaseUrl();
  const key = serviceKey();
  if (!url || !key) return null;

  const row = {
    kind: inquiry.kind,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone || null,
    message: inquiry.message || null,
    property_location: inquiry.propertyLocation || null,
    stay_details: inquiry.stayDetails || null,
    source_path: inquiry.sourcePath || null,
    user_agent: inquiry.userAgent?.slice(0, 400) || null,
    ip_hash: inquiry.ipHash || null,
  };

  try {
    const res = await fetch(`${url}/rest/v1/inquiries`, {
      method: "POST",
      headers: {
        ...supabaseHeaders(key),
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[supabase] insert failed:", res.status, await res.text());
      return null;
    }

    const rows = (await res.json()) as Array<{ id?: string }>;
    return rows[0]?.id ?? null;
  } catch (error) {
    console.error("[supabase] insert threw:", error);
    return null;
  }
}
