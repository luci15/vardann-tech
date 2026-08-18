import SectionHeading from "@/components/ui/SectionHeading";
import BestsellersCarousel from "./BestsellersCarousel";

export default function Products() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Products"
          title={
            <>
              Precision You Can <span className="text-vblue italic">Measure.</span>
            </>
          }
          subtitle="Calibration tubes, probes, test blocks and welded specimens — manufactured to ASME standards with full traceability."
        />
        <div className="mt-14">
          <BestsellersCarousel />
        </div>
      </div>
    </section>
  );
}
