import type { Metadata } from "next";
import { cmsMetadata } from "@/lib/cms/seo";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CursorGlow from "@/components/ui/CursorGlow";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import RevealObserver from "@/components/ui/RevealObserver";
import SectionSeparator from "@/components/ui/SectionSeparator";
import AboutImageParallax from "@/components/home/AboutImageParallax";
import StatsSection from "@/components/home/StatsSection";
import VideoSection from "@/components/home/VideoSection";
import SocialIcon from "@/components/ui/SocialIcon";
import {
  PalletBlueprint,
  CircuitLines,
  DimensionLine,
  RackOutline,
} from "@/components/ui/DecorArt";
import { Link } from "@/i18n/navigation";
import { CONTACT, SOCIAL_LINKS } from "@/lib/nav";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return cmsMetadata("home", locale as "en" | "ar");
}

const HERO_BG = "/images/home-hero.webp";
const ABOUT_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1kpyOH_iWnAUZX8-RTg76vb4zbqZ4iP47eRO4mAHmjwp8dQT9IjGWzmq3jAk1XItktWoHE2kkRymnoB8jRwEF4INzD_7Y2_PS0wkkt2233pj6Cz9JkXj3BxSe5K8ACtSTQmkDyuSITv8x1zJU36sRXWuIra4y1GQvE65kh5Gl3-t_Jexsy5tuaIfv6WV1mPWHSubrOuhaDGrJogMrTJo1DbZUIwZkcslAGl68yoW_YUy4dDTlqTz7nBcucm11d95hnYR5zJFHvz8";

/* Five of the legacy Wikimedia logo URLs had gone dead (404/400/429);
   replaced with the current Commons file locations (verified 200). */
const CLIENT_LOGOS = [
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", alt: "Amazon" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/09/Grupo_Carrefour_Brasil_logo.svg", alt: "Carrefour" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/9/91/Lidl-Logo.svg", alt: "Lidl" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg", alt: "Dell" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Airbus_Logo_2017.svg", alt: "Airbus" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/50/Nestle_textlogo_blue.svg", alt: "Nestlé" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/8/87/Unilever_text_logo.svg", alt: "Unilever" },
];

