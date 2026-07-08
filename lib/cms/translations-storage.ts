import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { supabase } from "@/lib/supabase/client";

export type TranslationRow = { key: string; en: string; ar: string };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function setAtPath(tree: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cur = tree;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!isPlainObject(cur[part])) cur[part] = {};
    cur = cur[part] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

/** Every translation row — Supabase is the single live source (all leaf
 *  keys were seeded from messages/*.json, see scripts/seed-supabase.ts).
 *  Cached under "translations", invalidated by writeTranslation(). */
export const allTranslationRows = unstable_cache(
  async (): Promise<TranslationRow[]> => {
    const { data, error } = await supabase().from("translations").select("key, en, ar");
    if (error) throw error;
    return data ?? [];
  },
  ["translations"],
  { tags: ["translations"] }
);

/** Full nested message tree for next-intl, built entirely from Supabase. */
export async function messagesFromDb(locale: "en" | "ar"): Promise<Record<string, unknown>> {
  const rows = await allTranslationRows();
  const tree: Record<string, unknown> = {};
  for (const r of rows) {
    const v = locale === "en" ? r.en : r.ar;
    if (v) setAtPath(tree, r.key, v);
  }
  return tree;
}

export async function writeTranslation(path: string, en?: string, ar?: string): Promise<void> {
  const patch: { key: string; en?: string; ar?: string } = { key: path };
  if (en !== undefined) patch.en = en;
  if (ar !== undefined) patch.ar = ar;
  const { error } = await supabase().from("translations").upsert(patch);
  if (error) throw error;
  revalidateTag("translations", { expire: 0 });
}
