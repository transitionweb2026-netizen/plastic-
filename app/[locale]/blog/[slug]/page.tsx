import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import RevealObserver from "@/components/ui/RevealObserver";
import ArticleCounters from "@/components/blog/ArticleCounters";
import { ARTICLES, getArticle } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

type Params = { slug: string; locale: string };

export function generateStaticParams(): { slug: string }[] {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      images: [article.heroImg],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const article = getArticle(slug);
  if (!article) notFound();

  const pageUrl = `${SITE_URL}/blog/${article.slug}`;
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
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </div>
  );
}
