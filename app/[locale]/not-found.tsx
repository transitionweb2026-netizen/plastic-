import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** Localized 404 UI (styling matches the legal pages). */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet py-24 text-center">
      <p className="font-display-lg text-[64px] leading-none text-primary mb-6">404</p>
      <h1 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-background mb-4">
        {t("title")}
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-10">
        {t("description")}
      </p>
      <Link href="/" className="btn-primary inline-flex">
        {t("backHome")}
      </Link>
    </div>
  );
}
