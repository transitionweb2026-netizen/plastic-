import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { PRODUCTS } from "@/lib/products";
import { AR_PRODUCTS } from "@/lib/products-ar";
import { galleryImages } from "@/lib/gallery";
import { SITE_URL } from "@/lib/site";
import { isAuthenticated } from "@/lib/cms/auth";
import { readCms, writeCms } from "@/lib/cms/storage";
import { auditAll, auditGalleryImages, slugify } from "@/lib/cms/audit";
import { defaultSeo, pageRegistry, articleSlug } from "@/lib/cms/seo";
import type { CmsData, Redirect } from "@/lib/cms/types";

/** Full dashboard payload: data + registry + defaults + audits. */
export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const cms = readCms();
  const registry = pageRegistry();
  const defaults: Record<string, { en: unknown; ar: unknown }> = {};
  for (const p of registry) {
    defaults[p.pageKey] = {
      en: defaultSeo(p.pageKey, "en"),
      ar: defaultSeo(p.pageKey, "ar"),
    };
  }
  return NextResponse.json({
    siteUrl: SITE_URL,
    cms,
    registry,
    defaults,
    audits: auditAll(),
    imageIssues: auditGalleryImages(),
    products: PRODUCTS.slice(0, 6).map((p) => ({
      id: p.id,
      nameEn: p.name,
      nameAr: AR_PRODUCTS[p.id]?.name ?? p.name,
      material: p.material,
      dimensions: p.dimensions,
      loadCapacity: p.loadCapacity,
      colors: p.colors,
      applications: p.applications,
    })),
    galleryImages: {
      en: galleryImages("en"),
      ar: galleryImages("ar"),
    },
  });
}

type SaveBody =
  | { section: "page"; pageKey: string; record: CmsData["pages"][string] }
  | { section: "product"; id: string; record: CmsData["products"][string] }
  | { section: "image"; file: string; record: CmsData["images"][string] }
  | { section: "global"; record: CmsData["global"] }
  | { section: "redirects"; records: Redirect[] };

/** Save one section; auto-creates slug-change redirects; revalidates site. */
export async function PUT(request: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json()) as SaveBody;
  const cms = readCms();
  const next: CmsData = JSON.parse(JSON.stringify(cms)) as CmsData;

  if (body.section === "page") {
    // sanitize slugs + auto-redirect on article slug changes
    for (const locale of ["en", "ar"] as const) {
      const rec = body.record[locale];
      if (rec.slug) rec.slug = slugify(rec.slug);
    }
    if (body.pageKey.startsWith("article:") && body.record.published) {
      const base = body.pageKey.slice(8);
      for (const locale of ["en", "ar"] as const) {
        const oldSlug = articleSlug(base, locale);
        const newSlug = body.record[locale].slug || base;
        if (newSlug !== oldSlug) {
          const from = `/blog/${oldSlug}`;
          if (!next.redirects.some((r) => r.from === from)) {
            next.redirects.push({
              id: crypto.randomUUID(),
              from,
              to: `/blog/${newSlug}`,
              statusCode: 301,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    }
    body.record.updatedAt = new Date().toISOString();
    next.pages[body.pageKey] = body.record;
  } else if (body.section === "product") {
    body.record.updatedAt = new Date().toISOString();
    next.products[body.id] = body.record;
  } else if (body.section === "image") {
    next.images[body.file] = body.record;
  } else if (body.section === "global") {
    next.global = body.record;
  } else if (body.section === "redirects") {
    next.redirects = body.records;
  } else {
    return NextResponse.json({ error: "unknown section" }, { status: 400 });
  }

  writeCms(next);
  // Refresh every rendered page so published SEO goes live immediately.
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
