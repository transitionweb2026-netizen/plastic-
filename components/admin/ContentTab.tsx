"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";

type Locale = "en" | "ar";

type ProductFields = {
  name?: string; category?: string; badge?: string; status?: string;
  shortDesc?: string; description?: string; material?: string;
  dimensions?: string; loadCapacity?: string; colors?: string[]; applications?: string[];
  features?: string[]; availability?: string;
};
type IndustryFields = {
  title?: string; description?: string; specs?: [string, string][];
  features?: string[]; applications?: string[]; industries?: string[]; availability?: string;
};
type LinkField = { href: string | null; label: string; title: string; disabled: boolean };
type RelatedItem = { href: string; img: string; category: string; title: string };
type ArticleCta = {
  badge: string; title: string; description: string;
  button1Text: string; button1Href: string; button2Text: string; button2Href: string;
};
type ArticleFields = {
  title?: string; h1?: string; heroBadge?: string; description?: string; bodyHtml?: string;
  authorBio?: { name: string; roleTitle: string; bio: string };
  prevLink?: LinkField;
  nextLink?: LinkField;
  relatedArticles?: RelatedItem[];
  cta?: ArticleCta;
};

type ContentRecord<T> = { published: boolean; en: T; ar: T; updatedAt?: string };
type SiteContact = {
  email?: string; phoneMainDisplay?: string; phoneMainHref?: string;
  phoneLogisticsDisplay?: string; phoneLogisticsHref?: string;
};

type Payload = {
  products: {
    id: number; nameEn: string; nameAr: string;
    image: string; coverImage: string; images: string[];
    base: { en: ProductFields; ar: ProductFields };
  }[];
  industries: {
    id: string; titleEn: string; titleAr: string; image: string;
    base: { en: IndustryFields; ar: IndustryFields };
  }[];
  articles: {
    slug: string; titleEn: string; titleAr: string; heroImg: string; heroAlt: string;
    base: { en: ArticleFields; ar: ArticleFields };
  }[];
  overrides: {
    products: Record<string, ContentRecord<ProductFields>>;
    industries: Record<string, ContentRecord<IndustryFields>>;
    articles: Record<string, ContentRecord<ArticleFields>>;
    siteContact: SiteContact;
  };
};

const inputCls =
  "w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary outline-none transition-colors";

async function saveContent(body: unknown): Promise<boolean> {
  const res = await fetch("/api/admin/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.ok;
}

const arrToText = (a?: string[]) => (a ?? []).join("\n");
const textToArr = (t: string) => t.split("\n").map((s) => s.trim()).filter(Boolean);
const specsToText = (s?: [string, string][]) => (s ?? []).map(([k, v]) => `${k}: ${v}`).join("\n");
const textToSpecs = (t: string): [string, string][] =>
  t
    .split("\n")
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx < 0) return null;
      const k = line.slice(0, idx).trim();
      const v = line.slice(idx + 1).trim();
      return k ? ([k, v] as [string, string]) : null;
    })
    .filter((x): x is [string, string] => x !== null);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─────────────────────── Product editor ─────────────────────── */

