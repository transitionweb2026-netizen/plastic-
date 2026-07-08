"use client";

import { useState } from "react";

/**
 * Shared upload control for every content image (products/industries/
 * articles/site images/gallery) — POSTs to /api/admin/upload (Supabase
 * Storage-backed) and hands the resulting public URL to `onChange`.
 * Caller owns persistence (its own save/publish flow); this component only
 * handles the upload + local preview.
 */
export default function ImageUploader({
  value,
  onChange,
  label,
  kind = "image",
  compact = false,
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  kind?: "image" | "og" | "favicon" | "apple";
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        setError("Upload failed");
        return;
      }
      const { path } = (await res.json()) as { path: string };
      onChange(path);
    } catch {
      setError("Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={compact ? "" : "mb-3"}>
      {label && (
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className={`${compact ? "w-16 h-16" : "w-24 h-24"} object-cover rounded-lg border border-outline-variant shrink-0`}
          />
        ) : (
          <div
            className={`${compact ? "w-16 h-16" : "w-24 h-24"} rounded-lg border border-dashed border-outline-variant shrink-0 flex items-center justify-center text-on-surface-variant text-xs`}
          >
            none
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold cursor-pointer w-fit">
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy}
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
          </label>
          {value && (
            <button
              type="button"
              className="text-xs text-error underline text-start w-fit"
              onClick={() => onChange("")}
            >
              Clear
            </button>
          )}
          {error && <span className="text-xs text-error">{error}</span>}
        </div>
      </div>
    </div>
  );
}
