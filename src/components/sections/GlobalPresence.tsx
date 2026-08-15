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
    <section className="relative flex flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-28 overflow-visible">
      {/* Ambient Radial Glow Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_65%_45%_at_50%_60%,rgba(0,120,220,0.08),transparent_75%)]"
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

        {/* Semicircle Curved Horizon Container with Multi-Layered Smoky Rim & Mobile Scroll Support */}
        <div className="relative mt-12 sm:mt-24 lg:mt-28 mb-10 sm:mb-16 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[410px] sm:h-[500px] md:h-[580px] lg:h-[650px] overflow-visible touch-pan-y [clip-path:ellipse(112%_100%_at_50%_100%)] sm:[clip-path:ellipse(98%_100%_at_50%_100%)] [mask-image:radial-gradient(ellipse_100%_94%_at_50%_50%,black_88%,transparent_100%)]">
          
          {/* Top Semicircle Rim Smoky Glow Line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 sm:h-44 bg-gradient-to-b from-sky-400/25 via-vblue/12 to-transparent blur-md z-10" />

          {/* Volumetric Smoky Mist Fog Layers along Curved Border */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_65%_at_50%_15%,rgba(56,189,248,0.2),rgba(0,102,204,0.1)_50%,transparent_85%)] blur-lg z-10" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_100%,rgba(15,23,42,0.12),transparent_70%)] z-10" />

          {/* Ambient Drifting Smoky Edge Fog */}
          <div className="pointer-events-none absolute -inset-4 bg-gradient-to-r from-sky-300/15 via-vblue/20 to-sky-300/15 opacity-70 blur-xl z-0" />

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