function ProductCard({
  id, nameEn, nameAr, image, coverImage, images, base, record, onSave, onSaveImages,
}: {
  id: number; nameEn: string; nameAr: string;
  image: string; coverImage: string; images: string[];
  base: { en: ProductFields; ar: ProductFields };
  record: ContentRecord<ProductFields>;
  onSave: (rec: ContentRecord<ProductFields>) => Promise<boolean>;
  onSaveImages: (patch: { image?: string; coverImage?: string; images?: string[] }) => Promise<boolean>;
}) {
  const [rec, setRec] = useState(record);
  const [loc, setLoc] = useState<Locale>("en");
  const [busy, setBusy] = useState<"" | "draft" | "publish">("");
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);

  const [imgState, setImgState] = useState({ image, coverImage, images });
  const [imgBusy, setImgBusy] = useState(false);
  const [imgSaved, setImgSaved] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const f = rec[loc];
  const b = base[loc];
  const set = (patch: Partial<ProductFields>) =>
    setRec((r) => ({ ...r, [loc]: { ...r[loc], ...patch } }));

  const doSave = async (publish: boolean) => {
    setBusy(publish ? "publish" : "draft");
    const ok = await onSave({ ...rec, published: publish });
    setBusy("");
    if (ok) {
      setRec((r) => ({ ...r, published: publish }));
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } else {
      setFailed(true);
      setTimeout(() => setFailed(false), 4000);
    }
  };

  const doSaveImages = async () => {
    setImgBusy(true);
    const ok = await onSaveImages(imgState);
    setImgBusy(false);
    if (ok) {
      setImgSaved(true);
      setTimeout(() => setImgSaved(false), 1800);
    } else {
      setImgFailed(true);
      setTimeout(() => setImgFailed(false), 4000);
    }
  };

  return (
    <details className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
        <span className="font-label-lg text-label-lg truncate">#{id} — {nameEn}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${rec.published ? "bg-[#d1fae5] text-[#065f46]" : "bg-surface-container-high text-on-surface-variant"}`}>
          {rec.published ? "Published" : "Draft"}
        </span>
      </summary>
      <div className="px-5 pb-5 border-t border-outline-variant/50 pt-4">
        <details className="mb-4 border border-outline-variant rounded-lg">
          <summary className="text-xs font-bold text-on-surface-variant uppercase tracking-wide cursor-pointer px-3 py-2.5">
            Photos
          </summary>
          <div className="px-3 pb-3">
            <ImageUploader
              label="Main catalog photo"
              value={imgState.image}
              onChange={(url) => setImgState((s) => ({ ...s, image: url }))}
            />
            <ImageUploader
              label="Cover photo (collapsed card) — leave blank to use main photo"
              value={imgState.coverImage}
              onChange={(url) => setImgState((s) => ({ ...s, coverImage: url }))}
            />
            <div className="mb-1">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1">
                Gallery photos
              </label>
              <div className="flex flex-wrap gap-3">
                {imgState.images.map((url, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <ImageUploader
                      compact
                      value={url}
                      onChange={(newUrl) =>
                        setImgState((s) => ({
                          ...s,
                          images: newUrl
                            ? s.images.map((x, j) => (j === i ? newUrl : x))
                            : s.images.filter((_, j) => j !== i),
                        }))
                      }
                    />
                  </div>
                ))}
                <ImageUploader
                  compact
                  onChange={(url) =>
                    url && setImgState((s) => ({ ...s, images: [...s.images, url] }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <button disabled={imgBusy} onClick={doSaveImages} className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold disabled:opacity-60">
                {imgBusy ? "Saving…" : "Save Photos"}
              </button>
              {imgSaved && <span className="text-primary text-xs font-bold">Saved ✓</span>}
              {imgFailed && <span className="text-error text-xs font-bold">Save failed</span>}
            </div>
          </div>
        </details>
        <div className="flex gap-1 mb-4">
          {(["en", "ar"] as const).map((l) => (
            <button key={l} onClick={() => setLoc(l)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${loc === l ? "bg-primary text-white" : "bg-surface-container-low"}`}>
              {l === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
        <Field label={`Name (default: ${b.name ?? nameAr})`}>
          <input className={inputCls} value={f.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Category label"><input className={inputCls} value={f.category ?? ""} onChange={(e) => set({ category: e.target.value })} /></Field>
          <Field label="Badge (image pill)"><input className={inputCls} value={f.badge ?? ""} onChange={(e) => set({ badge: e.target.value })} /></Field>
          <Field label="Status (e.g. In Stock)"><input className={inputCls} value={f.status ?? ""} onChange={(e) => set({ status: e.target.value })} /></Field>
        </div>
        <Field label="Short description (catalog card)">
          <textarea className={inputCls} rows={2} value={f.shortDesc ?? ""} onChange={(e) => set({ shortDesc: e.target.value })} />
        </Field>
        <Field label="Full description (detail modal)">
          <textarea className={inputCls} rows={3} value={f.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Material"><input className={inputCls} value={f.material ?? ""} onChange={(e) => set({ material: e.target.value })} /></Field>
          <Field label="Dimensions"><input className={inputCls} value={f.dimensions ?? ""} onChange={(e) => set({ dimensions: e.target.value })} /></Field>
          <Field label="Load capacity"><input className={inputCls} value={f.loadCapacity ?? ""} onChange={(e) => set({ loadCapacity: e.target.value })} /></Field>
        </div>
        <Field label="Applications (one per line)">
          <textarea className={inputCls} rows={3} value={arrToText(f.applications)} onChange={(e) => set({ applications: textToArr(e.target.value) })} />
        </Field>
        <Field label="Features (one per line)">
          <textarea className={inputCls} rows={3} value={arrToText(f.features)} onChange={(e) => set({ features: textToArr(e.target.value) })} />
        </Field>
        <Field label="Availability"><input className={inputCls} value={f.availability ?? ""} onChange={(e) => set({ availability: e.target.value })} /></Field>

        <div className="flex items-center gap-3 mt-5">
          <button disabled={!!busy} onClick={() => doSave(false)} className="px-5 py-2.5 border border-outline-variant rounded-lg text-sm font-bold disabled:opacity-60">
            {busy === "draft" ? "Saving…" : "Save Draft"}
          </button>
          <button disabled={!!busy} onClick={() => doSave(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold disabled:opacity-60">
            {busy === "publish" ? "Publishing…" : "Publish"}
          </button>
          {saved && <span className="text-primary text-sm font-bold">Saved ✓</span>}
          {failed && <span className="text-error text-sm font-bold">Save failed — check connection and try again</span>}
        </div>
      </div>
    </details>
  );
}

/* ─────────────────────── Industry modal editor ─────────────────────── */

function IndustryCard({
  id, titleEn, titleAr, image, base, record, onSave, onSaveImage,
}: {
  id: string; titleEn: string; titleAr: string; image: string;
  base: { en: IndustryFields; ar: IndustryFields };
  record: ContentRecord<IndustryFields>;
  onSave: (rec: ContentRecord<IndustryFields>) => Promise<boolean>;
  onSaveImage: (image: string) => Promise<boolean>;
}) {
  const [rec, setRec] = useState(record);
  const [loc, setLoc] = useState<Locale>("en");
  const [busy, setBusy] = useState<"" | "draft" | "publish">("");
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);

  const [img, setImg] = useState(image);
  const [imgBusy, setImgBusy] = useState(false);
  const [imgSaved, setImgSaved] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const f = rec[loc];
  const set = (patch: Partial<IndustryFields>) =>
    setRec((r) => ({ ...r, [loc]: { ...r[loc], ...patch } }));

  const doSave = async (publish: boolean) => {
    setBusy(publish ? "publish" : "draft");
    const ok = await onSave({ ...rec, published: publish });
    setBusy("");
    if (ok) {
      setRec((r) => ({ ...r, published: publish }));
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } else {
      setFailed(true);
      setTimeout(() => setFailed(false), 4000);
    }
  };

  const doSaveImage = async (url: string) => {
    setImg(url);
    setImgBusy(true);
    const ok = await onSaveImage(url);
    setImgBusy(false);
    if (ok) {
      setImgSaved(true);
      setTimeout(() => setImgSaved(false), 1800);
    } else {
      setImgFailed(true);
      setTimeout(() => setImgFailed(false), 4000);
    }
  };

  return (
    <details className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
        <span className="font-label-lg text-label-lg truncate">{id} — {titleEn}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${rec.published ? "bg-[#d1fae5] text-[#065f46]" : "bg-surface-container-high text-on-surface-variant"}`}>
          {rec.published ? "Published" : "Draft"}
        </span>
      </summary>
      <div className="px-5 pb-5 border-t border-outline-variant/50 pt-4">
        <p className="text-xs text-on-surface-variant mb-3">
          This edits the click-through detail modal only. The card grid on the
          Industries page itself is edited under Translations → industriesPage.
        </p>
        <div className="mb-4">
          <ImageUploader label="Photo" value={img} onChange={doSaveImage} />
          {imgBusy && <span className="text-xs text-on-surface-variant">Saving…</span>}
          {imgSaved && <span className="text-xs text-primary font-bold">Saved ✓</span>}
          {imgFailed && <span className="text-xs text-error font-bold">Save failed</span>}
        </div>
        <div className="flex gap-1 mb-4">
          {(["en", "ar"] as const).map((l) => (
            <button key={l} onClick={() => setLoc(l)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${loc === l ? "bg-primary text-white" : "bg-surface-container-low"}`}>
              {l === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
        <Field label={`Title (default: ${titleAr})`}>
          <input className={inputCls} value={f.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea className={inputCls} rows={3} value={f.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
        </Field>
        <Field label="Specs (one 'label: value' per line)">
          <textarea className={inputCls} rows={4} value={specsToText(f.specs)} onChange={(e) => set({ specs: textToSpecs(e.target.value) })} />
        </Field>
        <Field label="Features (one per line)">
          <textarea className={inputCls} rows={3} value={arrToText(f.features)} onChange={(e) => set({ features: textToArr(e.target.value) })} />
        </Field>
        <Field label="Applications (one per line)">
          <textarea className={inputCls} rows={3} value={arrToText(f.applications)} onChange={(e) => set({ applications: textToArr(e.target.value) })} />
        </Field>
        <Field label="Availability"><input className={inputCls} value={f.availability ?? ""} onChange={(e) => set({ availability: e.target.value })} /></Field>

        <div className="flex items-center gap-3 mt-5">
          <button disabled={!!busy} onClick={() => doSave(false)} className="px-5 py-2.5 border border-outline-variant rounded-lg text-sm font-bold disabled:opacity-60">
            {busy === "draft" ? "Saving…" : "Save Draft"}
          </button>
          <button disabled={!!busy} onClick={() => doSave(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold disabled:opacity-60">
            {busy === "publish" ? "Publishing…" : "Publish"}
          </button>
          {saved && <span className="text-primary text-sm font-bold">Saved ✓</span>}
          {failed && <span className="text-error text-sm font-bold">Save failed — check connection and try again</span>}
        </div>
      </div>
    </details>
  );
}

/* ─────────────────────── Article editor ─────────────────────── */

function ArticleCard({
  slug, titleEn, titleAr, heroImg, base, record, onSave, onSaveHero,
}: {
  slug: string; titleEn: string; titleAr: string; heroImg: string;
  base: { en: ArticleFields; ar: ArticleFields };
  record: ContentRecord<ArticleFields>;
  onSave: (rec: ContentRecord<ArticleFields>) => Promise<boolean>;
  onSaveHero: (heroImg: string) => Promise<boolean>;
}) {
  const [rec, setRec] = useState(record);
  const [loc, setLoc] = useState<Locale>("en");
  const [busy, setBusy] = useState<"" | "draft" | "publish">("");
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);

  const [hero, setHero] = useState(heroImg);
  const [heroBusy, setHeroBusy] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [heroFailed, setHeroFailed] = useState(false);

  const f = rec[loc];
  const b = base[loc];
  const set = (patch: Partial<ArticleFields>) =>
    setRec((r) => ({ ...r, [loc]: { ...r[loc], ...patch } }));

  const doSave = async (publish: boolean) => {
    setBusy(publish ? "publish" : "draft");
    const ok = await onSave({ ...rec, published: publish });
    setBusy("");
    if (ok) {
      setRec((r) => ({ ...r, published: publish }));
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } else {
      setFailed(true);
      setTimeout(() => setFailed(false), 4000);
    }
  };

  const doSaveHero = async (url: string) => {
    setHero(url);
    setHeroBusy(true);
    const ok = await onSaveHero(url);
    setHeroBusy(false);
    if (ok) {
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 1800);
    } else {
      setHeroFailed(true);
      setTimeout(() => setHeroFailed(false), 4000);
    }
  };

  return (
    <details className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
        <span className="font-label-lg text-label-lg truncate">{titleEn}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${rec.published ? "bg-[#d1fae5] text-[#065f46]" : "bg-surface-container-high text-on-surface-variant"}`}>
          {rec.published ? "Published" : "Draft"}
        </span>
      </summary>
      <div className="px-5 pb-5 border-t border-outline-variant/50 pt-4">
        <p className="text-xs text-on-surface-variant mb-3">
          Listing-page teaser text is edited under Translations → blogPage.
          This edits the article's detail page.
        </p>
        <div className="mb-4">
          <ImageUploader label="Hero image" value={hero} onChange={doSaveHero} />
          {heroBusy && <span className="text-xs text-on-surface-variant">Saving…</span>}
          {heroSaved && <span className="text-xs text-primary font-bold">Saved ✓</span>}
          {heroFailed && <span className="text-xs text-error font-bold">Save failed</span>}
        </div>
        <div className="flex gap-1 mb-4">
          {(["en", "ar"] as const).map((l) => (
            <button key={l} onClick={() => setLoc(l)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${loc === l ? "bg-primary text-white" : "bg-surface-container-low"}`}>
              {l === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
        <Field label={`Title (default: ${b.title ?? titleAr})`}>
          <input className={inputCls} value={f.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label="H1 (page heading)">
          <input className={inputCls} value={f.h1 ?? ""} onChange={(e) => set({ h1: e.target.value })} />
        </Field>
        <Field label="Hero badge (small pill above the title)">
          <input className={inputCls} value={f.heroBadge ?? ""} onChange={(e) => set({ heroBadge: e.target.value })} />
        </Field>
        <Field label="Description (meta + teaser)">
          <textarea className={inputCls} rows={2} value={f.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
        </Field>
        <Field label="Body">
          <RichTextEditor
            key={`${slug}-${loc}`}
            value={f.bodyHtml || b.bodyHtml || ""}
            onChange={(html) => set({ bodyHtml: html })}
          />
        </Field>

        <details className="mt-4 border-t border-outline-variant pt-4">
          <summary className="text-xs font-bold text-on-surface-variant uppercase tracking-wide cursor-pointer mb-3">
            Author bio {b.authorBio ? "" : "(none by default)"}
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Name">
              <input className={inputCls} value={f.authorBio?.name ?? b.authorBio?.name ?? ""}
                onChange={(e) => set({ authorBio: { name: e.target.value, roleTitle: f.authorBio?.roleTitle ?? b.authorBio?.roleTitle ?? "", bio: f.authorBio?.bio ?? b.authorBio?.bio ?? "" } })} />
            </Field>
            <Field label="Role title">
              <input className={inputCls} value={f.authorBio?.roleTitle ?? b.authorBio?.roleTitle ?? ""}
                onChange={(e) => set({ authorBio: { name: f.authorBio?.name ?? b.authorBio?.name ?? "", roleTitle: e.target.value, bio: f.authorBio?.bio ?? b.authorBio?.bio ?? "" } })} />
            </Field>
          </div>
          <Field label="Bio">
            <textarea className={inputCls} rows={2} value={f.authorBio?.bio ?? b.authorBio?.bio ?? ""}
              onChange={(e) => set({ authorBio: { name: f.authorBio?.name ?? b.authorBio?.name ?? "", roleTitle: f.authorBio?.roleTitle ?? b.authorBio?.roleTitle ?? "", bio: e.target.value } })} />
          </Field>
        </details>

        <details className="mt-4 border-t border-outline-variant pt-4">
          <summary className="text-xs font-bold text-on-surface-variant uppercase tracking-wide cursor-pointer mb-3">
            Previous / Next navigation cards
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold mb-2">Previous</p>
              <Field label="Label"><input className={inputCls} value={f.prevLink?.label ?? b.prevLink?.label ?? ""} onChange={(e) => set({ prevLink: { href: f.prevLink?.href ?? b.prevLink?.href ?? null, label: e.target.value, title: f.prevLink?.title ?? b.prevLink?.title ?? "", disabled: f.prevLink?.disabled ?? b.prevLink?.disabled ?? false } })} /></Field>
              <Field label="Title"><input className={inputCls} value={f.prevLink?.title ?? b.prevLink?.title ?? ""} onChange={(e) => set({ prevLink: { href: f.prevLink?.href ?? b.prevLink?.href ?? null, label: f.prevLink?.label ?? b.prevLink?.label ?? "", title: e.target.value, disabled: f.prevLink?.disabled ?? b.prevLink?.disabled ?? false } })} /></Field>
            </div>
            <div>
              <p className="text-xs font-bold mb-2">Next</p>
              <Field label="Label"><input className={inputCls} value={f.nextLink?.label ?? b.nextLink?.label ?? ""} onChange={(e) => set({ nextLink: { href: f.nextLink?.href ?? b.nextLink?.href ?? null, label: e.target.value, title: f.nextLink?.title ?? b.nextLink?.title ?? "", disabled: f.nextLink?.disabled ?? b.nextLink?.disabled ?? false } })} /></Field>
              <Field label="Title"><input className={inputCls} value={f.nextLink?.title ?? b.nextLink?.title ?? ""} onChange={(e) => set({ nextLink: { href: f.nextLink?.href ?? b.nextLink?.href ?? null, label: f.nextLink?.label ?? b.nextLink?.label ?? "", title: e.target.value, disabled: f.nextLink?.disabled ?? b.nextLink?.disabled ?? false } })} /></Field>
            </div>
          </div>
        </details>

        <details className="mt-4 border-t border-outline-variant pt-4">
          <summary className="text-xs font-bold text-on-surface-variant uppercase tracking-wide cursor-pointer mb-3">
            Related articles cards
          </summary>
          {(f.relatedArticles ?? b.relatedArticles ?? []).map((r, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 pb-3 border-b border-outline-variant/40 last:border-0">
              <Field label={`Card ${i + 1} — category tag`}>
                <input className={inputCls} value={r.category} onChange={(e) => {
                  const list = [...(f.relatedArticles ?? b.relatedArticles ?? [])];
                  list[i] = { ...list[i], category: e.target.value };
                  set({ relatedArticles: list });
                }} />
              </Field>
              <Field label={`Card ${i + 1} — title`}>
                <input className={inputCls} value={r.title} onChange={(e) => {
                  const list = [...(f.relatedArticles ?? b.relatedArticles ?? [])];
                  list[i] = { ...list[i], title: e.target.value };
                  set({ relatedArticles: list });
                }} />
              </Field>
            </div>
          ))}
        </details>

        <details className="mt-4 border-t border-outline-variant pt-4">
          <summary className="text-xs font-bold text-on-surface-variant uppercase tracking-wide cursor-pointer mb-3">
            Closing CTA section {b.cta ? "" : "(none by default)"}
          </summary>
          {(() => {
            const cur = f.cta ?? b.cta;
            const patchCta = (patch: Partial<ArticleCta>) => {
              const base: ArticleCta = cur ?? {
                badge: "", title: "", description: "",
                button1Text: "", button1Href: "/contact", button2Text: "", button2Href: "/products",
              };
              set({ cta: { ...base, ...patch } });
            };
            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Badge"><input className={inputCls} value={cur?.badge ?? ""} onChange={(e) => patchCta({ badge: e.target.value })} /></Field>
                  <div />
                  <Field label="Title"><input className={inputCls} value={cur?.title ?? ""} onChange={(e) => patchCta({ title: e.target.value })} /></Field>
                </div>
                <Field label="Description"><textarea className={inputCls} rows={2} value={cur?.description ?? ""} onChange={(e) => patchCta({ description: e.target.value })} /></Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Button 1 text"><input className={inputCls} value={cur?.button1Text ?? ""} onChange={(e) => patchCta({ button1Text: e.target.value })} /></Field>
                  <Field label="Button 2 text"><input className={inputCls} value={cur?.button2Text ?? ""} onChange={(e) => patchCta({ button2Text: e.target.value })} /></Field>
                </div>
              </>
            );
          })()}
        </details>

        <div className="flex items-center gap-3 mt-5">
          <button disabled={!!busy} onClick={() => doSave(false)} className="px-5 py-2.5 border border-outline-variant rounded-lg text-sm font-bold disabled:opacity-60">
            {busy === "draft" ? "Saving…" : "Save Draft"}
          </button>
          <button disabled={!!busy} onClick={() => doSave(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold disabled:opacity-60">
            {busy === "publish" ? "Publishing…" : "Publish"}
          </button>
          {saved && <span className="text-primary text-sm font-bold">Saved ✓</span>}
          {failed && <span className="text-error text-sm font-bold">Save failed — check connection and try again</span>}
        </div>
      </div>
    </details>
  );
}

/* ─────────────────────── Site contact editor ─────────────────────── */

function SiteContactEditor({ initial, onSave }: { initial: SiteContact; onSave: (v: SiteContact) => Promise<boolean> }) {
  const [v, setV] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);

  const doSave = async () => {
    setBusy(true);
    const ok = await onSave(v);
    setBusy(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } else {
      setFailed(true);
      setTimeout(() => setFailed(false), 4000);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
      <h3 className="font-label-lg text-label-lg mb-1">Site Contact Info</h3>
      <p className="text-xs text-on-surface-variant mb-4">
        Shown in the Footer, floating contact button, Home hero card, and
        forms. Leave a field blank to keep the built-in default.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Email">
          <input className={inputCls} value={v.email ?? ""} onChange={(e) => setV({ ...v, email: e.target.value })} />
        </Field>
        <div />
        <Field label="Main phone (display)">
          <input className={inputCls} value={v.phoneMainDisplay ?? ""} onChange={(e) => setV({ ...v, phoneMainDisplay: e.target.value })} />
        </Field>
        <Field label="Main phone (tel: link)">
          <input className={inputCls} placeholder="tel:+20..." value={v.phoneMainHref ?? ""} onChange={(e) => setV({ ...v, phoneMainHref: e.target.value })} />
        </Field>
        <Field label="Logistics phone (display)">
          <input className={inputCls} value={v.phoneLogisticsDisplay ?? ""} onChange={(e) => setV({ ...v, phoneLogisticsDisplay: e.target.value })} />
        </Field>
        <Field label="Logistics phone (tel: link)">
          <input className={inputCls} placeholder="tel:+20..." value={v.phoneLogisticsHref ?? ""} onChange={(e) => setV({ ...v, phoneLogisticsHref: e.target.value })} />
        </Field>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button disabled={busy} onClick={doSave} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold disabled:opacity-60">
          {busy ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-primary text-sm font-bold">Saved ✓</span>}
        {failed && <span className="text-error text-sm font-bold">Save failed — check connection and try again</span>}
      </div>
    </div>
  );
}

/* ─────────────────────── Main tab ─────────────────────── */

const SECTIONS = ["Products", "Industry Detail Modals", "Articles", "Site Contact"] as const;

export default function ContentTab() {
  const [data, setData] = useState<Payload | null>(null);
  const [section, setSection] = useState<(typeof SECTIONS)[number]>("Products");
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/admin/content").then(async (res) => {
      if (!res.ok) {
        setError("Failed to load content.");
        return;
      }
      setData((await res.json()) as Payload);
    });
  };

  useEffect(load, []);

  if (error) return <p className="text-error">{error}</p>;
  if (!data) return <p className="text-on-surface-variant">Loading content…</p>;

  const emptyProduct = (): ContentRecord<ProductFields> => ({ published: false, en: {}, ar: {} });
  const emptyIndustry = (): ContentRecord<IndustryFields> => ({ published: false, en: {}, ar: {} });
  const emptyArticle = (): ContentRecord<ArticleFields> => ({ published: false, en: {}, ar: {} });

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${section === s ? "bg-primary text-white" : "bg-surface-container-lowest border border-outline-variant"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {section === "Products" && (
        <div className="space-y-3">
          {data.products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              nameEn={p.nameEn}
              nameAr={p.nameAr}
              image={p.image}
              coverImage={p.coverImage}
              images={p.images}
              base={p.base}
              record={data.overrides.products[String(p.id)] ?? emptyProduct()}
              onSave={async (rec) => {
                const ok = await saveContent({ section: "product", id: String(p.id), record: rec });
                if (ok) load();
                return ok;
              }}
              onSaveImages={async (patch) => {
                const ok = await saveContent({ section: "productImages", id: String(p.id), ...patch });
                if (ok) load();
                return ok;
              }}
            />
          ))}
        </div>
      )}

      {section === "Industry Detail Modals" && (
        <div className="space-y-3">
          {data.industries.map((ind) => (
            <IndustryCard
              key={ind.id}
              id={ind.id}
              titleEn={ind.titleEn}
              titleAr={ind.titleAr}
              image={ind.image}
              base={ind.base}
              record={data.overrides.industries[ind.id] ?? emptyIndustry()}
              onSave={async (rec) => {
                const ok = await saveContent({ section: "industry", id: ind.id, record: rec });
                if (ok) load();
                return ok;
              }}
              onSaveImage={async (image) => {
                const ok = await saveContent({ section: "industryImage", id: ind.id, image });
                if (ok) load();
                return ok;
              }}
            />
          ))}
        </div>
      )}

      {section === "Articles" && (
        <div className="space-y-3">
          {data.articles.map((a) => (
            <ArticleCard
              key={a.slug}
              slug={a.slug}
              titleEn={a.titleEn}
              titleAr={a.titleAr}
              heroImg={a.heroImg}
              base={a.base}
              record={data.overrides.articles[a.slug] ?? emptyArticle()}
              onSave={async (rec) => {
                const ok = await saveContent({ section: "article", slug: a.slug, record: rec });
                if (ok) load();
                return ok;
              }}
              onSaveHero={async (heroImg) => {
                const ok = await saveContent({ section: "articleHero", slug: a.slug, heroImg });
                if (ok) load();
                return ok;
              }}
            />
          ))}
        </div>
      )}

      {section === "Site Contact" && (
        <SiteContactEditor
          initial={data.overrides.siteContact}
          onSave={async (v) => {
            const ok = await saveContent({ section: "siteContact", record: v });
            if (ok) load();
            return ok;
          }}
        />
      )}
    </div>
  );
}
