"use client";

import { useEffect, useMemo, useState } from "react";

type FlatEntry = { path: string; en: string; ar: string; overridden: boolean };

const inputCls =
  "w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary outline-none transition-colors";

async function saveTranslation(path: string, en?: string, ar?: string): Promise<boolean> {
  const res = await fetch("/api/admin/translations", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, en, ar }),
  });
  return res.ok;
}

function EntryRow({ entry, onSaved }: { entry: FlatEntry; onSaved: () => void }) {
  const [en, setEn] = useState(entry.en);
  const [ar, setAr] = useState(entry.ar);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const commit = async (nextEn: string, nextAr: string) => {
    setBusy(true);
    const ok = await saveTranslation(entry.path, nextEn, nextAr);
    setBusy(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
      onSaved();
    }
  };

  const reset = async () => {
    setEn(entry.en);
    setAr(entry.ar);
    await saveTranslation(entry.path, "", "");
    onSaved();
  };

  const isLong = entry.en.length > 70 || entry.ar.length > 70;
  const Field = isLong ? "textarea" : "input";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr_auto] gap-2 items-start py-2.5 border-b border-outline-variant/40 last:border-0">
      <div className="flex items-center gap-1.5 pt-2">
        <code className="text-[11px] text-on-surface-variant truncate" title={entry.path}>
          {entry.path.split(".").pop()}
        </code>
        {entry.overridden && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d1fae5] text-[#065f46] shrink-0">
            edited
          </span>
        )}
      </div>
      <Field
        className={inputCls}
        rows={isLong ? 2 : undefined}
        value={en}
        onChange={(e) => setEn(e.target.value)}
        onBlur={() => en !== entry.en && commit(en, ar)}
      />
      <Field
        className={inputCls}
        dir="rtl"
        rows={isLong ? 2 : undefined}
        value={ar}
        onChange={(e) => setAr(e.target.value)}
        onBlur={() => ar !== entry.ar && commit(en, ar)}
      />
      <div className="flex items-center gap-2 pt-2">
        {busy && <span className="text-xs text-on-surface-variant">Saving…</span>}
        {saved && <span className="text-xs text-primary font-bold">Saved ✓</span>}
        {entry.overridden && (
          <button
            type="button"
            className="text-xs underline text-on-surface-variant shrink-0"
            onClick={reset}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Edits every UI string (nav, footer, home hero, forms, buttons — every
 * "messages/en.json" / "messages/ar.json" namespace) via /api/admin/
 * translations. Structured content (product specs, industry modal
 * details, article bodies) lives in the separate Content tab.
 */
export default function TranslationsTab() {
  const [entries, setEntries] = useState<FlatEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/admin/translations").then(async (res) => {
      if (!res.ok) {
        setError("Failed to load translations.");
        return;
      }
      const data = (await res.json()) as { entries: FlatEntry[] };
      setEntries(data.entries);
    });
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!entries) return [];
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.path.toLowerCase().includes(q) ||
        e.en.toLowerCase().includes(q) ||
        e.ar.toLowerCase().includes(q)
    );
  }, [entries, query]);

  const grouped = useMemo(() => {
    const out: Record<string, FlatEntry[]> = {};
    for (const e of filtered) {
      const ns = e.path.split(".")[0];
      (out[ns] ??= []).push(e);
    }
    return out;
  }, [filtered]);

  const overriddenCount = entries?.filter((e) => e.overridden).length ?? 0;

  if (error) return <p className="text-error">{error}</p>;
  if (!entries) return <p className="text-on-surface-variant">Loading translations…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-on-surface-variant">
          {entries.length} strings across {new Set(entries.map((e) => e.path.split(".")[0])).size} namespaces
          {overriddenCount > 0 && <> · {overriddenCount} edited</>}
        </p>
        <input
          className={`${inputCls} max-w-xs`}
          placeholder="Search by key or text…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr_auto] gap-2 px-1 mb-1 text-xs font-bold text-on-surface-variant uppercase tracking-wide">
        <span>Key</span>
        <span>English</span>
        <span>العربية</span>
        <span />
      </div>

      <div className="space-y-2">
        {Object.entries(grouped).map(([ns, list]) => (
          <details
            key={ns}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden"
            open={!!query}
          >
            <summary className="flex items-center justify-between gap-3 px-5 py-3 cursor-pointer list-none">
              <span className="font-label-lg text-label-lg">{ns}</span>
              <span className="text-xs text-on-surface-variant">{list.length} strings</span>
            </summary>
            <div className="px-5 pb-4 border-t border-outline-variant/50 pt-2">
              {list.map((entry) => (
                <EntryRow key={entry.path} entry={entry} onSaved={load} />
              ))}
            </div>
          </details>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-on-surface-variant p-6 text-center">No matches.</p>
        )}
      </div>
    </div>
  );
}
