"use client";

import { useEffect } from "react";

/**
 * Animates [data-count] elements inside injected article HTML
 * (legacy article-4 count-up strip). No-op on articles without counters.
 */
export default function ArticleCounters() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-count]");
    if (els.length === 0) return;

    const animate = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      const duration = 1600;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
