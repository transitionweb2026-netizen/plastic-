import type { Metadata } from "next";
import { cmsMetadata } from "@/lib/cms/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PalletBlueprint, DimensionLine } from "@/components/ui/DecorArt";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { siteImage } from "@/lib/cms/images-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return cmsMetadata("about", locale as "en" | "ar");
}

const HERO_IMG_DEFAULT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBz7QZ_kL3IeykdpqgX6okEIbX4C78Vw1YX_52h2cnrS3ZyUghmQh911YI26l3Ywp1lM9HwgsOKT66vSRnqVTDYmu0JIZZfDv9pGg2_M8g--eq6CqUzc4NTPPXHtoWcxD4BRjfUp8VHzOigpPSYVOkAmSAdFvzTgYI6uelwuXSqYBa3RgfVNSpQa_9BFhI3AVFdg85QcN7ygqfmXlTlirqeK-20zfJ6J8NNDRFT0_jzwNnSHBRx0ud0n3amqNJZXPhbY-0V7-NxYG3E";

const STAT_VALUES = ["40+", "1.2M", "50k+", "85"];

const FACTORY_CARDS_DEFAULT = [
  {
    key: "1",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTuYQF-HR6iUXicaAHG2fqdlUmrlY4wbqhiv8LeLZvHv4fKzYd55dYZM7lTGQwojT8M396LqbcqqPtXSpO6zlBIy39X_jEHnaPUhFa1UETehe_PIKNzWNc6pb_lV6XJOmyc0fj8Z4mPdBYzkqsOMnCaxXREgYEoVPfsCCfxhtg4KndLjr_WznZ2dFQMdy3K4jEzAWRyCGOaTabVcJzUM6mk1E_uSqnzNKJJ7BuclkHtdozk6SilAiPc1bDyTeqgPT2LZN67gSFN_jB",
  },
  {
    key: "2",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpJHEoy-P6fYVY3GQn0-azgwyL3x2xyKkic36x5lTMDj8VdoUi4tc_t0d3yVaqvNGLxQroQtNZqtSsBLuH1mzJrjCgkK9tBOPc15fklhcLO8yVGBP41C3DdxdI1eJyr4UzyDwduvGSEZfgbJoVl3mv53flU_gxD3W8ERcwVC1Q8ls1rmafTJ02sZPWZoQNXCZdUNZ1uuuoQqMEp0hPx08wC98XHWlUQc2TIt6Zjt-ykPH7DMyTkk-Klu-HMvPFjMn6PD7Z8VtfF_bc",
  },
  {
    key: "3",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuIePElBxhVt48XqlFqlqBsk3g1mwziD_BkF1-bMHP5-QjUJygm6yUEEA0hDUPOIF6LbJ4r7_YDHwtD8OGzWVQdlfEwUxlbrSGDS-a0YBN9Fprtq10M2ZIP1oWAbnF84niJD_-WmP9Lae6-0Q4WZevp9gD3p3Re37XTEAPyL9sbV78XGUSl94jjEBJXFL1KKtNLVtkoP9uINBAFUWAiKILlXeTOaDh4hKP01r6q1Fo5a2QHWK8aK_F5h6oYcnmmh40ScP4-OmUzxKS",
  },
];

