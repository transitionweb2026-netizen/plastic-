import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import { allRedirects } from "./redirects";
import type {
  CmsData,
  GlobalSeo,
  PageSeo,
  ProductSeo,
  ImageSeo,
} from "./types";

export function emptyCms(): CmsData {
  return {
    version: 1,
    global: {
      org: {
        companyName: "Giant Storage Integrated Solutions",
        logoUrl: "",
        website: "",
        phone: "",
        email: "",
        address: { street: "", city: "", country: "" },
        social: {},
      },
      notFound: { published: false, en: {}, ar: {} },
      robots: { rules: [], custom: "" },
    },
    pages: {},
    products: {},
    images: {},
    redirects: [],
  };
}

/**
 * Full SEO CMS aggregate (global org/robots/404, per-page SEO, per-product
 * SEO, per-gallery-image SEO overlay, redirects) — used by lib/cms/seo.ts's
 * metadata builders, the admin dashboard's GET, and sitemap/robots. Cached
 * under "cms-data"; every write function below revalidates it.
 */
async function fetchCms(): Promise<CmsData> {
  const db = supabase();
  const [globalRes, pagesRes, productsRes, imagesRes, redirects] = await Promise.all([
    db.from("cms_global").select("*").eq("id", 1).maybeSingle(),
    db.from("cms_pages").select("*"),
    db.from("cms_product_seo").select("*"),
    db.from("gallery_images").select("file, published, override_en, override_ar"),
    allRedirects(),
  ]);
  if (globalRes.error) throw globalRes.error;
  if (pagesRes.error) throw pagesRes.error;
  if (productsRes.error) throw productsRes.error;
  if (imagesRes.error) throw imagesRes.error;

  const empty = emptyCms();
  const g = globalRes.data;
  const global: GlobalSeo = g
    ? {
        org: g.org,
        favicon: g.favicon ?? undefined,
        appleTouchIcon: g.apple_touch_icon ?? undefined,
        notFound: g.not_found,
        robots: g.robots,
      }
    : empty.global;

  const pages: Record<string, PageSeo> = {};
  for (const r of pagesRes.data ?? []) {
    pages[r.page_key] = {
      pageKey: r.page_key,
      published: r.published,
      en: r.en,
      ar: r.ar,
      updatedAt: r.updated_at,
    };
  }

  const products: Record<string, ProductSeo> = {};
  for (const r of productsRes.data ?? []) {
    products[String(r.product_id)] = {
      pageKey: String(r.product_id),
      published: r.published,
      en: r.en,
      ar: r.ar,
      updatedAt: r.updated_at,
      productCode: r.product_code ?? undefined,
      weight: r.weight ?? undefined,
      staticLoad: r.static_load ?? undefined,
      dynamicLoad: r.dynamic_load ?? undefined,
      rackingLoad: r.racking_load ?? undefined,
    };
  }

  const images: Record<string, ImageSeo> = {};
  for (const r of imagesRes.data ?? []) {
    images[r.file] = {
      file: r.file,
      published: r.published,
      en: r.override_en ?? {},
      ar: r.override_ar ?? {},
    };
  }

  return { version: 1, global, pages, products, images, redirects };
}

export const readCms = unstable_cache(fetchCms, ["cms-data"], { tags: ["cms-data"] });

export async function writeGlobal(record: GlobalSeo): Promise<void> {
  const { error } = await supabase()
    .from("cms_global")
    .upsert({
      id: 1,
      org: record.org,
      favicon: record.favicon ?? null,
      apple_touch_icon: record.appleTouchIcon ?? null,
      not_found: record.notFound,
      robots: record.robots,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
  revalidateTag("cms-data", { expire: 0 });
}

export async function writePage(pageKey: string, record: PageSeo): Promise<void> {
  const { error } = await supabase()
    .from("cms_pages")
    .upsert({
      page_key: pageKey,
      published: record.published,
      en: record.en,
      ar: record.ar,
      updated_at: record.updatedAt ?? new Date().toISOString(),
    });
  if (error) throw error;
  revalidateTag("cms-data", { expire: 0 });
}

export async function writeProductSeo(id: string, record: ProductSeo): Promise<void> {
  const { error } = await supabase()
    .from("cms_product_seo")
    .upsert({
      product_id: Number(id),
      published: record.published,
      en: record.en,
      ar: record.ar,
      product_code: record.productCode ?? null,
      weight: record.weight ?? null,
      static_load: record.staticLoad ?? null,
      dynamic_load: record.dynamicLoad ?? null,
      racking_load: record.rackingLoad ?? null,
      updated_at: record.updatedAt ?? new Date().toISOString(),
    });
  if (error) throw error;
  revalidateTag("cms-data", { expire: 0 });
}

export async function writeImageSeo(file: string, record: ImageSeo): Promise<void> {
  const { error } = await supabase()
    .from("gallery_images")
    .update({
      published: record.published,
      override_en: record.en,
      override_ar: record.ar,
      updated_at: new Date().toISOString(),
    })
    .eq("file", file);
  if (error) throw error;
  revalidateTag("cms-data", { expire: 0 });
  revalidateTag("gallery-images", { expire: 0 });
}

export { writeRedirects } from "./redirects";
