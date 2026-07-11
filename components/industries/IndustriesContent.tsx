"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import RevealObserver from "@/components/ui/RevealObserver";
import { HexOutline } from "@/components/ui/DecorArt";
import IndustryModal from "./IndustryModal";
import type { IndustryModal as IndustryModalData } from "@/lib/industries";

const STAT_DEFS = [
  { num: "22", suffix: "+", key: "stat1" },
  { num: "600K", suffix: "+", key: "stat2" },
  { num: "150", suffix: "+", key: "stat3" },
  { num: "5", suffix: "", key: "stat4" },
] as const;

const STEP_DEFS = [
  { id: "step1", num: "01", delay: "d1" },
  { id: "step2", num: "02", delay: "d2" },
  { id: "step3", num: "03", delay: "d3" },
  { id: "step4", num: "04", delay: "d4" },
  { id: "step5", num: "05", delay: "d5" },
  { id: "step6", num: "06", delay: "d1" },
  { id: "step7", num: "07", delay: "d2" },
] as const;

const TECH_DEFS = [
  { id: "tech1", icon: "smart_toy", iconBg: "bg-primary" },
  { id: "tech2", icon: "precision_manufacturing", iconBg: "bg-secondary" },
  { id: "tech3", icon: "settings_suggest", iconBg: "" },
] as const;

