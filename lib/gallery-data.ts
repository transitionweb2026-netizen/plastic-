import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
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

export type GalleryVideoAdmin = {
  id: string;
  titleEn: string;
  descEn: string;
  titleAr: string;
  descAr: string;
  thumb: string;
};

/** Raw (non-locale-merged) video text rows for the admin Gallery tab —
 *  see app/api/admin/cms/route.ts. Always-live, no publish gate (same
 *  discipline as content_site_contact/translations — a single canonical
 *  text pair per locale, not a draft/published pair). */
export async function getGalleryVideosAdmin(): Promise<GalleryVideoAdmin[]> {
  const rows = await fetchVideoRows();
  return rows.map((r) => ({
    id: r.id,
    titleEn: r.title_en,
    descEn: r.desc_en,
    titleAr: r.title_ar ?? "",
    descAr: r.desc_ar ?? "",
    thumb: r.thumb,
  }));
}

export async function writeGalleryVideoText(
  id: string,
  patch: { titleEn: string; descEn: string; titleAr: string; descAr: string }
): Promise<void> {
  const { error } = await supabase()
    .from("gallery_videos")
    .update({
      title_en: patch.titleEn,
      desc_en: patch.descEn,
      title_ar: patch.titleAr || null,
      desc_ar: patch.descAr || null,
    })
    .eq("id", id);
  if (error) throw error;
  revalidateTag("gallery-videos", { expire: 0 });
}
