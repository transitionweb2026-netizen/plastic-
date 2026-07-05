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
import { CONTACT } from "@/lib/nav";
import { SITE_NAME, SITE_URL } from "@/lib/site";
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
  return {
    metadataBase: new URL(SITE_URL),
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

/** Organization structured data (site-wide). */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT.email,
  telephone: CONTACT.phoneMain.display,
  address: {
    "@type": "PostalAddress",
    streetAddress: "22 El Tayaran St., Nasr City",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
};

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

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} ${lora.variable} ${plexArabic.variable} ${materialSymbols.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-background text-on-background antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider>
          {/* key={locale} remounts on language change → smooth fade-in */}
          <div key={locale} className="locale-fade flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingContactWidget />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
