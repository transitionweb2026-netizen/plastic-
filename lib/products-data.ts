import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { supabase } from "./supabase/client";
import { applyContentOverride } from "./cms/deep-merge";
import type { Product, ProductCategory } from "./products";

type ProductRow = {
  id: number;
  cat: ProductCategory;
  status_class: Product["statusClass"];
  image: string;
  cover_image: string | null;
  images: string[] | null;
  base_en: Omit<Product, "id" | "cat" | "statusClass" | "image" | "coverImage" | "images">;
  base_ar: Partial<Product>;
  override_en: Partial<Product>;
  override_ar: Partial<Product>;
  published: boolean;
};

const fetchRows = unstable_cache(
  async (): Promise<ProductRow[]> => {
    const { data, error } = await supabase()
      .from("content_products")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    return data as ProductRow[];
  },
  ["content-products"],
  { tags: ["content-products"] }
);

function localizedBase(row: ProductRow, locale: string): Product {
  const base: Product = {
    id: row.id,
    cat: row.cat,
    statusClass: row.status_class,
    image: row.image,
    coverImage: row.cover_image ?? undefined,
    images: row.images ?? undefined,
    ...row.base_en,
  };
  return locale !== "ar" ? base : { ...base, ...row.base_ar };
}

/** Full localized products, CMS content overrides applied (trim-or-fallback,
 *  only when published) — what the public site renders. */
export async function getProducts(locale: string): Promise<Product[]> {
  const rows = await fetchRows();
  return rows.map((r) =>
    applyContentOverride(
      localizedBase(r, locale),
      r.published ? (locale === "ar" ? r.override_ar : r.override_en) : undefined
    )
  );
}

export async function getProduct(id: number, locale: string): Promise<Product | undefined> {
  const rows = await fetchRows();
  const row = rows.find((r) => r.id === id);
  if (!row) return undefined;
  return applyContentOverride(
    localizedBase(row, locale),
    row.published ? (locale === "ar" ? row.override_ar : row.override_en) : undefined
  );
}

/** Base localized products with NO content-override layer — used only by
 *  lib/cms/seo.ts's productJsonLd(), matching its existing behavior of
 *  building structured data from shipped copy, not CMS content edits. */
export async function getProductsBase(locale: string): Promise<Product[]> {
  const rows = await fetchRows();
  return rows.map((r) => localizedBase(r, locale));
}

/** Base (locale-invariant) image fields — not part of the override layer. */
export async function writeProductImages(
  id: string,
  patch: { image?: string; coverImage?: string; images?: string[] }
): Promise<void> {
  const update: Record<string, unknown> = {};
  if (patch.image !== undefined) update.image = patch.image;
  if (patch.coverImage !== undefined) update.cover_image = patch.coverImage || null;
  if (patch.images !== undefined) update.images = patch.images.length ? patch.images : null;
  const { error } = await supabase().from("content_products").update(update).eq("id", Number(id));
  if (error) throw error;
  revalidateTag("content-products", { expire: 0 });
}
