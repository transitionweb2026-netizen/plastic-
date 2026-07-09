import type { Metadata } from "next";
import { cmsMetadata } from "@/lib/cms/seo";
import { getIndustryModals } from "@/lib/industries-data";
import { setRequestLocale } from "next-intl/server";
import IndustriesContent from "@/components/industries/IndustriesContent";
import { siteImage } from "@/lib/cms/images-data";

const HERO_IMG_DEFAULT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD9tA-rr56TAmeLUnSIaFKlqLG4WOQHKeKl--QJeyBeW4FocUP0_70tEj7xLqMSxysGDlXeHbbhUEYKgQDUx4Bobd1-tTTOPJbQ-sBlHT8xEeBEuI246As9lEE9_tN8TpHTJADF-JYWyVqKw8d_Y9FUF9rfzQdccymjHv0TkPA9KCAip3cT_w1e5ZaTtgmlFM5xlQ17smw7Xjp3FFIyb6tOk2YOJGs4PnucZmYwhk3bSsUt8q0LPvZ0eKBY8BA4-mxFCSsjFeZyefM";
const TECH_IMG_DEFAULT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9xG4AOLYtNF6EeqxOIyGlrwnGXVZUlh95ADhGQ5AGSP8iESn5u-6v9g6KADSN3RpjfF6GSiDeK_wNYUVdHIn8wKBxZo_D4u9W7UgkZA4jTj8gm6koZL_FxEZ09iCcpCZPIXctcf8iSUoqEetfgp8MdJ_j2BULAwR3iDzEF6mOP0MVLDYrXY-U0epKLARtpzAZ9k7HEDlc-6_7ehjbIBA8VuQ5uUQMbtKDSe1MNKu1hOQNMOmYz0K1x0EiDW25D-yKgCj4LWADIk";

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
  const modals = await getIndustryModals(locale);
  const heroImg = await siteImage("industries.hero", HERO_IMG_DEFAULT);
  const techImg = await siteImage("industries.techHighlight", TECH_IMG_DEFAULT);

  return <IndustriesContent modals={modals} heroImg={heroImg} techImg={techImg} />;
}
