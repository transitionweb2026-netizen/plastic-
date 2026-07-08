import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { supabase } from "@/lib/supabase/client";

/**
 * One-off page images that have no natural home in another content table
 * (hero backgrounds, logos, client-logo marquee, category tiles, video
 * thumbnails, factory cards, map/spotlight images). Stored as a flat
 * key → url table; the shipped constant in each page/component is the
 * fallback when a key has no override (same trim-or-fallback discipline
 * as the rest of the CMS — see lib/cms/deep-merge.ts's applyContentOverride).
 */
export const SITE_IMAGE_KEYS: { key: string; label: string }[] = [
  { key: "header.logo", label: "Header — logo" },
  { key: "home.hero", label: "Home — hero background" },
  { key: "home.about", label: "Home — about section image" },
  { key: "home.clientLogo.amazon", label: "Home — client logo: Amazon" },
  { key: "home.clientLogo.carrefour", label: "Home — client logo: Carrefour" },
  { key: "home.clientLogo.lidl", label: "Home — client logo: Lidl" },
  { key: "home.clientLogo.dell", label: "Home — client logo: Dell" },
  { key: "home.clientLogo.airbus", label: "Home — client logo: Airbus" },
  { key: "home.clientLogo.nestle", label: "Home — client logo: Nestlé" },
  { key: "home.clientLogo.unilever", label: "Home — client logo: Unilever" },
  { key: "home.category.cat1", label: "Home — category tile 1" },
  { key: "home.category.cat2", label: "Home — category tile 2" },
  { key: "home.category.cat3", label: "Home — category tile 3" },
  { key: "home.category.cat4", label: "Home — category tile 4" },
  { key: "home.video.1", label: "Home — video thumbnail 1" },
  { key: "home.video.2", label: "Home — video thumbnail 2" },
  { key: "home.video.3", label: "Home — video thumbnail 3" },
  { key: "about.hero", label: "About — hero image" },
  { key: "about.factoryCard.1", label: "About — factory card 1" },
  { key: "about.factoryCard.2", label: "About — factory card 2" },
  { key: "about.factoryCard.3", label: "About — factory card 3" },
  { key: "contact.map", label: "Contact — map image" },
  { key: "requestQuote.spotlight", label: "Request Quote — spotlight image" },
];

const fetchAll = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const { data, error } = await supabase().from("cms_images").select("key, url");
    if (error) throw error;
    const out: Record<string, string> = {};
    for (const r of data ?? []) if (r.url) out[r.key] = r.url;
    return out;
  },
  ["cms-images"],
  { tags: ["cms-images"] }
);

/** Resolve one site image: CMS override if set, else the shipped default. */
export async function siteImage(key: string, fallback: string): Promise<string> {
  const all = await fetchAll();
  return all[key] || fallback;
}

/** All current overrides, keyed the same as SITE_IMAGE_KEYS — used by the
 *  admin Site Images tab to show current value (override or blank). */
export async function siteImageOverrides(): Promise<Record<string, string>> {
  return fetchAll();
}

export async function writeSiteImage(key: string, url: string): Promise<void> {
  const { error } = await supabase()
    .from("cms_images")
    .upsert({ key, url: url || null, updated_at: new Date().toISOString() });
  if (error) throw error;
  revalidateTag("cms-images", { expire: 0 });
}
