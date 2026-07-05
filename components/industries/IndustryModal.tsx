"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { IndustryModal as IndustryModalData } from "@/lib/industries";

type IndustryModalProps = {
  data: IndustryModalData | null;
  onClose: () => void;
};

/**
 * Detail modal for manufacturing stages, technology highlights, industries,
 * and certifications (ported from the legacy indastries.html openModal).
 * Same shell as the products modal plus an "Industries Served" section and
 * a second Contact CTA.
 */
export default function IndustryModal({ data, onClose }: IndustryModalProps) {
  const t = useTranslations("productsUi");
  useEffect(() => {
    document.body.style.overflow = data ? "hidden" : "";
    if (!data) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [data, onClose]);

  return (
    <div
      className={`modal-backdrop ${data ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="industry-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {data && (
        <div className="modal-box">
          <div className="relative">
            <Image
              className="modal-img rounded-t-xl"
              src={data.image}
              alt={data.title}
              width={920}
              height={518}
              sizes="(max-width: 920px) 100vw, 920px"
            />
            <button className="modal-close" aria-label="Close" onClick={onClose}>
              <span
                className="material-symbols-outlined text-on-surface"
                style={{ fontSize: 20 }}
              >
                close
              </span>
            </button>
            <div className="absolute bottom-4 left-4">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${data.statusClass}`}
              >
                {data.status}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                  {data.category}
                </p>
                <h2
                  id="industry-modal-title"
                  className="font-headline-md text-headline-md text-on-surface"
                >
                  {data.title}
                </h2>
              </div>
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full self-start uppercase tracking-wide">
                {data.badge}
              </span>
            </div>
            <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
              {data.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="modal-section-title">{t("technicalSpecifications")}</p>
                <div>
                  {data.specs.map(([label, value]) => (
                    <div key={label} className="spec-row">
                      <span className="spec-label">{label}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="modal-section-title">{t("keyFeatures")}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {data.features.map((feature) => (
                    <span key={feature} className="feature-chip">
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{
                          fontSize: 14,
                          fontVariationSettings:
                            "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24",
                        }}
                      >
                        check_circle
                      </span>
                      {feature}
                    </span>
                  ))}
                </div>
                <p className="modal-section-title">{t("applications")}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {data.applications.map((app) => (
                    <span key={app} className="app-tag">
                      {app}
                    </span>
                  ))}
                </div>
                <p className="modal-section-title">{t("industriesServed")}</p>
                <div className="flex flex-wrap gap-2">
                  {data.industries.map((industry) => (
                    <span key={industry} className="ind-tag">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <p className="text-sm text-on-surface-variant">
                <span className="font-semibold text-on-surface">
                  {t("availability")}
                </span>{" "}
                {data.availability}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="border-2 border-primary text-primary px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-primary hover:text-white active:scale-95 transition-all inline-flex items-center min-h-[44px]"
                >
                  Contact Us
                </Link>
                <Link
                  href="/request-quote"
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-secondary active:scale-95 transition-all inline-flex items-center min-h-[44px]"
                  style={{ boxShadow: "0 6px 20px rgba(1,78,42,.3)" }}
                >
                  {t("requestAQuote")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
