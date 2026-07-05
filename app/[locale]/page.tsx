import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import CursorGlow from "@/components/ui/CursorGlow";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import RevealObserver from "@/components/ui/RevealObserver";
import SectionSeparator from "@/components/ui/SectionSeparator";
import AboutImageParallax from "@/components/home/AboutImageParallax";
import StatsSection from "@/components/home/StatsSection";
import VideoSection from "@/components/home/VideoSection";
import SocialIcon from "@/components/ui/SocialIcon";
import { PalletBlueprint, CircuitLines, DimensionLine, RackOutline } from "@/components/ui/DecorArt";
import { CONTACT, SOCIAL_LINKS } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Giant Storage | Integrated Industrial Solutions",
  description:
    "Leading Egyptian industrial plastic solutions — precision-engineered pallets, crates, and storage assets for global logistics, exported from Cairo to 22+ markets.",
};

const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCvUppSIUhiLWIyyd-8B9t1tvTbccTRdXY9Nl-ZoAMQrVOWoSEOBUPOzR4MChZDQSGPBzoURAW5wiRz03UypGYnBhWRbL2bHFzLdP4oa__H5VSKHFILgRqm0OOjKI_7w5MoM1iXx21UsvZl9WUzk4UcYgTUkk9G0PPt690qiXU3pWB6FeHpoaWkfiQZQFt4WubDwOjG6SAiXOfUv6idi7QaGe3ZpmEqEMdT0z2YUXQlyT0Jtm9qCq9LAAc0s580PKk41Bbw42nyesw";
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

const PRODUCT_CATEGORIES = [
  {
    span: "md:col-span-7",
    stagger: "stagger-1",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF7K_7bxI6zZEwCDg0qwrfYNZTQ6cd4O6D1ZlTJErRG9xY4mE0_JUMGJVBZapnc1bGbgWKyN_gYKtmM7IjTLqPKHTuj81b4SV72jPsX1pUfu7Nw5pFvkzRLcGBwOHx67pmEtiOGBNCK4tyebHi3mk9cEQsvSkqoBi2o7Q35EQ5WdF8v92AYzQprZKNQ0ZA2xrcQS5caPRGT_JOgy6CVsfmYf1m6aoVB5_ODkjHhYhIrAz96Su8peHEkWLB_KXyT-NBw-Gg8CVQYug",
    alt: "Plastic Pallets",
    title: "Plastic Pallets",
    titleClass: "font-headline-lg text-headline-lg",
    desc: "Ultra-durable, hygienic, and rackable solutions for heavy-load logistics and export.",
    descClass: "max-w-md",
    cta: "Explore Series",
    href: "/products",
    ctaStyle: "solid" as const,
  },
  {
    span: "md:col-span-5",
    stagger: "stagger-2",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq5RaPEnQ-nVljl3gMJjyk9Ci9IB2ANDnUZlM8YoMBkLBrWL1jAa3576FGEca3sFj68a1EXm6xqzhc2K62Oti6UOMG_rYwJ00rvrOgWSgHqo0WUYE7lAwAPfJEcChweyaHmU-juKmHArlQl51D7ioeazXCnItYwd6Rha06-AM0WdGdNPgBR6UDYS0VgBtUs6U9t5OQ8t62lXf0O9DkPVHr0MDGjAeswNL4M45mES3t0W9jFzyKkpKhXWxdoZ0EtNhFnnKtLqONpas",
    alt: "Industrial Crates",
    title: "Industrial Crates",
    titleClass: "font-headline-lg text-headline-lg",
    desc: "Optimized for agricultural and food processing industries.",
    descClass: "",
    cta: "View Range",
    href: "/products",
    ctaStyle: "solid" as const,
  },
  {
    span: "md:col-span-4",
    stagger: "stagger-3",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAi7lX7MXKrbHrWBmmjBIrDOr-GkiDn11wjBI-4tJzzLTByVB4pLWgl03p7OzrUAv1z55KSeIbovkI1iGr1KPXaL8GtfZ3d5msswFDWb4Q7ypGNNjOorErYM85QzZdecEFaizTGKtW5V8Tj_RlLbpnLGqmrmy_IuXDAqUh379HVhVEgk-r3wsUg-lv_J_WMFfTWGa4wsaPX1e0Tn1wGhisKLuIdFP96aqybf2Zq01F-wI8Wbk6qbUubNsum4rTk2kX4KRwzRj5kjtQ",
    alt: "Industrial Bins",
    title: "Industrial Bins",
    titleClass: "font-headline-md text-headline-md",
    desc: "",
    descClass: "",
    cta: "View Specs",
    href: "/products",
    ctaStyle: "underline" as const,
  },
  {
    span: "md:col-span-8",
    stagger: "stagger-4",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGXe8LA-bga17T9a2Vpsftq01DixGiLApBkzi6tmzwh1obOx6MwKMYUXla6REnQ00qhqHmrjWZ7pND_dnNW2uNdBgrZgflIMhMeOmOS6O3Ja0LGsD8-kfHveDxjoIbbFbYeylVw4VhvGxeybduhOz0H2_ZDxOG9_PPJJ78iBYqY9uBR4DAdi5_aH5XIoPJecGr4OHNBne3SamwVIFBwwHbPvHuE9Wt-YPPYVgzbI_qnpXtA8vneiWXgHSZwn2Ba7ycKwaClD7Iv-s",
    alt: "Specialty Storage",
    title: "Specialty Storage",
    titleClass: "font-headline-lg text-headline-lg",
    desc: "Nesting and stackable containers for specialized supply chain needs.",
    descClass: "",
    cta: "Custom Solutions",
    href: "/request-quote",
    ctaStyle: "solid" as const,
  },
];

