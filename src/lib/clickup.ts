import "server-only";

import type { InquiryInput } from "./inquiries";

/**
 * Every homeowner enquiry becomes a ClickUp task, per section 3 of the brief.
 *
 * Best effort by design: the enquiry is already safely in Supabase before this
 * runs, so a ClickUp outage must never cost a lead or fail the submission. A
 * failure is logged and the row keeps `clickup_task_id` null, which is what a
 * retry would look for.
 */
export function isClickUpConfigured(): boolean {
  return Boolean(process.env.CLICKUP_API_TOKEN && process.env.CLICKUP_LEADS_LIST_ID);
}

export async function createLeadTask(inquiry: InquiryInput): Promise<string | null> {
  const token = process.env.CLICKUP_API_TOKEN;
  const listId = process.env.CLICKUP_LEADS_LIST_ID;
  if (!token || !listId) return null;

  const where = inquiry.propertyLocation?.trim();
  const title =
    inquiry.kind === "owner"
      ? `Owner lead: ${inquiry.name}${where ? ` (${where})` : ""}`
      : `Guest enquiry: ${inquiry.name}`;

  const description = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    inquiry.phone ? `Phone: ${inquiry.phone}` : null,
    where ? `Property location: ${where}` : null,
    inquiry.stayDetails ? `Stay details: ${inquiry.stayDetails}` : null,
    inquiry.sourcePath ? `Came from: ${inquiry.sourcePath}` : null,
    "",
    inquiry.message || "(no message)",
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const res = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ name: title.slice(0, 250), description }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[clickup] task creation failed:", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { id?: string };
    return json.id ?? null;
  } catch (error) {
    console.error("[clickup] task creation threw:", error);
    return null;
  }
}
