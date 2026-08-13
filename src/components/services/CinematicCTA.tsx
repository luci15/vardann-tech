"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import TechIcon from "@/components/ui/TechIcon";
import type { IconKey } from "@/lib/content";

type CinematicCtaProps = {
  eyebrow: string;
  headline: string;
  supporting: string;
  visualLabel: string;
  icon: IconKey;
  image?: string;
};

// The closing frame for every service page — a full-bleed technical visual
// with a dark readability gradient and a single editorial statement. Falls
// back to the blueprint/watermark placeholder language when no photo is
// supplied yet.
export default function CinematicCta({
  eyebrow,
  headline,
  supporting,
  visualLabel,
  icon,
  image,
}: CinematicCtaProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy sm:min-h-[78vh]">
      {image ? (
        <Image
          src={image}
          alt={visualLabel}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <TechIcon
          icon={icon}
          className="pointer-events-none absolute -right-16 bottom-[-10%] h-[70%] w-[70%] text-white/[0.05] sm:h-[85%] sm:w-[85%]"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 [background:linear-gradient(180deg,rgba(44,62,80,0.35),rgba(44,62,80,0.85)_65%,rgba(44,62,80,0.97))]"
      />
      {!image && (
        <span className="text-eyebrow absolute top-6 left-6 rounded-full bg-white/10 px-2.5 py-1 text-[0.55rem] tracking-[0.16em] text-white/60 sm:top-8 sm:left-8">
          VISUAL — {visualLabel}
        </span>
      )}

      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center lg:px-10"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-eyebrow text-[0.65rem] text-gold">{eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl leading-[1.1] text-white sm:text-5xl">
          {headline}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/70">
          {supporting}
        </p>
        <Link
          href="/contact"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-eyebrow text-[0.7rem] text-navy transition-all duration-300 hover:bg-gold"
        >
          Enquire Now
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>
    </section>
  );
}
