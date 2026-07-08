"use client";

/** Copies the current page URL to the clipboard, matching the legacy
 *  inline onclick's exact behavior (no __PAGE_URL__ token needed —
 *  window.location.href is already correct client-side). */
export default function CopyLinkButton({
  label,
  copiedLabel,
}: {
  label: string;
  copiedLabel: string;
}) {
  return (
    <button
      className="share-btn bg-surface-container-high text-on-surface"
      onClick={(e) => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          (e.currentTarget as HTMLButtonElement).textContent = copiedLabel;
        });
      }}
    >
      {label}
    </button>
  );
}
