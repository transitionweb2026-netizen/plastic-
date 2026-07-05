"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  PRODUCT_CATEGORIES,
  PRODUCTS,
  productCover,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import ProductModal from "./ProductModal";

/** The catalog shows a single page of exactly six products (no pagination). */
const MAX_VISIBLE_PRODUCTS = 6;
const DELAYS = ["delay-1", "delay-2", "delay-3", "delay-4", "delay-5", "delay-6"];

type CategoryFilter = ProductCategory | "all";

function isCategory(value: string | null): value is CategoryFilter {
  return (
    value !== null && PRODUCT_CATEGORIES.some((c) => c.id === value)
  );
}

/**
 * Client-side product catalog: category filter, a single six-product grid,
 * and detail modal. Supports deep links like /products?category=pallets
 * (used by footer links).
 */
export default function ProductCatalog() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category");
  const [category, setCategory] = useState<CategoryFilter>(
    isCategory(initialCat) ? initialCat : "all"
  );
  const [selected, setSelected] = useState<Product | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);

  const pageItems = useMemo(
    () =>
      (category === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.cat === category)
      ).slice(0, MAX_VISIBLE_PRODUCTS),
    [category]
  );

  // Legacy behavior: filter changes scroll back to the top of the grid.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const top = gridRef.current?.offsetTop ?? 0;
    window.scrollTo({ top: top - 120, behavior: "smooth" });
  }, [category]);

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
  }, [pageItems]);

  const selectCategory = (next: CategoryFilter) => {
    setCategory(next);
  };

  return (
    <>
      {/* Category filters */}
      <section className="px-4 md:px-margin-desktop mb-12 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-2 rounded-full font-label-md text-label-md transition-all ${
                category === cat.id
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
              aria-pressed={category === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Product grid */}
      <section className="px-4 md:px-margin-desktop">
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pageItems.length === 0 ? (
            <p className="col-span-3 text-center text-on-surface-variant py-16 font-body-md text-body-md">
              No products found in this category.
            </p>
          ) : (
            pageItems.map((product, i) => (
              <div
                key={`${category}-${product.id}`}
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
                    <span className="quick-view-text">Quick View</span>
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
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
