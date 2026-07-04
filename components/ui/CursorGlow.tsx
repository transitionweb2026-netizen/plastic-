"use client";

import { useEffect, useRef } from "react";

/** Soft green radial glow that follows the cursor (legacy home.html effect). */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = ref.current;
    if (!glow) return;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      glow.style.opacity = "1";
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(${e.clientX - 240}px, ${e.clientY - 240}px)`;
      });
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div id="cursor-glow" ref={ref} aria-hidden="true" />;
}
