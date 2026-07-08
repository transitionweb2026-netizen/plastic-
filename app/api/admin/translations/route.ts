import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/cms/auth";
import { allTranslationRows, writeTranslation } from "@/lib/cms/translations-storage";
import { getAtPath } from "@/lib/cms/deep-merge";
import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

type FlatEntry = { path: string; en: string; ar: string; overridden: boolean };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Walks the shipped EN/AR message trees to enumerate every leaf path (same
 *  order every time), then reads the live value from Supabase for each —
 *  "overridden" just means the live value differs from the shipped one,
 *  purely a display hint (see lib/cms/translations-storage.ts). */
function flatten(
  enNode: unknown,
  arNode: unknown,
  rows: Map<string, { en: string; ar: string }>,
  prefix: string,
  out: FlatEntry[]
): void {
  if (!isPlainObject(enNode)) return;
  for (const key of Object.keys(enNode)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const enVal = enNode[key];
    const arVal = isPlainObject(arNode) ? arNode[key] : undefined;
    if (isPlainObject(enVal)) {
      flatten(enVal, arVal, rows, path, out);
    } else if (typeof enVal === "string") {
      const row = rows.get(path);
      const liveEn = row?.en || enVal;
      const liveAr = row?.ar || (typeof arVal === "string" ? arVal : "");
      out.push({
        path,
        en: liveEn,
        ar: liveAr,
        overridden: liveEn !== enVal || liveAr !== (typeof arVal === "string" ? arVal : ""),
      });
    }
  }
}

export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await allTranslationRows();
  const byKey = new Map(rows.map((r) => [r.key, { en: r.en, ar: r.ar }]));
  const entries: FlatEntry[] = [];
  flatten(enMessages, arMessages, byKey, "", entries);
  return NextResponse.json({ entries });
}

type SaveBody = { path: string; en?: string; ar?: string };

/** Sets a single leaf. An empty/whitespace-only value resets that locale
 *  back to the shipped default rather than storing a blank string. */
export async function PUT(request: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json()) as SaveBody;
  if (!body.path) return NextResponse.json({ error: "missing path" }, { status: 400 });

  const en =
    body.en !== undefined
      ? body.en.trim() || (getAtPath(enMessages, body.path) as string | undefined) || ""
      : undefined;
  const ar =
    body.ar !== undefined
      ? body.ar.trim() || (getAtPath(arMessages, body.path) as string | undefined) || ""
      : undefined;

  await writeTranslation(body.path, en, ar);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
