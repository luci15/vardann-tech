import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full border border-vblue bg-white px-6 py-3 text-eyebrow text-[0.7rem] text-vblue transition-colors hover:bg-lightblue"
          >
            View All Products
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
