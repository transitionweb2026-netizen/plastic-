"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

const STAT_DEFS = [
  { target: 22, suffix: "+", key: "statsMarkets" },
  { target: 600, suffix: "k", key: "statsUnits" },
  { target: 150, suffix: "+", key: "statsClients" },
  { target: 100, suffix: "%", key: "statsRecyclable" },
] as const;

/** Animated count-up stats band (legacy home.html stats section). */
export default function StatsSection() {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animateCounter = (el: HTMLElement) => {
      const target = Number(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const duration = 1900;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
          el.classList.add("stat-pulse");
          el.addEventListener(
            "animationend",
            () => el.classList.remove("stat-pulse"),
            { once: true }
          );
        }
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            section
              .querySelectorAll<HTMLElement>("[data-target]")
              .forEach(animateCounter);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-primary text-on-primary relative overflow-hidden"
    >
      <div
        className="stats-orb absolute"
        style={{
          width: 500,
          height: 500,
          top: -120,
          left: -120,
          animation: "orbFloat 8s ease-in-out infinite",
        }}
      />
      <div
        className="stats-orb absolute"
        style={{
          width: 380,
          height: 380,
          bottom: -80,
          right: -80,
          animation: "orbFloat 10s ease-in-out 3s infinite",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle,rgba(255,255,255,.06) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 lg:gap-12 text-center">
          {STAT_DEFS.map((stat) => (
            <div key={stat.key} className="space-y-3">
              <p
                className="font-display-lg text-headline-xl stat-num"
                dir="ltr"
                data-target={stat.target}
                data-suffix={stat.suffix}
              >
                0
              </p>
              <p className="font-label-lg text-label-lg opacity-75 uppercase tracking-widest">
                {t(stat.key)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
