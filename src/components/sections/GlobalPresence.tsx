"use client";

import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";

const GlobalGlobe = dynamic(() => import("@/components/sections/GlobalGlobe"), {
  ssr: false,
  loading: () => (
    <div className="relative mx-auto h-[550px] w-full max-w-4xl animate-pulse rounded-full border border-vblue/15 bg-vblue/5" />
  ),
});

const regions = [
  "India (Origin)",
  "Egypt",
  "Libya",
  "Iran",
  "Saudi Arabia",
  "Russia",
];

export default function GlobalPresence() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20">
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
          subtitle="Our products and services are trusted by clients across India, the Middle East, Africa, Eurasia, and Russia."
        />

        <div className="mx-auto mt-6 w-full max-w-4xl">
          <GlobalGlobe />
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
