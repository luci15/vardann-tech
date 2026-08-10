import SectionHeading from "@/components/ui/SectionHeading";
import BestsellersCarousel from "./BestsellersCarousel";

export default function Products() {
  return (
    <section className="relative overflow-hidden bg-soft-light py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_50%_at_85%_10%,rgba(0,80,160,0.10),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Products"
          title="Precision You Can Measure."
          subtitle="Calibration tubes, probes, test blocks and welded specimens — manufactured to ASME standards with full traceability."
        />
        <div className="mt-14">
          <BestsellersCarousel />
        </div>
      </div>
    </section>
  );
}
