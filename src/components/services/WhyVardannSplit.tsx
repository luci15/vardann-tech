"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { whyVardann } from "@/lib/content";

// Split layout: eyebrow pill + two-tone statement + photo (with a large
// ghost watermark word behind it) on the left, a numbered accordion-style
// list on the right — replacing the plain seven-card grid the brief
// explicitly asked to avoid.
export default function WhyVardannSplit() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="border-t border-vblue/10 bg-continuous-light py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <span className="text-eyebrow inline-flex items-center gap-2 rounded-full border border-vblue/25 bg-white px-3.5 py-1.5 text-[0.62rem] text-vblue">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Why Vardann Tech
            </span>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-navy sm:text-5xl">
              Zero Compromise.
              <br />
              <span className="text-vblue">Towards Safety.</span>
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-body">
              Every discipline — inspection, testing, metallurgy and
              manufacturing — held to the same standard of precision.
            </p>

            <div className="relative mt-10 hidden sm:block">
              <span
                aria-hidden="true"
                className="text-display pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 text-[6rem] font-bold tracking-tight text-vblue/[0.06] select-none sm:text-[8rem]"
              >
                SAFETY
              </span>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-vblue/10">
                <Image
                  src="/services/hub-cta.jpg"
                  alt="Engineering team on a plant inspection"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <ul>
            {whyVardann.map((item, i) => {
              const isHovered = hovered === i;
              return (
                <li
                  key={item}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative border-b border-vblue/10 py-6 first:pt-0"
                >
                  <motion.div
                    className="flex items-baseline gap-5"
                    animate={reduceMotion ? {} : { x: isHovered ? 8 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span
                      className={`text-eyebrow text-[0.72rem] transition-colors duration-300 ${
                        isHovered ? "text-gold" : "text-steel"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 font-heading text-lg font-semibold transition-colors duration-300 sm:text-xl ${
                        isHovered ? "text-vblue" : "text-navy"
                      }`}
                    >
                      {item}
                    </span>
                    <motion.span
                      className="h-2 w-2 shrink-0 rounded-full bg-gold"
                      initial={false}
                      animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
                      transition={{ duration: 0.25 }}
                    />
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