const CATEGORY_IMAGES = {
  cat1: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF7K_7bxI6zZEwCDg0qwrfYNZTQ6cd4O6D1ZlTJErRG9xY4mE0_JUMGJVBZapnc1bGbgWKyN_gYKtmM7IjTLqPKHTuj81b4SV72jPsX1pUfu7Nw5pFvkzRLcGBwOHx67pmEtiOGBNCK4tyebHi3mk9cEQsvSkqoBi2o7Q35EQ5WdF8v92AYzQprZKNQ0ZA2xrcQS5caPRGT_JOgy6CVsfmYf1m6aoVB5_ODkjHhYhIrAz96Su8peHEkWLB_KXyT-NBw-Gg8CVQYug",
  cat2: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq5RaPEnQ-nVljl3gMJjyk9Ci9IB2ANDnUZlM8YoMBkLBrWL1jAa3576FGEca3sFj68a1EXm6xqzhc2K62Oti6UOMG_rYwJ00rvrOgWSgHqo0WUYE7lAwAPfJEcChweyaHmU-juKmHArlQl51D7ioeazXCnItYwd6Rha06-AM0WdGdNPgBR6UDYS0VgBtUs6U9t5OQ8t62lXf0O9DkPVHr0MDGjAeswNL4M45mES3t0W9jFzyKkpKhXWxdoZ0EtNhFnnKtLqONpas",
  cat3: "https://lh3.googleusercontent.com/aida-public/AB6AXuAi7lX7MXKrbHrWBmmjBIrDOr-GkiDn11wjBI-4tJzzLTByVB4pLWgl03p7OzrUAv1z55KSeIbovkI1iGr1KPXaL8GtfZ3d5msswFDWb4Q7ypGNNjOorErYM85QzZdecEFaizTGKtW5V8Tj_RlLbpnLGqmrmy_IuXDAqUh379HVhVEgk-r3wsUg-lv_J_WMFfTWGa4wsaPX1e0Tn1wGhisKLuIdFP96aqybf2Zq01F-wI8Wbk6qbUubNsum4rTk2kX4KRwzRj5kjtQ",
  cat4: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGXe8LA-bga17T9a2Vpsftq01DixGiLApBkzi6tmzwh1obOx6MwKMYUXla6REnQ00qhqHmrjWZ7pND_dnNW2uNdBgrZgflIMhMeOmOS6O3Ja0LGsD8-kfHveDxjoIbbFbYeylVw4VhvGxeybduhOz0H2_ZDxOG9_PPJJ78iBYqY9uBR4DAdi5_aH5XIoPJecGr4OHNBne3SamwVIFBwwHbPvHuE9Wt-YPPYVgzbI_qnpXtA8vneiWXgHSZwn2Ba7ycKwaClD7Iv-s",
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tw = await getTranslations("widget");

  const productCategories = [
    {
      span: "md:col-span-7",
      stagger: "stagger-1",
      img: CATEGORY_IMAGES.cat1,
      title: t("cat1Title"),
      titleClass: "font-headline-lg text-headline-lg",
      desc: t("cat1Desc"),
      descClass: "max-w-md",
      cta: t("cat1Cta"),
      href: "/products",
      ctaStyle: "solid" as const,
    },
    {
      span: "md:col-span-5",
      stagger: "stagger-2",
      img: CATEGORY_IMAGES.cat2,
      title: t("cat2Title"),
      titleClass: "font-headline-lg text-headline-lg",
      desc: t("cat2Desc"),
      descClass: "",
      cta: t("cat2Cta"),
      href: "/industries",
      ctaStyle: "solid" as const,
    },
    {
      span: "md:col-span-4",
      stagger: "stagger-3",
      img: CATEGORY_IMAGES.cat3,
      title: t("cat3Title"),
      titleClass: "font-headline-md text-headline-md",
      desc: "",
      descClass: "",
      cta: t("cat3Cta"),
      href: "/blog",
      ctaStyle: "underline" as const,
    },
    {
      span: "md:col-span-8",
      stagger: "stagger-4",
      img: CATEGORY_IMAGES.cat4,
      title: t("cat4Title"),
      titleClass: "font-headline-lg text-headline-lg",
      desc: t("cat4Desc"),
      descClass: "",
      cta: t("cat4Cta"),
      href: "/gallery",
      ctaStyle: "solid" as const,
    },
  ];

  const features = [
    { icon: "verified_user", title: t("feat1Title"), desc: t("feat1Desc"), stagger: "stagger-1" },
    { icon: "public", title: t("feat2Title"), desc: t("feat2Desc"), stagger: "stagger-2" },
    { icon: "eco", title: t("feat3Title"), desc: t("feat3Desc"), stagger: "stagger-3" },
  ];

  const certifications = [
    { icon: "workspace_premium", title: t("cert1Title"), desc: t("cert1Desc"), stagger: "stagger-1" },
    { icon: "health_and_safety", title: t("cert2Title"), desc: t("cert2Desc"), stagger: "stagger-2" },
    { icon: "eco", title: t("cert3Title"), desc: t("cert3Desc"), stagger: "stagger-3" },
    { icon: "verified", title: t("cert4Title"), desc: t("cert4Desc"), stagger: "stagger-4" },
  ];

  return (
    <>
      <CursorGlow />
      <ScrollProgressBar />
      <RevealObserver />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[600px] md:h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="hero-bg relative w-full h-full">
            <Image
              src={HERO_BG}
              alt={t("heroTitle")}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-on-background/78 via-on-background/42 to-transparent" />
        </div>

        <div className="hero-geo hero-geo-1 hidden lg:block" />
        <div className="hero-geo hero-geo-2 hidden lg:block" />
        <div className="hero-geo hero-geo-3 hidden lg:block" />

        <div className="relative z-10 w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="max-w-2xl text-on-primary">
            <span className="hero-badge inline-flex items-center gap-2 bg-on-primary/10 backdrop-blur-md border border-on-primary/15 text-on-primary px-4 py-2 rounded-full font-bold text-label-sm uppercase tracking-widest mb-5">
              <span
                className="material-symbols-outlined text-inverse-primary"
                style={{ fontSize: 16 }}
              >
                location_on
              </span>
              {t("heroBadge")}
            </span>
            <h1 className="hero-title font-display-lg text-headline-xl-mobile md:text-display-lg mb-6 leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="hero-para font-body-lg text-body-lg mb-10 opacity-90 max-w-xl">
              {t("heroPara")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="hero-btn-1 btn-primary">
                <span
                  className="material-symbols-outlined text-base"
                  style={{
                    fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24",
                  }}
                >
                  inventory_2
                </span>
                {t("exploreProducts")}
              </Link>
              <Link
                href="/contact"
                className="hero-btn-2 border-2 border-on-primary text-on-primary px-8 py-4 rounded-full font-label-lg text-label-lg hover:bg-on-primary hover:text-primary transition-all inline-flex items-center"
              >
                {t("contactUs")}
              </Link>
            </div>
            <div className="hero-stats flex flex-wrap gap-3 mt-10">
              <div className="glass-badge">{t("heroGlass1")}</div>
              <div className="glass-badge">{t("heroGlass2")}</div>
              <div className="glass-badge">{t("heroGlass3")}</div>
            </div>

            {/* Mobile-only "Connect With Us" card: flows normally below the
                stats row so it can never overlap other Hero content (unlike
                the md+ version, which floats absolutely). Same inner markup
                and classes as the md+ card, so the visual design (glass,
                colors, borders, shadows, icons) is byte-identical. */}
            <div className="contact-widget-mobile md:hidden mt-8 max-w-[260px] me-auto">
              <div className="contact-widget-inner rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest px-1">
                  {t("connectWithUs")}
                </p>
                <div className="flex items-center justify-center gap-2.5">
                  {SOCIAL_LINKS.map((s, i) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="widget-social"
                      style={{ animationDelay: `${1.3 + i * 0.12}s` }}
                    >
                      <SocialIcon brand={s.brand} size={18} />
                    </a>
                  ))}
                </div>
                <a
                  href={CONTACT.phoneMain.href}
                  aria-label={tw("callAria", { phone: CONTACT.phoneMain.display })}
                  className="widget-phone"
                >
                  <span className="icon-wrap">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </span>
                  <span dir="ltr">{CONTACT.phoneMain.display}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating contact widget (tablet/desktop only — see the in-flow
            mobile-only version above, which avoids absolute-position
            overlap on short mobile viewports) */}
        <div className="contact-widget hidden md:block absolute bottom-8 right-6 md:right-12 rtl:right-auto rtl:left-6 md:rtl:left-12 z-20">
          <div className="contact-widget-inner rounded-2xl p-4 flex flex-col gap-3 min-w-[200px]">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest px-1">
              {t("connectWithUs")}
            </p>
            <div className="flex items-center justify-center gap-2.5">
              {SOCIAL_LINKS.map((s, i) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="widget-social"
                  style={{ animationDelay: `${1.3 + i * 0.12}s` }}
                >
                  <SocialIcon brand={s.brand} size={18} />
                </a>
              ))}
            </div>
            <a
              href={CONTACT.phoneMain.href}
              aria-label={tw("callAria", { phone: CONTACT.phoneMain.display })}
              className="widget-phone"
            >
              <span className="icon-wrap">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </span>
              <span dir="ltr">{CONTACT.phoneMain.display}</span>
            </a>
          </div>
        </div>

        <div className="scroll-indicator hidden md:flex">
          <span>{t("scroll")}</span>
          <div className="arrow" />
        </div>
      </section>

      <SectionSeparator label={t("sepAbout")} />

      {/* ═══ 2. ABOUT US ═══ */}
      <section className="pb-28 bg-surface overflow-hidden relative" id="about">
        <DimensionLine className="absolute bottom-8 left-16 w-[380px] hidden xl:block" />
        <div
          className="absolute top-0 right-0 w-64 h-64 dot-pattern-bg opacity-40 pointer-events-none"
          style={{
            maskImage: "radial-gradient(circle,#000 40%,transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle,#000 40%,transparent 80%)",
          }}
        />

        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <span className="section-eyebrow">{t("aboutEyebrow")}</span>
              <h2 className="font-headline-xl text-headline-xl mb-6 leading-tight">
                {t("aboutTitle1")}
                <br />
                {t("aboutTitle2")}
              </h2>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-5">
                {t("aboutPara1")}
              </p>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-8">
                {t("aboutPara2")}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="mini-stat p-5 bg-surface-container-low rounded-xl cursor-default">
                  <h3 className="font-headline-md text-headline-md text-primary mb-1">
                    {t("stat1Value")}
                  </h3>
                  <p className="font-label-sm text-label-sm opacity-70">
                    {t("stat1Label")}
                  </p>
                </div>
                <div className="mini-stat p-5 bg-surface-container-low rounded-xl cursor-default">
                  <h3 className="font-headline-md text-headline-md text-primary mb-1">
                    {t("stat2Value")}
                  </h3>
                  <p className="font-label-sm text-label-sm opacity-70">
                    {t("stat2Label")}
                  </p>
                </div>
              </div>
              <Link href="/about" className="btn-primary">
                {t("aboutCta")}
                <span className="material-symbols-outlined text-base rtl-flip">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="reveal reveal-right relative">
              <AboutImageParallax src={ABOUT_IMG} alt={t("aboutTitle1")} />
              <div className="about-corner-tl" />
              <div className="about-corner-br" />
              <div className="absolute -bottom-6 -left-6 rtl:left-auto rtl:-right-6 bg-primary p-6 rounded-xl text-on-primary hidden md:flex items-center gap-4 shadow-xl">
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{
                    fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24",
                  }}
                >
                  verified
                </span>
                <div>
                  <p className="font-headline-md text-headline-md leading-tight">
                    {t("isoBadgeTitle")}
                  </p>
                  <p className="font-label-sm text-label-sm opacity-80">
                    {t("isoBadgeSub")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionSeparator label={t("sepPartners")} bgClassName="bg-surface-container-low" />

      {/* ═══ 3. TRUSTED BY ═══ */}
      <section className="pb-20 bg-surface-container-low overflow-hidden relative">
        <RackOutline className="decor-breathe absolute -left-10 bottom-2 w-[280px] hidden xl:block" />
        <div className="absolute inset-0 dot-pattern-light opacity-60 pointer-events-none" />

        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto relative">
          <div className="text-center mb-12 reveal">
            <span className="section-eyebrow">{t("trustedEyebrow")}</span>
            <h2 className="font-headline-xl text-headline-xl">
              {t("trustedTitle")}
            </h2>
          </div>

          {/* Desktop infinite scroll (track duplicated for seamless loop; the
              marquee stays LTR — logo motion is direction-neutral) */}
          <div className="hidden md:block logo-track-wrap" dir="ltr">
            <div className="logo-track">
              {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
                <div key={`${logo.alt}-${i}`} className="logo-item">
                  <Image
                    src={logo.src}
                    alt={i >= CLIENT_LOGOS.length ? "" : logo.alt}
                    width={120}
                    height={40}
                    style={{ width: "auto", height: "auto" }}
                    unoptimized
                    aria-hidden={i >= CLIENT_LOGOS.length}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Mobile grid */}
          <div className="grid grid-cols-3 gap-4 md:hidden">
            {CLIENT_LOGOS.slice(0, 6).map((logo) => (
              <div key={logo.alt} className="logo-item">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={40}
                  style={{ width: "auto", height: "auto" }}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionSeparator label={t("sepProducts")} bgClassName="bg-surface-container-low" />

      {/* ═══ 4. PRODUCT CATEGORIES ═══ */}
      <section className="pb-24 bg-surface-container-low relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(1,78,42,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(1,78,42,.03) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto relative">
          <div className="text-center mb-16 reveal">
            <span className="section-eyebrow">{t("productsEyebrow")}</span>
            <h2 className="font-headline-xl text-headline-xl mb-4">
              {t("productsTitle")}
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              {t("productsSub")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">
            {productCategories.map((cat) => (
              <div
                key={cat.title}
                className={`${cat.span} product-card reveal ${cat.stagger}`}
              >
                <div className="relative h-full overflow-hidden">
                  <Image
                    className="prod-img absolute inset-0"
                    src={cat.img}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-background/82 via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-8">
                    <h3 className={`text-on-primary ${cat.titleClass} mb-2`}>
                      {cat.title}
                    </h3>
                    {cat.desc && (
                      <p
                        className={`text-on-primary/80 font-body-md text-body-md mb-5 ${cat.descClass}`}
                      >
                        {cat.desc}
                      </p>
                    )}
                    {cat.ctaStyle === "solid" ? (
                      <Link
                        href={cat.href}
                        className="card-btn bg-on-primary text-primary px-6 py-2 rounded-lg font-label-lg text-label-lg hover:bg-primary hover:text-on-primary transition-all"
                      >
                        {cat.cta}
                      </Link>
                    ) : (
                      <Link
                        href={cat.href}
                        className="card-btn text-on-primary font-label-lg text-label-lg underline"
                      >
                        {cat.cta}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. STATS ═══ */}
      <StatsSection />

      <SectionSeparator label={t("sepVideos")} />

      {/* ═══ 6. VIDEOS ═══ */}
      <VideoSection />

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-24 bg-on-background text-on-primary relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 noise-overlay pointer-events-none" />
        <PalletBlueprint
          tone="light"
          className="decor-breathe absolute -bottom-8 -right-6 w-[400px] hidden lg:block"
        />
        <div
          className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(146,213,166,.07) 0%,transparent 70%)",
            transform: "translate(-40%,-40%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(146,213,166,.06) 0%,transparent 70%)",
            transform: "translate(35%,35%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto relative">
          <div className="text-center mb-14 reveal">
            <span
              className="section-eyebrow"
              style={{ background: "rgba(173,242,193,.2)", color: "#92d5a6" }}
            >
              {t("whyEyebrow")}
            </span>
            <h2 className="font-headline-xl text-headline-xl mt-2">
              {t("whyTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`feature-block space-y-6 reveal ${feature.stagger}`}
              >
                <div className="feature-icon-ring">
                  <span className="material-symbols-outlined text-3xl text-on-primary">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md">
                  {feature.title}
                </h3>
                <p className="text-surface-variant font-body-md text-body-md opacity-80">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionSeparator label={t("sepQuality")} bgClassName="bg-surface-container-low" />

      {/* ═══ 7. CERTIFICATIONS ═══ */}
      <section className="pb-24 bg-surface-container-low relative overflow-hidden">
        <CircuitLines className="absolute top-6 right-4 w-[320px] hidden xl:block" />
        <div
          className="absolute top-0 right-0 w-72 h-72 dot-pattern-bg opacity-30 pointer-events-none"
          style={{
            maskImage: "radial-gradient(circle,#000 40%,transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle,#000 40%,transparent 80%)",
          }}
        />

        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto relative">
          <div className="text-center mb-12 reveal">
            <span className="section-eyebrow">{t("certsEyebrow")}</span>
            <h2 className="font-headline-xl text-headline-xl mb-4">
              {t("certsTitle")}
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              {t("certsSub")}
            </p>
          </div>

          <div className="cert-connector-wrap mb-2" aria-hidden="true">
            <div className="cert-connector-node" />
            <div className="cert-connector-line" />
            <div className="cert-connector-node" />
            <div className="cert-connector-line" />
            <div className="cert-connector-node" />
            <div className="cert-connector-line" />
            <div className="cert-connector-node" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.title} className={`cert-card reveal ${cert.stagger}`}>
                <div className="cert-icon">
                  <span className="material-symbols-outlined">{cert.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2">
                  {cert.title}
                </h3>
                <p className="text-on-surface-variant text-body-md">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
