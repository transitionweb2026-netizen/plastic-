"use client";

import { useRef, useState } from "react";

/**
 * Direct-to-Storage video upload control for the CMS. Gets a one-time
 * signed URL from /api/admin/video-upload, then PUTs the file straight to
 * Supabase Storage via XHR (real progress events; no serverless body
 * limits). Hands the resulting public URL to `onChange` — the caller owns
 * persistence, same contract as ImageUploader. Shows an inline preview of
 * the current video with Replace/Delete controls.
 */
export default function VideoUploader({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fmtSize = (bytes: number) =>
    bytes >= 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.ceil(bytes / 1024)} KB`;

  const upload = async (file: File) => {
    setError("");
    setDone(false);
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file (MP4).");
      return;
    }
    setFileInfo(`${file.name} — ${fmtSize(file.size)}`);
    setBusy(true);
    setProgress(0);
    try {
      const res = await fetch("/api/admin/video-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "could not start the upload");
      }
      const { uploadUrl, publicUrl } = (await res.json()) as {
        uploadUrl: string;
        publicUrl: string;
      };

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("content-type", file.type || "video/mp4");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) return resolve();
          // Surface the real storage error (e.g. "Payload too large",
          // "Bucket not found", policy violations) instead of a code.
          let detail = "";
          try {
            const body = JSON.parse(xhr.responseText) as { message?: string; error?: string };
            detail = body.message || body.error || "";
          } catch {
            detail = xhr.responseText?.slice(0, 120) ?? "";
          }
          reject(new Error(`storage rejected the upload (${xhr.status}${detail ? `: ${detail}` : ""})`));
        };
        xhr.onerror = () =>
          reject(
            new Error(
              "the browser blocked the upload before it reached storage — usually a connection drop or a security-policy (CSP/CORS) block; try again and contact the developer if it persists"
            )
          );
        xhr.ontimeout = () => reject(new Error("upload timed out — check your connection and try again"));
        xhr.send(file);
      });

      onChange(publicUrl);
      setDone(true);
      setTimeout(() => setDone(false), 3500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
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

      {value && !busy && (
        <div className="mb-2">
          {/* Inline preview of the current video (metadata only) */}
          <video
            src={value}
            controls
            preload="metadata"
            playsInline
            className="w-full max-w-[260px] rounded-lg border border-outline-variant bg-black"
          />
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-label={value ? "Replace video" : "Upload video"}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !busy && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file && !busy) void upload(file);
        }}
        className={`rounded-lg border-2 border-dashed px-4 py-4 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-outline-variant hover:border-primary/50"
        } ${busy ? "opacity-70 cursor-wait" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = "";
          }}
        />
        {busy ? (
          <div>
            <p className="text-xs font-bold text-on-surface mb-2">
              Uploading… {progress}%
            </p>
            <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            {fileInfo && (
              <p className="text-[11px] text-on-surface-variant mt-1.5">{fileInfo}</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant">
            <span className="font-bold text-primary">
              {value ? "Replace video" : "Upload video"}
            </span>{" "}
            — drag &amp; drop an MP4 here or click to browse
          </p>
        )}
      </div>

      <div className="mt-1.5 flex items-center gap-3 min-h-[18px]">
        {done && (
          <span className="text-xs text-primary font-bold">
            Uploaded ✓ — saved and live
          </span>
        )}
        {error && <span className="text-xs text-error font-bold">{error}</span>}
        {value && !busy && (
          <button
            type="button"
            className="text-xs text-error underline"
            onClick={() => {
              setDone(false);
              setError("");
              onChange("");
            }}
          >
            Delete video
          </button>
        )}
      </div>
    </div>
  );
}
