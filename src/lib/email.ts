import "server-only";

import type { InquiryInput } from "./inquiries";
import { SITE_URL } from "./site";

/**
 * Emails the team when an enquiry arrives.
 *
 * Sent through Resend's HTTP API with plain fetch - no SDK, for the same reason
 * as Supabase and Sanity: one POST does not justify a dependency, and fewer
 * packages see the key.
 *
 * This is a NOTIFICATION, never the record. The enquiry is already saved in
 * Supabase before this runs, and a failure here is logged and swallowed. An
 * owner who misses a ping still has the lead; an owner whose lead was only ever
 * an email has nothing when mail breaks.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.INQUIRY_NOTIFY_TO);
}

function plainText(inquiry: InquiryInput): string {
  const lines = [
    inquiry.kind === "owner" ? "New homeowner enquiry" : "New guest enquiry",
    "",
    `Name:   ${inquiry.name}`,
    `Email:  ${inquiry.email}`,
    inquiry.phone ? `Phone:  ${inquiry.phone}` : null,
    inquiry.propertyLocation ? `Where:  ${inquiry.propertyLocation}` : null,
    inquiry.stayDetails ? `Dates:  ${inquiry.stayDetails}` : null,
    inquiry.sourcePath ? `Page:   ${SITE_URL}${inquiry.sourcePath}` : null,
    "",
    inquiry.message?.trim() || "(no message)",
    "",
    "---",
    "Reply to this email to answer them directly.",
  ];
  return lines.filter((line) => line !== null).join("\n");
}

export async function sendInquiryNotification(inquiry: InquiryInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFY_TO;
  // Must be a domain verified in Resend, or Resend refuses to send.
  const from = process.env.INQUIRY_NOTIFY_FROM ?? "WildRoots site <onboarding@resend.dev>";
  if (!apiKey || !to) return false;

  const where = inquiry.propertyLocation?.trim();
  const subject =
    inquiry.kind === "owner"
      ? `Homeowner enquiry: ${inquiry.name}${where ? ` (${where})` : ""}`
      : `Guest enquiry: ${inquiry.name}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((address) => address.trim()),
        subject,
        text: plainText(inquiry),
        /*
         * So the team can hit Reply in Gmail and reach the person directly,
         * instead of copying the address out of the body.
         */
        reply_to: inquiry.email,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[email] notification failed:", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] notification threw:", error);
    return false;
  }
}
