import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notFoundSeo } from "@/lib/cms/seo";

/**
 * Catch-all for unknown paths: renders the localized, CMS-managed 404.
 *
 * The CMS Redirect Manager is enforced in proxy.ts, not here — Next.js
 * always prefers a literal route (e.g. app/[locale]/blog/[slug]) over this
 * catch-all, so a redirect for "/blog/old-slug" would never reach this page.
 * proxy.ts intercepts every request before route resolution, so by the time
 * we're here any CMS redirect has already had its chance to fire.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = notFoundSeo(locale as "en" | "ar");
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    robots: { index: false },
    ...(seo.ogImage ? { openGraph: { images: [seo.ogImage] } } : {}),
  };
}

export default function CatchAll() {
  notFound();
}
