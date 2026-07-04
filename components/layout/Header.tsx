"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LOGO_SRC, NAV_LINKS, REQUEST_QUOTE } from "@/lib/nav";
import MobileDrawer from "./MobileDrawer";

/**
 * Canonical site header, unified from the legacy per-page variants
 * (home.html look: sticky, translucent surface, underline nav links,
 * Request Quote pill) with the slide-in drawer for mobile.
 */
export default function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Legacy behavior: header gains a shadow once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`bg-surface/80 backdrop-blur-md text-primary border-b border-outline-variant/30 top-0 sticky z-50 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto h-20">
          <Link
            href="/"
            className="flex items-center gap-4"
            aria-label="Giant Storage — Home"
          >
            <Image
              alt="Giant Storage Logo"
              className="h-12 w-auto object-contain"
              src={LOGO_SRC}
              width={120}
              height={48}
              priority
            />
            <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary uppercase">
              GIANT STORAGE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={
                  isActive(link.href)
                    ? "text-primary font-bold font-label-lg text-label-lg nav-link nav-link-active"
                    : "text-on-surface-variant hover:text-primary transition-colors font-label-lg text-label-lg nav-link"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href={REQUEST_QUOTE.href}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-lg text-label-lg hover:bg-secondary active:scale-95 transition-all premium-shadow hidden md:inline-flex items-center"
              style={{ boxShadow: "0 4px 18px rgba(1,78,42,.3)" }}
            >
              {REQUEST_QUOTE.label}
            </Link>
            <button
              className="md:hidden text-primary hover:scale-110 transition-transform"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
