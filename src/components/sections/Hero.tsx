"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { company, bestsellerProducts } from "@/lib/content";
import HeroFan from "./HeroFan";

const fanProducts = [0, 1, 2, 3, 4, 5].map((i) => bestsellerProducts[i]);

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4.2rem)] flex-col items-center justify-center gap-2 overflow-hidden bg-soft-light px-6 py-10 lg:px-10">
      {/* Layered, low-opacity depth — a wide top glow, two soft brand-color
          blobs off to each side, and a faint technical grid — built only
          from existing brand tokens (vblue / gold / navy), just composed
          into more dimension than a single flat gradient. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(0,80,160,0.14),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-[26rem] w-[26rem] rounded-full bg-vblue/10 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-[22rem] w-[22rem] rounded-full bg-gold/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(40,56,72,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(40,56,72,0.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_35%,black,transparent)]"
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-eyebrow text-[0.7rem] text-vblue">
          NDT &middot; Inspection &middot; Metallography &middot; Manufacturing
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-heading text-[2.1rem] font-extrabold leading-[0.98] tracking-tight text-navy sm:text-5xl lg:text-6xl">
          Engineered for <span className="text-vblue">the Critical.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-body sm:text-base">
          {company.about} Trusted across India, the Middle East, Africa and
          Asia-Pacific since {company.established}.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full bg-vblue px-7 py-3 text-eyebrow text-[0.72rem] text-white transition-all duration-300 hover:scale-[1.03] hover:bg-vblue-hover"
          >
            Explore Products
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="text-eyebrow rounded-full border border-vblue bg-white px-7 py-3 text-[0.72rem] text-vblue transition-all duration-300 hover:scale-[1.03] hover:bg-lightblue"
          >
            Talk to an Engineer
          </Link>
        </div>
      </motion.div>

      <HeroFan products={fanProducts} className="relative z-10 max-w-5xl" />
    </section>
  );
}
