"use client";

/**
 * Last resort: an error in the root layout itself, where the normal boundary
 * and the site chrome are unavailable. It has to render its own <html> and
 * carry its own styles, because nothing else is guaranteed to have loaded.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141210",
          color: "#fcfbf8",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 300,
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "36rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 300, margin: "0 0 1rem" }}>
            The site is having a problem
          </h1>
          <p style={{ color: "#c9bfb0", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
            Something failed before the page could load. The team is reachable on WhatsApp at
            +506 8734-7178 in the meantime.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{
                padding: "0.875rem 1.625rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                background: "#877750",
                color: "#fff",
                border: "1px solid #877750",
                borderRadius: 0,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="https://wa.me/50687347178"
              style={{
                padding: "0.875rem 1.625rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#b8a181",
                border: "1px solid #877750",
                textDecoration: "none",
              }}
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
