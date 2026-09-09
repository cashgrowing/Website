import type { NextConfig } from "next";

/**
 * Security headers.
 * The nonce-based Content-Security-Policy lands in Phase 3 (it needs middleware
 * plus the final list of embedded Hostaway / analytics origins). Everything that
 * does not depend on those decisions is switched on now.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
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
  async redirects() {
    return [
      {
        source: "/post/what-a-property-manager-does-costa-rica",
        destination: "/journal/what-a-property-manager-does-costa-rica",
        permanent: true,
      },
      {
        source: "/post/property-management-long-term-rental-solutions",
        destination: "/journal/what-a-property-manager-does-costa-rica",
        permanent: true,
      },
      { source: "/blog", destination: "/journal", permanent: true },
      { source: "/blog/:path*", destination: "/journal", permanent: true },
    ];
  },
};

export default nextConfig;
