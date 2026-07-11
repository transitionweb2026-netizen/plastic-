import type { Metadata } from "next";
import { cmsMetadata } from "@/lib/cms/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RackOutline, CircuitLines } from "@/components/ui/DecorArt";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import RevealObserver from "@/components/ui/RevealObserver";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { getArticles } from "@/lib/articles-data";
import { siteImage } from "@/lib/cms/images-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return cmsMetadata("blog", locale as "en" | "ar");
}

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAcPMNwGE1bKWNaxncsX8vguDLGBzb6mHxljOIWBIQfY54ECIbO6Jr5uNXH_2cYqbiwkVxl8LoPWz01Sr4FEwQkdYOoyJzOmLbH-dust81lmyCbBv4ftAyfeXNbK4e4xe8Aeius_CZgI0p9_Ag61H4ylBWqi4CgwGF3e8EdSzKc-vOuSTDlQniT0Xw47wauaFbsPBm1hIrNjzf1r2SQ1NcDyukNsZlZSP5YgxEv5IE68RuFARFzROEtWG514_5N_Ii3Qe31tLoqhNQ";

const RECENT_ARTICLE_META = [
  { href: "/blog/net-zero-2030", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhOM_ZjQqp8NJDoi3TNAvcIdLUaAQ_ri_gcyBDD-xY0k2iO845ekZDNRcTLjA3ywaMyoXSbjseHsWl0wnoL6Llm5IU-w8Jse3BJ9ZmyTP-bkKvf2IlpIdJRciAU8R9XZKMvuVXIbECxOsCD4Dbft9KWCVkWGwJIXYkBEebjogwT646gqGWF9yJP1RGROkfOJa9U4Io-G751y7aB8lnVJ3c3IzrUAUjhXzH4nOOgUGBELGPEdR33mialt8zDm4fkln6tYm8-ZdpHfE", key: "art1", delay: "d1" },
  { href: "/blog/urban-fulfillment", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNPxQPmmNYVdxT76yKC5NKNvGeB48Yvcy0rl9G-sDkDPLCYXmAxU9F2gv1fxCj_fMW8cmA6Z7pR-9TamLGlTXv9lXR7AbYHpBAAzvs_DlYeXE3Qi6YX32FqBS1zKXAysb0VhryyE7uaMEyS5sN7JYozlOi2FeoMDJEfuk97fTNl8PpS0UoOHtEVzZRObvMx1n7h-nbdiDjHO6iDKTPbrwDXAxDrGePe0PAPtOXAEX4y_sjp1jFelUdDUEu0T2VkHr8SecHPxIXZGc", key: "art2", delay: "d2" },
  { href: "/blog/southeast-asia", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB33hTy7fYKCExhmtTn0k_-HKmx_UcrBf8Xwmv2i5rx3djejhVbzzsrQiDl5fegvJJYvCNKiYdSK14zuQ_dUDZ49TtEdA46-VBDErjJay49wo2wxSDCGC8krTJkV7xCOFbY06N3ir2O7av1SEGGOYS1YlvEEZ6vV-d-etUVv5Z6QmPJ6QcSyCfla4LsgBuPM_jcNX04psJfTi0RUiStiDNwEOHfrYn2n-ayFh6a6ueJOT1xeNaE_TLO018jWTFzwSV0WORcvkNUZQI", key: "art3", delay: "d3" },
];

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blogPage");

  // Card Image (falling back to Hero Image when unset) always wins over the
  // legacy hardcoded thumbnails above — see the Articles CMS "Card image"
  // field. Text/copy here stays translation-driven, untouched.
  const articlesBySlug = new Map(
    (await getArticles(locale)).map((a) => [a.slug, a.cardImage])
  );
  const featuredCardImage = articlesBySlug.get("high-density-storage") ?? HERO_IMG;
  const pageHeroImg = await siteImage("blog.hero", HERO_IMG);
  const recentArticles = RECENT_ARTICLE_META.map((a) => ({
    ...a,
    img: articlesBySlug.get(a.href.replace("/blog/", "")) ?? a.img,
    tag: t(`${a.key}Tag`),
    title: t(`${a.key}Title`),
    desc: t(`${a.key}Desc`),
    alt: t(`${a.key}Alt`),
    date: t(`${a.key}Date`),
    read: t(`${a.key}Read`),
  }));

  return (
    <div className="page-blog">
      <RevealObserver />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[620px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="hero-bg relative w-full h-full">
            <Image
              src={pageHeroImg}
              alt={t("heroAlt")}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
        <div className="absolute top-12 right-[8%] w-20 h-20 border-2 border-white/15 rounded-full float-el hidden lg:block" />
        <div
          className="absolute bottom-16 right-[22%] w-12 h-12 border border-white/10 rounded-xl rotate-12 float-el hidden lg:block"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative z-10 w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto py-24">
          <div className="max-w-3xl">
            <span className="hero-text-1 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                auto_stories
              </span>
              {t("heroBadge")}
            </span>
            <h1
              className="hero-text-2 font-black text-white mb-6 leading-[1.08]"
              style={{
                fontSize: "clamp(2rem,5vw,3.6rem)",
                letterSpacing: "-.02em",
              }}
            >
              {t("heroTitle1")}
              <br />
              <span style={{ color: "#92d5a6" }}>{t("heroTitle2")}</span>
            </h1>
            <p className="hero-text-3 text-white/80 text-lg mb-10 max-w-2xl leading-relaxed">
              {t("heroPara")}
            </p>
            <div className="hero-text-4 flex flex-wrap gap-4">
              <a href="#featured" className="btn-primary">
                {t("readLatest")}{" "}
                <span className="material-symbols-outlined arr" style={{ fontSize: 18 }}>
                  arrow_downward
                </span>
              </a>
              <a href="#newsletter" className="btn-outline">
                {t("subscribe")}{" "}
                <span className="material-symbols-outlined arr rtl-flip" style={{ fontSize: 18 }}>
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED ARTICLE ═══ */}
      <section className="relative overflow-hidden py-20 bg-surface" id="featured">
        <div aria-hidden className="decor-orb absolute -top-28 -right-28 w-96 h-96" />
        <div aria-hidden className="decor-corner-tl absolute top-8 left-4 md:left-8 hidden md:block" />
        <RackOutline className="decor-breathe absolute -bottom-6 -left-8 w-[260px] hidden xl:block" />
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="flex items-center gap-4 mb-10 reveal">
            <div className="h-px flex-1 bg-outline-variant" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {t("featuredLabel")}
            </span>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>
          <Link
            href="/blog/high-density-storage"
            className="feat-card block md:grid md:grid-cols-2 reveal d1"
          >
            <div className="h-72 md:h-auto overflow-hidden relative">
              <Image
                className="feat-img object-cover"
                src={featuredCardImage}
                alt={t("featAlt")}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 md:p-14 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {t("featTag")}
                </span>
                <span className="text-on-surface-variant text-xs font-semibold">
                  {t("featRead")}
                </span>
              </div>
              <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-surface mb-5 leading-tight">
                {t("featTitle")}
              </h2>
              <p className="text-on-surface-variant text-base leading-relaxed mb-8 line-clamp-3">
                {t("featDesc")}
              </p>
              <div className="flex items-center justify-end">
                <span className="flex items-center gap-1 text-primary text-sm font-bold">
                  {t("readArticle")}{" "}
                  <span className="material-symbols-outlined rtl-flip" style={{ fontSize: 16 }}>
                    arrow_forward
                  </span>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══ LATEST UPDATES ═══ */}
      <section className="relative overflow-hidden py-20 bg-surface-container-low dot-bg" id="updates">
        <CircuitLines className="absolute -bottom-4 right-6 w-[300px] hidden lg:block" />
        <div aria-hidden className="decor-ring-static decor-scroll-rotate absolute top-10 -right-12 w-36 h-36 hidden xl:block" />
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="flex justify-between items-end mb-12">
            <div className="reveal">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                {t("updatesLabel")}
              </p>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">
                {t("updatesTitle")}
              </h3>
              <div className="h-1 w-16 bg-primary rounded-full mt-3" />
            </div>
            <a
              href="#featured"
              className="hidden md:flex items-center gap-2 text-primary font-bold text-sm group reveal"
            >
              {t("viewAll")}{" "}
              <span
                className="material-symbols-outlined rtl-flip group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
                style={{ fontSize: 18 }}
              >
                arrow_forward
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {recentArticles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className={`art-card reveal ${article.delay}`}
              >
                <div className="h-52 overflow-hidden relative">
                  <Image
                    className="card-img object-cover"
                    src={article.img}
                    alt={article.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-7 flex flex-col flex-grow">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider mb-3 block">
                    {article.tag}
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-3 leading-snug flex-grow">
                    {article.title}
                  </h4>
                  <p className="text-on-surface-variant text-sm mb-5 line-clamp-2">
                    {article.desc}
                  </p>
                  <div className="flex justify-between items-center text-xs text-on-surface-variant mt-auto">
                    <span className="font-medium">{article.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="bg-surface-container px-2.5 py-1 rounded-full font-semibold">
                        {article.read}
                      </span>
                      <span
                        className="material-symbols-outlined bookmark-btn cursor-pointer"
                        style={{ fontSize: 20 }}
                        aria-hidden
                      >
                        bookmark
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="py-24 bg-primary relative overflow-hidden" id="newsletter">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 50%,rgba(255,255,255,.5) 0%,transparent 55%),radial-gradient(circle at 85% 50%,rgba(255,255,255,.3) 0%,transparent 55%)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"
          style={{ animation: "floatY 10s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 float-el"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-container-max-width mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop text-center">
          <span className="reveal inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              mail
            </span>
            {t("nlBadge")}
          </span>
          <h2
            className="reveal d1 font-black text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(1.75rem,4vw,3rem)", letterSpacing: "-.02em" }}
          >
            {t("nlTitle")}
          </h2>
          <p className="reveal d2 text-white/75 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("nlPara")}
          </p>
          <div className="reveal d2 flex flex-wrap justify-center gap-6 mb-10">
            {[t("check1"), t("check2"), t("check3")].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-white/70 text-sm"
                >
                  <span
                    className="material-symbols-outlined text-white/50"
                    style={{
                      fontSize: 16,
                      fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24",
                    }}
                  >
                    check_circle
                  </span>
                  {item}
                </div>
              )
            )}
          </div>
          <NewsletterForm />
          <p className="reveal d4 text-white/40 text-xs mt-4">
            {t("nlAgree")}{" "}
            <Link href="/privacy-policy" className="underline hover:text-white/70 transition-colors">
              {t("nlPrivacy")}
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
