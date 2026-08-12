import type { Metadata } from "next";
import Image from "next/image";
import { bestsellerProducts } from "@/lib/content";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import CapabilitiesShowcase from "@/components/sections/CapabilitiesShowcase";
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bestsellerProducts.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-vblue/10 bg-white shadow-sm transition-colors hover:border-vblue/50"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 30vw"
                    className="object-contain p-6"
                  />
                </div>
                <div className="p-7 pt-0">
                  <p className="text-eyebrow text-[0.62rem] text-vblue">
                    {p.category}
                  </p>
                  <h3 className="mt-1.5 font-heading text-lg font-bold text-navy">
                    {p.name}
                  </h3>
                  <p className="mt-2.5 text-base leading-relaxed text-body">
                    {p.description}
                  </p>
                  <p className="mt-3 text-[0.78rem] leading-snug tracking-normal text-steel italic">
                    {p.spec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <SectionHeading
            align="left"
            eyebrow="Capabilities / 01"
            title="Engineered for the Critical."
            subtitle="From advanced NDT and inspection to precision manufacturing and metallography, Vardann Tech delivers engineering solutions for demanding applications."
          />
          <div className="mt-12">
            <CapabilitiesShowcase />
          </div>
        </div>
      </section>
      </div>

      <CtaSection />
    </>
  );
}
