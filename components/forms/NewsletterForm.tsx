"use client";

import { useState } from "react";

const formId = process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER_ID;

type Status = "idle" | "loading" | "success" | "error";

/**
 * Blog newsletter signup (legacy handleSubscribe). Posts to Formspree when
 * NEXT_PUBLIC_FORMSPREE_NEWSLETTER_ID is configured; otherwise shows a
 * friendly not-configured message instead of failing silently like the
 * legacy placeholder endpoint did.
 */
export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="reveal in-view text-white font-bold text-lg max-w-md mx-auto py-3">
        ✓ Subscribed! Check your inbox to confirm.
      </p>
    );
  }

  return (
    <>
      <form
        className="reveal d3 flex flex-col sm:flex-row max-w-md mx-auto gap-2 sm:gap-0"
        onSubmit={onSubmit}
      >
        <input
          className="nl-input"
          type="email"
          name="email"
          placeholder="your@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <button
          type="submit"
          className="nl-btn sm:rounded-r-lg sm:rounded-l-none"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe →"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-white/80 text-sm mt-3">
          {formId
            ? "Something went wrong — please try again later."
            : "Newsletter signup isn't configured yet. Please check back soon."}
        </p>
      )}
    </>
  );
}
