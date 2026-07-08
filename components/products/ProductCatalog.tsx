"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { productCover, type Product } from "@/lib/products";
import ProductModal from "./ProductModal";

/** The catalog shows a single grid of exactly six products. */
const MAX_VISIBLE_PRODUCTS = 6;
const DELAYS = ["delay-1", "delay-2", "delay-3", "delay-4", "delay-5", "delay-6"];

/**
 * Client-side product catalog: a single six-product grid with the detail
 * modal (no category filters, no pagination).
 */
export default function ProductCatalog({
  products,
}: {
  /** Fully resolved (localized, CMS-merged) products — fetched server-side
   *  by the parent page, see app/[locale]/products/page.tsx. */
  products: Product[];
}) {
  const t = useTranslations("productsUi");
  const visibleProducts = products.slice(0, MAX_VISIBLE_PRODUCTS);
  const [selected, setSelected] = useState<Product | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Scroll-reveal for cards (legacy .fade-up → .visible).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    gridRef.current
      ?.querySelectorAll(".fade-up:not(.visible)")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Product grid */}
      <section className="px-4 md:px-margin-desktop">
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {visibleProducts.map((product, i) => (
            <div
              key={product.id}
              className={`prod-card fade-up ${DELAYS[i] ?? ""}`}
              onClick={() => setSelected(product)}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[.875rem] bg-surface-container-low">
                <Image
                  className="card-img object-cover"
                  src={productCover(product)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="quick-view-overlay">
                  <span className="quick-view-text">{t("quickView")}</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full">
                    {product.badge}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">
                  {product.category}
                </p>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                  {product.name}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2">
                  {product.shortDesc}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-label-md text-label-md text-primary font-bold">
                    {product.status}
                  </span>
                  <button
                    className="btn-view"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(product);
                    }}
                  >
                    {t("viewDetails")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
