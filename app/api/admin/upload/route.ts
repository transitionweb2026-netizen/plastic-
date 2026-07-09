import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAuthenticated } from "@/lib/cms/auth";
import { supabase } from "@/lib/supabase/client";

/**
 * Image uploads for the whole CMS (SEO favicon/apple/OG, and every
 * content/site image — products, industries, articles, gallery, site
 * images). Server-side processing with sharp, then stored in the public
 * Supabase Storage bucket "site-images" (not local disk — files written to
 * disk at runtime don't survive a redeploy and Next's production server
 * only scans public/ once at startup anyway).
 *
 *  - kind=favicon → 48×48 PNG
 *  - kind=apple   → 180×180 PNG (Apple touch icon)
 *  - kind=og      → center-cropped 1200×630 (the OG standard) JPEG
 *  - kind=image   → generic content photo, capped to 1600px on the long
 *                   edge, aspect preserved, re-encoded as JPEG (default) or
 *                   kept as PNG when the source has an alpha channel
 *  - kind=datasheet → product spec-sheet PDF, stored as-is (no image
 *                     processing — sharp can't and shouldn't touch it)
 */
export async function POST(request: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "image");
  if (!(file instanceof File))
    return NextResponse.json({ error: "no file" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024)
    return NextResponse.json({ error: "file too large (max 8 MB)" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const stamp = Date.now().toString(36);
  const bucket = supabase().storage.from("site-images");

  if (kind === "datasheet") {
    if (file.type !== "application/pdf")
      return NextResponse.json({ error: "file must be a PDF" }, { status: 400 });
    const name = `datasheet-${stamp}.pdf`;
    const { error } = await bucket.upload(name, buf, { contentType: "application/pdf", upsert: false });
    if (error) return NextResponse.json({ error: "upload failed" }, { status: 422 });
    const { data } = bucket.getPublicUrl(name);
    return NextResponse.json({ ok: true, path: data.publicUrl });
  }

  try {
    let name: string;
    let out: Buffer;
    let contentType: string;

    if (kind === "favicon") {
      name = `favicon-${stamp}.png`;
      out = await sharp(buf).resize(48, 48, { fit: "cover" }).png().toBuffer();
      contentType = "image/png";
    } else if (kind === "apple") {
      name = `apple-touch-${stamp}.png`;
      out = await sharp(buf).resize(180, 180, { fit: "cover" }).png().toBuffer();
      contentType = "image/png";
    } else if (kind === "og") {
      name = `og-${stamp}.jpg`;
      out = await sharp(buf)
        .resize(1200, 630, { fit: "cover", position: "attention" })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
      contentType = "image/jpeg";
    } else {
      const meta = await sharp(buf).metadata();
      const hasAlpha = Boolean(meta.hasAlpha);
      const resized = sharp(buf).resize(1600, 1600, { fit: "inside", withoutEnlargement: true });
      if (hasAlpha) {
        name = `image-${stamp}.png`;
        out = await resized.png().toBuffer();
        contentType = "image/png";
      } else {
        name = `image-${stamp}.jpg`;
        out = await resized.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
        contentType = "image/jpeg";
      }
    }

    const { error } = await bucket.upload(name, out, { contentType, upsert: false });
    if (error) throw error;
    const { data } = bucket.getPublicUrl(name);
    return NextResponse.json({ ok: true, path: data.publicUrl });
  } catch {
    return NextResponse.json({ error: "image processing failed" }, { status: 422 });
  }
}
