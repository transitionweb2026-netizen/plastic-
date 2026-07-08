"use client";

import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";

type SiteImageKey = { key: string; label: string };
type Payload = { keys: SiteImageKey[]; values: Record<string, string> };

function ImageRow({ item, value, onSaved }: { item: SiteImageKey; value: string; onSaved: () => void }) {
  const [url, setUrl] = useState(value);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);

  const commit = async (newUrl: string) => {
    setUrl(newUrl);
    setBusy(true);
    const res = await fetch("/api/admin/site-images", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: item.key, url: newUrl }),
    });
    setBusy(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
      onSaved();
    } else {
      setFailed(true);
      setTimeout(() => setFailed(false), 4000);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-outline-variant/40 last:border-0">
      <div className="flex items-center gap-3">
        <ImageUploader value={url} onChange={commit} />
        <span className="text-sm">{item.label}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {busy && <span className="text-xs text-on-surface-variant">Saving…</span>}
        {saved && <span className="text-xs text-primary font-bold">Saved ✓</span>}
        {failed && <span className="text-xs text-error font-bold">Save failed</span>}
        {!url && <span className="text-xs text-on-surface-variant">using built-in default</span>}
      </div>
    </div>
  );
}

/**
 * Every one-off page image that has no natural home in another content
 * table (hero backgrounds, header logo, client-logo marquee, category
 * tiles, video thumbnails, factory cards, map/spotlight). Backed by the
 * cms_images table (lib/cms/images-data.ts) — falls back to the shipped
 * default image on the live site whenever a key here is left blank.
 */
export default function SiteImagesTab() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/admin/site-images").then(async (res) => {
      if (!res.ok) {
        setError("Failed to load site images.");
        return;
      }
      setData((await res.json()) as Payload);
    });
  };

  useEffect(load, []);

  if (error) return <p className="text-error">{error}</p>;
  if (!data) return <p className="text-on-surface-variant">Loading site images…</p>;

  const groups: Record<string, SiteImageKey[]> = {};
  for (const item of data.keys) {
    const group = item.key.split(".")[0];
    (groups[group] ??= []).push(item);
  }
  const groupLabels: Record<string, string> = {
    header: "Header",
    home: "Home page",
    about: "About page",
    contact: "Contact page",
    requestQuote: "Request Quote page",
  };

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([group, items]) => (
        <details key={group} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden" open>
          <summary className="font-label-lg text-label-lg px-5 py-3 cursor-pointer list-none border-b border-outline-variant/50">
            {groupLabels[group] ?? group}
          </summary>
          <div className="px-5">
            {items.map((item) => (
              <ImageRow key={item.key} item={item} value={data.values[item.key] ?? ""} onSaved={load} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
