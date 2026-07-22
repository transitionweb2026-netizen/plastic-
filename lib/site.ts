/** Canonical production origin — override via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaintstorage.com";

export const SITE_NAME = "Giant Storage Integrated Solutions";

/** Cache-buster for the static favicon defaults — bump when the underlying
 *  files in public/ change, since browsers cache favicon URLs very
 *  aggressively and often ignore normal content/cache-control changes. */
export const FAVICON_VERSION = "?v=5";
