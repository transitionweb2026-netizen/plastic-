import { NextResponse, type NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Serves CMS-uploaded media (OG images, favicon, apple touch icon) from
 * content/uploads/ — always reading fresh from disk, unlike Next.js's
 * built-in public/ static serving, which snapshots the public/ directory
 * ONCE at production server startup and never picks up files written
 * there afterward. A Route Handler executes as real request-time code, so
 * uploads show up immediately with no restart required.
 */

const UPLOADS_DIR = path.join(process.cwd(), "content", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  // Reject traversal / nested paths — uploads are always a flat filename.
  if (segments.length !== 1 || segments[0].includes("..") || segments[0].includes("/")) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const filename = segments[0];
  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) return NextResponse.json({ error: "not found" }, { status: 404 });

  try {
    const data = await fs.readFile(path.join(UPLOADS_DIR, filename));
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
