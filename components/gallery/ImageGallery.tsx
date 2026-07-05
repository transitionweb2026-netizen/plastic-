"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { galleryImages } from "@/lib/gallery";

const STAGGERS = ["d1", "d2", "d3", "d4"];

/**
 * Masonry image grid (CSS columns) + fullscreen lightbox.
 * Lightbox: prev/next, arrow keys, Escape, backdrop click. All motion is
 * transform/opacity only (compositor-friendly), images lazy-load via
 * next/image defaults.
 */
export default function ImageGallery() {
  const locale = useLocale();
  const t = useTranslations("galleryUi");
  const tc = useTranslations("common");
  const images = galleryImages(locale);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const total = images.length;

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

  const active = openIdx !== null ? images[openIdx] : null;

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:balance]">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className={`gallery-item reveal ${STAGGERS[i % STAGGERS.length]}`}
            onClick={() => setOpenIdx(i)}
            aria-label={t("viewLarger", { caption: img.caption })}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="gallery-img"
            />
            <span className="gallery-caption">{img.caption}</span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
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
