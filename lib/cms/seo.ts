import "server-only";
import type { Metadata } from "next";
import { getArticles, getArticleSlugs } from "@/lib/articles-data";
import { getProductsBase } from "@/lib/products-data";
import { SITE_URL } from "@/lib/site";
import { CONTACT, SOCIAL_LINKS, LOGO_SRC_DEFAULT } from "@/lib/nav";
import { messagesFromDb } from "./translations-storage";
import { readCms } from "./storage";
import { findRedirect } from "./redirects";
import type { Locale, OrgSchema, PageSeo, SeoFields } from "./types";

/* ─────────────────────────── Page registry ───────────────────────────
 * Every public surface gets a stable pageKey. Static routes keep their
 * structural paths (slug not editable — like core pages in Yoast/RankMath);
 * article slugs ARE editable per locale via the CMS. */

export type RegistryEntry = {
  pageKey: string;
  /** Route path without locale prefix; articles use the base slug. */
  path: string;
  label: string;
  group: "Core" | "Blog" | "Products" | "Legal" | "System";
  slugEditable: boolean;
};

const STATIC_PAGES: Omit<RegistryEntry, "pageKey">[] = [
  { path: "/", label: "Home", group: "Core", slugEditable: false },
  { path: "/products", label: "Products", group: "Core", slugEditable: false },
  { path: "/industries", label: "Industries", group: "Core", slugEditable: false },
  { path: "/gallery", label: "Gallery", group: "Core", slugEditable: false },
  { path: "/blog", label: "Blog", group: "Blog", slugEditable: false },
  { path: "/about", label: "About Us", group: "Core", slugEditable: false },
  { path: "/contact", label: "Contact", group: "Core", slugEditable: false },
  { path: "/request-quote", label: "Request Quote", group: "Core", slugEditable: false },
  { path: "/privacy-policy", label: "Privacy Policy", group: "Legal", slugEditable: false },
  { path: "/terms-of-service", label: "Terms of Service", group: "Legal", slugEditable: false },
];

const STATIC_KEY_BY_PATH: Record<string, string> = {
  "/": "home",
  "/products": "products",
  "/industries": "industries",
  "/gallery": "gallery",
  "/blog": "blog",
  "/about": "about",
  "/contact": "contact",
  "/request-quote": "quote",
  "/privacy-policy": "privacy",
  "/terms-of-service": "terms",
};

export async function pageRegistry(): Promise<RegistryEntry[]> {
  const fixed = STATIC_PAGES.map((p) => ({
    ...p,
    pageKey: STATIC_KEY_BY_PATH[p.path],
  }));
  const articles = await getArticles("en");
  const articleEntries = articles.map((a) => ({
    pageKey: `article:${a.slug}`,
    path: `/blog/${a.slug}`,
    label: `Article — ${a.title}`,
    group: "Blog" as const,
    slugEditable: true,
  }));
  return [...fixed, ...articleEntries];
}

/* ─────────────────────────── Defaults ─────────────────────────── */

/** Built-in SEO values (what the site currently ships, pre-CMS-override):
 *  page titles/descriptions come from the live translations table (so a
 *  Translations-tab edit to e.g. "meta.home.title" is reflected here too),
 *  falling back further to the SEO tab override only if published. */
export async function defaultSeo(
  pageKey: string,
  locale: Locale
): Promise<Required<Pick<SeoFields, "metaTitle" | "metaDescription">> & SeoFields> {
  if (pageKey.startsWith("article:")) {
    const slug = pageKey.slice("article:".length);
    const article = (await getArticles(locale)).find((a) => a.slug === slug);
    return {
      metaTitle: article?.title ?? "",
      metaDescription: article?.description ?? "",
      slug,
      ogImage: article?.heroImg,
    };
  }
  const messages = await messagesFromDb(locale);
  const meta = (messages.meta ?? {}) as Record<string, { title: string; description: string } | string>;
  const ns = meta[pageKey] as { title: string; description: string } | undefined;
  return {
    metaTitle: ns?.title ?? "",
    metaDescription: ns?.description ?? "",
  };
}