const FEATURES = [
  {
    icon: "verified_user",
    title: "Uncompromising Quality",
    desc: "Our products undergo rigorous stress tests, including load-bearing analysis and temperature resilience, ensuring zero failure in critical environments.",
    stagger: "stagger-1",
  },
  {
    icon: "public",
    title: "Global Export Hub",
    desc: "Strategically located in Cairo, we leverage Egypt's logistical routes to provide rapid, cost-effective shipping to Europe, Africa, and the Middle East.",
    stagger: "stagger-2",
  },
  {
    icon: "eco",
    title: "Eco-Forward Vision",
    desc: "We champion a circular economy. All our plastic products are 100% recyclable, and we offer buy-back programs for damaged units to reduce industrial waste.",
    stagger: "stagger-3",
  },
];

const CERTIFICATIONS = [
  {
    icon: "workspace_premium",
    title: "ISO 9001:2015",
    desc: "Quality management systems ensuring consistent, high-standard production processes across all product lines.",
    stagger: "stagger-1",
  },
  {
    icon: "health_and_safety",
    title: "OHSAS 18001",
    desc: "Occupational health and safety standards protecting our workforce and operational environments.",
    stagger: "stagger-2",
  },
  {
    icon: "eco",
    title: "ISO 14001",
    desc: "Environmental management certification reflecting our commitment to sustainable and eco-forward manufacturing.",
    stagger: "stagger-3",
  },
  {
    icon: "verified",
    title: "CE Marked",
    desc: "European conformity marking confirming our products meet EU safety, health, and environmental requirements.",
    stagger: "stagger-4",
  },
];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CursorGlow />
      <ScrollProgressBar />
      <RevealObserver />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="hero-bg relative w-full h-full">
            <Image
              src={HERO_BG}
              alt="Giant Storage industrial warehouse"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-on-background/88 via-on-background/55 to-transparent" />
        </div>

        <div className="hero-geo hero-geo-1 hidden lg:block" />
        <div className="hero-geo hero-geo-2 hidden lg:block" />
        <div className="hero-geo hero-geo-3 hidden lg:block" />

        <div className="relative z-10 w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="max-w-2xl text-on-primary">
            <h1 className="hero-title font-display-lg text-headline-xl-mobile md:text-display-lg mb-6 leading-tight">
              Leading Egyptian Industrial Plastic Solutions
            </h1>
            <p className="hero-para font-body-lg text-body-lg mb-10 opacity-90 max-w-xl">
              Pioneering precision-engineered storage and logistics assets for
              global industries. Scaling your operations with reliability and
              Egyptian craftsmanship.
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
                Explore Products
              </Link>
              <Link
                href="/contact"
                className="hero-btn-2 border-2 border-on-primary text-on-primary px-8 py-4 rounded-full font-label-lg text-label-lg hover:bg-on-primary hover:text-primary transition-all inline-flex items-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Floating contact widget */}
        <div className="contact-widget absolute bottom-8 right-6 md:right-12 z-20">
          <div className="contact-widget-inner rounded-2xl p-4 flex flex-col gap-3 min-w-[200px]">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest px-1">
              Connect With Us
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
              aria-label="Call us"
              className="widget-phone"
            >
              <span className="icon-wrap">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </span>
              {CONTACT.phoneMain.display}
            </a>
          </div>
        </div>

        <div className="scroll-indicator hidden md:flex">
          <span>Scroll</span>
          <div className="arrow" />
        </div>
      </section>

      <SectionSeparator label="About Us" />

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
              <span className="section-eyebrow">Who We Are</span>
              <h2 className="font-headline-xl text-headline-xl mb-6 leading-tight">
                Integrated Storage
                <br />
                Excellence
              </h2>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-5">
                Giant Storage Integrated Solutions stands at the forefront of
                the Egyptian manufacturing sector. We specialize in high-density
                polyethylene (HDPE) solutions designed to survive the rigors of
                heavy-duty industrial cycles.
              </p>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-8">
                From the heart of Cairo to the global market, our commitment to
                quality control and sustainable manufacturing processes ensures
                that every pallet and crate meets international standards for
                durability and safety.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="mini-stat p-5 bg-surface-container-low rounded-xl cursor-default">
                  <h3 className="font-headline-md text-headline-md text-primary mb-1">
                    20+
                  </h3>
                  <p className="font-label-sm text-label-sm opacity-70">
                    Years of Excellence
                  </p>
                </div>
                <div className="mini-stat p-5 bg-surface-container-low rounded-xl cursor-default">
                  <h3 className="font-headline-md text-headline-md text-primary mb-1">
                    50k+
                  </h3>
                  <p className="font-label-sm text-label-sm opacity-70">
                    Monthly Capacity
                  </p>
                </div>
              </div>
              <Link href="/about" className="btn-primary">
                About Us
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="reveal reveal-right relative">
              <AboutImageParallax
                src={ABOUT_IMG}
                alt="Giant Storage manufacturing facility"
              />
              <div className="about-corner-tl" />
              <div className="about-corner-br" />
              <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-xl text-on-primary hidden md:flex items-center gap-4 shadow-xl">
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
                    ISO 9001:2015
                  </p>
                  <p className="font-label-sm text-label-sm opacity-80">
                    Certified Quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionSeparator label="Trusted Partners" bgClassName="bg-surface-container-low" />

      {/* ═══ 3. TRUSTED BY ═══ */}
      <section className="pb-20 bg-surface-container-low overflow-hidden relative">
        <RackOutline className="decor-breathe absolute -left-10 bottom-2 w-[280px] hidden xl:block" />
        <div className="absolute inset-0 dot-pattern-light opacity-60 pointer-events-none" />

        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto relative">
          <div className="text-center mb-12 reveal">
            <span className="section-eyebrow">Trusted By</span>
            <h2 className="font-headline-xl text-headline-xl">
              Companies That Trust Us
            </h2>
          </div>

          {/* Desktop infinite scroll (track duplicated for seamless loop) */}
          <div className="hidden md:block logo-track-wrap">
            <div className="logo-track">
              {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
                <div key={`${logo.alt}-${i}`} className="logo-item">
                  <Image
                    src={logo.src}
                    alt={i >= CLIENT_LOGOS.length ? "" : logo.alt}
                    width={120}
                    height={40}
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
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionSeparator label="Our Products" bgClassName="bg-surface-container-low" />

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
            <span className="section-eyebrow">Products</span>
            <h2 className="font-headline-xl text-headline-xl mb-4">
              Core Product Categories
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Precision engineered solutions for every logistics challenge.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">
            {PRODUCT_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className={`${cat.span} product-card reveal ${cat.stagger}`}
              >
                <div className="relative h-full overflow-hidden">
                  <Image
                    className="prod-img absolute inset-0"
                    src={cat.img}
                    alt={cat.alt}
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

      <SectionSeparator label="Latest Videos" />

      {/* ═══ 6. VIDEOS ═══ */}
      <VideoSection />

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-24 bg-on-background text-on-primary relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 noise-overlay pointer-events-none" />
        <PalletBlueprint tone="light" className="decor-breathe absolute -bottom-8 -right-6 w-[400px] hidden lg:block" />
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
              Why Giant Storage
            </span>
            <h2 className="font-headline-xl text-headline-xl mt-2">
              Built on Excellence
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {FEATURES.map((feature) => (
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

      <SectionSeparator label="Quality Standards" bgClassName="bg-surface-container-low" />

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
            <span className="section-eyebrow">Standards</span>
            <h2 className="font-headline-xl text-headline-xl mb-4">
              Our Certifications
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Every product we manufacture is backed by internationally
              recognized certifications, ensuring compliance and peace of mind
              for our global clients.
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
            {CERTIFICATIONS.map((cert) => (
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