/**
 * About page (from legacy "about us.html"). This page used a smaller spacing
 * scale than the global tokens (16px mobile margins, 24px gutters, 56px
 * display size), preserved here with explicit utilities.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");
  const stats = STAT_VALUES.map((value, i) => ({ value, label: t(`stat${i + 1}`) }));
  const values = [t("value1"), t("value2"), t("value3")];
  const HERO_IMG = await siteImage("about.hero", HERO_IMG_DEFAULT);
  const factoryCards = await Promise.all(
    FACTORY_CARDS_DEFAULT.map(async (card, i) => ({
      ...card,
      img: await siteImage(`about.factoryCard.${card.key}`, card.img),
      title: t(`factory${i + 1}`),
      alt: t(`factory${i + 1}Alt`),
    }))
  );

  return (
    <>
      {/* Hero */}
      <section className="relative px-4 md:px-margin-desktop py-20 overflow-hidden">
        <div aria-hidden className="absolute -top-16 -right-16 w-64 h-64 dot-pattern-bg opacity-40 pointer-events-none [mask-image:radial-gradient(circle,#000_40%,transparent_80%)]" />
        <div aria-hidden className="decor-orb absolute -left-28 bottom-4 w-80 h-80 hidden md:block" />
        <DimensionLine className="absolute bottom-2 left-4 w-[340px] hidden lg:block" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm mb-4">
              {t("since")}
            </span>
            <h1
              className="font-display-lg text-primary mb-6 leading-tight"
              style={{
                fontSize: "clamp(1.65rem, 7vw, 3.5rem)",
                letterSpacing: "-.02em",
              }}
            >
              {t("heroTitle1")} <br />
              <span className="text-outline">{t("heroTitle2")}</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
              {t("heroPara")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-primary px-8 py-4 text-on-primary rounded-xl font-label-md text-label-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center min-h-[44px]"
              >
                {t("exploreProducts")}
              </Link>
              <Link
                href="/contact"
                className="border-2 border-primary px-8 py-4 text-primary rounded-xl font-label-md text-label-md hover:bg-primary/5 hover:-translate-y-0.5 transition-all inline-flex items-center min-h-[44px]"
              >
                {t("contactUs")}
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden soft-industrial-shadow">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent z-10" />
            <Image
              src={HERO_IMG}
              alt={t("heroAlt")}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-surface-container px-4 md:px-margin-desktop py-12">
        <div aria-hidden className="absolute inset-0 dot-pattern-light opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6">
              <div className="font-display-lg text-headline-lg text-primary mb-2">
                {stat.value}
              </div>
              <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision bento */}
      <section className="px-4 md:px-margin-desktop py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 bg-white p-12 rounded-3xl soft-industrial-shadow flex flex-col justify-between border border-surface-variant">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-6">
                  rocket_launch
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
                  {t("missionTitle")}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  {t("missionPara")}
                </p>
              </div>
              <div className="mt-8 border-t border-surface-variant pt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <span className="font-label-md text-label-md text-primary">
                  {t("certified")}
                </span>
              </div>
            </div>
            <div className="md:col-span-5 grid grid-rows-2 gap-6">
              <div className="bg-primary p-6 rounded-3xl text-on-primary">
                <span className="material-symbols-outlined text-3xl mb-4">
                  visibility
                </span>
                <h3 className="font-headline-md text-headline-md mb-2">
                  {t("visionTitle")}
                </h3>
                <p className="font-body-md text-body-md text-on-primary/80">
                  {t("visionPara")}
                </p>
              </div>
              <div className="bg-surface-container-high p-6 rounded-3xl">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">
                  handshake
                </span>
                <h3 className="font-headline-md text-headline-md text-primary mb-2">
                  {t("valuesTitle")}
                </h3>
                <ul className="space-y-2">
                  {values.map((value) => (
                    <li
                      key={value}
                      className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Factory overview */}
      <section className="relative bg-inverse-surface py-20 px-4 md:px-margin-desktop overflow-hidden">
        <div aria-hidden className="absolute inset-0 noise-overlay pointer-events-none" />
        <PalletBlueprint tone="light" className="decor-breathe absolute -bottom-10 -right-4 w-[380px] hidden lg:block" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-headline-lg text-headline-lg text-inverse-on-surface mb-4">
                {t("mfgTitle")}
              </h2>
              <p className="font-body-lg text-body-lg text-inverse-on-surface/70">
                {t("mfgPara")}
              </p>
            </div>
            <Link
              href="/industries"
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-primary-container hover:-translate-y-0.5 transition-all inline-flex items-center min-h-[44px]"
            >
              {t("virtualTour")}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {factoryCards.map((card) => (
              <div
                key={card.title}
                className="group relative aspect-video rounded-2xl overflow-hidden"
              >
                <Image
                  src={card.img}
                  alt={card.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all p-6 flex flex-col justify-end">
                  <h4 className="font-headline-md text-headline-md text-white">
                    {card.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-margin-desktop py-20">
        <div className="max-w-7xl mx-auto bg-primary-container rounded-[40px] p-12 text-center text-on-primary overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl -ml-32 -mb-32" />
          <div className="relative z-10">
            {/* Legacy page-local sizes: headline-lg-mobile 24/32, display-lg 56/64 */}
            <h2 className="font-display-lg text-[24px] leading-8 md:text-[56px] md:leading-[64px] md:tracking-[-0.02em] font-bold mb-6">
              {t("ctaTitle")}
            </h2>
            <p className="font-body-lg text-body-lg mb-8 max-w-2xl mx-auto opacity-90">
              {t("ctaPara")}
            </p>
            <Link
              href="/request-quote"
              className="bg-white text-primary px-10 py-4 rounded-xl font-headline-md text-headline-md hover:bg-surface-container-low hover:-translate-y-0.5 transition-all inline-flex items-center min-h-[44px]"
            >
              {t("ctaBtn")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
