/**
 * Universal Video URL resolver — normalizes any admin-pasted video link
 * into something the in-site lightbox can render. Client-safe (imported by
 * the lightbox players). The CMS user never picks a provider; detection is
 * automatic from the URL shape.
 *
 * kind: "file"  → plays in the site's Plyr player (<video>):
 *   - Supabase Storage / CDN / plain MP4 URLs (used as-is)
 *   - Google Drive sharing links → the site's /api/video/[id] streaming
 *     proxy (Chrome's ORB blocks Drive's endpoint cross-origin), with the
 *     Drive preview iframe kept as fallbackEmbed if streaming errors
 *   - Dropbox share links → raw=1 direct-content form
 *   - OneDrive 1drv.ms short links → api.onedrive.com direct-content form
 *
 * kind: "embed" → renders the provider's own player in the existing
 * lightbox iframe (never leaves the site):
 *   - YouTube watch/short/live/embed links → youtube-nocookie embed
 *   - Vimeo links (incl. unlisted hash) → player.vimeo.com embed
 *   - Loom share links → loom.com embed
 *   - onedrive.live.com share links → OneDrive embed player
 */
export type PlayableVideo =
  | { kind: "file"; src: string; fallbackEmbed?: string }
  | { kind: "embed"; src: string };

export function resolveVideoUrl(url: string): PlayableVideo {
  const trimmed = url.trim();

  // ── YouTube (watch, youtu.be, Shorts, live, embed) ──
  const yt = trimmed.match(
    /(?:youtube\.com\/(?:watch\?[^#]*?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) {
    return {
      kind: "embed",
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&playsinline=1`,
    };
  }

  // ── Vimeo (public or unlisted-with-hash, player links too) ──
  const vimeo = trimmed.match(
    /vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/
  );
  if (vimeo) {
    const hash = vimeo[2] ? `&h=${vimeo[2]}` : "";
    return {
      kind: "embed",
      src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&playsinline=1${hash}`,
    };
  }

  // ── Loom ──
  const loom = trimmed.match(/loom\.com\/(?:share|embed)\/([a-f0-9]{16,})/);
  if (loom) {
    return { kind: "embed", src: `https://www.loom.com/embed/${loom[1]}` };
  }

  // ── Google Drive ──
  const drive = trimmed.match(
    /drive\.google\.com\/(?:file\/d\/([\w-]{10,})|open\?[^#]*\bid=([\w-]{10,})|uc\?[^#]*\bid=([\w-]{10,}))/
  );
  const driveId = drive?.[1] || drive?.[2] || drive?.[3];
  if (driveId) {
    return {
      kind: "file",
      src: `/api/video/${driveId}`,
      fallbackEmbed: `https://drive.google.com/file/d/${driveId}/preview`,
    };
  }

  // ── Dropbox share links → direct content (raw=1) ──
  if (/(?:www\.)?dropbox\.com\//.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      u.searchParams.delete("dl");
      u.searchParams.set("raw", "1");
      return { kind: "file", src: u.toString() };
    } catch {
      /* malformed URL — fall through to as-is */
    }
  }

  // ── OneDrive ──
  // 1drv.ms short share links → direct content via the shares API.
  if (/1drv\.ms\//.test(trimmed)) {
    const b64 = btoa(trimmed).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
    return {
      kind: "file",
      src: `https://api.onedrive.com/v1.0/shares/u!${b64}/root/content`,
    };
  }
  // onedrive.live.com links → OneDrive's embed player.
  if (/onedrive\.live\.com\//.test(trimmed)) {
    return {
      kind: "embed",
      src: trimmed.replace(/\/(redir|view|download)\b/, "/embed"),
    };
  }

  // ── Everything else: direct video file (Supabase Storage, CDN, MP4…) ──
  return { kind: "file", src: trimmed };
}
