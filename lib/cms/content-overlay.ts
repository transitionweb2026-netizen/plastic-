import "server-only";
import { readContentOverrides } from "./content-storage";
import type { ProductFields, IndustryFields, ArticleFields, SiteContactOverride } from "./content-types";

type Locale = "en" | "ar";

function published<T>(rec?: { published: boolean; en: T; ar: T }): { en: T; ar: T } | undefined {
  return rec && rec.published ? rec : undefined;
}

export function productOverride(id: number, locale: Locale): Partial<ProductFields> | undefined {
  const rec = published(readContentOverrides().products[String(id)]);
  return rec?.[locale];
}

export function allProductOverrides(locale: Locale): Record<number, Partial<ProductFields>> {
  const out: Record<number, Partial<ProductFields>> = {};
  for (const [id, rec] of Object.entries(readContentOverrides().products)) {
    const p = published(rec);
    if (p) out[Number(id)] = p[locale];
  }
  return out;
}

export function industryOverride(id: string, locale: Locale): Partial<IndustryFields> | undefined {
  const rec = published(readContentOverrides().industries[id]);
  return rec?.[locale];
}

export function allIndustryOverrides(locale: Locale): Record<string, Partial<IndustryFields>> {
  const out: Record<string, Partial<IndustryFields>> = {};
  for (const [id, rec] of Object.entries(readContentOverrides().industries)) {
    const p = published(rec);
    if (p) out[id] = p[locale];
  }
  return out;
}

export function articleOverride(slug: string, locale: Locale): Partial<ArticleFields> | undefined {
  const rec = published(readContentOverrides().articles[slug]);
  return rec?.[locale];
}

/** Site-wide contact info (email/phones) — no per-locale split, no publish
 *  gate (same always-active singleton pattern as lib/cms/seo.ts's
 *  orgSettings()); each field falls back individually if unset/empty. */
export function siteContactOverride(): SiteContactOverride {
  return readContentOverrides().siteContact;
}
