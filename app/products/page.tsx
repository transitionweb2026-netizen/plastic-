import type { Metadata } from "next";
import ProductCatalog from "@/components/products/ProductCatalog";

export const metadata: Metadata = {
  title: "Industrial Storage Products",
  description:
    "Browse Giant Storage's catalog of industrial pallets, heavy-duty crates, storage bins, and containers — engineered HDPE solutions for high-density logistics.",
};

export default function ProductsPage() {
  return (
    <div className="relative overflow-hidden pt-6 pb-20">
      {/* Whitespace decor (palette-only, non-interactive) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 blueprint-grid [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <span aria-hidden className="material-symbols-outlined decor-icon absolute top-8 right-10 hidden lg:block">inventory_2</span>
      <div aria-hidden className="decor-orb absolute -left-28 top-[430px] w-72 h-72 hidden md:block" />

      {/* Hero */}
      <section className="relative px-4 md:px-margin-desktop mb-12">
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

      {/* Catalog is client-side (modal state) */}
      <ProductCatalog />
    </div>
  );
}
