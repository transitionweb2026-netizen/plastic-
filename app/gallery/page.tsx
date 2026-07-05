import type { Metadata } from "next";
import Image from "next/image";
import RevealObserver from "@/components/ui/RevealObserver";
import ImageGallery from "@/components/gallery/ImageGallery";
import { RackOutline, DimensionLine } from "@/components/ui/DecorArt";
import VideoGallery from "@/components/gallery/VideoGallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Inside Giant Storage — manufacturing facilities, production lines, warehouses, product photography, and completed client projects across 22+ markets.",
};

const HERO_IMG = "/gallery/images/img-01.jpg";

export default function GalleryPage() {
  return (
    <div className="page-gallery">
      <RevealObserver />

      {/* ═══ HERO (same treatment as the blog/article dark heroes) ═══ */}
      <section className="relative h-[420px] md:h-[480px] overflow-hidden flex items-end">
        <div className="hero-zoom-img absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="Giant Storage manufacturing facility"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15" />
        <div className="relative z-10 w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto pb-14">
          <p className="reveal text-xs font-bold uppercase tracking-widest text-primary-fixed-dim mb-3">
            Inside Giant Storage
          </p>
          <h1 className="reveal d1 font-black text-white leading-tight text-[clamp(2rem,5vw,3.6rem)] tracking-tight mb-4">
            Gallery
          </h1>
          <p className="reveal d2 text-white/85 font-body-lg text-body-lg max-w-2xl">
            A look inside our manufacturing facilities, production lines, and
            warehouses — and the products and completed projects we deliver to
            clients in 22+ markets.
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
            <span className="section-eyebrow">Our Work</span>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl mb-4">
              Facilities, Products &amp; Projects
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-body-md text-body-md">
              From the molding floor to the loading bay — a visual record of
              how Giant Storage builds, tests, and ships industrial plastic
              solutions.
            </p>
          </div>
          <ImageGallery />
        </div>
      </section>

      {/* ═══ VIDEOS ═══ */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <RackOutline className="decor-breathe absolute top-8 -right-8 w-[280px] hidden xl:block" />
        <div className="absolute inset-0 dot-pattern-light opacity-40 pointer-events-none" />
        <div className="relative px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="section-eyebrow">Videos</span>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl mb-4">
              See Us in Motion
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-body-md text-body-md">
              Facility tours, stress tests, and logistics operations — watch
              how our products perform in the real world.
            </p>
          </div>
          <VideoGallery />
        </div>
      </section>
    </div>
  );
}
