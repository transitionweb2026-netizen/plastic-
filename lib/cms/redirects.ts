import "server-only";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import type { Redirect } from "./types";

/**
 * Deliberately lean module — called from proxy.ts on every single request —
 * so it queries only the cms_redirects table (not the full CMS aggregate)
 * and is cached under its own tag, invalidated by writeRedirects() below.
 */
const fetchRedirects = unstable_cache(
  async (): Promise<Redirect[]> => {
    const { data, error } = await supabase().from("cms_redirects").select("*");
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      from: r.from_path,
      to: r.to_path,
      statusCode: r.status_code as 301 | 302,
      createdAt: r.created_at,
    }));
  },
  ["cms-redirects"],
  { tags: ["cms-redirects"] }
);

export async function findRedirect(pathname: string) {
  const norm = pathname.replace(/\/+$/, "") || "/";
  const redirects = await fetchRedirects();
  return redirects.find((r) => (r.from.replace(/\/+$/, "") || "/") === norm);
}

export async function allRedirects(): Promise<Redirect[]> {
  return fetchRedirects();
}

export async function writeRedirects(records: Redirect[]): Promise<void> {
  const db = supabase();
  const { data: existing, error: readErr } = await db.from("cms_redirects").select("id");
  if (readErr) throw readErr;
  const keepIds = new Set(records.map((r) => r.id));
  const toDelete = (existing ?? []).map((r) => r.id).filter((id) => !keepIds.has(id));
  if (toDelete.length) {
    const { error } = await db.from("cms_redirects").delete().in("id", toDelete);
    if (error) throw error;
  }
  if (records.length) {
    const { error } = await db.from("cms_redirects").upsert(
      records.map((r) => ({
        id: r.id,
        from_path: r.from,
        to_path: r.to,
        status_code: r.statusCode,
        created_at: r.createdAt,
      }))
    );
    if (error) throw error;
  }
  const { revalidateTag } = await import("next/cache");
  revalidateTag("cms-redirects", { expire: 0 });
  revalidateTag("cms-data", { expire: 0 });
}
