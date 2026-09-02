"use client";

import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";

const DottedWorldMap = dynamic(() => import("@/components/sections/DottedWorldMap"), {
  ssr: false,
  loading: () => (
    <div className="relative mx-auto h-[410px] sm:h-[500px] w-full bg-transparent" />
  ),
});

const regions = [
  "India (Origin)",
  "USA",
  "Egypt",
  "Libya",
  "Iran",
  "Saudi Arabia",
  "Russia",
];

export default function GlobalPresence() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 overflow-visible">
      <div className="relative mx-auto w-full max-w-6xl overflow-visible">
        <SectionHeading
          eyebrow="Global Presence"
          title={
            <>
              Trusted Across <span className="text-vblue italic">Continents.</span>
            </>
          }
          subtitle="Our products and services are trusted by clients across India, the Middle East, Africa, Eurasia, USA, and Russia."
        />

        {/* Clean Map Container without blue background / fog */}
        <div className="relative mt-8 sm:mt-12 mb-6 sm:mb-10 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[380px] sm:h-[480px] md:h-[540px] lg:h-[600px] overflow-visible touch-pan-y">
          <DottedWorldMap />
        </div>

        <div className="mx-auto mt-4 sm:mt-6 flex max-w-3xl flex-col items-center gap-3 text-center">
          <p className="text-eyebrow text-[0.65rem] text-steel">
            Global Delivery Network &amp; Connected Markets
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {regions.map((r) => (
              <span
                key={r}
                className="rounded-full border border-vblue/15 bg-white px-4 py-1.5 text-xs font-semibold text-navy shadow-sm sm:text-sm"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
