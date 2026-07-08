"use client";

/**
 * SEO CMS dashboard. Single-page admin over /api/admin/cms:
 * Pages · Blog · Products · Gallery · Global · Robots · Redirects · Health.
 * Concepts (pageKey registry, defaults+overrides, publish flag, org schema
 * singleton) carry over from the legacy React CMS.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import WebsiteContentTab from "./WebsiteContentTab";

/* ────────────── types mirrored from lib/cms (client-safe copies) ────────────── */
type Locale = "en" | "ar";
type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  canonical?: string;
  ogImage?: string;
};
type PageSeo = { pageKey: string; published: boolean; en: SeoFields; ar: SeoFields; updatedAt?: string };
type ProductSeo = PageSeo & {
  productCode?: string; weight?: string; staticLoad?: string; dynamicLoad?: string; rackingLoad?: string;
};
type ImageSeoSide = { alt?: string; title?: string; caption?: string; category?: string; description?: string };
type ImageSeo = { file: string; published: boolean; en: ImageSeoSide; ar: ImageSeoSide };
type Redirect = { id: string; from: string; to: string; statusCode: 301 | 302; createdAt: string };
type RobotsRule = { userAgent: string; allow: string[]; disallow: string[] };
type Issue = { severity: "error" | "warning" | "info"; code: string; message: string };
type Audit = { pageKey: string; label: string; locale: Locale; score: number; issues: Issue[] };
type Registry = { pageKey: string; path: string; label: string; group: string; slugEditable: boolean };

type Payload = {
  siteUrl: string;
  cms: {
    global: {
      org: {
        companyName: string; logoUrl: string; website: string; phone: string; email: string;
        address: { street: string; city: string; country: string };
        social: Record<string, string | undefined>;
      };
      favicon?: string;
      appleTouchIcon?: string;
      notFound: { published: boolean; en: SeoFields; ar: SeoFields };
      robots: { rules: RobotsRule[]; custom: string };
    };
    pages: Record<string, PageSeo>;
    products: Record<string, ProductSeo>;
    images: Record<string, ImageSeo>;
    redirects: Redirect[];
  };
  registry: Registry[];
  defaults: Record<string, { en: SeoFields; ar: SeoFields }>;
  audits: Audit[];
  imageIssues: Issue[];
  products: { id: number; nameEn: string; nameAr: string; material: string; dimensions: string; loadCapacity: string }[];
  galleryImages: Record<Locale, { src: string; alt: string; caption: string }[]>;
  galleryVideos: { id: string; titleEn: string; descEn: string; titleAr: string; descAr: string; thumb: string }[];
};

const TABS = ["Website Content", "Pages", "Blog", "Products", "Gallery", "Global", "Robots", "Redirects", "Health"] as const;
type Tab = (typeof TABS)[number];

const TITLE = { min: 50, max: 60 };
const DESC = { min: 140, max: 160 };
const SLUG_RE = /^[a-z0-9؀-ۿ]+(?:-[a-z0-9؀-ۿ]+)*$/;

function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/['’"”]/g, "").replace(/[^a-z0-9؀-ۿ]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function counterTone(n: number, r: { min: number; max: number }) {
  if (n === 0) return "text-error";
  if (n < r.min) return "text-[#92400e]";
  if (n > r.max + 15) return "text-error";
  if (n > r.max) return "text-[#92400e]";
  return "text-primary";
}

