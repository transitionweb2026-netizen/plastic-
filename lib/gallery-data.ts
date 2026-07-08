import "server-only";
import { unstable_cache } from "next/cache";
import { supabase } from "./supabase/client";
import GALLERY_MANIFEST from "./gallery-manifest.json";
import type { GalleryImage, GalleryVideo } from "./gallery";

type ImageRow = {
  file: string;
  alt_en: string;
  caption_en: string;
  alt_ar: string;
  caption_ar: string;
};

type VideoRow = {
  id: string;
  title_en: string;
  desc_en: string;
  title_ar: string | null;
  desc_ar: string | null;
  thumb: string;
  type: "youtube" | "mp4";
  youtube_id: string | null;
  src: string | null;
};

const fetchImageRows = unstable_cache(
  async (): Promise<ImageRow[]> => {
    const { data, error } = await supabase()
      .from("gallery_images")
      .select("file, alt_en, caption_en, alt_ar, caption_ar");
    if (error) throw error;
    return data as ImageRow[];
  },
  ["gallery-images"],
  { tags: ["gallery-images"] }
);

const fetchVideoRows = unstable_cache(
  async (): Promise<VideoRow[]> => {
    const { data, error } = await supabase().from("gallery_videos").select("*");
    if (error) throw error;
    return data as VideoRow[];
  },
  ["gallery-videos"],
  { tags: ["gallery-videos"] }
);

/** Gallery images with base alt/caption text in the requested locale
 *  (physical manifest — file/width/height — stays a static asset list,
 *  see lib/gallery-manifest.json). CMS SEO overrides are layered on top by
 *  the caller — see lib/cms/seo.ts's galleryImageSeo(). */
export async function getGalleryImages(locale: string): Promise<GalleryImage[]> {
  const rows = await fetchImageRows();
  const byFile = new Map(rows.map((r) => [r.file, r]));
  const fallback =
    locale === "ar"
      ? { alt: "منشأة جاينت ستوريدج", caption: "جاينت ستوريدج" }
      : { alt: "Giant Storage facility", caption: "Giant Storage" };
  return (GALLERY_MANIFEST as { file: string; width: number; height: number }[]).map((m) => {
    const r = byFile.get(m.file);
    return {
      src: m.file,
      width: m.width,
      height: m.height,
      alt: (locale === "ar" ? r?.alt_ar : r?.alt_en) || fallback.alt,
      caption: (locale === "ar" ? r?.caption_ar : r?.caption_en) || fallback.caption,
    };
  });
}

export async function getGalleryVideos(locale: string): Promise<GalleryVideo[]> {
  const rows = await fetchVideoRows();
  return rows.map((r) => {
    const title = (locale === "ar" ? r.title_ar : r.title_en) || r.title_en;
    const desc = (locale === "ar" ? r.desc_ar : r.desc_en) || r.desc_en;
    const common = { id: r.id, title, desc, thumb: r.thumb };
    return r.type === "youtube"
      ? { ...common, type: "youtube" as const, youtubeId: r.youtube_id! }
      : { ...common, type: "mp4" as const, src: r.src! };
  });
}