/* ─────────────────────────── Effective values ─────────────────────────── */

function published(rec?: PageSeo): PageSeo | undefined {
  return rec && rec.published ? rec : undefined;
}

export async function effectiveSeo(
  pageKey: string,
  locale: Locale
): Promise<SeoFields & { metaTitle: string; metaDescription: string }> {
  const cms = published((await readCms()).pages[pageKey])?.[locale] ?? {};
  const dft = await defaultSeo(pageKey, locale);
  return {
    metaTitle: cms.metaTitle?.trim() || dft.metaTitle,
    metaDescription: cms.metaDescription?.trim() || dft.metaDescription,
    slug: cms.slug?.trim() || dft.slug,
    canonical: cms.canonical?.trim() || undefined,
    ogImage: cms.ogImage || dft.ogImage,
  };
}

/** Localized article slug (CMS override falls back to the base slug). */
export async function articleSlug(baseSlug: string, locale: Locale): Promise<string> {
  return (await effectiveSeo(`article:${baseSlug}`, locale)).slug || baseSlug;
}

/** Resolve an incoming article URL slug to the base slug, per locale. */
export async function resolveArticleSlug(rawUrlSlug: string, locale: Locale): Promise<string | undefined> {
  // Route params arrive percent-encoded — decode so non-ASCII (Arabic) slug
  // overrides compare correctly against their stored plain-text form.
  let urlSlug = rawUrlSlug;
  try {
    urlSlug = decodeURIComponent(rawUrlSlug);
  } catch {
    /* malformed escape sequence — fall through with the raw value */
  }
  const slugs = await getArticleSlugs();
  for (const base of slugs) {
    if ((await articleSlug(base, locale)) === urlSlug || base === urlSlug) return base;
  }
  // Cross-locale fallback: in-content links (prev/next, related, body) and
  // shared URLs sometimes carry the OTHER locale's slug override — serve the
  // article instead of 404ing; canonical tags still point at the right slug.
  const other: Locale = locale === "ar" ? "en" : "ar";
  for (const base of slugs) {
    if ((await articleSlug(base, other)) === urlSlug) return base;
  }
  return undefined;
}

function localePath(path: string, locale: Locale): string {
  return locale === "en" ? (path === "/" ? "/en" : `/en${path}`) : path;
}

/**
 * Build Next Metadata for a page from CMS + defaults: title, description,
 * canonical (deduped, auto-derived when not set), hreflang alternates, and
 * OG image/title/description. One call per page = no duplicate tags.
 */
export async function cmsMetadata(pageKey: string, locale: Locale, pathOverride?: string): Promise<Metadata> {
  const seo = await effectiveSeo(pageKey, locale);
  const entry = (await pageRegistry()).find((p) => p.pageKey === pageKey);
  const basePath = pathOverride ?? entry?.path ?? "/";
  const arPath = pageKey.startsWith("article:") ? `/blog/${await articleSlug(pageKey.slice(8), "ar")}` : basePath;
  const enPath = pageKey.startsWith("article:") ? `/blog/${await articleSlug(pageKey.slice(8), "en")}` : basePath;
  const canonical =
    seo.canonical || `${SITE_URL}${localePath(locale === "ar" ? arPath : enPath, locale)}`;

  const og = seo.ogImage
    ? [seo.ogImage.startsWith("http") ? seo.ogImage : `${SITE_URL}${seo.ogImage}`]
    : undefined;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: {
      canonical,
      languages: {
        ar: `${SITE_URL}${localePath(arPath, "ar")}`,
        en: `${SITE_URL}${localePath(enPath, "en")}`,
        "x-default": `${SITE_URL}${localePath(arPath, "ar")}`,
      },
    },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      ...(og ? { images: og } : {}),
    },
  };
}

/* ─────────────────────────── Global / org ─────────────────────────── */

