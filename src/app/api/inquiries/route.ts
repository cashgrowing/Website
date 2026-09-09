import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

import { createLeadTask, isClickUpConfigured } from "@/lib/clickup";
import { inquirySchema } from "@/lib/inquiries";
import { rateLimit } from "@/lib/rate-limit";
import { insertInquiry, isSupabaseConfigured } from "@/lib/supabase";
import { isTurnstileConfigured, verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
/** Never cached: this endpoint only writes. */
export const dynamic = "force-dynamic";

/** Vercel puts the real client IP here; the socket address is the proxy's. */
function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * Store a salted hash, never the address itself. Enough to spot one source
 * abusing the form, not enough to identify a person or to be worth stealing.
 * With no salt configured we store nothing rather than a guessable digest.
 */
function hashIp(ip: string): string | undefined {
  const salt = process.env.INQUIRY_IP_SALT;
  if (!salt || ip === "unknown") return undefined;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function POST(request: NextRequest) {
  // Refuse to accept writes we cannot protect or cannot store. Failing closed
  // is the only honest option: an enquiry that vanishes is a lost customer.
  if (!isSupabaseConfigured() || !isTurnstileConfigured()) {
    console.error("[inquiries] refused: supabase or turnstile is not configured");
    return NextResponse.json(
      { error: "The form is not available right now. Please message us on WhatsApp." },
      { status: 503 },
    );
  }

  const ip = clientIp(request);

  // Rate limit before doing any work, including before calling Cloudflare.
  const limit = rateLimit(`inquiry:${ip}`, 5, 600);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages from this connection. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const inquiry = parsed.data;

  // Honeypot: invisible to people, irresistible to bots. Answer 200 so the bot
  // records a success and does not retry, but store nothing.
  if (inquiry.company) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const human = await verifyTurnstile(inquiry.turnstileToken ?? "", ip === "unknown" ? undefined : ip);
  if (!human) {
    return NextResponse.json(
      { error: "We could not verify that you are human. Please try again." },
      { status: 403 },
    );
  }

  const id = await insertInquiry({
    ...inquiry,
    userAgent: request.headers.get("user-agent") ?? undefined,
    ipHash: hashIp(ip),
  });

  if (!id) {
    // Stored nothing, so say so rather than pretending it arrived.
    return NextResponse.json(
      { error: "We could not save that. Please message us on WhatsApp instead." },
      { status: 502 },
    );
  }

  // The lead is safe in Supabase from here. ClickUp is best effort and must
  // never turn a stored enquiry into a failed submission.
  if (isClickUpConfigured()) {
    void createLeadTask(inquiry).catch((error) => {
      console.error("[inquiries] clickup hand-off failed:", error);
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
