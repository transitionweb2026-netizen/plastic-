import type { Metadata } from "next";
import { Suspense } from "react";
import ProductCatalog from "@/components/products/ProductCatalog";

export const metadata: Metadata = {
  title: "Industrial Storage Products",
  description:
    "Browse Giant Storage's catalog of industrial pallets, heavy-duty crates, storage bins, and containers — engineered HDPE solutions for high-density logistics.",
};

export default function ProductsPage() {
  return (
    <div className="pt-6 pb-20">
      {/* Hero */}
      <section className="px-4 md:px-margin-desktop mb-12">
        <div className="max-w-4xl">
          <h1 className="font-headline-lg text-[24px] leading-8 md:text-headline-lg text-primary mb-4">
            Industrial Grade Storage Solutions
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Premium storage systems designed for high-density environments. Our
            heavy-duty pallets, crates, and bins are engineered for maximum
            durability and logistical efficiency.
          </p>
        </div>
      </section>

      {/* Catalog is client-side (filter/pagination/modal state); Suspense is
          required because it reads ?category= via useSearchParams. */}
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <ProductCatalog />
      </Suspense>
    </div>
  );
}