async function saveSection(body: unknown): Promise<boolean> {
  const res = await fetch("/api/admin/cms", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.ok;
}

/* ────────────── small building blocks ────────────── */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-label-md text-label-md">{label}</span>
        {hint && <span className="text-xs text-on-surface-variant">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary outline-none transition-colors";

function Warn({ issues }: { issues: string[] }) {
  if (!issues.length) return null;
  return (
    <ul className="mt-1.5 space-y-1">
      {issues.map((m) => (
        <li key={m} className="text-xs text-[#92400e] flex gap-1.5">
          <span>⚠</span> {m}
        </li>
      ))}
    </ul>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 80 ? "bg-[#d1fae5] text-[#065f46]" : score >= 50 ? "bg-[#fef3c7] text-[#92400e]" : "bg-[#ffdad6] text-[#93000a]";
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${tone}`}>{score}/100</span>;
}

function OgUploader({ value, onChange }: { value?: string; onChange: (v?: string) => void }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file: File) => {
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", "og");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setBusy(false);
    if (res.ok) onChange(((await res.json()) as { path: string }).path);
  };
  return (
    <Field label="Open Graph Image" hint="auto-cropped to 1200 × 630">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="OG preview" className="w-full max-w-sm rounded-lg border border-outline-variant mb-2" />
      )}
      <div className="flex gap-2">
        <label className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold cursor-pointer">
          {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
        {value && (
          <button type="button" className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold" onClick={() => onChange(undefined)}>
            Delete
          </button>
        )}
      </div>
    </Field>
  );
}

function GooglePreview({ title, desc, url }: { title: string; desc: string; url: string }) {
  return (
    <div className="border border-outline-variant rounded-lg p-4 bg-white">
      <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Google preview</p>
      <p className="text-xs text-[#202124] truncate">{url}</p>
      <p className="text-[#1a0dab] text-lg leading-snug truncate">{title || "—"}</p>
      <p className="text-sm text-[#4d5156] line-clamp-2">{desc || "—"}</p>
    </div>
  );
}

function SocialPreview({ title, desc, image, url }: { title: string; desc: string; image?: string; url: string }) {
  const [net, setNet] = useState<"Facebook" | "LinkedIn" | "WhatsApp">("Facebook");
  return (
    <div className="border border-outline-variant rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Share preview</p>
        <div className="flex gap-1">
          {(["Facebook", "LinkedIn", "WhatsApp"] as const).map((n) => (
            <button key={n} onClick={() => setNet(n)} className={`px-2 py-0.5 rounded text-xs font-bold ${net === n ? "bg-primary text-white" : "bg-surface-container-low"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="border border-outline-variant rounded-lg overflow-hidden max-w-sm">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="w-full aspect-[1.91/1] object-cover" />
        ) : (
          <div className="w-full aspect-[1.91/1] bg-surface-container-high flex items-center justify-center text-xs text-on-surface-variant">
            No OG image
          </div>
        )}
        <div className="p-3 bg-[#f0f2f5]">
          <p className="text-[10px] uppercase text-[#606770]">{new URL(url).hostname}</p>
          <p className="text-sm font-bold text-[#050505] truncate">{title || "—"}</p>
          {net !== "WhatsApp" && <p className="text-xs text-[#606770] line-clamp-1">{desc || "—"}</p>}
        </div>
      </div>
    </div>
  );
}

/* ────────────── SEO fields editor (per locale) ────────────── */

function SeoEditor({
  fields, defaults, locale, slugEditable, siteUrl, path, allSlugs, onChange,
}: {
  fields: SeoFields;
  defaults: SeoFields;
  locale: Locale;
  slugEditable: boolean;
  siteUrl: string;
  path: string;
  allSlugs: string[];
  onChange: (f: SeoFields) => void;
}) {
  const title = fields.metaTitle ?? "";
  const desc = fields.metaDescription ?? "";
  const slug = fields.slug ?? "";
  const effTitle = title || defaults.metaTitle || "";
  const effDesc = desc || defaults.metaDescription || "";
  const effSlug = slug || defaults.slug || "";
  const effOg = fields.ogImage || defaults.ogImage;
  const url = `${siteUrl}${locale === "en" ? "/en" : ""}${slugEditable ? `/blog/${effSlug}` : path === "/" ? "" : path}`;

  const slugIssues: string[] = [];
  if (slug && !SLUG_RE.test(slug)) slugIssues.push("Lowercase letters, numbers and hyphens only.");
  if (slug && allSlugs.filter((s) => s === slug).length > 0) slugIssues.push("This slug is already used by another page.");
  const canonicalIssues: string[] = [];
  if (fields.canonical) {
    try {
      const u = new URL(fields.canonical);
      if (!/^https?:$/.test(u.protocol)) throw new Error();
    } catch {
      canonicalIssues.push("Must be a valid absolute http(s) URL.");
    }
  }

  const tLen = effTitle.length;
  const dLen = effDesc.length;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <Field label="Meta Title" hint={`${tLen} chars · recommended ${TITLE.min}–${TITLE.max}`}>
          <input dir={locale === "ar" ? "rtl" : "ltr"} className={inputCls} value={title} placeholder={defaults.metaTitle} onChange={(e) => onChange({ ...fields, metaTitle: e.target.value })} />
          <p className={`text-xs mt-1 ${counterTone(tLen, TITLE)}`}>
            {tLen === 0 ? "Missing title" : tLen < TITLE.min ? "Too short" : tLen > TITLE.max ? "Longer than recommended" : "Good length"}
          </p>
        </Field>
        <Field label="Meta Description" hint={`${dLen} chars · recommended ${DESC.min}–${DESC.max}`}>
          <textarea dir={locale === "ar" ? "rtl" : "ltr"} rows={3} className={inputCls} value={desc} placeholder={defaults.metaDescription} onChange={(e) => onChange({ ...fields, metaDescription: e.target.value })} />
          <p className={`text-xs mt-1 ${counterTone(dLen, DESC)}`}>
            {dLen === 0 ? "Missing description" : dLen < DESC.min ? "Too short" : dLen > DESC.max ? "Longer than recommended" : "Good length"}
          </p>
        </Field>
        {slugEditable ? (
          <Field label="URL Slug" hint="lowercase-hyphenated">
            <div className="flex gap-2">
              <input className={inputCls} value={slug} placeholder={defaults.slug} onChange={(e) => onChange({ ...fields, slug: e.target.value })} />
              <button type="button" className="px-3 border border-outline-variant rounded-lg text-xs font-bold whitespace-nowrap" onClick={() => onChange({ ...fields, slug: slugify(effTitle) })}>
                From title
              </button>
            </div>
            <Warn issues={slugIssues} />
          </Field>
        ) : (
          <Field label="URL Slug" hint="structural route — fixed">
            <input className={`${inputCls} opacity-60`} value={path} disabled />
          </Field>
        )}
        <Field label="Canonical URL" hint="auto-generated when empty">
          <input className={inputCls} value={fields.canonical ?? ""} placeholder={url} onChange={(e) => onChange({ ...fields, canonical: e.target.value || undefined })} />
          <Warn issues={canonicalIssues} />
        </Field>
        <OgUploader value={fields.ogImage} onChange={(v) => onChange({ ...fields, ogImage: v })} />
      </div>
      <div className="space-y-4">
        <GooglePreview title={effTitle} desc={effDesc} url={url} />
        <SocialPreview title={effTitle} desc={effDesc} image={effOg} url={url} />
      </div>
    </div>
  );
}

