/**
 * Normalizes an admin-pasted Video URL into something the in-site player
 * can actually render. Client-safe (imported by the lightbox players).
 *
 * - Google Drive sharing links (any of the common shapes below) become the
 *   Drive inline-preview player, rendered in an <iframe> like YouTube —
 *   direct-download Drive URLs are unreliable for files over ~100 MB
 *   (virus-scan interstitial), the preview player is not:
 *     https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *     https://drive.google.com/open?id=FILE_ID
 *     https://drive.google.com/uc?export=download&id=FILE_ID
 * - Everything else (Supabase Storage, CDN, plain MP4) plays as a direct
 *   file in the native <video> element.
 */
export type PlayableVideo =
  | { kind: "file"; src: string }
  | { kind: "embed"; src: string };

export function resolveVideoUrl(url: string): PlayableVideo {
  const m = url.match(
    /drive\.google\.com\/(?:file\/d\/([\w-]{10,})|open\?[^#]*\bid=([\w-]{10,})|uc\?[^#]*\bid=([\w-]{10,}))/
  );
  const id = m?.[1] || m?.[2] || m?.[3];
  if (id) return { kind: "embed", src: `https://drive.google.com/file/d/${id}/preview` };
  return { kind: "file", src: url };
}
