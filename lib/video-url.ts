/**
 * Normalizes an admin-pasted Video URL into something the in-site player
 * can actually render. Client-safe (imported by the lightbox players).
 *
 * Google Drive sharing links (any of the common shapes below) resolve to
 * the site's own /api/video/[id] streaming proxy, so Drive videos play in
 * the in-site Plyr player with proper mobile controls instead of Drive's
 * iframe UI. (Chrome's ORB policy blocks Drive's cross-origin download
 * endpoint inside <video> tags — a same-origin stream sidesteps that.)
 * The iframe preview is kept as `fallbackEmbed`, used only if native
 * playback errors (e.g. quota-locked or permission-restricted files):
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?export=download&id=FILE_ID
 *
 * Everything else (Supabase Storage, CDN, plain MP4) plays as-is.
 */
export type PlayableVideo = {
  src: string;
  /** Drive-only: iframe preview player to fall back to if <video> errors. */
  fallbackEmbed?: string;
};

export function resolveVideoUrl(url: string): PlayableVideo {
  const m = url.match(
    /drive\.google\.com\/(?:file\/d\/([\w-]{10,})|open\?[^#]*\bid=([\w-]{10,})|uc\?[^#]*\bid=([\w-]{10,}))/
  );
  const id = m?.[1] || m?.[2] || m?.[3];
  if (id) {
    return {
      src: `/api/video/${id}`,
      fallbackEmbed: `https://drive.google.com/file/d/${id}/preview`,
    };
  }
  return { src: url };
}
