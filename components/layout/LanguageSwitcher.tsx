"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const OPTIONS: { locale: AppLocale; label: string }[] = [
  { locale: "ar", label: "AR" },
  { locale: "en", label: "EN" },
];

/** Module-level helper (not a component/hook) so the cookie write isn't
 *  flagged as mutating an outer-scope variable from within a component. */
function persistLocaleCookie(next: AppLocale) {
  document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
}

/**
 * Compact segmented language toggle (AR | EN). Switching persists the
 * choice in the NEXT_LOCALE cookie (read by proxy.ts) and swaps the locale
 * via a client-side navigation — no full reload; the locale layout's keyed
 * wrapper provides the fade transition. Arabic remains the default locale.
 */
export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("langSwitcher");
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: AppLocale) => {
    if (next === locale) return;
    persistLocaleCookie(next);
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`lang-switch ${className}`}
      dir="ltr"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.locale}
          type="button"
          onClick={() => switchTo(opt.locale)}
          aria-pressed={locale === opt.locale}
          aria-label={opt.locale === "ar" ? t("arabic") : t("english")}
          className={`lang-switch-btn ${locale === opt.locale ? "active" : ""}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
