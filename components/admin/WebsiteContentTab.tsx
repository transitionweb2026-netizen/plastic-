"use client";

import { useState } from "react";
import TranslationsTab from "./TranslationsTab";
import ContentTab from "./ContentTab";
import SiteImagesTab from "./SiteImagesTab";

const SUBTABS = ["Text & Labels", "Products / Industries / Articles / Contact Info", "Site Images"] as const;

/**
 * Single entry point for editing every visible word on the site, without
 * touching source code: hero titles/descriptions/buttons, every section
 * heading and paragraph, nav, footer, statistics, cards, CTAs — all of
 * "messages/en.json" + "messages/ar.json" (Text & Labels), plus product
 * specs, industry modal detail, full article bodies, and site contact
 * info (the second sub-tab). SEO metadata stays in the separate tabs
 * above — this section is content, not SEO.
 */
export default function WebsiteContentTab() {
  const [sub, setSub] = useState<(typeof SUBTABS)[number]>("Text & Labels");

  return (
    <div>
      <div className="mb-5 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <h2 className="font-headline-md text-headline-md text-primary mb-1">
          Website Content
        </h2>
        <p className="text-sm text-on-surface-variant">
          Every visible word on the site, editable here — hero, buttons, nav,
          footer, section titles, paragraphs, cards, statistics, product and
          article content, and contact info. Changes go live immediately,
          no code changes needed.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {SUBTABS.map((s) => (
          <button
            key={s}
            onClick={() => setSub(s)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${sub === s ? "bg-primary text-white" : "bg-surface-container-lowest border border-outline-variant"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {sub === "Text & Labels" && <TranslationsTab />}
      {sub === "Products / Industries / Articles / Contact Info" && <ContentTab />}
      {sub === "Site Images" && <SiteImagesTab />}
    </div>
  );
}
