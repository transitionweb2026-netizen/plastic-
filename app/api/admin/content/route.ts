import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/cms/auth";
import {
  readContentOverrides,
  writeProductOverride,
  writeIndustryOverride,
  writeArticleOverride,
  writeSiteContact,
} from "@/lib/cms/content-storage";
import type { ContentOverrides, ContentRecord } from "@/lib/cms/content-types";
import { getProductsBase, writeProductImages } from "@/lib/products-data";
import { getIndustryModalsBase, writeIndustryImage } from "@/lib/industries-data";
import { getArticlesBase, writeArticleHeroImage } from "@/lib/articles-data";
import { productCover, productGallery } from "@/lib/products";

/** Only the 14 reachable modal ids (7 process steps, 3 tech, 4 certs) —
 *  the "industries served" ind1..6 keys are dead in the current UI, so
 *  there's nothing to edit them for. See IndustriesContent.tsx. */
const REACHABLE_INDUSTRY_IDS = [
  "step1", "step2", "step3", "step4", "step5", "step6", "step7",
  "tech1", "tech2", "tech3",
  "cert1", "cert2", "cert3", "cert4",
];

export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const overrides = await readContentOverrides();

  const productsEn = await getProductsBase("en");
  const productsAr = await getProductsBase("ar");
  const arProductById = new Map(productsAr.map((p) => [p.id, p]));

  const industriesEn = await getIndustryModalsBase("en");
  const industriesAr = await getIndustryModalsBase("ar");

  const articlesEn = await getArticlesBase("en");
  const articlesAr = await getArticlesBase("ar");
  const arArticleBySlug = new Map(articlesAr.map((a) => [a.slug, a]));

  return NextResponse.json({
    products: productsEn.map((p) => ({
      id: p.id,
      nameEn: p.name,
      nameAr: arProductById.get(p.id)?.name ?? p.name,
      image: p.image,
      coverImage: productCover(p),
      images: productGallery(p),
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
        ar: arProductById.get(p.id) ?? p,
      },
    })),
    industries: REACHABLE_INDUSTRY_IDS.filter((id) => industriesEn[id]).map((id) => ({
      id,
      titleEn: industriesEn[id].title,
      titleAr: industriesAr[id]?.title ?? industriesEn[id].title,
      image: industriesEn[id].image,
      base: {
        en: industriesEn[id],
        ar: industriesAr[id] ?? industriesEn[id],
      },
    })),
    articles: articlesEn.map((a) => {
      const ar = arArticleBySlug.get(a.slug) ?? a;
      return {
        slug: a.slug,
        titleEn: a.title,
        titleAr: ar.title,
        heroImg: a.heroImg,
        heroAlt: a.heroAlt,
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
            title: ar.title,
            h1: ar.h1,
            description: ar.description,
            bodyHtml: ar.bodyHtml,
            authorBio: ar.authorBio,
            prevLink: ar.prevLink,
            nextLink: ar.nextLink,
            relatedArticles: ar.relatedArticles,
            cta: ar.cta,
          },
        },
      };
    }),
    overrides,
  });
}

type SaveBody =
  | { section: "product"; id: string; record: ContentRecord<ContentOverrides["products"][string]["en"]> }
  | { section: "industry"; id: string; record: ContentRecord<ContentOverrides["industries"][string]["en"]> }
  | { section: "article"; slug: string; record: ContentRecord<ContentOverrides["articles"][string]["en"]> }
  | { section: "siteContact"; record: ContentOverrides["siteContact"] }
  | { section: "productImages"; id: string; image?: string; coverImage?: string; images?: string[] }
  | { section: "industryImage"; id: string; image: string }
  | { section: "articleHero"; slug: string; heroImg?: string; heroAlt?: string };

export async function PUT(request: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json()) as SaveBody;

  if (body.section === "product") {
    await writeProductOverride(body.id, { ...body.record, updatedAt: new Date().toISOString() });
  } else if (body.section === "industry") {
    await writeIndustryOverride(body.id, { ...body.record, updatedAt: new Date().toISOString() });
  } else if (body.section === "article") {
    await writeArticleOverride(body.slug, { ...body.record, updatedAt: new Date().toISOString() });
  } else if (body.section === "siteContact") {
    await writeSiteContact(body.record);
  } else if (body.section === "productImages") {
    await writeProductImages(body.id, {
      image: body.image,
      coverImage: body.coverImage,
      images: body.images,
    });
  } else if (body.section === "industryImage") {
    await writeIndustryImage(body.id, body.image);
  } else if (body.section === "articleHero") {
    await writeArticleHeroImage(body.slug, { heroImg: body.heroImg, heroAlt: body.heroAlt });
  } else {
    return NextResponse.json({ error: "unknown section" }, { status: 400 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
