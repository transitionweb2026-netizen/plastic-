import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

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
  ].map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    priority,
  }));

  const articles = ARTICLES.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    priority: 0.5,
  }));

  return [...pages, ...articles];
}
