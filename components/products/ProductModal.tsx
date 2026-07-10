"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { productGallery, type Product } from "@/lib/products";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

/** Product detail modal (ported from the legacy openModal renderer). */
export default function ProductModal({ product, onClose }: ProductModalProps) {
  const t = useTranslations("productsUi");
  const tc = useTranslations("common");
  const gallery = useMemo(
    () => (product ? productGallery(product) : []),
    [product]
  );
  const [activeIdx, setActiveIdx] = useState(0);

  // Each product starts its gallery on the main (first) image. Adjusted
  // during render (React's recommended pattern for resetting state when a
  // prop changes) rather than in an effect.
  const [prevProduct, setPrevProduct] = useState(product);
  if (product !== prevProduct) {
    setPrevProduct(product);
    setActiveIdx(0);
  }

  // Legacy behavior: lock body scroll while open, close on Escape.
  useEffect(() => {
    document.body.style.overflow = product ? "hidden" : "";
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  const activeSrc = gallery[activeIdx] ?? product?.image;

  return (
    <div
      className={`modal-backdrop ${product ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {product && (
        <div className="modal-box">
          <div className="relative">
            {/* key remount triggers the fade/scale transition on image switch */}
            <div key={activeSrc} className="gallery-main">
              {/* Local studio shots are 1:1 on white — show them un-cropped
                  (contain on white); remote catalog photos keep the 16:9 crop. */}
              <Image
                className={`modal-img rounded-t-xl ${
                  activeSrc?.startsWith("/products/") ? "modal-img-contain" : ""
                }`}
                src={activeSrc ?? product.image}
                alt={product.name}
                width={920}
                height={518}
                sizes="(max-width: 920px) 100vw, 920px"
              />
            </div>
            <button className="modal-close" aria-label={tc("close")} onClick={onClose}>
              <span
                className="material-symbols-outlined text-on-surface"
                style={{ fontSize: 20 }}
              >
                close
              </span>
            </button>
            <div className="absolute bottom-4 left-4">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${product.statusClass}`}
              >
                {product.status}
              </span>
            </div>
          </div>

          {/* Angle gallery — hidden when a product has only one image */}
          {gallery.length > 1 && (
            <div
              className="gallery-thumbs"
              role="group"
              aria-label={t("productImages", { name: product.name })}
            >
              {gallery.map((src, i) => (
                <button
                  key={`${i}-${src}`}
                  type="button"
                  className={`gallery-thumb ${i === activeIdx ? "active" : ""}`}
                  aria-label={t("viewImage", { n: i + 1, total: gallery.length })}
                  aria-current={i === activeIdx}
                  onClick={() => setActiveIdx(i)}
                >
                  <Image
                    src={src}
                    alt=""
                    width={128}
                    height={96}
                    sizes="128px"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                  {product.category}
                </p>
                <h2
                  id="modal-title"
                  className="font-headline-md text-headline-md text-on-surface"
                >
                  {product.name}
                </h2>
              </div>
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full self-start">
                {product.badge}
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
              {product.description}
            </p>

            <div>
              <p className="modal-section-title">{t("technicalSpecifications")}</p>
              <div>
                {[
                  [t("material"), product.material],
                  [t("dimensions"), product.dimensions],
                  [t("loadCapacity"), product.loadCapacity],
                ].map(([label, value]) => (
                  <div key={label} className="spec-row">
                    <span className="spec-label">{label}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <p className="text-sm text-on-surface-variant">
                <span className="font-semibold text-on-surface">
                  {t("availability")}
                </span>{" "}
                {product.availability}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {product.datasheetPdf && (
                  <a
                    href={product.datasheetPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-outline-variant text-on-surface px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container-low active:scale-95 transition-all inline-flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      download
                    </span>
                    {t("downloadDatasheet")}
                  </a>
                )}
                <Link
                  href="/request-quote"
                  className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md hover:bg-secondary active:scale-95 transition-all inline-flex items-center"
                  style={{ boxShadow: "0 6px 20px rgba(14,74,48,.3)" }}
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
