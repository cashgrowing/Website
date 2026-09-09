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
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export type StoredInquiry = InquiryInput & {
  sourcePath?: string;
  userAgent?: string;
  ipHash?: string;
};

/** Insert one enquiry. Returns the new row's id, or null if the write failed. */
export async function insertInquiry(inquiry: StoredInquiry): Promise<string | null> {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
        apikey: key,
        Authorization: `Bearer ${key}`,
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
