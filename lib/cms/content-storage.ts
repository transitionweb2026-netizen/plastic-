import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import {
  emptyContentOverrides,
  type ContentOverrides,
  type ContentRecord,
  type ProductFields,
  type IndustryFields,
  type ArticleFields,
  type SiteContactOverride,
} from "./content-types";

/**
 * Reconstructs the ContentOverrides shape the admin dashboard's Content tab
 * expects (see components/admin/ContentTab.tsx), from the override_en/
 * override_ar/published columns on content_products/industries/articles +
 * the content_site_contact singleton. The "base" values (shipped defaults)
 * live in the same rows now — see lib/products.ts/industries.ts/articles.ts
 * for the merge, not here.
 */
async function fetchContentOverrides(): Promise<ContentOverrides> {
  const db = supabase();
  const [productsRes, industriesRes, articlesRes, contactRes] = await Promise.all([
    db.from("content_products").select("id, override_en, override_ar, published, updated_at"),
    db.from("content_industries").select("id, override_en, override_ar, published, updated_at"),
    db.from("content_articles").select("slug, override_en, override_ar, published, updated_at"),
    db.from("content_site_contact").select("*").eq("id", 1).maybeSingle(),
  ]);
  if (productsRes.error) throw productsRes.error;
  if (industriesRes.error) throw industriesRes.error;
  if (articlesRes.error) throw articlesRes.error;
  if (contactRes.error) throw contactRes.error;

  const out = emptyContentOverrides();
  for (const r of productsRes.data ?? []) {
    out.products[String(r.id)] = {
      published: r.published,
      en: r.override_en ?? {},
      ar: r.override_ar ?? {},
      updatedAt: r.updated_at,
    };
  }
  for (const r of industriesRes.data ?? []) {
    out.industries[r.id] = {
      published: r.published,
      en: r.override_en ?? {},
      ar: r.override_ar ?? {},
      updatedAt: r.updated_at,
    };
  }
  for (const r of articlesRes.data ?? []) {
    out.articles[r.slug] = {
      published: r.published,
      en: r.override_en ?? {},
      ar: r.override_ar ?? {},
      updatedAt: r.updated_at,
    };
  }
  const c = contactRes.data;
  out.siteContact = c
    ? {
        email: c.email ?? undefined,
        phoneMainDisplay: c.phone_main_display ?? undefined,
        phoneMainHref: c.phone_main_href ?? undefined,
        phoneLogisticsDisplay: c.phone_logistics_display ?? undefined,
        phoneLogisticsHref: c.phone_logistics_href ?? undefined,
      }
    : {};
  return out;
}

export const readContentOverrides = unstable_cache(
  fetchContentOverrides,
  ["content-overrides"],
  { tags: ["content-overrides"] }
);

export async function writeProductOverride(
  id: string,
  record: ContentRecord<Partial<ProductFields>>
): Promise<void> {
  const { error } = await supabase()
    .from("content_products")
    .update({
      override_en: record.en,
      override_ar: record.ar,
      published: record.published,
      updated_at: record.updatedAt ?? new Date().toISOString(),
    })
    .eq("id", Number(id));
  if (error) throw error;
  revalidateTag("content-overrides", { expire: 0 });
  revalidateTag("content-products", { expire: 0 });
}

export async function writeIndustryOverride(
  id: string,
  record: ContentRecord<Partial<IndustryFields>>
): Promise<void> {
  const { error } = await supabase()
    .from("content_industries")
    .update({
      override_en: record.en,
      override_ar: record.ar,
      published: record.published,
      updated_at: record.updatedAt ?? new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
  revalidateTag("content-overrides", { expire: 0 });
  revalidateTag("content-industries", { expire: 0 });
}

export async function writeArticleOverride(
  slug: string,
  record: ContentRecord<Partial<ArticleFields>>
): Promise<void> {
  const { error } = await supabase()
    .from("content_articles")
    .update({
      override_en: record.en,
      override_ar: record.ar,
      published: record.published,
      updated_at: record.updatedAt ?? new Date().toISOString(),
    })
    .eq("slug", slug);
  if (error) throw error;
  revalidateTag("content-overrides", { expire: 0 });
  revalidateTag("content-articles", { expire: 0 });
}

export async function writeSiteContact(record: SiteContactOverride): Promise<void> {
  const { error } = await supabase()
    .from("content_site_contact")
    .upsert({
      id: 1,
      email: record.email ?? null,
      phone_main_display: record.phoneMainDisplay ?? null,
      phone_main_href: record.phoneMainHref ?? null,
      phone_logistics_display: record.phoneLogisticsDisplay ?? null,
      phone_logistics_href: record.phoneLogisticsHref ?? null,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
  revalidateTag("content-overrides", { expire: 0 });
  revalidateTag("site-contact", { expire: 0 });
}

/** Site-wide contact info (Footer, forms, hero widget) — no per-locale
 *  split, no publish gate, same always-active singleton as before. */
export const siteContact = unstable_cache(
  async (): Promise<SiteContactOverride> => {
    const { data, error } = await supabase()
      .from("content_site_contact")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return data
      ? {
          email: data.email ?? undefined,
          phoneMainDisplay: data.phone_main_display ?? undefined,
          phoneMainHref: data.phone_main_href ?? undefined,
          phoneLogisticsDisplay: data.phone_logistics_display ?? undefined,
          phoneLogisticsHref: data.phone_logistics_href ?? undefined,
        }
      : {};
  },
  ["site-contact"],
  { tags: ["site-contact"] }
);