/* ────────────── record editor card (both locales + publish) ────────────── */

function RecordCard({
  entry, record, defaults, siteUrl, otherSlugs, onSave, extra,
}: {
  entry: Registry;
  record: PageSeo;
  defaults: { en: SeoFields; ar: SeoFields };
  siteUrl: string;
  otherSlugs: Record<Locale, string[]>;
  onSave: (rec: PageSeo, publish: boolean) => Promise<boolean>;
  extra?: React.ReactNode;
}) {
  const [rec, setRec] = useState<PageSeo>(record);
  const [openLocale, setOpenLocale] = useState<Locale>("en");
  const [busy, setBusy] = useState<"" | "draft" | "publish">("");
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);

  const doSave = async (publish: boolean) => {
    setBusy(publish ? "publish" : "draft");
    const ok = await onSave({ ...rec, published: publish }, publish);
    setBusy("");
    if (ok) {
      setRec((r) => ({ ...r, published: publish }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } else {
      setFailed(true);
      setTimeout(() => setFailed(false), 4000);
    }
  };

  return (
    <details className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-label-lg text-label-lg truncate">{entry.label}</span>
          <span className="text-xs text-on-surface-variant hidden md:inline">{entry.path}</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${rec.published ? "bg-[#d1fae5] text-[#065f46]" : "bg-surface-container-high text-on-surface-variant"}`}>
          {rec.published ? "Published" : "Draft"}
        </span>
      </summary>
      <div className="px-5 pb-5 border-t border-outline-variant/50 pt-4">
        <div className="flex gap-1 mb-4">
          {(["en", "ar"] as const).map((loc) => (
            <button key={loc} onClick={() => setOpenLocale(loc)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${openLocale === loc ? "bg-primary text-white" : "bg-surface-container-low"}`}>
              {loc === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
        <SeoEditor
          key={openLocale}
          fields={rec[openLocale]}
          defaults={defaults[openLocale]}
          locale={openLocale}
          slugEditable={entry.slugEditable}
          siteUrl={siteUrl}
          path={entry.path}
          allSlugs={otherSlugs[openLocale]}
          onChange={(f) => setRec((r) => ({ ...r, [openLocale]: f }))}
        />
        {extra}
        <div className="flex items-center gap-3 mt-5">
          <button disabled={!!busy} onClick={() => doSave(false)} className="px-5 py-2.5 border border-outline-variant rounded-lg text-sm font-bold disabled:opacity-60">
            {busy === "draft" ? "Saving…" : "Save Draft"}
          </button>
          <button disabled={!!busy} onClick={() => doSave(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold disabled:opacity-60">
            {busy === "publish" ? "Publishing…" : "Publish"}
          </button>
          {saved && <span className="text-primary text-sm font-bold">Saved ✓</span>}
          {failed && <span className="text-error text-sm font-bold">Save failed — check connection and try again</span>}
          {rec.published && (
            <a className="text-xs underline text-on-surface-variant ms-auto" href={entry.slugEditable ? `/blog/${rec.en.slug || defaults.en.slug}` : entry.path} target="_blank" rel="noreferrer">
              Preview →
            </a>
          )}
        </div>
      </div>
    </details>
  );
}

/* ────────────── main dashboard ────────────── */

export default function Dashboard() {
  const [data, setData] = useState<Payload | null>(null);
  const [tab, setTab] = useState<Tab>("Website Content");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/cms");
    if (!res.ok) {
      setError("Failed to load CMS data.");
      return;
    }
    setData((await res.json()) as Payload);
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/cms").then(async (res) => {
      if (ignore) return;
      if (!res.ok) {
        setError("Failed to load CMS data.");
        return;
      }
      setData((await res.json()) as Payload);
    });
    return () => {
      ignore = true;
    };
    // Only on mount — `load` (used to re-fetch after saves) is called
    // explicitly from save handlers, not tied to this effect.
  }, []);

  const emptyRec = useCallback(
    (pageKey: string): PageSeo => ({ pageKey, published: false, en: {}, ar: {} }),
    []
  );

  const slugsByLocale = useMemo(() => {
    const out: Record<Locale, string[]> = { en: [], ar: [] };
    if (!data) return out;
    for (const entry of data.registry) {
      if (!entry.slugEditable) continue;
      for (const loc of ["en", "ar"] as const) {
        const rec = data.cms.pages[entry.pageKey];
        const slug = (rec?.published && rec[loc].slug) || data.defaults[entry.pageKey]?.[loc]?.slug;
        if (slug) out[loc].push(`${entry.pageKey}::${slug}`);
      }
    }
    return out;
  }, [data]);

  if (error) return <p className="p-10 text-error">{error}</p>;
  if (!data) return <p className="p-10 text-on-surface-variant">Loading CMS…</p>;

  const otherSlugsFor = (pageKey: string): Record<Locale, string[]> => ({
    en: slugsByLocale.en.filter((s) => !s.startsWith(pageKey + "::")).map((s) => s.split("::")[1]),
    ar: slugsByLocale.ar.filter((s) => !s.startsWith(pageKey + "::")).map((s) => s.split("::")[1]),
  });

  const savePage = (pageKey: string) => async (rec: PageSeo) => {
    const ok = await saveSection({ section: "page", pageKey, record: rec });
    if (ok) void load();
    return ok;
  };

  const groups: Record<string, Registry[]> = {};
  for (const r of data.registry) (groups[r.group] ??= []).push(r);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Admin Dashboard</h1>
          <p className="text-sm text-on-surface-variant">
            Giant Storage — website content &amp; SEO management · {data.siteUrl}
          </p>
        </div>
        <button
          className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold"
          onClick={async () => {
            await fetch("/api/admin/auth", { method: "DELETE" });
            window.location.reload();
          }}
        >
          Sign out
        </button>
      </header>

      <nav className="flex flex-wrap gap-1.5 mb-8">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${tab === t ? "bg-primary text-white" : "bg-surface-container-lowest border border-outline-variant"}`}>
            {t}
          </button>
        ))}
      </nav>

      {tab === "Pages" && (
        <div className="space-y-3">
          {["Core", "Legal"].map((g) =>
            (groups[g] ?? []).map((entry) => (
              <RecordCard
                key={entry.pageKey}
                entry={entry}
                record={data.cms.pages[entry.pageKey] ?? emptyRec(entry.pageKey)}
                defaults={data.defaults[entry.pageKey]}
                siteUrl={data.siteUrl}
                otherSlugs={otherSlugsFor(entry.pageKey)}
                onSave={savePage(entry.pageKey)}
              />
            ))
          )}
        </div>
      )}

      {tab === "Blog" && (
        <div className="space-y-3">
          {(groups["Blog"] ?? []).map((entry) => (
            <RecordCard
              key={entry.pageKey}
              entry={entry}
              record={data.cms.pages[entry.pageKey] ?? emptyRec(entry.pageKey)}
              defaults={data.defaults[entry.pageKey]}
              siteUrl={data.siteUrl}
              otherSlugs={otherSlugsFor(entry.pageKey)}
              onSave={savePage(entry.pageKey)}
            />
          ))}
          <p className="text-xs text-on-surface-variant">
            Changing a published article slug automatically creates a 301 redirect from the old URL.
          </p>
        </div>
      )}

      {tab === "Products" && <ProductsTab data={data} reload={load} />}
      {tab === "Gallery" && <GalleryTab data={data} reload={load} />}
      {tab === "Global" && <GlobalTab data={data} reload={load} />}
      {tab === "Robots" && <RobotsTab data={data} reload={load} />}
      {tab === "Redirects" && <RedirectsTab data={data} reload={load} />}
      {tab === "Health" && <HealthTab data={data} />}
      {tab === "Website Content" && <WebsiteContentTab />}
    </div>
  );
}

/* ────────────── Products tab ────────────── */

function ProductsTab({ data, reload }: { data: Payload; reload: () => Promise<void> }) {
  return (
    <div className="space-y-3">
      {data.products.map((p) => {
        const key = String(p.id);
        const record: ProductSeo =
          data.cms.products[key] ?? { pageKey: `product:${key}`, published: false, en: {}, ar: {} };
        const entry: Registry = {
          pageKey: `product:${key}`,
          path: "/products",
          label: `${p.nameEn} · ${p.nameAr}`,
          group: "Products",
          slugEditable: false,
        };
        return (
          <RecordCard
            key={key}
            entry={entry}
            record={record}
            defaults={{
              en: { metaTitle: p.nameEn, metaDescription: "" },
              ar: { metaTitle: p.nameAr, metaDescription: "" },
            }}
            siteUrl={data.siteUrl}
            otherSlugs={{ en: [], ar: [] }}
            onSave={async (rec) => {
              const ok = await saveSection({ section: "product", id: key, record: rec as ProductSeo });
              if (ok) await reload();
              return ok;
            }}
            extra={
              <ProductExtras
                record={record}
                info={p}
                onChange={() => {
                  /* handled inside via its own save (below) */
                }}
              />
            }
          />
        );
      })}
      <p className="text-xs text-on-surface-variant">
        Published product SEO feeds the Product schema (JSON-LD) on the products page.
        Name, material, dimensions, colors and applications come from the catalog data.
      </p>
    </div>
  );
}

function ProductExtras({
  record, info,
}: {
  record: ProductSeo;
  info: Payload["products"][number];
  onChange: () => void;
}) {
  const [extras, setExtras] = useState({
    productCode: record.productCode ?? "",
    weight: record.weight ?? "",
    staticLoad: record.staticLoad ?? "",
    dynamicLoad: record.dynamicLoad ?? "",
    rackingLoad: record.rackingLoad ?? "",
  });
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className="mt-5 border-t border-outline-variant/50 pt-4">
      <p className="font-label-md text-label-md mb-3">Technical data (Product schema)</p>
      <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
        <p className="text-on-surface-variant">Material: <span className="text-on-surface">{info.material}</span></p>
        <p className="text-on-surface-variant">Dimensions: <span className="text-on-surface">{info.dimensions}</span></p>
        <p className="text-on-surface-variant">Load: <span className="text-on-surface">{info.loadCapacity}</span></p>
      </div>
      <div className="grid md:grid-cols-5 gap-3">
        {(
          [
            ["productCode", "Product Code"],
            ["weight", "Weight"],
            ["staticLoad", "Static Load"],
            ["dynamicLoad", "Dynamic Load"],
            ["rackingLoad", "Racking Load"],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="text-xs font-bold">
            {label}
            <input className={`${inputCls} mt-1 font-normal`} value={extras[k]} onChange={(e) => setExtras((x) => ({ ...x, [k]: e.target.value }))} />
          </label>
        ))}
      </div>
      <button
        className="mt-3 px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold"
        onClick={async () => {
          const ok = await saveSection({ section: "product", id: String(info.id), record: { ...record, ...extras } });
          if (ok) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          } else {
            setFailed(true);
            setTimeout(() => setFailed(false), 4000);
          }
        }}
      >
        Save technical data
      </button>
      {saved && <span className="text-primary text-xs font-bold ms-2">Saved ✓</span>}
      {failed && <span className="text-error text-xs font-bold ms-2">Save failed</span>}
    </div>
  );
}

/* ────────────── Gallery tab ────────────── */

function GalleryTab({ data, reload }: { data: Payload; reload: () => Promise<void> }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-label-lg text-label-lg mb-3">Images</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {data.galleryImages.en.map((img, i) => {
            const arImg = data.galleryImages.ar[i];
            const record: ImageSeo =
              data.cms.images[img.src] ?? { file: img.src, published: false, en: {}, ar: {} };
            return (
              <ImageCard key={img.src} img={img} arCaption={arImg?.caption ?? ""} record={record} onSave={async (rec) => {
                const ok = await saveSection({ section: "image", file: img.src, record: rec });
                if (ok) await reload();
                return ok;
              }} />
            );
          })}
        </div>
      </div>
      <div>
        <h2 className="font-label-lg text-label-lg mb-3">Videos</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {data.galleryVideos.map((video) => (
            <VideoCard key={video.id} video={video} onSave={async (rec) => {
              const ok = await saveSection({ section: "galleryVideo", id: video.id, record: rec });
              if (ok) await reload();
              return ok;
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoCard({
  video, onSave,
}: {
  video: { id: string; titleEn: string; descEn: string; titleAr: string; descAr: string; thumb: string };
  onSave: (rec: { titleEn: string; descEn: string; titleAr: string; descAr: string }) => Promise<boolean>;
}) {
  const [v, setV] = useState({
    titleEn: video.titleEn, descEn: video.descEn, titleAr: video.titleAr, descAr: video.descAr,
  });
  const [loc, setLoc] = useState<Locale>("en");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const titleKey = loc === "en" ? "titleEn" : "titleAr";
  const descKey = loc === "en" ? "descEn" : "descAr";

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
      <div className="flex gap-3 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={video.thumb} alt="" className="w-24 h-16 object-cover rounded-lg" />
        <div className="min-w-0">
          <p className="text-xs font-bold truncate">{video.id}</p>
          <p className="text-xs text-on-surface-variant truncate">{v[titleKey]}</p>
          <div className="flex gap-1 mt-1.5">
            {(["en", "ar"] as const).map((l) => (
              <button key={l} onClick={() => setLoc(l)} className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${loc === l ? "bg-primary text-white" : "bg-surface-container-low"}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2" dir={loc === "ar" ? "rtl" : "ltr"}>
        <input className={inputCls} placeholder="Title" value={v[titleKey]} onChange={(e) => setV((x) => ({ ...x, [titleKey]: e.target.value }))} />
        <textarea className={inputCls} rows={2} placeholder="Description" value={v[descKey]} onChange={(e) => setV((x) => ({ ...x, [descKey]: e.target.value }))} />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button
          disabled={busy}
          className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold disabled:opacity-60"
          onClick={async () => {
            setBusy(true);
            const ok = await onSave(v);
            setBusy(false);
            if (ok) {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            } else {
              setFailed(true);
              setTimeout(() => setFailed(false), 4000);
            }
          }}
        >
          {busy ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-primary text-xs font-bold">Saved ✓</span>}
        {failed && <span className="text-error text-xs font-bold">Save failed</span>}
      </div>
    </div>
  );
}

function ImageCard({
  img, arCaption, record, onSave,
}: {
  img: { src: string; alt: string; caption: string };
  arCaption: string;
  record: ImageSeo;
  onSave: (rec: ImageSeo) => Promise<boolean>;
}) {
  const [rec, setRec] = useState(record);
  const [loc, setLoc] = useState<Locale>("en");
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const side = rec[loc];
  const set = (k: keyof ImageSeoSide, v: string) =>
    setRec((r) => ({ ...r, [loc]: { ...r[loc], [k]: v } }));
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
      <div className="flex gap-3 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt="" className="w-24 h-16 object-cover rounded-lg" />
        <div className="min-w-0">
          <p className="text-xs font-bold truncate">{img.src.split("/").pop()}</p>
          <p className="text-xs text-on-surface-variant truncate">{loc === "en" ? img.caption : arCaption}</p>
          <div className="flex gap-1 mt-1.5">
            {(["en", "ar"] as const).map((l) => (
              <button key={l} onClick={() => setLoc(l)} className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${loc === l ? "bg-primary text-white" : "bg-surface-container-low"}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2" dir={loc === "ar" ? "rtl" : "ltr"}>
        {(
          [
            ["alt", "Alt text"],
            ["title", "Title"],
            ["caption", "Caption"],
            ["category", "Category"],
          ] as const
        ).map(([k, label]) => (
          <input key={k} className={inputCls} placeholder={label} value={side[k] ?? ""} onChange={(e) => set(k, e.target.value)} />
        ))}
        <textarea className={`${inputCls} col-span-2`} rows={2} placeholder="Description (optional)" value={side.description ?? ""} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold" onClick={async () => {
          const ok = await onSave({ ...rec, published: true });
          if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
          else { setFailed(true); setTimeout(() => setFailed(false), 4000); }
        }}>
          Publish
        </button>
        <button className="px-4 py-1.5 border border-outline-variant rounded-lg text-xs font-bold" onClick={async () => {
          const ok = await onSave({ ...rec, published: false });
          if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
          else { setFailed(true); setTimeout(() => setFailed(false), 4000); }
        }}>
          Save Draft
        </button>
        {saved && <span className="text-primary text-xs font-bold">Saved ✓</span>}
        {failed && <span className="text-error text-xs font-bold">Save failed</span>}
      </div>
    </div>
  );
}

/* ────────────── Global / Robots / Redirects / Health tabs ────────────── */

function GlobalTab({ data, reload }: { data: Payload; reload: () => Promise<void> }) {
  const [g, setG] = useState(data.cms.global);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const org = g.org;
  const setOrg = (patch: Partial<typeof org>) => setG((x) => ({ ...x, org: { ...x.org, ...patch } }));
  const iconUpload = async (kind: "favicon" | "apple", file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", kind);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { path } = (await res.json()) as { path: string };
      setG((x) => (kind === "favicon" ? { ...x, favicon: path } : { ...x, appleTouchIcon: path }));
    }
  };
  return (
    <div className="space-y-6">
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
        <h2 className="font-label-lg text-label-lg mb-4">Organization schema</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {(
            [
              ["companyName", "Company Name"],
              ["logoUrl", "Logo URL"],
              ["website", "Website"],
              ["phone", "Phone"],
              ["email", "Email"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="text-xs font-bold">
              {label}
              <input className={`${inputCls} mt-1 font-normal`} value={(org[k] as string) ?? ""} onChange={(e) => setOrg({ [k]: e.target.value } as Partial<typeof org>)} />
            </label>
          ))}
          <label className="text-xs font-bold">Street<input className={`${inputCls} mt-1 font-normal`} value={org.address.street} onChange={(e) => setOrg({ address: { ...org.address, street: e.target.value } })} /></label>
          <label className="text-xs font-bold">City<input className={`${inputCls} mt-1 font-normal`} value={org.address.city} onChange={(e) => setOrg({ address: { ...org.address, city: e.target.value } })} /></label>
          <label className="text-xs font-bold">Country<input className={`${inputCls} mt-1 font-normal`} value={org.address.country} onChange={(e) => setOrg({ address: { ...org.address, country: e.target.value } })} /></label>
        </div>
        <h3 className="font-label-md text-label-md mt-5 mb-2">Social links (feeds sameAs)</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {(["facebook", "instagram", "linkedin", "whatsapp", "youtube", "tiktok"] as const).map((k) => (
            <label key={k} className="text-xs font-bold capitalize">
              {k}
              <input className={`${inputCls} mt-1 font-normal`} value={org.social[k] ?? ""} onChange={(e) => setOrg({ social: { ...org.social, [k]: e.target.value || undefined } })} />
            </label>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
        <h2 className="font-label-lg text-label-lg mb-4">Favicon & Apple Touch Icon</h2>
        <div className="flex flex-wrap gap-8">
          {(
            [
              ["favicon", g.favicon, "Favicon (48×48)"],
              ["apple", g.appleTouchIcon, "Apple Touch Icon (180×180)"],
            ] as const
          ).map(([kind, value, label]) => (
            <div key={kind}>
              <p className="text-xs font-bold mb-2">{label}</p>
              {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="" className="w-12 h-12 rounded border border-outline-variant mb-2" />
              ) : (
                <div className="w-12 h-12 rounded border border-dashed border-outline-variant mb-2" />
              )}
              <div className="flex gap-2">
                <label className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold cursor-pointer">
                  {value ? "Replace" : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && iconUpload(kind, e.target.files[0])} />
                </label>
                {value && (
                  <button className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-bold" onClick={() => setG((x) => (kind === "favicon" ? { ...x, favicon: undefined } : { ...x, appleTouchIcon: undefined }))}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
        <h2 className="font-label-lg text-label-lg mb-4">404 page SEO</h2>
        {(["en", "ar"] as const).map((loc) => (
          <div key={loc} className="grid md:grid-cols-2 gap-3 mb-3" dir={loc === "ar" ? "rtl" : "ltr"}>
            <input className={inputCls} placeholder={`Meta title (${loc})`} value={g.notFound[loc].metaTitle ?? ""} onChange={(e) => setG((x) => ({ ...x, notFound: { ...x.notFound, [loc]: { ...x.notFound[loc], metaTitle: e.target.value } } }))} />
            <input className={inputCls} placeholder={`Meta description (${loc})`} value={g.notFound[loc].metaDescription ?? ""} onChange={(e) => setG((x) => ({ ...x, notFound: { ...x.notFound, [loc]: { ...x.notFound[loc], metaDescription: e.target.value } } }))} />
          </div>
        ))}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={g.notFound.published} onChange={(e) => setG((x) => ({ ...x, notFound: { ...x.notFound, published: e.target.checked } }))} />
          Published
        </label>
      </section>

      <button
        className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-bold"
        onClick={async () => {
          const ok = await saveSection({ section: "global", record: g });
          if (ok) {
            await reload();
            setSaved(true);
            setTimeout(() => setSaved(false), 2200);
          } else {
            setFailed(true);
            setTimeout(() => setFailed(false), 4000);
          }
        }}
      >
        Save global settings
      </button>
      {saved && <span className="text-primary text-sm font-bold ms-3">Saved ✓</span>}
      {failed && <span className="text-error text-sm font-bold ms-3">Save failed — check connection and try again</span>}
    </div>
  );
}

function RobotsTab({ data, reload }: { data: Payload; reload: () => Promise<void> }) {
  const [cfg, setCfg] = useState(data.cms.global.robots);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const setRule = (i: number, patch: Partial<RobotsRule>) =>
    setCfg((c) => ({ ...c, rules: c.rules.map((r, j) => (j === i ? { ...r, ...patch } : r)) }));
  return (
    <div className="space-y-4">
      <p className="text-sm text-on-surface-variant">
        Served at <code>/robots.txt</code>. <code>/admin</code> and <code>/api</code> are always disallowed.
      </p>
      {cfg.rules.map((r, i) => (
        <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 grid md:grid-cols-3 gap-3">
          <label className="text-xs font-bold">User-agent<input className={`${inputCls} mt-1 font-normal`} value={r.userAgent} onChange={(e) => setRule(i, { userAgent: e.target.value })} /></label>
          <label className="text-xs font-bold">Allow (one per line)<textarea rows={2} className={`${inputCls} mt-1 font-normal`} value={r.allow.join("\n")} onChange={(e) => setRule(i, { allow: e.target.value.split("\n").filter(Boolean) })} /></label>
          <label className="text-xs font-bold">Disallow (one per line)<textarea rows={2} className={`${inputCls} mt-1 font-normal`} value={r.disallow.join("\n")} onChange={(e) => setRule(i, { disallow: e.target.value.split("\n").filter(Boolean) })} /></label>
          <button className="text-xs text-error underline text-start" onClick={() => setCfg((c) => ({ ...c, rules: c.rules.filter((_, j) => j !== i) }))}>Remove rule</button>
        </div>
      ))}
      <button className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold" onClick={() => setCfg((c) => ({ ...c, rules: [...c.rules, { userAgent: "*", allow: ["/"], disallow: [] }] }))}>
        + Add rule
      </button>
      <div className="flex gap-3">
        <button className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-bold" onClick={async () => {
          const ok = await saveSection({ section: "global", record: { ...data.cms.global, robots: cfg } });
          if (ok) { await reload(); setSaved(true); setTimeout(() => setSaved(false), 2200); }
          else { setFailed(true); setTimeout(() => setFailed(false), 4000); }
        }}>
          Save robots.txt
        </button>
        <a className="px-6 py-3 border border-outline-variant rounded-lg text-sm font-bold" href="/robots.txt" target="_blank" rel="noreferrer">View live</a>
        {saved && <span className="self-center text-primary text-sm font-bold">Saved ✓</span>}
        {failed && <span className="self-center text-error text-sm font-bold">Save failed</span>}
      </div>
    </div>
  );
}

function RedirectsTab({ data, reload }: { data: Payload; reload: () => Promise<void> }) {
  const [rows, setRows] = useState<Redirect[]>(data.cms.redirects);
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const filtered = rows.filter((r) => r.from.includes(q) || r.to.includes(q));
  const set = (id: string, patch: Partial<Redirect>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input className={`${inputCls} max-w-xs`} placeholder="Search redirects…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold" onClick={() => setRows((rs) => [{ id: crypto.randomUUID(), from: "/old-path", to: "/", statusCode: 301, createdAt: new Date().toISOString() }, ...rs])}>
          + Add redirect
        </button>
      </div>
      <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-start text-xs uppercase text-on-surface-variant border-b border-outline-variant">
              <th className="p-3 text-start">Old URL</th>
              <th className="p-3 text-start">New URL</th>
              <th className="p-3 text-start">Code</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-outline-variant/40">
                <td className="p-2"><input className={inputCls} value={r.from} onChange={(e) => set(r.id, { from: e.target.value })} /></td>
                <td className="p-2"><input className={inputCls} value={r.to} onChange={(e) => set(r.id, { to: e.target.value })} /></td>
                <td className="p-2">
                  <select className={inputCls} value={r.statusCode} onChange={(e) => set(r.id, { statusCode: Number(e.target.value) as 301 | 302 })}>
                    <option value={301}>301</option>
                    <option value={302}>302</option>
                  </select>
                </td>
                <td className="p-2"><button className="text-xs text-error underline" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}>Delete</button></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td className="p-4 text-on-surface-variant" colSpan={4}>No redirects.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <button className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-bold" onClick={async () => {
        const ok = await saveSection({ section: "redirects", records: rows });
        if (ok) { await reload(); setSaved(true); setTimeout(() => setSaved(false), 2200); }
        else { setFailed(true); setTimeout(() => setFailed(false), 4000); }
      }}>
        Save redirects
      </button>
      {saved && <span className="text-primary text-sm font-bold ms-3">Saved ✓</span>}
      {failed && <span className="text-error text-sm font-bold ms-3">Save failed</span>}
    </div>
  );
}

function HealthTab({ data }: { data: Payload }) {
  const sorted = [...data.audits].sort((a, b) => a.score - b.score);
  return (
    <div className="space-y-3">
      {data.imageIssues.length > 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
          <h2 className="font-label-lg text-label-lg mb-3">Gallery image issues</h2>
          <ul className="space-y-1 text-sm">
            {data.imageIssues.map((i, n) => (
              <li key={n} className="text-[#92400e]">⚠ {i.message}</li>
            ))}
          </ul>
        </div>
      )}
      {sorted.map((a) => (
        <details key={`${a.pageKey}-${a.locale}`} className="bg-surface-container-lowest border border-outline-variant rounded-xl">
          <summary className="flex items-center justify-between gap-3 px-5 py-3.5 cursor-pointer list-none">
            <span className="font-label-md text-label-md truncate">
              {a.label} <span className="text-on-surface-variant">({a.locale.toUpperCase()})</span>
            </span>
            <ScoreBadge score={a.score} />
          </summary>
          <div className="px-5 pb-4">
            {a.issues.length === 0 ? (
              <p className="text-sm text-primary">No issues — nice work.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {a.issues.map((i, n) => (
                  <li key={n} className={i.severity === "error" ? "text-error" : i.severity === "warning" ? "text-[#92400e]" : "text-on-surface-variant"}>
                    {i.severity === "error" ? "✕" : i.severity === "warning" ? "⚠" : "ℹ"} {i.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
