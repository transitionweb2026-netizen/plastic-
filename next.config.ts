import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isProd = process.env.NODE_ENV === "production";

/** Supabase Storage host (site-images bucket) — derived from the env var
 *  so this doesn't need updating if the project ever changes. */
const supabaseHost = process.env.SUPABASE_URL
  ? new URL(process.env.SUPABASE_URL).hostname
  : undefined;

/**
 * Ported from the legacy per-page <meta http-equiv="Content-Security-Policy"> tag,
 * adjusted for the Next.js build: Tailwind CDN and runtime Google Fonts are gone
 * (both are now compiled/self-hosted), Formspree stays for form submissions, and
 * the two remote image hosts remain until images are re-hosted locally.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // Google Ads conversion tracking (gtag.js) — see lib/googleAds.ts /
  // app/[locale]/layout.tsx. gtag.js itself loads from googletagmanager.com,
  // then reports conversions via a chain of background script/image/fetch
  // requests spanning google.com, googleadservices.com, and multiple
  // doubleclick.net subdomains (googleads.g.doubleclick.net for the
  // conversion pixel, ad.doubleclick.net for the collect beacon) — allowed
  // via wildcard below since Google doesn't document a fixed, stable set.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.doubleclick.net",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `img-src 'self' data: https://lh3.googleusercontent.com https://upload.wikimedia.org https://www.googletagmanager.com https://*.google.com https://*.doubleclick.net${supabaseHost ? ` https://${supabaseHost}` : ""}`,
  // Supabase host required for the admin's direct-to-Storage video uploads
  // (signed-URL PUTs go straight from the browser to Storage).
  `connect-src 'self' https://formspree.io https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.google.com https://www.googleadservices.com https://*.doubleclick.net${supabaseHost ? ` https://${supabaseHost}` : ""}`,
  // Video lightboxes: embedded players for every auto-detected provider
  // (see lib/video-url.ts) — YouTube, Drive preview fallback, Vimeo, Loom,
  // OneDrive.
  "frame-src https://www.youtube-nocookie.com https://drive.google.com https://player.vimeo.com https://www.loom.com https://onedrive.live.com",
  // Admin-pasted Video URLs may point at any HTTPS host (Supabase Storage,
  // CDNs, plain MP4 links) — media is low-risk, so allow https: broadly.
  "media-src 'self' https:",
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
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost }]
        : []),
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
      // Belt-and-suspenders: the sitemap route already sets this header
      // itself, but some hosting proxies have been observed dropping
      // dynamic Route Handler response headers — this framework-level
      // config is a second, independent enforcement path for the same
      // header so the browser/crawler always sees valid XML content-type.
      {
        source: "/sitemap.xml",
        headers: [{ key: "Content-Type", value: "application/xml; charset=utf-8" }],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
