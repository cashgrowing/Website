"use client";

import { useEffect } from "react";

import { Placeholder } from "@/components/Placeholder";

/**
 * Route error boundary.
 *
 * Every page is statically generated, so this is rare by construction - it
 * would take a runtime failure during revalidation, or a client-side error. It
 * still exists because the alternative is Next's default error screen, which
 * tells a homeowner nothing and offers them nowhere to go. WhatsApp is always
 * on the page below.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // The digest is what ties this to a server log entry.
    console.error("[error boundary]", error.digest ?? "", error.message);
  }, [error]);

  return (
    <Placeholder
      title="Something went wrong on our side"
      note="This page did not load properly. It is not something you did. Try again, and if it keeps happening the WhatsApp line below is answered around the clock."
      action={{ label: "Try again", onClick: reset }}
    />
  );
}
