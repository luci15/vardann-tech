"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import TextReveal from "./TextReveal";
import Marquee from "./Marquee";
import { allMethodCodes } from "@/lib/content";

// Minimal, controlled entrance for the services hub: background first,
// eyebrow pill, then the headline composes in word by word, then the
// supporting statement, the CTA, then a marquee of every method code.
export default function HubHero() {
  const reduceMotion = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative overflow-hidden bg-continuous-light pt-12 pb-14 sm:pt-16 sm:pb-16">
      <motion.div className="flex justify-center" {...fade(0.1)}>
        <span className="text-eyebrow inline-flex items-center gap-2 rounded-full border border-vblue/25 bg-white px-4 py-1.5 text-[0.62rem] text-vblue">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Services / Engineering Capabilities
        </span>
      </motion.div>

      <h1 className="mx-auto mt-6 max-w-3xl px-6 text-center font-display text-[2.5rem] leading-[1.08] tracking-tight text-navy sm:text-6xl">
        <TextReveal text="Inspection, Testing &" trigger="mount" delay={0.35} />
        {" "}
        <TextReveal
          text="Manufacturing Services"
          trigger="mount"
          delay={0.6}
          className="text-vblue"
        />
      </h1>

      <motion.p
        className="mx-auto mt-6 max-w-xl px-6 text-center text-base leading-relaxed text-body sm:text-lg"
        {...fade(1.1)}
      >
        From advanced NDT and inspection to precision manufacturing and
        metallography — one standard of precision across every discipline.
      </motion.p>

      <motion.div className="mt-8 flex justify-center px-6" {...fade(1.3)}>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 rounded-full bg-vblue px-7 py-3 text-eyebrow text-[0.72rem] text-white transition-all duration-300 hover:scale-[1.03] hover:bg-vblue-hover"
        >
          Enquire Now
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>

      <motion.div className="mt-12" {...fade(1.5)}>
        <Marquee items={allMethodCodes} className="[mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]" />
      </motion.div>
    </section>
  );
}
