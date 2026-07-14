import { getArticles } from "@/lib/articles-data";
import { SITE_URL } from "@/lib/site";
import { articleSlug, pageRegistry } from "@/lib/cms/seo";

/** CMS-aware bilingual sitemap: refreshes on every request so slug edits
 *  and new content appear without a rebuild. */
export const dynamic = "force-dynamic";

const PRIORITY: Record<string, number> = {
  home: 1, products: 0.9, quote: 0.9, industries: 0.8, blog: 0.7,
  gallery: 0.6, about: 0.6, contact: 0.6, privacy: 0.2, terms: 0.2,
};

type SitemapEntry = {
  url: string;
  lastModified: Date;
  priority: number;
  alternates: { ar: string; en: string };
};

/** Escapes the five reserved XML characters — defensive, since URLs/slugs
 *  are otherwise trusted CMS/code data, not raw user input. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function buildEntries(): Promise<SitemapEntry[]> {
  const entry = (arPath: string, enPath: string, priority: number, lastModified: Date) => {
    const arUrl = `${SITE_URL}${arPath === "" ? "/" : arPath}`;
    return {
      url: arUrl,
      lastModified,
      priority,
      alternates: { ar: arUrl, en: `${SITE_URL}/en${enPath}` },
    };
  };

  const articles = await getArticles("en");
  const out: SitemapEntry[] = [];
  for (const page of await pageRegistry()) {
    if (page.pageKey.startsWith("article:")) {
      const base = page.pageKey.slice(8);
      const a = articles.find((x) => x.slug === base);
      out.push(
        entry(
          `/blog/${await articleSlug(base, "ar")}`,
          `/blog/${await articleSlug(base, "en")}`,
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

/** Hand-rolled XML Route Handler — bypasses the app/sitemap.ts Metadata
 *  Route convention entirely. That convention relies on Next's own server
 *  serializing the returned array into XML at request time; on this host
 *  it was instead returning the raw entries as plain text, so this route
 *  builds and returns the XML document explicitly (with an explicit
 *  Content-Type) rather than depending on that serialization step. */
export async function GET() {
  const entries = await buildEntries();
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    entries
      .map(
        (e) =>
          `<url>\n` +
          `<loc>${escapeXml(e.url)}</loc>\n` +
          `<xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(e.alternates.ar)}" />\n` +
          `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(e.alternates.en)}" />\n` +
          `<lastmod>${e.lastModified.toISOString()}</lastmod>\n` +
          `<priority>${e.priority}</priority>\n` +
          `</url>\n`
      )
      .join("") +
    `</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
