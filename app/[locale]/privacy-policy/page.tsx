import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/lib/nav";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.privacy" });
  return { title: t("title"), description: t("description") };
}

/**
 * TODO: replace this placeholder with counsel-approved privacy policy text
 * before launch. The page exists so the footer legal links never 404.
 */
export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet py-24">
      <h1 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-background mb-6">
        {t("privacyTitle")}
      </h1>
      <div className="space-y-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        <p>
          {t("privacyP1")}
        </p>
        <p>
          {t("privacyP2")}{" "}
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
