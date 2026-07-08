import "server-only";
import { getGalleryImages } from "@/lib/gallery-data";
import { readCms } from "./storage";
import { defaultSeo, effectiveSeo, pageRegistry } from "./seo";
import type { Locale } from "./types";

/**
 * SEO validation + scoring engine. Pure functions over CMS + defaults;
 * surfaced in the admin Health tab and beside each editor.
 */

export type Issue = {
  severity: "error" | "warning" | "info";
  code: string;
  message: string;
};

export const TITLE_RANGE = { min: 50, max: 60, hardMax: 70 } as const;
export const DESC_RANGE = { min: 140, max: 160, hardMax: 180 } as const;

export function validateTitle(title: string): Issue[] {
  const n = title.trim().length;
  if (!n) return [{ severity: "error", code: "title-missing", message: "Meta title is missing." }];
  if (n < TITLE_RANGE.min)
    return [{ severity: "warning", code: "title-short", message: `Title is ${n} chars — aim for ${TITLE_RANGE.min}–${TITLE_RANGE.max}.` }];
  if (n > TITLE_RANGE.hardMax)
    return [{ severity: "warning", code: "title-long", message: `Title is ${n} chars and will be truncated in results.` }];
  if (n > TITLE_RANGE.max)
    return [{ severity: "info", code: "title-longish", message: `Title is ${n} chars — slightly over the ${TITLE_RANGE.max} sweet spot.` }];
  return [];
}

export function validateDescription(desc: string): Issue[] {
  const n = desc.trim().length;
  if (!n) return [{ severity: "error", code: "desc-missing", message: "Meta description is missing." }];
  if (n < DESC_RANGE.min)
    return [{ severity: "warning", code: "desc-short", message: `Description is ${n} chars — aim for ${DESC_RANGE.min}–${DESC_RANGE.max}.` }];
  if (n > DESC_RANGE.hardMax)
    return [{ severity: "warning", code: "desc-long", message: `Description is ${n} chars and will be truncated.` }];
  if (n > DESC_RANGE.max)
    return [{ severity: "info", code: "desc-longish", message: `Description is ${n} chars — slightly over ${DESC_RANGE.max}.` }];
  return [];
}

export const SLUG_RE = /^[a-z0-9؀-ۿ]+(?:-[a-z0-9؀-ۿ]+)*$/;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’"”]/g, "")
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function validateSlug(slug: string | undefined, pageKey: string, locale: Locale): Promise<Issue[]> {
  if (!slug) return [];
  const issues: Issue[] = [];
  if (!SLUG_RE.test(slug))
    issues.push({ severity: "error", code: "slug-invalid", message: "Slug must be lowercase, hyphen-separated, no special characters." });
  // duplicate detection across all slug-capable pages in the same locale
  for (const entry of await pageRegistry()) {
    if (!entry.slugEditable || entry.pageKey === pageKey) continue;
    if ((await effectiveSeo(entry.pageKey, locale)).slug === slug)
      issues.push({ severity: "error", code: "slug-duplicate", message: `Slug is already used by "${entry.label}".` });
  }
  return issues;
}

export function validateCanonical(canonical: string | undefined): Issue[] {
  if (!canonical) return [];
  try {
    const u = new URL(canonical);
    if (!/^https?:$/.test(u.protocol)) throw new Error();
    return [];
  } catch {
    return [{ severity: "error", code: "canonical-invalid", message: "Canonical must be a valid absolute http(s) URL." }];
  }
}

export type PageAudit = {
  pageKey: string;
  label: string;
  locale: Locale;
  score: number;
  issues: Issue[];
};

/** Score one page/locale (0–100) with the issue list behind it. */
export async function auditPage(pageKey: string, locale: Locale): Promise<Omit<PageAudit, "label">> {
  const seo = await effectiveSeo(pageKey, locale);
  const dft = await defaultSeo(pageKey, locale);
  const issues: Issue[] = [
    ...validateTitle(seo.metaTitle),
    ...validateDescription(seo.metaDescription),
    ...(await validateSlug(seo.slug !== dft.slug ? seo.slug : undefined, pageKey, locale)),
    ...validateCanonical(seo.canonical),
  ];
  if (!seo.ogImage)
    issues.push({ severity: "warning", code: "og-missing", message: "No Open Graph image set — link shares will have no preview image." });

  let score = 100;
  for (const i of issues)
    score -= i.severity === "error" ? 25 : i.severity === "warning" ? 10 : 3;
  return { pageKey, locale, score: Math.max(0, score), issues };
}

export async function auditGalleryImages(): Promise<Issue[]> {
  const cms = await readCms();
  const issues: Issue[] = [];
  for (const locale of ["en", "ar"] as const) {
    for (const img of await getGalleryImages(locale)) {
      const rec = cms.images[img.file];
      const alt = (rec?.published && rec[locale]?.alt) || img.alt;
      if (!alt?.trim())
        issues.push({ severity: "error", code: "img-alt-missing", message: `Gallery image ${img.file} has no ${locale} alt text.` });
    }
  }
  return issues;
}

export async function auditAll(): Promise<PageAudit[]> {
  const out: PageAudit[] = [];
  for (const entry of await pageRegistry()) {
    for (const locale of ["en", "ar"] as const) {
      out.push({ ...(await auditPage(entry.pageKey, locale)), label: entry.label });
    }
  }
  return out;
}
