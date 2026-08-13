"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import ImageSlot from "./ImageSlot";
import TextReveal from "./TextReveal";
import Marquee from "./Marquee";
import type { IconKey } from "@/lib/content";

type ServiceHeroProps = {
  number: string;
  title: string;
  subtitle: string;
  headline: string;
  visualLabel: string;
  icon: IconKey;
  image?: string;
  /** Method/discipline codes for this service — driven into the marquee. */
  codes: string[];
  /** Short, factual compliance/standard line — shown as a floating card on
   *  the hero image. Sourced from the brochure, never invented. */
  badge: string;
};

// Cinematic-but-minimal opener for each of the four service pages:
// number pill → title (H1) → method tag line → large editorial statement
// → CTA. The visual is edge-aligned and its height is set to match the
// text column's own content, so the two are vertically centered together
// instead of a short text block floating against an oversized image. A
// full-width marquee band closes out the whole hero section beneath both.
export default function ServiceHero({
  number,
  title,
  subtitle,
  headline,
  visualLabel,
  icon,
  image,
  codes,
  badge,
}: ServiceHeroProps) {
  const reduceMotion = useReducedMotion();

  // Colour the closing phrase, matching the homepage's accent-word
  // convention (e.g. Hero's "the Critical.") — split off the last word.
  const headlineWords = headline.split(" ");
  const headlineRest = headlineWords.slice(0, -1).join(" ");
  const headlineAccent = headlineWords.at(-1) ?? "";

  return (
    <section className="relative overflow-hidden bg-continuous-light">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 pt-10 pb-10 lg:grid-cols-[0.62fr_0.88fr] lg:gap-0 lg:pt-14 lg:pb-14">
        <div className="px-6 lg:px-14">
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-eyebrow inline-flex items-center gap-2 rounded-full border border-vblue/25 bg-white px-3.5 py-1.5 text-[0.62rem] text-vblue">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {number} / 04
            </span>
          </motion.div>

          <motion.h1
            className="mt-4 text-eyebrow text-[0.95rem] text-navy sm:text-base"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="mt-2 max-w-md text-base text-steel"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>

          <p className="mt-5 font-display text-[2.4rem] leading-[1.05] tracking-tight text-navy sm:text-6xl">
            <TextReveal text={headlineRest} trigger="mount" delay={0.35} />
            {" "}
            <TextReveal
              text={headlineAccent}
              trigger="mount"
              delay={0.35 + headlineWords.length * 0.045}
              className="text-vblue italic"
            />
          </p>

          <motion.div
            className="mt-7"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-vblue px-7 py-3 text-eyebrow text-[0.72rem] text-white transition-all duration-300 hover:scale-[1.03] hover:bg-vblue-hover"
            >
              Enquire Now
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        <div className="relative">
          <ImageSlot
            label={visualLabel}
            icon={icon}
            image={image}
            priority
            className="h-[46vh] rounded-none lg:h-[34rem] lg:rounded-l-2xl"
            direction="down"
            delay={0.2}
            trigger="mount"
          />
          <motion.div
            className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] sm:bottom-8 sm:left-8"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <BadgeCheck className="h-5 w-5 shrink-0 text-vblue" />
            <span className="text-sm font-semibold text-navy">{badge}</span>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-vblue/10 bg-white py-5">
        <Marquee
          items={codes}
          className="[mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
        />
      </div>
    </section>
  );
}
