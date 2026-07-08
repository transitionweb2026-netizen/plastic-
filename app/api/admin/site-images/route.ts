import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/cms/auth";
import { SITE_IMAGE_KEYS, siteImageOverrides, writeSiteImage } from "@/lib/cms/images-data";

export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const values = await siteImageOverrides();
  return NextResponse.json({ keys: SITE_IMAGE_KEYS, values });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { key, url } = (await request.json()) as { key: string; url: string };
  if (!SITE_IMAGE_KEYS.some((k) => k.key === key))
    return NextResponse.json({ error: "unknown key" }, { status: 400 });
  await writeSiteImage(key, url);
  return NextResponse.json({ ok: true });
}
