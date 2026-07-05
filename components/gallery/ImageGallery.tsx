"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { galleryImages } from "@/lib/gallery";

/** Thumbnails visible at once in the carousel strip. */
const VISIBLE_THUMBS = 5;

/**
 * Featured-image gallery: one large image on top, a 5-up thumbnail carousel
 * below with circular prev/next arrows. Clicking a thumbnail swaps the
 * featured image (fade + zoom); clicking the featured image opens the
 * existing fullscreen lightbox (prev/next, arrow keys, Escape, backdrop
 * click). Fully RTL-aware: the strip translates the opposite way and the
 * arrow glyphs flip via .rtl-flip.
 */
export default function ImageGallery() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("galleryUi");
  const tc = useTranslations("common");
  const images = galleryImages(locale);
  const total = images.length;
  const maxStart = Math.max(0, total - VISIBLE_THUMBS);

  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [startIdx, setStartIdx] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /** Select a featured image, keeping its thumbnail inside the window. */
  const select = useCallback(
    (i: number) => {
      setFeaturedIdx(i);
      setStartIdx((s) => Math.min(Math.max(s, i - VISIBLE_THUMBS + 1), Math.min(i, maxStart)));
    },
    [maxStart]
  );

  const scrollThumbs = (dir: 1 | -1) =>
    setStartIdx((s) => Math.min(Math.max(s + dir, 0), maxStart));

  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIdx((i) => (i === null ? i : (i + dir + total) % total)),
    [total]
  );

  // Lightbox: keyboard controls + body scroll lock (same pattern as the
  // product modal).
  useEffect(() => {
    document.body.style.overflow = openIdx !== null ? "hidden" : "";
    if (openIdx === null) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [openIdx, step]);

  const featured = images[featuredIdx];
  const active = openIdx !== null ? images[openIdx] : null;
  // Each slot is 1/5 of the strip; RTL translates the opposite way.
  const trackShift = `translateX(${isRtl ? "" : "-"}${(startIdx * 100) / VISIBLE_THUMBS}%)`;

  return (
    <>
      {/* Featured image */}
      <div className="reveal">
        <button
          type="button"
          onClick={() => setOpenIdx(featuredIdx)}
          aria-label={t("viewLarger", { caption: featured.caption })}
          className="gfeat-frame relative w-full overflow-hidden rounded-2xl block cursor-pointer"
        >
          {/* key remount re-runs the fade + zoom transition per image */}
          <div key={featured.src} className="gfeat-main relative w-full aspect-[16/9]">
            <Image
              src={featured.src}
              alt={featured.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1312px"
              className="object-cover"
            />
          </div>
          <span className="gallery-caption gfeat-caption">{featured.caption}</span>
        </button>
      </div>

      {/* Thumbnail carousel: ◀ [5 thumbs] ▶ */}
      <div className="mt-6 flex items-center gap-3 md:gap-4 reveal d1">
        <button
          type="button"
          className="gfeat-arrow"
          onClick={() => scrollThumbs(-1)}
          disabled={startIdx === 0}
          aria-label={t("previousImage")}
        >
          <span className="material-symbols-outlined rtl-flip">chevron_left</span>
        </button>

        <div className="flex-1 overflow-hidden">
          <div
            className="gfeat-track flex"
            style={{ transform: trackShift }}
          >
            {images.map((img, i) => (
              <div key={img.src} className="gfeat-slot">
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-label={img.caption}
                  aria-current={i === featuredIdx}
                  className={`gfeat-thumb ${i === featuredIdx ? "active" : ""}`}
                >
                  <Image
                    src={img.src}
                    alt=""
                    width={280}
                    height={180}
                    sizes="(max-width: 768px) 20vw, 250px"
                    className="object-cover w-full h-full"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="gfeat-arrow"
          onClick={() => scrollThumbs(1)}
          disabled={startIdx >= maxStart}
          aria-label={t("nextImage")}
        >
          <span className="material-symbols-outlined rtl-flip">chevron_right</span>
        </button>
      </div>

      {/* Lightbox (unchanged functionality) */}
      <div
        className={`lightbox ${active ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={active?.caption ?? t("imageViewer")}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpenIdx(null);
        }}
      >
        {active && openIdx !== null && (
          <>
            <button
              ref={closeBtnRef}
              className="lightbox-ctl lightbox-close"
              aria-label={tc("close")}
              onClick={() => setOpenIdx(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <button
              className="lightbox-ctl lightbox-prev"
              aria-label={t("previousImage")}
              onClick={() => step(-1)}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {/* key remount re-runs the fade/scale entrance per image */}
            <figure key={active.src} className="lightbox-figure">
              <Image
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                sizes="92vw"
                className="lightbox-img"
                priority
              />
              <figcaption className="lightbox-caption">
                {active.caption}
                <span className="opacity-60">
                  {" "}
                  · <span dir="ltr">{openIdx + 1} / {total}</span>
                </span>
              </figcaption>
            </figure>

            <button
              className="lightbox-ctl lightbox-next"
              aria-label={t("nextImage")}
              onClick={() => step(1)}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}