export async function orgSettings(): Promise<OrgSchema> {
  const cms = (await readCms()).global.org;
  return {
    companyName: cms.companyName || "Giant Storage Integrated Solutions",
    logoUrl: cms.logoUrl || LOGO_SRC_DEFAULT,
    website: cms.website || SITE_URL,
    phone: cms.phone || CONTACT.phoneMain.display,
    email: cms.email || CONTACT.email,
    address: {
      street: cms.address.street || "22 El Tayaran St., Nasr City",
      city: cms.address.city || "Cairo",
      country: cms.address.country || "EG",
    },
    social: Object.keys(cms.social).length
      ? cms.social
      : Object.fromEntries(SOCIAL_LINKS.map((s) => [s.brand, s.href])),
  };
}

/** Organization JSON-LD, CMS-driven (single source — rendered once in layout). */
export async function organizationJsonLd() {
  const org = await orgSettings();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.companyName,
    url: org.website,
    logo: org.logoUrl,
    email: org.email,
    telephone: org.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address.street,
      addressLocality: org.address.city,
      addressCountry: org.address.country,
    },
    sameAs: Object.values(org.social).filter(Boolean),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/* ─────────────────────────── Gallery image SEO ─────────────────────────── */

export async function galleryImageSeo(file: string, locale: Locale) {
  const rec = (await readCms()).images[file];
  if (!rec || !rec.published) return undefined;
  return rec[locale];
}

export function galleryImageJsonLd(locale: Locale, images: { src: string; alt: string; caption: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: locale === "ar" ? "معرض جاينت ستوريدج" : "Giant Storage Gallery",
    image: images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: img.src.startsWith("http") ? img.src : `${SITE_URL}${img.src}`,
      name: img.caption,
      description: img.alt,
    })),
  };
}

/* ─────────────────────────── Product SEO / schema ─────────────────────────── */

export async function productJsonLd(locale: Locale) {
  const cms = await readCms();
  const org = await orgSettings();
  const visible = (await getProductsBase(locale)).slice(0, 6);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: visible.map((loc, i) => {
      const extra = cms.products[String(loc.id)];
      const pub = extra && extra.published ? extra : undefined;
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: pub?.[locale]?.metaTitle || loc.name,
          description: pub?.[locale]?.metaDescription || loc.shortDesc,
          sku: pub?.productCode || undefined,
          material: loc.material,
          weight: pub?.weight || undefined,
          brand: { "@type": "Brand", name: org.companyName },
          additionalProperty: [
            { "@type": "PropertyValue", name: "Dimensions", value: loc.dimensions },
            { "@type": "PropertyValue", name: "Load Capacity", value: loc.loadCapacity },
            ...(pub?.staticLoad
              ? [{ "@type": "PropertyValue", name: "Static Load", value: pub.staticLoad }]
              : []),
            ...(pub?.dynamicLoad
              ? [{ "@type": "PropertyValue", name: "Dynamic Load", value: pub.dynamicLoad }]
              : []),
            ...(pub?.rackingLoad
              ? [{ "@type": "PropertyValue", name: "Racking Load", value: pub.rackingLoad }]
              : []),
          ],
        },
      };
    }),
  };
}

/* ─────────────────────────── 404 / favicon / robots / redirects ─────────────────────────── */

export async function notFoundSeo(locale: Locale) {
  const g = (await readCms()).global.notFound;
  const cms = g.published ? g[locale] : {};
  const fallback =
    locale === "ar"
      ? { metaTitle: "الصفحة غير موجودة", metaDescription: "الصفحة التي تبحث عنها غير موجودة." }
      : { metaTitle: "Page Not Found", metaDescription: "The page you are looking for does not exist." };
  return {
    metaTitle: cms.metaTitle || fallback.metaTitle,
    metaDescription: cms.metaDescription || fallback.metaDescription,
    ogImage: cms.ogImage,
  };
}

export async function faviconLinks() {
  const g = (await readCms()).global;
  return { favicon: g.favicon, appleTouchIcon: g.appleTouchIcon };
}

export { findRedirect };
