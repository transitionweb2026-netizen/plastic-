"use client";

import { useState } from "react";

export default function LoginForm({ devPassword }: { devPassword: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) window.location.reload();
    else setError("Invalid password.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-8 industrial-shadow"
      >
        <h1 className="font-headline-md text-headline-md text-primary mb-1">
          SEO CMS
        </h1>
        <p className="text-sm text-on-surface-variant mb-6">
          Giant Storage — admin sign in
        </p>
        <label className="font-label-md text-label-md block mb-2" htmlFor="pw">
          Password
        </label>
        <input
          id="pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 px-4 bg-surface-container-low border border-outline-variant rounded-lg mb-4"
          autoFocus
          required
        />
        {error && <p className="text-error text-sm mb-3">{error}</p>}
        {devPassword && (
          <p className="text-xs text-[#92400e] bg-[#fef3c7] rounded-lg p-3 mb-4">
            ADMIN_PASSWORD is not set — the development fallback password
            <code className="font-bold"> giant-admin </code>
            is active. Set ADMIN_PASSWORD in .env.local before deploying.
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full h-12 bg-primary text-on-primary rounded-lg font-label-md text-label-md active:scale-95 transition-all disabled:opacity-70"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
