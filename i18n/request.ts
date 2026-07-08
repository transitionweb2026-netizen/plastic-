import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { messagesFromDb } from "@/lib/cms/translations-storage";
import { deepMergeMessages } from "@/lib/cms/deep-merge";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Shipped file is a structural fallback only (e.g. a brand-new key added
  // to the file before the next seed) — Supabase is the live source and
  // wins for every key it has. See lib/cms/translations-storage.ts.
  const base = (await import(`../messages/${locale}.json`)).default;
  const live = await messagesFromDb(locale as "en" | "ar");

  return {
    locale,
    messages: deepMergeMessages(base, live),
  };
});
