"use client";

import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";

const DottedWorldMap = dynamic(() => import("@/components/sections/DottedWorldMap"), {
  ssr: false,
  loading: () => (
    <div className="relative mx-auto h-[340px] sm:h-[480px] w-full bg-transparent" />
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
    <section className="relative flex flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-28 overflow-visible">
      {/* Ambient Radial Glow Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_65%_45%_at_50%_60%,rgba(0,120,220,0.06),transparent_75%)]"
      />

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

        {/* Semicircle Curved Horizon Container (Curved Top & Bottom Edges with Light Smoky Edge Blend) */}
        <div className="relative mt-16 sm:mt-24 lg:mt-28 mb-12 sm:mb-16 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[340px] sm:h-[480px] md:h-[560px] lg:h-[650px] overflow-visible [clip-path:ellipse(98%_100%_at_50%_100%)] [mask-image:radial-gradient(ellipse_98%_92%_at_50%_50%,black_88%,transparent_100%)]">
          {/* Light Smoky Edge Fog Layer */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-vblue/5 via-transparent to-vblue/5 opacity-35 blur-xs" />

          <DottedWorldMap />
        </div>

        <div className="mx-auto mt-6 sm:mt-10 flex max-w-3xl flex-col items-center gap-3 text-center">
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
