import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProductsBase } from "@/lib/products-data";
import {
  getGalleryImages,
  getGalleryVideosAdmin,
  writeGalleryVideoText,
  writeGalleryImageFile,
  writeGalleryVideoThumb,
} from "@/lib/gallery-data";
import { SITE_URL } from "@/lib/site";
import { isAuthenticated } from "@/lib/cms/auth";
import { readCms, writeGlobal, writePage, writeProductSeo, writeImageSeo, writeRedirects } from "@/lib/cms/storage";
import { auditAll, auditGalleryImages, slugify } from "@/lib/cms/audit";
import { defaultSeo, pageRegistry, articleSlug } from "@/lib/cms/seo";
import type { CmsData, Redirect } from "@/lib/cms/types";

/** Full dashboard payload: data + registry + defaults + audits. */
export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const cms = await readCms();
  const registry = await pageRegistry();
  const defaults: Record<string, { en: unknown; ar: unknown }> = {};
  for (const p of registry) {
    defaults[p.pageKey] = {
      en: await defaultSeo(p.pageKey, "en"),
      ar: await defaultSeo(p.pageKey, "ar"),
    };
  }
  const productsEn = await getProductsBase("en");
  const productsAr = await getProductsBase("ar");
  const arById = new Map(productsAr.map((p) => [p.id, p]));

  return NextResponse.json({
    siteUrl: SITE_URL,
    cms,
    registry,
    defaults,
    audits: await auditAll(),
    imageIssues: await auditGalleryImages(),
    products: productsEn.slice(0, 6).map((p) => ({
      id: p.id,
      nameEn: p.name,
      nameAr: arById.get(p.id)?.name ?? p.name,
      material: p.material,
      dimensions: p.dimensions,
      loadCapacity: p.loadCapacity,
      colors: p.colors,
      applications: p.applications,
    })),
    galleryImages: {
      en: await getGalleryImages("en"),
      ar: await getGalleryImages("ar"),
    },
    galleryVideos: await getGalleryVideosAdmin(),
  });
}

type SaveBody =
  | { section: "page"; pageKey: string; record: CmsData["pages"][string] }
  | { section: "product"; id: string; record: CmsData["products"][string] }
  | { section: "image"; file: string; record: CmsData["images"][string] }
  | { section: "global"; record: CmsData["global"] }
  | { section: "redirects"; records: Redirect[] }
  | {
      section: "galleryVideo";
      id: string;
      record: { titleEn: string; descEn: string; titleAr: string; descAr: string };
    }
  | { section: "imageFile"; file: string; imageUrl: string }
  | { section: "galleryVideoThumb"; id: string; thumb: string };

/** Save one section; auto-creates slug-change redirects; revalidates site. */
export async function PUT(request: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json()) as SaveBody;

  if (body.section === "page") {
    for (const locale of ["en", "ar"] as const) {
      const rec = body.record[locale];
      if (rec.slug) rec.slug = slugify(rec.slug);
    }
    if (body.pageKey.startsWith("article:") && body.record.published) {
      const base = body.pageKey.slice(8);
      const cms = await readCms();
      const newRedirects: Redirect[] = [];
      for (const locale of ["en", "ar"] as const) {
        const oldSlug = await articleSlug(base, locale);
        const newSlug = body.record[locale].slug || base;
        if (newSlug !== oldSlug) {
          const from = `/blog/${oldSlug}`;
          if (!cms.redirects.some((r) => r.from === from)) {
            newRedirects.push({
              id: crypto.randomUUID(),
              from,
              to: `/blog/${newSlug}`,
              statusCode: 301,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
      if (newRedirects.length) {
        await writeRedirects([...cms.redirects, ...newRedirects]);
      }
    }
    body.record.updatedAt = new Date().toISOString();
    await writePage(body.pageKey, body.record);
  } else if (body.section === "product") {
    body.record.updatedAt = new Date().toISOString();
    await writeProductSeo(body.id, body.record);
  } else if (body.section === "image") {
    await writeImageSeo(body.file, body.record);
  } else if (body.section === "global") {
    await writeGlobal(body.record);
  } else if (body.section === "redirects") {
    await writeRedirects(body.records);
  } else if (body.section === "galleryVideo") {
    await writeGalleryVideoText(body.id, body.record);
  } else if (body.section === "imageFile") {
    await writeGalleryImageFile(body.file, body.imageUrl);
  } else if (body.section === "galleryVideoThumb") {
    await writeGalleryVideoThumb(body.id, body.thumb);
  } else {
    return NextResponse.json({ error: "unknown section" }, { status: 400 });
  }

  // Refresh every rendered page so published SEO goes live immediately.
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
