/**
 * Gallery types. The image/video text and manifest now live in Supabase
 * (gallery_images / gallery_videos tables) — see lib/gallery-data.ts
 * (server-only) for the fetch functions. This file only keeps the types,
 * needed by client components (ImageGallery.tsx, VideoGallery.tsx).
 */
export type GalleryImage = {
  /** Stable manifest key (matches gallery_images.file) — identifies this
   *  slot regardless of whether its photo has been overridden. */
  file: string;
  /** Effective display URL: the admin-uploaded override if set, else the
   *  static manifest file itself. */
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  title?: string;
  category?: string;
  description?: string;
};

export type GalleryVideo = {
  id: string;
  title: string;
  desc: string;
  thumb: string;
} & ({ type: "youtube"; youtubeId: string } | { type: "mp4"; src: string });
