"use client";

import { useRef } from "react";
import Image from "next/image";

type AboutImageParallaxProps = {
  src: string;
  alt: string;
};

/** Mouse-tilt parallax wrapper for the About section image (legacy effect). */
export default function AboutImageParallax({ src, alt }: AboutImageParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 14;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)`;
    el.style.transition = "transform .08s ease-out";
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.transition = "transform .5s ease-out";
  };

  return (
    <div
      ref={ref}
      className="about-img-wrap relative rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 24px 64px rgba(14,74,48,.18)" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        width={720}
        height={500}
        className="w-full h-[500px] object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}
