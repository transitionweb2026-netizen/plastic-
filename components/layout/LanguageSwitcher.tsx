"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const OPTIONS: { locale: AppLocale; flag: string; labelKey: "arabic" | "english" }[] = [
  { locale: "ar", flag: "🇪🇬", labelKey: "arabic" },
  { locale: "en", flag: "🇺🇸", labelKey: "english" },
];

/**
 * Segmented language pill (🇪🇬 العربية / 🇺🇸 English). Switching persists the
 * choice in the NEXT_LOCALE cookie (read by proxy.ts) and swaps the locale
 * via a client-side navigation — no full page reload; the locale layout's
 * keyed wrapper provides the fade transition.
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
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`lang-switch ${className}`}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.locale}
          type="button"
          onClick={() => switchTo(opt.locale)}
          aria-pressed={locale === opt.locale}
          className={`lang-switch-btn ${locale === opt.locale ? "active" : ""}`}
        >
          <span aria-hidden>{opt.flag}</span>
          <span className="lang-switch-label">{t(opt.labelKey)}</span>
        </button>
      ))}
    </div>
  );
}
