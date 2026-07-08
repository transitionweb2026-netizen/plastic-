import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isProd = process.env.NODE_ENV === "production";

/**
 * Ported from the legacy per-page <meta http-equiv="Content-Security-Policy"> tag,
 * adjusted for the Next.js build: Tailwind CDN and runtime Google Fonts are gone
 * (both are now compiled/self-hosted), Formspree stays for form submissions, and
 * the two remote image hosts remain until images are re-hosted locally.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: https://lh3.googleusercontent.com https://upload.wikimedia.org",
  "connect-src 'self' https://formspree.io",
  // Gallery video lightbox: YouTube embeds + self-hosted MP4s
  "frame-src https://www.youtube-nocookie.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://formspree.io",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // CSP only in production: dev needs eval/websockets for HMR.
          ...(isProd
            ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }]
            : []),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
