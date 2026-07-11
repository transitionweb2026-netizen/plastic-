"use client";

import { useEffect, useRef } from "react";
import "plyr/dist/plyr.css";

/** Minimal surface of the Plyr instance we use (plyr's own .d.ts uses a
 *  legacy `export =` shape that trips TS under bundler resolution). */
type PlyrInstance = { destroy: () => void };

/**
 * Plyr-powered player for direct video files (Supabase Storage/CDN/MP4) —
 * used inside the video lightboxes.
 *
 * React renders ONLY the stable host <div>; the <video> element is created
 * imperatively inside it because Plyr rewrites the DOM around the video
 * (wrapping it in its own containers), which breaks React reconciliation
 * ("removeChild … not a child" crashes) if React owns those nodes.
 *
 * Consumers load this via next/dynamic({ ssr: false }) and Plyr itself is
 * imported dynamically below, so its JS+CSS only download the first time a
 * modal opens; the player initializes on mount (= modal open) and is
 * destroyed on unmount (= modal close). The icon sprite is self-hosted
 * (public/plyr.svg) so no CDN request escapes the site's CSP.
 */
export default function PlyrVideo({
  src,
  poster,
  title,
  onError,
}: {
  src: string;
  poster?: string;
  title?: string;
  /** Fired when the source fails to load/decode — lets the lightbox swap
   *  to an embed fallback (used for Google Drive edge cases). */
  onError?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let player: PlyrInstance | null = null;
    let cancelled = false;

    const video = document.createElement("video");
    video.src = src;
    if (poster) video.poster = poster;
    if (title) video.title = title;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.addEventListener("error", () => {
      if (video.error) onErrorRef.current?.();
    });
    host.appendChild(video);

    void import("plyr").then((mod) => {
      const Plyr = (mod as { default: new (el: HTMLElement, opts: object) => PlyrInstance }).default;
      if (cancelled) return;
      player = new Plyr(video, {
        iconUrl: "/plyr.svg",
        blankVideo: "",
        // Portrait 1080×1920 frame; non-9:16 sources letterbox (no cropping).
        ratio: "9:16",
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "settings",
          "pip",
          "fullscreen",
        ],
        settings: ["speed"],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        keyboard: { focused: true, global: true },
        tooltips: { controls: true, seek: true },
        fullscreen: { enabled: true, fallback: true, iosNative: true },
      });
    });

    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        /* Plyr can throw during teardown of an already-detached tree */
      }
      // React never sees Plyr's DOM — reset the host wholesale.
      host.innerHTML = "";
    };
  }, [src, poster, title]);

  return <div ref={hostRef} className="plyr-host" />;
}
