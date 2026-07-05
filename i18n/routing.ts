import { defineRouting } from "next-intl/routing";

/**
 * Arabic is the primary language and lives unprefixed at "/".
 * English is secondary at "/en". First visits always land on Arabic
 * (no accept-language negotiation); the visitor's explicit choice is
 * persisted via the NEXT_LOCALE cookie, handled in proxy.ts.
 */
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "as-needed",
  // Detection is handled manually in proxy.ts (cookie only, no
  // accept-language) so that first visits are always Arabic.
  localeDetection: false,
  localeCookie: false,
});

export type AppLocale = (typeof routing.locales)[number];
