import type { Metadata } from "next";
import { cmsMetadata } from "@/lib/cms/seo";
import { setRequestLocale } from "next-intl/server";
import IndustriesContent from "@/components/industries/IndustriesContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return cmsMetadata("industries", locale as "en" | "ar");
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <IndustriesContent />;
}
