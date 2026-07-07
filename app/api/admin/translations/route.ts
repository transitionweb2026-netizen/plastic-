import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/cms/auth";
import {
  readTranslationOverrides,
  writeTranslationOverrides,
} from "@/lib/cms/translations-storage";
import { getAtPath, setAtPath, deleteAtPath } from "@/lib/cms/deep-merge";
import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

type FlatEntry = { path: string; en: string; ar: string; overridden: boolean };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Walks the base EN/AR message trees together, flattening to dot-paths.
 *  Both files share identical structure (verified — mirrored namespaces),
 *  so walking EN's keys and reading the matching AR value is sufficient. */
function flatten(
  enNode: unknown,
  arNode: unknown,
  overrides: { en: Record<string, unknown>; ar: Record<string, unknown> },
  prefix: string,
  out: FlatEntry[]
): void {
  if (!isPlainObject(enNode)) return;
  for (const key of Object.keys(enNode)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const enVal = enNode[key];
    const arVal = isPlainObject(arNode) ? arNode[key] : undefined;
    if (isPlainObject(enVal)) {
      flatten(enVal, arVal, overrides, path, out);
    } else if (typeof enVal === "string") {
      const enOverride = getAtPath(overrides.en, path);
      const arOverride = getAtPath(overrides.ar, path);
      out.push({
        path,
        en: typeof enOverride === "string" ? enOverride : enVal,
        ar: typeof arOverride === "string" ? arOverride : typeof arVal === "string" ? arVal : "",
        overridden: typeof enOverride === "string" || typeof arOverride === "string",
      });
    }
  }
}

export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const overrides = readTranslationOverrides();
  const entries: FlatEntry[] = [];
  flatten(enMessages, arMessages, overrides, "", entries);
  return NextResponse.json({ entries });
}

type SaveBody = { path: string; en?: string; ar?: string };

/** Sets or clears a single leaf. A value that's empty/whitespace-only
 *  deletes the override for that locale (falls back to the shipped
 *  default) rather than storing a redundant empty string. */
export async function PUT(request: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json()) as SaveBody;
  if (!body.path) return NextResponse.json({ error: "missing path" }, { status: 400 });

  const overrides = readTranslationOverrides();
  let en = overrides.en;
  let ar = overrides.ar;

  if (body.en !== undefined) {
    en = body.en.trim() ? setAtPath(en, body.path, body.en) : deleteAtPath(en, body.path);
  }
  if (body.ar !== undefined) {
    ar = body.ar.trim() ? setAtPath(ar, body.path, body.ar) : deleteAtPath(ar, body.path);
  }

  writeTranslationOverrides({ en, ar });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
