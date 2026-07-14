import type { Metadata } from "next";
import { cmsMetadata } from "@/lib/cms/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PalletBlueprint, DimensionLine } from "@/components/ui/DecorArt";
import Image from "next/image";
import QuoteForm from "@/components/forms/QuoteForm";
import { resolveContact } from "@/lib/nav";
import { siteContact } from "@/lib/cms/content-storage";
import { siteImage } from "@/lib/cms/images-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return cmsMetadata("quote", locale as "en" | "ar");
}

// See app/[locale]/layout.tsx — same CDN-staleness reasoning, this page
// additionally renders the CMS-driven contact info passed into QuoteForm.
export const revalidate = 30;

const SPOTLIGHT_IMG_DEFAULT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCu-r1AtSl49qnI-a6NpF3tIMe9S-lR-_cjAB-1B1UFjSmtwMjuChO8r_vHNeznJ12flZiGZ4SxWZ8hD6TGOulSfBizqWR9qxtIJY52SlcUX1Mbk_7JJGm5n7rwbflv7mWhPhh6LBAqkdIc70TCCcuCPfd_hvvH2WiPZLU-qSWh2krADab1dLpe8oZl16qEn98rf1MTStEiM_YPxBIJSdPGtm31NnmvEbgU0j7AymSOMtp4_TySD5AhRTnoUwHxZpWeQNr9Ri9ZfAg";

const WHY_ICONS = ["verified", "public", "engineering"] as const;

export default async function RequestQuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quotePage");
  const contact = resolveContact(await siteContact());
  const SPOTLIGHT_IMG = await siteImage("requestQuote.spotlight", SPOTLIGHT_IMG_DEFAULT);
  const whyItems = WHY_ICONS.map((icon, i) => ({
    icon,
    title: t(`why${i + 1}Title`),
    desc: t(`why${i + 1}Desc`),
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-16 pb-8 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
        <span aria-hidden className="material-symbols-outlined decor-icon absolute top-6 right-10 hidden lg:block">request_quote</span>
        <div aria-hidden className="decor-corner-tl absolute top-8 left-2 hidden md:block" />
        <DimensionLine className="absolute bottom-0 left-2 w-[400px] hidden lg:block" />
        <div className="max-w-3xl">
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary mb-4">
            {t("heroTitle")}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            {t("heroPara")}
          </p>
        </div>
      </section>

      {/* Form + aside */}
      <section className="relative px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto pb-32">
        <div aria-hidden className="decor-orb absolute -right-24 top-16 w-80 h-80 hidden xl:block" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 blueprint-grid [mask-image:linear-gradient(to_top,black,transparent)]" />
        <div aria-hidden className="decor-corner-br absolute bottom-10 right-2 hidden md:block" />
        <PalletBlueprint className="decor-breathe absolute bottom-6 left-6 w-[320px] hidden xl:block" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-8">
            <QuoteForm contact={contact} />
          </div>

          <aside className="lg:col-span-4 space-y-gutter">
            <div className="bg-surface-container-low rounded-xl p-8 space-y-6">
              <h3 className="font-headline-md text-headline-md text-primary">
                {t("whyTitle")}
              </h3>
              <ul className="space-y-4">
                {whyItems.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="material-symbols-outlined text-secondary shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-label-lg text-label-lg text-on-surface">
                        {item.title}
                      </p>
                      <p className="text-on-surface-variant text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-video group">
              <Image
                className="object-cover"
                src={SPOTLIGHT_IMG}
                alt={t("spotlightAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-all" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-label-sm font-bold text-primary mb-1">
                  {t("spotlightLabel")}
                </p>
                <p className="text-sm font-medium">
                  {t("spotlightText")}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
