/**
 * SEO CMS data model. Storage is pluggable (lib/cms/storage.ts): the JSON
 * file driver ships by default; the shape mirrors the legacy React site's
 * Supabase CMS (seo_pages / org_schema tables) so a Supabase driver can be
 * swapped in without touching consumers.
 */

export type Locale = "en" | "ar";

/** Per-locale SEO fields (all optional — fall back to built-in defaults). */
export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  /** URL slug (path segment) — editable only for slug-capable entities. */
  slug?: string;
  /** Absolute canonical URL; auto-derived when empty. */
  canonical?: string;
  /** Path under /uploads (or absolute URL) for the Open Graph image. */
  ogImage?: string;
};

export type PageSeo = {
  /** Stable registry key, e.g. "home", "products", "article:net-zero-2030". */
  pageKey: string;
  /** false = draft: site keeps serving defaults until published. */
  published: boolean;
  en: SeoFields;
  ar: SeoFields;
  updatedAt?: string;
};

/** Extra per-product technical/SEO data layered over lib/products.ts. */
export type ProductSeo = PageSeo & {
  productCode?: string;
  weight?: string;
  staticLoad?: string;
  dynamicLoad?: string;
  rackingLoad?: string;
};

/** Per-image SEO for gallery images (index-aligned with the manifest). */
export type ImageSeo = {
  file: string;
  published: boolean;
  en: { alt?: string; title?: string; caption?: string; category?: string; description?: string };
  ar: { alt?: string; title?: string; caption?: string; category?: string; description?: string };
};

export type Redirect = {
  id: string;
  /** Path only, e.g. "/old-page" (locale-agnostic). */
  from: string;
  to: string;
  statusCode: 301 | 302;
  createdAt: string;
};

export type RobotsRule = {
  userAgent: string;
  allow: string[];
  disallow: string[];
};

export type OrgSchema = {
  companyName: string;
  logoUrl: string;
  website: string;
  phone: string;
  email: string;
  address: { street: string; city: string; country: string };
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
    youtube?: string;
    tiktok?: string;
  };
};

export type GlobalSeo = {
  org: OrgSchema;
  favicon?: string;
  appleTouchIcon?: string;
  /** 404 page SEO. */
  notFound: { published: boolean; en: SeoFields; ar: SeoFields };
  robots: { rules: RobotsRule[]; custom: string };
};

export type CmsData = {
  version: 1;
  global: GlobalSeo;
  pages: Record<string, PageSeo>;
  products: Record<string, ProductSeo>;
  images: Record<string, ImageSeo>;
  redirects: Redirect[];
};
