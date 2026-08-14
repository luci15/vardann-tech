"use client";

import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";

const DottedWorldMap = dynamic(() => import("@/components/sections/DottedWorldMap"), {
  ssr: false,
  loading: () => (
    <div className="relative mx-auto h-[380px] sm:h-[450px] w-full bg-transparent" />
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
    <section className="relative flex flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_45%_45%_at_50%_60%,rgba(0,80,160,0.12),transparent_65%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Global Presence"
          title={
            <>
              Trusted Across <span className="text-vblue italic">Continents.</span>
            </>
          }
          subtitle="Our products and services are trusted by clients across India, the Middle East, Africa, Eurasia, USA, and Russia."
        />

        {/* Full-Width 3D Tilted Map Cropped into Semicircle Horizon Arc */}
        <div className="relative mt-6 sm:mt-8 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[340px] sm:h-[480px] md:h-[560px] lg:h-[650px] overflow-hidden [clip-path:ellipse(96%_100%_at_50%_100%)]">
          <DottedWorldMap />
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 text-center">
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
