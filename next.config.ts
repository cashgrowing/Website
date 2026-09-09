import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * The brief asks for a nonce-based policy. That is not compatible with the
 * statically generated pages the same brief requires, and the incompatibility
 * is not theoretical: a nonce is minted per request, but prerendered HTML is
 * written once at build time with no nonce on it. Serving
 * `script-src 'self' 'nonce-...' 'strict-dynamic'` over that HTML was measured
 * to block all 16 of Next's inline hydration scripts - the page renders and
 * then never hydrates.
 *
 * Making it work means reading the nonce in the root layout, which opts every
 * page out of static rendering and gives up the ISR and Core Web Vitals the
 * brief also demands. That trade is the owner's call, not a silent one, so
 * until it is made this policy keeps static rendering and stays strict
 * everywhere except script-src.
 *
 * `'unsafe-inline'` here is a real weakening against XSS injected into our own
 * markup. The mitigations that remain: no user-generated content is rendered,
 * all content is typed data rather than HTML, `object-src 'none'` and
 * `base-uri 'self'` close the classic escalation paths, and `connect-src
 * 'self'` and `form-action 'self'` stop exfiltration to another origin.
 *
 * When the Hostaway widgets and analytics land, their origins need adding to
 * script-src, frame-src and connect-src. They are deliberately absent now.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Hostaway listing photography
      { protocol: "https", hostname: "*.hostaway.com" },
      { protocol: "https", hostname: "hostaway-platform.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "hostaway-platform.s3.amazonaws.com" },
      { protocol: "https", hostname: "*.muscache.com" },
    ],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // Redirect map from section 7 of the build brief. Live from day one so the
  // rankings on the old Wix URLs survive the cutover.
  //
  // `statusCode: 301` rather than `permanent: true`: Next emits 308 for
  // `permanent`, and while Google treats the two the same, the brief asks for
  // 301 and older tooling is less consistent about 308.
  async redirects() {
    return [
      {
        source: "/post/what-a-property-manager-does-costa-rica",
        destination: "/journal/what-a-property-manager-does-costa-rica",
        statusCode: 301,
      },
      {
        source: "/post/property-management-long-term-rental-solutions",
        destination: "/journal/what-a-property-manager-does-costa-rica",
        statusCode: 301,
      },
      { source: "/blog", destination: "/journal", statusCode: 301 },
      { source: "/blog/:path*", destination: "/journal", statusCode: 301 },
    ];
  },
};

export default nextConfig;
