import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { isAuthenticated } from "@/lib/cms/auth";

/**
 * Image uploads for the SEO CMS. Server-side processing with sharp:
 *  - kind=og      → center-cropped 1200×630 (the OG standard), JPEG + WebP
 *  - kind=favicon → 48×48 PNG
 *  - kind=apple   → 180×180 PNG (Apple touch icon)
 *
 * Files land in content/uploads/ — deliberately NOT public/uploads/.
 * Next.js's production server (`next start`) scans the public/ directory
 * ONCE at process startup; files written there at runtime 404 until the
 * server restarts, which is unacceptable for a live CMS. The /uploads/*
 * URL is instead served by app/uploads/[...path]/route.ts, a Route Handler
 * that reads the file fresh from disk on every request (see that file for
 * the full explanation).
 */
export async function POST(request: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "og");
  if (!(file instanceof File))
    return NextResponse.json({ error: "no file" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024)
    return NextResponse.json({ error: "file too large (max 8 MB)" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "content", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const stamp = Date.now().toString(36);

  try {
    if (kind === "favicon") {
      const name = `favicon-${stamp}.png`;
      await sharp(buf).resize(48, 48, { fit: "cover" }).png().toFile(path.join(dir, name));
      return NextResponse.json({ ok: true, path: `/uploads/${name}` });
    }
    if (kind === "apple") {
      const name = `apple-touch-${stamp}.png`;
      await sharp(buf).resize(180, 180, { fit: "cover" }).png().toFile(path.join(dir, name));
      return NextResponse.json({ ok: true, path: `/uploads/${name}` });
    }
    // Open Graph: crop to the recommended 1200×630
    const name = `og-${stamp}.jpg`;
    await sharp(buf)
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(dir, name));
    await sharp(buf)
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .webp({ quality: 82 })
      .toFile(path.join(dir, `og-${stamp}.webp`));
    return NextResponse.json({ ok: true, path: `/uploads/${name}` });
  } catch {
    return NextResponse.json({ error: "image processing failed" }, { status: 422 });
  }
}
