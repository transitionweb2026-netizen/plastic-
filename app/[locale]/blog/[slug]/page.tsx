import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import RevealObserver from "@/components/ui/RevealObserver";
import { CornerAccent, HexOutline } from "@/components/ui/DecorArt";
import ArticleCounters from "@/components/blog/ArticleCounters";
import CopyLinkButton from "@/components/blog/CopyLinkButton";
import { getArticle, getArticles, articleBodyLocalized, getArticleSlugs } from "@/lib/articles-data";
import { SITE_URL } from "@/lib/site";
import {
  articleSlug,
  breadcrumbJsonLd,
  cmsMetadata,
  resolveArticleSlug,
} from "@/lib/cms/seo";

type Params = { slug: string; locale: string };

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const loc = locale as "en" | "ar";
  const baseSlug = await resolveArticleSlug(slug, loc);
  if (!baseSlug) return {};
  const meta = await cmsMetadata(`article:${baseSlug}`, loc);
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
  const t = await getTranslations("articlePage");
  const baseSlug = await resolveArticleSlug(slug, loc);
  if (!baseSlug) notFound();
  const article = await getArticle(baseSlug, locale);
  if (!article) notFound();
  const bodyLocalized = await articleBodyLocalized(baseSlug, locale);

  // Related-article thumbnails always mirror the linked article's own Card
  // Image (falling back to its Hero Image) — same single Card Image system
  // used everywhere else, not a separately curated field. Falls back to the
  // stored r.img only if the href doesn't resolve to a known article.
  const cardImageBySlug = new Map(
    (await getArticles(locale)).map((a) => [a.slug, a.cardImage])
  );

  const urlSlug = await articleSlug(baseSlug, loc);
  const pageUrl = `${SITE_URL}${locale === "en" ? "/en" : ""}/blog/${urlSlug}`;
  const bodyHtml = article.bodyHtml.replaceAll(
    'href="/',
    locale === "en" ? 'href="/en/' : 'href="/'
  );

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
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-12 max-w-4xl mx-auto">
          <span
            className="hero-animate inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ animationDelay: ".1s" }}
          >
            {article.heroBadge}
          </span>
          <h1
            className="hero-animate font-black text-white leading-tight mb-4"
            style={{ fontSize: "clamp(1.6rem,4vw,2.75rem)", letterSpacing: "-.02em", animationDelay: ".25s" }}
          >
            {article.h1}
          </h1>
          <div
            className="hero-animate flex flex-wrap items-center gap-3 text-white/70 text-sm"
            style={{ animationDelay: ".4s" }}
          >
            <span>{article.readTime}</span>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 md:px-10 py-16">
        {/* Back + Share */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 pb-8 border-b border-outline-variant">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_back
            </span>{" "}
            {t("backToBlog")}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-on-surface-variant font-semibold">
              {t("shareLabel")}
            </span>
            <button className="share-btn bg-[#1877f2] text-white">
              {t("shareFacebook")}
            </button>
            <button className="share-btn bg-[#0a66c2] text-white">
              {t("shareLinkedIn")}
            </button>
            <CopyLinkButton label={t("copyLink")} copiedLabel={t("copied")} />
          </div>
        </div>

        {/* Article body — the true prose, fully rich-text editable via the
            admin Content tab. Until AR_ARTICLES/CMS carries a translated
            bodyHtml, English prose renders LTR inside the RTL shell. */}
        <div
          className="prose-content"
          dir={bodyLocalized ? undefined : "ltr"}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {article.showBottomShare && (
          <div className="mt-10 pt-8 border-t border-outline-variant flex flex-wrap gap-3 items-center reveal">
            <span className="text-sm font-bold text-on-surface">
              {t("shareAgainLabel")}
            </span>
            <button className="share-btn bg-[#1877f2] text-white">
              {t("shareFacebook")}
            </button>
            <button className="share-btn bg-[#0a66c2] text-white">
              {t("shareLinkedIn")}
            </button>
            <button className="share-btn bg-[#1da1f2] text-white">
              {t("shareTwitter")}
            </button>
            <CopyLinkButton label={t("copyLink")} copiedLabel={t("copied")} />
          </div>
        )}

        {/* Prev / Next */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 reveal">
          {article.prevLink.disabled || !article.prevLink.href ? (
            <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant opacity-40 cursor-not-allowed">
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                {article.prevLink.label}
              </p>
              <p className="text-sm text-on-surface-variant">{article.prevLink.title}</p>
            </div>
          ) : (
            <Link
              href={article.prevLink.href}
              className="p-5 bg-surface-container-low rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all"
            >
              <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                {article.prevLink.label}
              </p>
              <p className="text-sm font-semibold text-on-surface">{article.prevLink.title}</p>
            </Link>
          )}
          {article.nextLink.disabled || !article.nextLink.href ? (
            <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant opacity-40 cursor-not-allowed">
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                {article.nextLink.label}
              </p>
              <p className="text-sm text-on-surface-variant">{article.nextLink.title}</p>
            </div>
          ) : (
            <Link
              href={article.nextLink.href}
              className="p-5 bg-surface-container-low rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all text-right"
            >
              <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                {article.nextLink.label}
              </p>
              <p className="text-sm font-semibold text-on-surface">{article.nextLink.title}</p>
            </Link>
          )}
        </div>
      </main>

      {/* Related */}
      {article.relatedArticles.length > 0 && (
        <section className="py-16 bg-surface-container-low relative overflow-hidden">
          <CornerAccent corner="tl" className="absolute top-6 left-6 hidden md:block" />
          <HexOutline className="absolute -bottom-10 -right-10 w-56 hidden lg:block" opacity={0.04} />
          <div className="max-w-4xl mx-auto px-6 md:px-10 relative">
            <h2 className="font-bold text-xl text-on-surface mb-8 reveal">
              {t("relatedArticlesHeading")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {article.relatedArticles.map((r, i) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className={`art-related reveal d${i + 1}`}
                >
                  <Image
                    src={cardImageBySlug.get(r.href.replace("/blog/", "")) ?? r.img}
                    alt=""
                    width={400}
                    height={144}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-primary text-xs font-bold uppercase mb-1">
                      {r.category}
                    </p>
                    <p className="font-semibold text-sm text-on-surface leading-snug">
                      {r.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      {article.cta && (
        <section className="py-16 bg-primary text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%,rgba(255,255,255,.4) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(255,255,255,.3) 0%,transparent 50%)",
            }}
          />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-float-slow" />
          <div className="max-w-3xl mx-auto px-6 text-center reveal relative">
            <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              {article.cta.badge}
            </span>
            <h2
              className="font-black text-3xl md:text-4xl mb-4"
              style={{ letterSpacing: "-.02em" }}
            >
              {article.cta.title}
            </h2>
            <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
              {article.cta.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={article.cta.button1Href}>
                <button
                  className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:-translate-y-1 transition-all"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}
                >
                  {article.cta.button1Text}
                </button>
              </Link>
              <Link href={article.cta.button2Href}>
                <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all">
                  {article.cta.button2Text}
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
