"use client";

import { useEffect } from "react";

/**
 * Re-implements the legacy scroll-reveal IntersectionObserver: any element
 * with the `.reveal` class gets `.in-view` added the first time it enters
 * the viewport. Mount once per page that uses reveal animations — sections
 * themselves stay server-rendered.
 */
export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
