"use client";

import { useEffect, useRef } from "react";
import "plyr/dist/plyr.css";

/** Minimal surface of the Plyr instance we use (plyr's own .d.ts uses a
 *  legacy `export =` shape that trips TS under bundler resolution). */
type PlyrInstance = { destroy: () => void };

/**
 * Plyr-powered player for direct video files (Supabase Storage/CDN/MP4) —
 * used inside the video lightboxes. Consumers load this via
 * next/dynamic({ ssr: false }) and the Plyr library itself is imported
 * dynamically below, so its JS only downloads the first time a modal
 * opens; the player initializes on mount (= modal open) and is destroyed
 * on unmount (= modal close). The icon sprite is self-hosted
 * (public/plyr.svg) so no CDN request escapes the site's CSP.
 */
export default function PlyrVideo({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let player: PlyrInstance | null = null;
    let cancelled = false;

    void import("plyr").then((mod) => {
      const Plyr = (mod as { default: new (el: HTMLElement, opts: object) => PlyrInstance }).default;
      if (cancelled || !videoRef.current) return;
      player = new Plyr(videoRef.current, {
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
      player?.destroy();
    };
  }, [src]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={videoRef}
      src={src}
      poster={poster || undefined}
      title={title}
      controls
      playsInline
      preload="metadata"
    />
  );
}
