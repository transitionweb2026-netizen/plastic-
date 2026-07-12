import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/cms/auth";
import { supabase } from "@/lib/supabase/client";

/**
 * Issues a one-time signed upload URL so the admin's browser can PUT a
 * video file STRAIGHT into Supabase Storage — the file never passes
 * through this server (serverless request bodies are size-capped, and
 * direct upload gives the client real progress events). The client then
 * saves the returned public URL through the normal content endpoints.
 */
export async function POST(request: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { filename } = (await request.json()) as { filename?: string };
  const ext = (filename ?? "").split(".").pop()?.toLowerCase() ?? "";
  if (!["mp4", "webm", "mov", "m4v"].includes(ext))
    return NextResponse.json({ error: "file must be a video (mp4/webm/mov)" }, { status: 400 });

  const name = `video-${Date.now().toString(36)}.${ext === "mov" ? "mp4" : ext}`;
  const bucket = supabase().storage.from("site-images");

  const { data, error } = await bucket.createSignedUploadUrl(name);
  if (error || !data)
    return NextResponse.json({ error: "could not create upload URL" }, { status: 500 });

  const { data: pub } = bucket.getPublicUrl(name);
  return NextResponse.json({
    ok: true,
    uploadUrl: data.signedUrl,
    publicUrl: pub.publicUrl,
  });
}
