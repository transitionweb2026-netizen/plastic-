import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { supabase } from "./supabase/client";
import { applyContentOverride } from "./cms/deep-merge";
import type { Article } from "./articles";

type ArticleRow = {
  slug: string;
  hero_img: string;
  hero_alt: string;
  hero_overlay_html: string;
  date: string;
  read_time: string;
  has_counters: boolean;
  show_bottom_share: boolean;
  base_en: Omit<
    Article,
    "slug" | "heroImg" | "heroAlt" | "heroOverlayHtml" | "date" | "readTime" | "hasCounters" | "showBottomShare"
  >;
  base_ar: Partial<Article>;
  override_en: Partial<Article>;
  override_ar: Partial<Article>;
  published: boolean;
};

const fetchRows = unstable_cache(
  async (): Promise<ArticleRow[]> => {
    const { data, error } = await supabase().from("content_articles").select("*");
    if (error) throw error;
    return data as ArticleRow[];
  },
  ["content-articles"],
  { tags: ["content-articles"] }
);

function localizedBase(row: ArticleRow, locale: string): Article {
  const base: Article = {
    slug: row.slug,
    heroImg: row.hero_img,
    heroAlt: row.hero_alt,
    heroOverlayHtml: row.hero_overlay_html,
    date: row.date,
    readTime: row.read_time,
    hasCounters: row.has_counters,
    showBottomShare: row.show_bottom_share,
    ...row.base_en,
  };
  return locale !== "ar" ? base : { ...base, ...row.base_ar };
}

export async function getArticles(locale: string): Promise<Article[]> {
  const rows = await fetchRows();
  return rows.map((r) =>
    applyContentOverride(
      localizedBase(r, locale),
      r.published ? (locale === "ar" ? r.override_ar : r.override_en) : undefined
    )
  );
}

export async function getArticle(slug: string, locale: string): Promise<Article | undefined> {
  const rows = await fetchRows();
  const row = rows.find((r) => r.slug === slug);
  if (!row) return undefined;
  return applyContentOverride(
    localizedBase(row, locale),
    row.published ? (locale === "ar" ? row.override_ar : row.override_en) : undefined
  );
}

/** Base articles with NO content-override layer — used by the admin
 *  Content tab's GET (shows shipped defaults alongside the editable
 *  override). */
export async function getArticlesBase(locale: string): Promise<Article[]> {
  const rows = await fetchRows();
  return rows.map((r) => localizedBase(r, locale));
}

/** Base slugs only, cheap for generateStaticParams/sitemap — no per-locale
 *  merge needed since slugs are locale-invariant at the base-content level
 *  (per-locale slug overrides are handled by lib/cms/seo.ts's articleSlug()). */
export async function getArticleSlugs(): Promise<string[]> {
  const rows = await fetchRows();
  return rows.map((r) => r.slug);
}

/** True when the article body itself is available in the locale — a
 *  published CMS bodyHtml override counts as localized too. */
export async function articleBodyLocalized(slug: string, locale: string): Promise<boolean> {
  if (locale !== "ar") return true;
  const rows = await fetchRows();
  const row = rows.find((r) => r.slug === slug);
  if (!row) return false;
  const overrideBody = row.published ? row.override_ar?.bodyHtml : undefined;
  return Boolean(row.base_ar?.bodyHtml) || Boolean(overrideBody?.trim());
}

/** Base (locale-invariant) hero image fields — not part of the override layer. */
export async function writeArticleHeroImage(
  slug: string,
  patch: { heroImg?: string; heroAlt?: string }
): Promise<void> {
  const update: Record<string, unknown> = {};
  if (patch.heroImg !== undefined) update.hero_img = patch.heroImg;
  if (patch.heroAlt !== undefined) update.hero_alt = patch.heroAlt;
  const { error } = await supabase().from("content_articles").update(update).eq("slug", slug);
  if (error) throw error;
  revalidateTag("content-articles", { expire: 0 });
}
