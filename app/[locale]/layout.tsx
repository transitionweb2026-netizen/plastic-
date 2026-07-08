import type { Metadata } from "next";
import { Inter, Lora, IBM_Plex_Sans_Arabic } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContactWidget from "@/components/ui/FloatingContactWidget";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { faviconLinks, organizationJsonLd } from "@/lib/cms/seo";
import { siteImage } from "@/lib/cms/images-data";
import { LOGO_SRC_DEFAULT } from "@/lib/nav";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

/** Premium Arabic UI face (site-wide when lang="ar"; see globals.css). */
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

/**
 * Material Symbols Outlined is not available through next/font/google,
 * so the variable woff2 (FILL/wght/GRAD/opsz axes) is self-hosted.
 * display "block" prevents the raw ligature text (e.g. "menu") from
 * flashing before the icon font loads.
 */
const materialSymbols = localFont({
  src: "../fonts/material-symbols-outlined.woff2",
  variable: "--font-material-symbols",
  display: "block",
  weight: "100 700",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const icons = await faviconLinks();
  return {
    metadataBase: new URL(SITE_URL),
    // Deliberately no app/favicon.ico special file: Next.js always injects
    // that as its own <link rel="icon">, alongside (not replacing) this
    // one, so a CMS-uploaded favicon couldn't reliably win over it. This
    // field is the single source of truth, falling back to the build-time
    // default until the CMS sets an override.
    icons: {
      icon: icons.favicon || "/favicon-default.ico",
      ...(icons.appleTouchIcon ? { apple: icons.appleTouchIcon } : {}),
    },
    title: {
      default: t("siteTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("siteDescription"),
    openGraph: {
      siteName: t("siteName"),
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
    },
    alternates: {
      canonical: "./",
      languages: { ar: "/", en: "/en", "x-default": "/" },
    },
  };
}

/* Organization structured data is CMS-driven (lib/cms/seo.ts). */

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const orgJsonLd = await organizationJsonLd();
  const logoSrc = await siteImage("header.logo", LOGO_SRC_DEFAULT);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} ${lora.variable} ${plexArabic.variable} ${materialSymbols.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-background text-on-background antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NextIntlClientProvider>
          {/* key={locale} remounts on language change → smooth fade-in */}
          <div key={locale} className="locale-fade flex min-h-screen flex-col">
            <Header logoSrc={logoSrc} />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingContactWidget />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
