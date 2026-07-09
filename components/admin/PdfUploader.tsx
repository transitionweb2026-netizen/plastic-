"use client";

import { useState } from "react";

/**
 * Shared upload control for product datasheet PDFs — POSTs to
 * /api/admin/upload (kind=datasheet, Supabase Storage-backed) and hands the
 * resulting public URL to `onChange`. Caller owns persistence (its own
 * save/publish flow); this component only handles the upload + preview link.
 */
export default function PdfUploader({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("File must be a PDF");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "datasheet");
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
    <div className="mb-3">
      {label && (
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="w-24 h-24 rounded-lg border border-outline-variant shrink-0 flex flex-col items-center justify-center gap-1 text-primary hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
              picture_as_pdf
            </span>
            <span className="text-[11px] font-bold">Preview</span>
          </a>
        ) : (
          <div className="w-24 h-24 rounded-lg border border-dashed border-outline-variant shrink-0 flex items-center justify-center text-on-surface-variant text-xs">
            none
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold cursor-pointer w-fit">
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
            <input
              type="file"
              accept="application/pdf"
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
              Delete
            </button>
          )}
          {error && <span className="text-xs text-error">{error}</span>}
        </div>
      </div>
    </div>
  );
}
