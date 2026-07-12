"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { resolveVideoUrl } from "@/lib/video-url";

/** Plyr (JS + CSS) loads only the first time a video modal opens. */
const PlyrVideo = dynamic(() => import("@/components/ui/PlyrVideo"), {
  ssr: false,
  loading: () => <div className="player-placeholder" aria-hidden />,
});

function PlayOverlay() {
  return (
    <div className="play-btn">
      <div className="play-btn-inner">
        <span className="material-symbols-outlined">play_arrow</span>
      </div>
    </div>
  );
}

/**
 * Latest Videos section: desktop grid + mobile swipe carousel with dot nav
 * (ported from the legacy hand-rolled carousel). Cards with an admin-set
 * Video URL (cms_images home.videoUrl.N) open an in-site lightbox player —
 * same UX as the gallery's VideoGallery; cards without one stay inert.
 */
export default function VideoSection({
  images,
  videoUrls = ["", "", ""],
}: {
  images: [string, string, string];
  videoUrls?: [string, string, string];
}) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const isRtl = useLocale() === "ar";
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<{ src: string; title: string; poster: string } | null>(null);
  /** Drive edge cases only: flips to the iframe preview if native playback errors. */
  const [playerFallback, setPlayerFallback] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef(0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const videos = [
    { img: images[0], url: videoUrls[0], title: t("video1Title"), desc: t("video1Desc"), shortDesc: t("video1Short") },
    { img: images[1], url: videoUrls[1], title: t("video2Title"), desc: t("video2Desc"), shortDesc: t("video2Short") },
    { img: images[2], url: videoUrls[2], title: t("video3Title"), desc: t("video3Desc"), shortDesc: t("video3Short") },
  ];
  const total = videos.length;

  const goTo = (n: number) => setCurrent((n + total) % total);
  const play = (video: { url: string; title: string; img: string }) => {
    if (!video.url) return;
    setPlayerFallback(false);
    setOpen({ src: video.url, title: video.title, poster: video.img });
  };

  return (
    <section className="pb-24 bg-surface relative overflow-hidden">
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(173,242,193,.18) 0%,transparent 70%)",
          transform: "translate(30%,30%)",
        }}
      />

      <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto relative">
        <div className="text-center mb-16 reveal">
          <span className="section-eyebrow">{t("videosEyebrow")}</span>
          <h2 className="font-headline-xl text-headline-xl mb-4">{t("videosTitle")}</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            {t("videosSub")}
          </p>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <div key={video.title} className={`video-card reveal stagger-${i + 1}`}>
              <div
                className="thumb-wrap"
                role={video.url ? "button" : undefined}
                style={video.url ? { cursor: "pointer" } : undefined}
                onClick={() => play(video)}
              >
                <Image
                  src={video.img}
                  alt={`${video.title} video thumbnail`}
                  width={640}
                  height={360}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <PlayOverlay />
              </div>
              <div className="p-5">
                <h3 className="font-headline-md text-headline-md mb-2">
                  {video.title}
                </h3>
                <p className="text-on-surface-variant text-body-md mb-3">
                  {video.desc}
                </p>
                <button type="button" className="video-card-link" onClick={() => play(video)}>
                  {t("watchNow")} {isRtl ? "←" : "→"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="sm:hidden video-carousel px-6">
          <div
            className="video-slides"
            style={{ transform: `translateX(${isRtl ? "" : "-"}${current * 100}%)` }}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchX.current;
              // In RTL the next slide sits to the left, so swipes invert.
              if (Math.abs(dx) > 40)
                goTo((isRtl ? dx > 0 : dx < 0) ? current + 1 : current - 1);
            }}
          >
            {videos.map((video) => (
              <div key={video.title} className="video-slide">
                <div className="video-card">
                  <div
                    className="thumb-wrap"
                    role={video.url ? "button" : undefined}
                    onClick={() => play(video)}
                  >
                    <Image
                      src={video.img}
                      alt={`${video.title} video thumbnail`}
                      width={640}
                      height={360}
                      sizes="100vw"
                    />
                    <PlayOverlay />
                  </div>
                  <div className="p-4">
                    <h3 className="font-headline-md text-headline-md mb-1">
                      {video.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm">
                      {video.shortDesc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-btn carousel-btn-prev"
            aria-label={isRtl ? "التالي" : "Previous"}
            onClick={() => goTo(isRtl ? current + 1 : current - 1)}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            className="carousel-btn carousel-btn-next"
            aria-label={isRtl ? "السابق" : "Next"}
            onClick={() => goTo(isRtl ? current - 1 : current + 1)}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <div className="flex justify-center gap-2 mt-4">
            {videos.map((video, i) => (
              <button
                key={video.title}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === current}
                onClick={() => goTo(i)}
                className="rounded-full border-none cursor-pointer transition-all duration-300"
                style={{
                  height: 8,
                  minHeight: 8,
                  width: i === current ? 20 : 8,
                  background: i === current ? "#0e4a30" : "#c0c9bf",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* In-site player lightbox (same UX as the gallery's VideoGallery) */}
      <div
        className={`lightbox ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={open?.title ?? t("videosTitle")}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
      >
        {open && (
          <>
            <button
              ref={closeBtnRef}
              className="lightbox-ctl lightbox-close"
              aria-label={tc("close")}
              onClick={() => setOpen(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="lightbox-player">
              {(() => {
                // Provider auto-detection (see lib/video-url.ts): embed
                // providers (YouTube/Vimeo/Loom/…) render their player in
                // this same iframe; direct files stream through Plyr, with
                // Drive's iframe as an error-only fallback.
                const resolved = resolveVideoUrl(open.src);
                const embedSrc =
                  resolved.kind === "embed"
                    ? resolved.src
                    : playerFallback
                      ? resolved.fallbackEmbed
                      : undefined;
                return embedSrc ? (
                  <iframe
                    src={embedSrc}
                    title={open.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <PlyrVideo
                    src={resolved.src}
                    poster={open.poster}
                    title={open.title}
                    onError={
                      resolved.kind === "file" && resolved.fallbackEmbed
                        ? () => setPlayerFallback(true)
                        : undefined
                    }
                  />
                );
              })()}
              <p className="lightbox-caption">{open.title}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
