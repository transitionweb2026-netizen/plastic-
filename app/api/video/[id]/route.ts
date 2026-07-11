import { NextResponse } from "next/server";

/**
 * Same-origin streaming proxy for Google Drive-hosted videos.
 *
 * Chrome's Opaque Response Blocking (ORB) refuses cross-origin
 * drive.usercontent.google.com responses inside <video> elements, so the
 * in-site Plyr player can't stream Drive files directly. This route pipes
 * the file through the site's own origin instead: it forwards the
 * browser's Range requests to Drive's direct-download endpoint (confirm=t
 * skips the large-file virus-scan interstitial) and streams the body back,
 * preserving the range/партial-content headers seeking depends on.
 *
 * Locked to Drive file IDs only — this is not a general-purpose proxy.
 */

export const maxDuration = 300;

const FILE_ID = /^[\w-]{10,}$/;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!FILE_ID.test(id))
    return NextResponse.json({ error: "bad id" }, { status: 400 });

  const upstreamHeaders: Record<string, string> = {};
  const range = request.headers.get("range");
  if (range) upstreamHeaders.Range = range;

  const upstream = await fetch(
    `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
    { headers: upstreamHeaders, redirect: "follow" }
  );

  const type = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || type.startsWith("text/html")) {
    // Interstitial/permission page instead of media — let the client's
    // <video> error out so the lightbox can fall back to the Drive embed.
    return NextResponse.json({ error: "not streamable" }, { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", type || "video/mp4");
  for (const h of ["content-length", "content-range", "accept-ranges"]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }
  // Drive serves immutable file revisions — let the CDN/browser cache chunks.
  headers.set("Cache-Control", "public, max-age=3600");

  return new Response(upstream.body, { status: upstream.status, headers });
}
