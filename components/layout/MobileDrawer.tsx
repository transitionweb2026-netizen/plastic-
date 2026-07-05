"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_LINKS, REQUEST_QUOTE } from "@/lib/nav";
import LanguageSwitcher from "./LanguageSwitcher";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Mobile slide-in navigation drawer, unified from the legacy per-page
 * implementations. Slides from the inline-start edge (left in LTR, right
 * in RTL) with the dimmed overlay.
 */
export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const t = useTranslations();

  // Legacy behavior: lock body scroll while the drawer is open; close on Escape.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <aside
        id="drawer"
        aria-hidden={!open}
        className={`fixed start-0 top-0 h-full z-[60] flex flex-col pt-8 bg-surface shadow-xl w-80 max-w-[85vw] transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
      >
        <div className="px-6 mb-8 flex justify-between items-center">
          <span className="font-headline-md text-headline-md text-primary font-bold">
            {t("header.brand")}
          </span>
          <button
            className="text-on-surface-variant"
            onClick={onClose}
            aria-label={t("header.closeMenu")}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex flex-col overflow-y-auto" aria-label={t("header.mainNavigation")}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={
                isActive(link.href)
                  ? "bg-secondary-container text-on-secondary-container rounded-xl m-2 px-4 py-3 flex items-center gap-4 translate-x-1 rtl:-translate-x-1 transition-transform"
                  : "text-on-surface-variant m-2 px-4 py-3 flex items-center gap-4 hover:bg-surface-container-high transition-colors"
              }
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="font-label-md text-label-md">
                {t(`nav.${link.key}`)}
              </span>
            </Link>
          ))}
          <Link
            href={REQUEST_QUOTE.href}
            onClick={onClose}
            className="btn-primary w-fit mx-4 mt-4"
          >
            {t("nav.requestQuote")}
          </Link>
          <div className="px-4 py-6">
            <LanguageSwitcher />
          </div>
        </nav>
      </aside>

      <div
        className={`fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
    </>
  );
}
