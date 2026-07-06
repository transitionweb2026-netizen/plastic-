import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";
import { articleSlug, pageRegistry } from "@/lib/cms/seo";

/** CMS-aware bilingual sitemap: refreshes on every request so slug edits
 *  and new content appear without a rebuild. */
export const dynamic = "force-dynamic";

const PRIORITY: Record<string, number> = {
  home: 1, products: 0.9, quote: 0.9, industries: 0.8, blog: 0.7,
  gallery: 0.6, about: 0.6, contact: 0.6, privacy: 0.2, terms: 0.2,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (arPath: string, enPath: string, priority: number, lastModified: Date) => ({
    url: `${SITE_URL}${arPath === "" ? "/" : arPath}`,
    lastModified,
    priority,
    alternates: {
      languages: {
        ar: `${SITE_URL}${arPath === "" ? "/" : arPath}`,
        en: `${SITE_URL}/en${enPath}`,
      },
    },
  });

  const out: MetadataRoute.Sitemap = [];
  for (const page of pageRegistry()) {
    if (page.pageKey.startsWith("article:")) {
      const base = page.pageKey.slice(8);
      const a = ARTICLES.find((x) => x.slug === base);
      out.push(
        entry(
          `/blog/${articleSlug(base, "ar")}`,
          `/blog/${articleSlug(base, "en")}`,
          0.5,
          a ? new Date(a.date) : new Date()
        )
      );
    } else {
      const p = page.path === "/" ? "" : page.path;
      out.push(entry(p, p, PRIORITY[page.pageKey] ?? 0.5, new Date()));
    }
  }
  return out;
}
