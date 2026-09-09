import { InquiryForm } from "./InquiryForm";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isTurnstileConfigured } from "@/lib/turnstile";

/**
 * Renders the enquiry form only when there is somewhere to store a submission
 * and something to keep the bots out.
 *
 * If either is missing the form is not shown at all. A visitor should never
 * meet a form that cannot work, and the endpoint behind it refuses writes in
 * the same conditions - the two checks agree on purpose.
 */
export function InquirySection({
  kind,
  sourcePath,
}: {
  kind: "owner" | "guest";
  sourcePath: string;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey || !isSupabaseConfigured() || !isTurnstileConfigured()) return null;

  return <InquiryForm kind={kind} siteKey={siteKey} sourcePath={sourcePath} />;
}
