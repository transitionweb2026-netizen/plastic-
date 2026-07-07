import "server-only";
import { createJsonFileDriver } from "./storage";

/** Sparse override trees mirroring messages/en.json / messages/ar.json —
 *  only overridden leaves are present; everything else falls back to the
 *  shipped translation file. See i18n/request.ts for the merge point. */
export type TranslationOverrides = {
  en: Record<string, unknown>;
  ar: Record<string, unknown>;
};

const driver = createJsonFileDriver<TranslationOverrides>(
  "translations-overrides.json",
  () => ({ en: {}, ar: {} })
);

export function readTranslationOverrides(): TranslationOverrides {
  return driver.read();
}

export function writeTranslationOverrides(data: TranslationOverrides): void {
  driver.write(data);
}
