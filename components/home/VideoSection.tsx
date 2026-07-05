"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const VIDEO_IMGS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCvUppSIUhiLWIyyd-8B9t1tvTbccTRdXY9Nl-ZoAMQrVOWoSEOBUPOzR4MChZDQSGPBzoURAW5wiRz03UypGYnBhWRbL2bHFzLdP4oa__H5VSKHFILgRqm0OOjKI_7w5MoM1iXx21UsvZl9WUzk4UcYgTUkk9G0PPt690qiXU3pWB6FeHpoaWkfiQZQFt4WubDwOjG6SAiXOfUv6idi7QaGe3ZpmEqEMdT0z2YUXQlyT0Jtm9qCq9LAAc0s580PKk41Bbw42nyesw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAdJc6ylJWEXyzDimYyjnQ00x9XeNWK9KPZjA140wr00AvC3HpOha8CRMQffb43tWBWd5yxbzkA-ixSLkuKY-r2HOXfkEq-vYsKBp1s9aFYbGRwcmy7Q9KkED-wQcDJ2NgzMQKLq_t9VitW_ahLz27Kn2QyAWRETwkE07VNOdNwXMx_-nQZ-BEd0MsWAXmE56g9obqnPkfvTznouerMn7vRreb0zQc0xU7-gv3HdLRYmhCXA3gzBhycrRJx9C8DTc05i0FwVAMl8MM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1kpyOH_iWnAUZX8-RTg76vb4zbqZ4iP47eRO4mAHmjwp8dQT9IjGWzmq3jAk1XItktWoHE2kkRymnoB8jRwEF4INzD_7Y2_PS0wkkt2233pj6Cz9JkXj3BxSe5K8ACtSTQmkDyuSITv8x1zJU36sRXWuIra4y1GQvE65kh5Gl3-t_Jexsy5tuaIfv6WV1mPWHSubrOuhaDGrJogMrTJo1DbZUIwZkcslAGl68yoW_YUy4dDTlqTz7nBcucm11d95hnYR5zJFHvz8",
];

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
 * (ported from the legacy hand-rolled carousel).
 *
 * TODO: real video URLs were never configured in the legacy site (the
 * "Watch Now" links pointed at "#"). When videos exist, turn the buttons
 * below into links to the video/watch page.
 */
export default function VideoSection() {
  const t = useTranslations("home");
  const isRtl = useLocale() === "ar";
  const [current, setCurrent] = useState(0);
  const touchX = useRef(0);

  const videos = [
    { img: VIDEO_IMGS[0], title: t("video1Title"), desc: t("video1Desc"), shortDesc: t("video1Short") },
    { img: VIDEO_IMGS[1], title: t("video2Title"), desc: t("video2Desc"), shortDesc: t("video2Short") },
    { img: VIDEO_IMGS[2], title: t("video3Title"), desc: t("video3Desc"), shortDesc: t("video3Short") },
  ];
  const total = videos.length;

  const goTo = (n: number) => setCurrent((n + total) % total);

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
              <div className="thumb-wrap">
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
                <button type="button" className="video-card-link">
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
                  <div className="thumb-wrap">
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
                  background: i === current ? "#014e2a" : "#c0c9bf",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
