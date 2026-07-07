import type { Metadata } from "next";
import { cmsMetadata } from "@/lib/cms/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveContact } from "@/lib/nav";
import { siteContactOverride } from "@/lib/cms/content-overlay";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return cmsMetadata("terms", locale as "en" | "ar");
}

/**
 * TODO: replace this placeholder with counsel-approved terms text before
 * launch. The page exists so the footer legal links never 404.
 */
export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const CONTACT = resolveContact(siteContactOverride());

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet py-24">
      <h1 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-background mb-6">
        {t("termsTitle")}
      </h1>
      <div className="space-y-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        <p>
          {t("termsP1")}
        </p>
        <p>
          {t("termsP2")}{" "}
          <a
            className="text-primary font-semibold hover:underline"
            href={`mailto:${CONTACT.email}`}
          >
            {CONTACT.email}
          </a>{" "}
          {t("orCall")}{" "}
          <a
            className="text-primary font-semibold hover:underline"
            href={CONTACT.phoneMain.href}
          >
            {CONTACT.phoneMain.display}
          </a>
          .
        </p>
        <p>
          <Link className="text-primary font-semibold hover:underline" href="/contact">
            {t("contactUsArrow")}
          </Link>
        </p>
      </div>
    </div>
  );
}
