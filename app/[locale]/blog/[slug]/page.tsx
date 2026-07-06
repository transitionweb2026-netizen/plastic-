import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import RevealObserver from "@/components/ui/RevealObserver";
import ArticleCounters from "@/components/blog/ArticleCounters";
import {
  ARTICLES,
  articleBodyLocalized,
  getArticle,
  localizeArticle,
} from "@/lib/articles";
import { SITE_URL } from "@/lib/site";
import {
  articleSlug,
  breadcrumbJsonLd,
  cmsMetadata,
  resolveArticleSlug,
} from "@/lib/cms/seo";

type Params = { slug: string; locale: string };

export function generateStaticParams(): { slug: string }[] {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const loc = locale as "en" | "ar";
  const baseSlug = resolveArticleSlug(slug, loc);
  if (!baseSlug) return {};
  const meta = cmsMetadata(`article:${baseSlug}`, loc);
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article" },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "en" | "ar";
  const baseSlug = resolveArticleSlug(slug, loc);
  if (!baseSlug) notFound();
  const base = getArticle(baseSlug);
  if (!base) notFound();
  const article = localizeArticle(base, locale);
  const bodyLocalized = articleBodyLocalized(baseSlug, locale);

  const urlSlug = articleSlug(baseSlug, loc);
  const pageUrl = `${SITE_URL}${locale === "en" ? "/en" : ""}/blog/${urlSlug}`;
  const bodyHtml = article.bodyHtml
    .replaceAll("__PAGE_URL__", encodeURIComponent(pageUrl))
    // keep injected legacy links inside the active locale
    .replaceAll('href="/', locale === "en" ? 'href="/en/' : 'href="/');

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.h1,
    description: article.description,
    image: article.heroImg,
    datePublished: new Date(article.date).toISOString(),
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      name: "Giant Storage Integrated Solutions",
      url: SITE_URL,
    },
  };

  return (
    <div className="page-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}${locale === "en" ? "/en" : "/"}` },
              { name: locale === "ar" ? "المدونة" : "Blog", url: `${SITE_URL}${locale === "en" ? "/en" : ""}/blog` },
              { name: article.h1, url: pageUrl },
            ])
          ),
        }}
      />
      <RevealObserver />
      {article.hasCounters && <ArticleCounters />}

      {/* Hero (legacy markup: zooming image + bottom overlay with badge/title/meta) */}
      <section className="relative h-[480px] md:h-[520px] overflow-hidden">
        <div className="hero-zoom-img absolute inset-0">
          <Image
            src={article.heroImg}
            alt={article.heroAlt || article.h1}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div dangerouslySetInnerHTML={{ __html: article.heroOverlayHtml }} />
      </section>

      {/* Article body — verbatim legacy markup (share row with fixed share
          links, stats strips, prose, prev/next, related). Injected as-is to
          preserve the original content and styling exactly. */}
      {/* Until AR_ARTICLES carries translated bodies, English bodies render
          LTR inside the RTL shell for readability. */}
      <div
        className="article-body"
        dir={bodyLocalized ? undefined : "ltr"}
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </div>
  );
}
