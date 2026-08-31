import type { Metadata } from "next";
import { bestsellerProducts } from "@/lib/content";
import PageHeader from "@/components/ui/PageHeader";
import ProductGrid from "@/components/products/ProductGrid";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "Products | Vardann Tech and Engg LLP",
};

export default function ProductsPage() {
  return (
    <>
      <div className="bg-continuous-light">
      <PageHeader
        eyebrow="Our Product"
        title="Precision You Can Measure."
        subtitle="Calibration tubes, probes, test blocks and welded specimens — manufactured per ASME standards with NABL/NPL traceability. Custom orders typically ship within 3–6 days."
      />

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <ProductGrid products={bestsellerProducts} />
        </div>
      </section>
      </div>

      <CtaSection />
    </>
  );
}
