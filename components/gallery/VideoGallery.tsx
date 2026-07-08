"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GalleryVideo } from "@/lib/gallery";

const STAGGERS = ["d1", "d2", "d3"];

/**
 * Video grid reusing the home page's .video-card / .play-btn styling, with
 * a fullscreen player lightbox. Supports YouTube embeds and local MP4s
 * (see lib/gallery-data.ts — placeholders until client videos arrive).
 */
export default function VideoGallery({ videos }: { videos: GalleryVideo[] }) {
  const t = useTranslations("galleryUi");
  const tc = useTranslations("common");
  const [open, setOpen] = useState<GalleryVideo | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, i) => (
          <button
            key={video.id}
            type="button"
            className={`video-card text-left reveal ${STAGGERS[i % STAGGERS.length]}`}
            onClick={() => setOpen(video)}
            aria-label={t("playVideo", { title: video.title })}
          >
            <div className="thumb-wrap relative aspect-video">
              <Image
                src={video.thumb}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="play-btn">
                <div className="play-btn-inner">
                  <span className="material-symbols-outlined">play_arrow</span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-headline-md text-lg text-on-surface mb-1">
                {video.title}
              </h3>
              <p className="text-sm text-on-surface-variant">{video.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Player lightbox */}
      <div
        className={`lightbox ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={open?.title ?? t("videoPlayer")}
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
              {open.type === "youtube" ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${open.youtubeId}?autoplay=1&rel=0`}
                  title={open.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={open.src} controls autoPlay playsInline />
              )}
              <p className="lightbox-caption">{open.title}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
