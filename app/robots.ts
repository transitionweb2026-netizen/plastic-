import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { readCms } from "@/lib/cms/storage";

/** CMS-managed robots.txt (Allow/Disallow rules + custom lines). Admin and
 *  API routes are always excluded. */
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const cfg = (await readCms()).global.robots;
  const rules =
    cfg.rules.length > 0
      ? cfg.rules.map((r) => ({
          userAgent: r.userAgent || "*",
          allow: r.allow.length ? r.allow : undefined,
          disallow: [...r.disallow, "/admin", "/api"],
        }))
      : [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }];
  return {
    rules,
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