export default function IndustriesContent({
  modals,
  heroImg,
  techImg,
}: {
  /** Fully resolved (localized, CMS-merged) detail-modal data, keyed by
   *  modal id — fetched server-side by the parent page. Card-grid text
   *  above stays translation-driven — see the "industriesPage" namespace. */
  modals: Record<string, IndustryModalData>;
  /** CMS-resolved (siteImage "industries.hero" / "industries.techHighlight")
   *  page-level showcase images, fetched server-side by the parent page. */
  heroImg: string;
  techImg: string;
}) {
  const t = useTranslations("industriesPage");
  const [openId, setOpenId] = useState<string | null>(null);

  /** Legacy proc-card images keyed by step id (same order as the IMGS constant). */
  const STEP_IMAGES: Record<string, string> = Object.fromEntries(
    STEP_DEFS.map((s) => [s.id, modals[s.id]?.image ?? ""])
  );

  const stats = STAT_DEFS.map((s) => ({ ...s, label: t(s.key) }));
  const processSteps = STEP_DEFS.map((s) => ({
    ...s,
    title: t(`${s.id}Title`),
    desc: t(`${s.id}Desc`),
  }));
  const techItems = TECH_DEFS.map((s) => ({
    ...s,
    title: t(`${s.id}Title`),
    desc: t(`${s.id}Desc`),
  }));
  return (
    <div className="page-industries">
      <RevealObserver />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="hero-img relative w-full h-full">
            <Image
              src={heroImg}
              alt="Giant Storage facility"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-background/85 via-background/52 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent" />
        </div>
        <div className="absolute top-20 right-[15%] w-24 h-24 border-2 border-primary/20 rounded-full animate-float-slow hidden lg:block" />
        <div
          className="absolute bottom-24 right-[30%] w-16 h-16 border border-primary/15 rounded-xl rotate-12 animate-float hidden lg:block"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 right-[20%] w-8 h-8 bg-primary/10 rounded-full animate-float-slow hidden lg:block"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto py-24">
          <div className="max-w-2xl">
            <span
              className="hero-badge inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-6"
              style={{ animationDelay: ".1s" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                location_on
              </span>
              {t("badgeLocation")}
            </span>
            <h1
              className="hero-badge font-black text-[38px] md:text-[56px] leading-tight mb-6 text-on-background"
              style={{ animationDelay: ".25s", letterSpacing: "-.02em" }}
            >
              {t("heroTitle1")}
              <br />
              <span className="text-primary">{t("heroTitle2")}</span>
            </h1>
            <p
              className="hero-badge font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg"
              style={{ animationDelay: ".4s" }}
            >
              {t("heroPara")}
            </p>
            <div className="hero-badge flex flex-wrap gap-4" style={{ animationDelay: ".55s" }}>
              <Link href="/products" className="btn-hero-primary">
                {t("exploreProducts")}
                <span className="material-symbols-outlined btn-arrow rtl-flip" style={{ fontSize: 18 }}>
                  arrow_forward
                </span>
              </Link>
              <Link href="/contact" className="btn-hero-outline">
                {t("contactUs")}
                <span className="material-symbols-outlined btn-arrow rtl-flip" style={{ fontSize: 18 }}>
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          <div className="absolute right-8 bottom-12 rtl:right-auto rtl:left-8 hidden xl:flex flex-col gap-3">
            <div className="glass-badge">{t("glass1")}</div>
            <div className="glass-badge">{t("glass2")}</div>
            <div className="glass-badge">{t("glass3")}</div>
          </div>
        </div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section className="bg-primary">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`stat-item ${
                  i < stats.length - 1 ? "border-r border-white/20" : ""
                }`}
              >
                <div className="stat-num text-white" dir="ltr">
                  {stat.num}
                  {stat.suffix && <span className="text-white/70">{stat.suffix}</span>}
                </div>
                <div className="stat-lbl text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS STEPS ═══ */}
      <section className="py-24 bg-surface" id="manufacturing">
        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 reveal">
                {t("processLabel")}
              </p>
              <h2 className="font-headline-xl text-headline-xl reveal d1">
                {t("processTitle")}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-4 reveal d2">
                {t("processPara")}
              </p>
            </div>
            <div className="sep w-full md:w-64 reveal d3">
              <div className="sep-dot" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            {processSteps.map((step) => (
              <button
                key={step.id}
                type="button"
                className={`proc-card reveal ${step.delay} text-left`}
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Image
                    className="card-img object-cover"
                    src={STEP_IMAGES[step.id]}
                    alt={step.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="card-overlay absolute inset-0 bg-primary/30 flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      {t("viewDetails")}
                    </span>
                  </div>
                  <span className="step-num absolute top-3 start-4" dir="ltr">{step.num}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-headline-md text-headline-md mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                    {step.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TECH HIGHLIGHTS ═══ */}
      <section className="py-24 bg-surface relative overflow-hidden" id="technology">
        <HexOutline className="absolute top-10 -right-16 w-64 hidden xl:block" opacity={0.04} />
        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative reveal-left">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  className="w-full h-auto transition-transform duration-700 hover:scale-105"
                  src={techImg}
                  alt={t("techAlt")}
                  width={720}
                  height={480}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4 glass-badge flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    verified
                  </span>
                  {t("industry40")}
                </div>
              </div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full animate-float" />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 border-2 border-primary/20 rounded-2xl rotate-12 animate-float-slow" />
            </div>
            <div className="reveal-right">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                {t("techLabel")}
              </p>
              <h2 className="font-headline-xl text-headline-xl mb-10">
                {t("techTitle")}
              </h2>
              <div className="space-y-3">
                {techItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="tech-item w-full text-start"
                    onClick={() => setOpenId(item.id)}
                  >
                    <div
                      className={`tech-icon-box ${item.iconBg}`}
                      style={item.iconBg ? undefined : { background: "#246640" }}
                    >
                      <span
                        className={`material-symbols-outlined text-2xl ${
                          item.iconBg ? "text-on-primary" : "text-white"
                        }`}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline-md text-headline-md mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                    <span
                      className="material-symbols-outlined text-primary/40 self-center"
                      style={{ fontSize: 18 }}
                    >
                      arrow_forward_ios
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%,rgba(255,255,255,.4) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(255,255,255,.3) 0%,transparent 50%)",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-float-slow" />
        <div className="relative z-10 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto text-center">
          <h2 className="font-headline-xl text-headline-xl text-white mb-4 reveal">
            {t("ctaTitle")}
          </h2>
          <p className="text-white/80 font-body-lg text-body-lg max-w-2xl mx-auto mb-10 reveal d1">
            {t("ctaPara")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center reveal d2">
            <Link
              href="/request-quote"
              className="bg-white text-primary font-bold px-8 py-4 rounded-lg text-sm hover:shadow-xl active:scale-95 transition-all inline-flex items-center"
              style={{ boxShadow: "0 8px 24px rgba(0,0,0,.2)" }}
            >
              {t("requestQuote")}
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-lg text-sm hover:bg-white/10 active:scale-95 transition-all inline-flex items-center"
            >
              {t("contactTeam")}
            </Link>
          </div>
        </div>
      </section>

      <IndustryModal
        data={openId ? modals[openId] ?? null : null}
        onClose={() => setOpenId(null)}
      />
    </div>
  );
}
