import type { Metadata } from "next";
import { cmsMetadata, galleryImageJsonLd, galleryImageSeo } from "@/lib/cms/seo";
import { getGalleryImages, getGalleryVideos } from "@/lib/gallery-data";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import RevealObserver from "@/components/ui/RevealObserver";
import ImageGallery from "@/components/gallery/ImageGallery";
import { RackOutline, DimensionLine } from "@/components/ui/DecorArt";
import VideoGallery from "@/components/gallery/VideoGallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return cmsMetadata("gallery", locale as "en" | "ar");
}

const HERO_IMG = "/gallery/images/img-01.jpg";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("galleryUi");
  const loc = locale as "en" | "ar";
  // Gallery images with CMS per-image overrides (alt/caption always shown;
  // title/category/description carried through for any consumer that wants
  // them — same trim-or-fallback discipline as the rest of the CMS).
  const baseImages = await getGalleryImages(loc);
  const images = await Promise.all(
    baseImages.map(async (img) => {
      const cms = await galleryImageSeo(img.src, loc);
      return {
        ...img,
        alt: cms?.alt?.trim() || img.alt,
        caption: cms?.caption?.trim() || img.caption,
        title: cms?.title?.trim() || undefined,
        category: cms?.category?.trim() || undefined,
        description: cms?.description?.trim() || undefined,
      };
    })
  );
  const videos = await getGalleryVideos(loc);

  return (
    <div className="page-gallery">
      <RevealObserver />

      {/* ═══ HERO (same treatment as the blog/article dark heroes) ═══ */}
      <section className="relative h-[420px] md:h-[480px] overflow-hidden flex items-end">
        <div className="hero-zoom-img absolute inset-0">
          <Image
            src={HERO_IMG}
            alt={t("heroTitle")}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15" />
        <div className="relative z-10 w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto pb-14">
          <p className="reveal text-xs font-bold uppercase tracking-widest text-primary-fixed-dim mb-3">
            {t("heroEyebrow")}
          </p>
          <h1 className="reveal d1 font-black text-white leading-tight text-[clamp(2rem,5vw,3.6rem)] tracking-tight mb-4">
            {t("heroTitle")}
          </h1>
          <p className="reveal d2 text-white/85 font-body-lg text-body-lg max-w-2xl">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      {/* ═══ IMAGE GALLERY ═══ */}
      <section className="relative overflow-hidden py-24 bg-surface">
        <div aria-hidden className="decor-orb absolute -left-28 top-72 w-80 h-80 hidden lg:block" />
        <div aria-hidden className="decor-ring absolute -bottom-10 -right-10 w-40 h-40 hidden lg:block" />
        <DimensionLine className="absolute top-16 left-1/2 -translate-x-1/2 w-[420px] hidden md:block" />
        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="section-eyebrow">{t("imagesEyebrow")}</span>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl mb-4">
              {t("imagesTitle")}
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-body-md text-body-md">
              {t("imagesDescription")}
            </p>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryImageJsonLd(loc, images)) }}
          />
          <ImageGallery images={images} />
        </div>
      </section>

      {/* ═══ VIDEOS ═══ */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <RackOutline className="decor-breathe absolute top-8 -right-8 w-[280px] hidden xl:block" />
        <div className="absolute inset-0 dot-pattern-light opacity-40 pointer-events-none" />
        <div className="relative px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="section-eyebrow">{t("videosEyebrow")}</span>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl mb-4">
              {t("videosTitle")}
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-body-md text-body-md">
              {t("videosDescription")}
            </p>
          </div>
          <VideoGallery videos={videos} />
        </div>
      </section>
    </div>
  );
}
