import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/cms/auth";
import {
  readContentOverrides,
  writeContentOverrides,
} from "@/lib/cms/content-storage";
import type { ContentOverrides, ContentRecord } from "@/lib/cms/content-types";
import { PRODUCTS } from "@/lib/products";
import { AR_PRODUCTS } from "@/lib/products-ar";
import { INDUSTRY_MODALS } from "@/lib/industries";
import { AR_INDUSTRY_MODALS } from "@/lib/industries-ar";
import { ARTICLES } from "@/lib/articles";
import { AR_ARTICLES } from "@/lib/articles-ar";

/** Only the 12 reachable modal ids (5 process steps, 3 tech, 4 certs) —
 *  the "industries served" ind1..6 keys are dead in the current UI, so
 *  there's nothing to edit them for. See IndustriesContent.tsx. */
const REACHABLE_INDUSTRY_IDS = [
  "step1", "step2", "step3", "step4", "step5",
  "tech1", "tech2", "tech3",
  "cert1", "cert2", "cert3", "cert4",
];

export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const overrides = readContentOverrides();

  return NextResponse.json({
    products: PRODUCTS.map((p) => ({
      id: p.id,
      nameEn: p.name,
      nameAr: AR_PRODUCTS[p.id]?.name ?? p.name,
      base: {
        en: {
          name: p.name,
          shortDesc: p.shortDesc,
          description: p.description,
          material: p.material,
          dimensions: p.dimensions,
          loadCapacity: p.loadCapacity,
          colors: p.colors,
          applications: p.applications,
          features: p.features,
          availability: p.availability,
        },
        ar: { ...p, ...AR_PRODUCTS[p.id] },
      },
    })),
    industries: REACHABLE_INDUSTRY_IDS.filter((id) => INDUSTRY_MODALS[id]).map((id) => ({
      id,
      titleEn: INDUSTRY_MODALS[id].title,
      titleAr: AR_INDUSTRY_MODALS[id]?.title ?? INDUSTRY_MODALS[id].title,
      base: {
        en: INDUSTRY_MODALS[id],
        ar: { ...INDUSTRY_MODALS[id], ...AR_INDUSTRY_MODALS[id] },
      },
    })),
    articles: ARTICLES.map((a) => ({
      slug: a.slug,
      titleEn: a.title,
      titleAr: AR_ARTICLES[a.slug]?.title ?? a.title,
      base: {
        en: {
          title: a.title,
          h1: a.h1,
          description: a.description,
          bodyHtml: a.bodyHtml,
          authorBio: a.authorBio,
          prevLink: a.prevLink,
          nextLink: a.nextLink,
          relatedArticles: a.relatedArticles,
          cta: a.cta,
        },
        ar: {
          title: AR_ARTICLES[a.slug]?.title ?? a.title,
          h1: AR_ARTICLES[a.slug]?.h1 ?? a.h1,
          description: AR_ARTICLES[a.slug]?.description ?? a.description,
          bodyHtml: AR_ARTICLES[a.slug]?.bodyHtml ?? a.bodyHtml,
          authorBio: AR_ARTICLES[a.slug]?.authorBio ?? a.authorBio,
          prevLink: AR_ARTICLES[a.slug]?.prevLink ?? a.prevLink,
          nextLink: AR_ARTICLES[a.slug]?.nextLink ?? a.nextLink,
          relatedArticles: AR_ARTICLES[a.slug]?.relatedArticles ?? a.relatedArticles,
          cta: AR_ARTICLES[a.slug]?.cta ?? a.cta,
        },
      },
    })),
    overrides,
  });
}

type SaveBody =
  | { section: "product"; id: string; record: ContentRecord<ContentOverrides["products"][string]["en"]> }
  | { section: "industry"; id: string; record: ContentRecord<ContentOverrides["industries"][string]["en"]> }
  | { section: "article"; slug: string; record: ContentRecord<ContentOverrides["articles"][string]["en"]> }
  | { section: "siteContact"; record: ContentOverrides["siteContact"] };

export async function PUT(request: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json()) as SaveBody;
  const overrides = readContentOverrides();
  const next: ContentOverrides = JSON.parse(JSON.stringify(overrides)) as ContentOverrides;

  if (body.section === "product") {
    next.products[body.id] = { ...body.record, updatedAt: new Date().toISOString() };
  } else if (body.section === "industry") {
    next.industries[body.id] = { ...body.record, updatedAt: new Date().toISOString() };
  } else if (body.section === "article") {
    next.articles[body.slug] = { ...body.record, updatedAt: new Date().toISOString() };
  } else if (body.section === "siteContact") {
    next.siteContact = body.record;
  } else {
    return NextResponse.json({ error: "unknown section" }, { status: 400 });
  }

  writeContentOverrides(next);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
