import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

/**
 * Bilingual sitemap: Arabic is canonical at "/", English under "/en".
 * Each entry carries hreflang alternates for both languages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/products", priority: 0.9 },
    { path: "/industries", priority: 0.8 },
    { path: "/blog", priority: 0.7 },
    { path: "/gallery", priority: 0.6 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/request-quote", priority: 0.9 },
    { path: "/privacy-policy", priority: 0.2 },
    { path: "/terms-of-service", priority: 0.2 },
  ];

  const entry = (path: string, priority: number, lastModified: Date) => ({
    url: `${SITE_URL}${path === "" ? "/" : path}`,
    lastModified,
    priority,
    alternates: {
      languages: {
        ar: `${SITE_URL}${path === "" ? "/" : path}`,
        en: `${SITE_URL}/en${path}`,
      },
    },
  });

  return [
    ...pages.map(({ path, priority }) => entry(path, priority, new Date())),
    ...ARTICLES.map((article) =>
      entry(`/blog/${article.slug}`, 0.5, new Date(article.date))
    ),
  ];
}
