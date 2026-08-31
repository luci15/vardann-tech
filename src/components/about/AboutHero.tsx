"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { company } from "@/lib/content";

const GlobalGlobe = dynamic(() => import("@/components/sections/GlobalGlobe"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-transparent" />,
});

// Distinct from the shared PageHeader used on Services/Products/Contact —
// About gets its own editorial split hero so the interactive globe (moved
// here from the cramped 300px slot it used to share with the stats row)
// has real room to read as a feature, not an afterthought.
export default function AboutHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-16 pb-14 sm:pt-20 sm:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_50%_at_15%_0%,rgba(0,80,160,0.12),transparent_65%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1fr_0.9fr] lg:gap-6 lg:px-10">
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-eyebrow inline-flex items-center gap-2 rounded-full border border-vblue/25 bg-white px-3.5 py-1.5 text-[0.62rem] text-vblue">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            About Us
          </span>

          <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-navy sm:text-6xl">
            Company Profile.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-body sm:text-lg">
            Formerly known as {company.formerlyKnownAs}. We have rebranded as{" "}
            {company.name} to reflect our broader vision and global commitment
            to engineering excellence.
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto aspect-square w-full max-w-[440px] lg:max-w-none"
        >
          <GlobalGlobe />
        </motion.div>
      </div>
    </section>
  );
}
