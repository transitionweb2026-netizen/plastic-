import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { readTranslationOverrides } from "@/lib/cms/translations-storage";
import { deepMergeMessages } from "@/lib/cms/deep-merge";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const base = (await import(`../messages/${locale}.json`)).default;
  // CMS overrides are read fresh (fs, not import()) on every request, so
  // admin edits appear on the next page load — no rebuild needed.
  const overrides = readTranslationOverrides()[locale as "en" | "ar"];

  return {
    locale,
    messages: Object.keys(overrides).length
      ? deepMergeMessages(base, overrides)
      : base,
  };
});
