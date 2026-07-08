import "server-only";
import { unstable_cache } from "next/cache";
import { supabase } from "./supabase/client";
import { applyContentOverride } from "./cms/deep-merge";
import type { IndustryModal } from "./industries";

type IndustryRow = {
  id: string;
  image: string;
  category: string;
  badge: string;
  status: string;
  status_class: IndustryModal["statusClass"];
  base_en: Omit<IndustryModal, "image" | "category" | "badge" | "status" | "statusClass">;
  base_ar: Partial<IndustryModal>;
  override_en: Partial<IndustryModal>;
  override_ar: Partial<IndustryModal>;
  published: boolean;
};

const fetchRows = unstable_cache(
  async (): Promise<IndustryRow[]> => {
    const { data, error } = await supabase().from("content_industries").select("*");
    if (error) throw error;
    return data as IndustryRow[];
  },
  ["content-industries"],
  { tags: ["content-industries"] }
);

function localizedBase(row: IndustryRow, locale: string): IndustryModal {
  const base: IndustryModal = {
    image: row.image,
    category: row.category,
    badge: row.badge,
    status: row.status,
    statusClass: row.status_class,
    ...row.base_en,
  };
  return locale !== "ar" ? base : { ...base, ...row.base_ar };
}

export async function getIndustryModals(locale: string): Promise<Record<string, IndustryModal>> {
  const rows = await fetchRows();
  const out: Record<string, IndustryModal> = {};
  for (const r of rows) {
    out[r.id] = applyContentOverride(
      localizedBase(r, locale),
      r.published ? (locale === "ar" ? r.override_ar : r.override_en) : undefined
    );
  }
  return out;
}

export async function getIndustryModal(id: string, locale: string): Promise<IndustryModal | undefined> {
  const rows = await fetchRows();
  const row = rows.find((r) => r.id === id);
  if (!row) return undefined;
  return applyContentOverride(
    localizedBase(row, locale),
    row.published ? (locale === "ar" ? row.override_ar : row.override_en) : undefined
  );
}

/** Base modals with NO content-override layer — used by the admin Content
 *  tab's GET (shows shipped defaults alongside the editable override). */
export async function getIndustryModalsBase(locale: string): Promise<Record<string, IndustryModal>> {
  const rows = await fetchRows();
  const out: Record<string, IndustryModal> = {};
  for (const r of rows) out[r.id] = localizedBase(r, locale);
  return out;
}
