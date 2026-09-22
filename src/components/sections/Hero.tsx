"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { company, bestsellerProducts } from "@/lib/content";
import HeroFan from "./HeroFan";

const fanProducts = [0, 1, 2, 3, 4, 5].map((i) => bestsellerProducts[i]);

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4.6rem)] flex-col items-center justify-center gap-2 overflow-hidden px-6 py-10 lg:px-10">
      {/* Texture is scoped to Hero only — a visible technical grid plus a
          top glow behind the headline. The rest of the light sections stay
          plain gradient (see .bg-continuous-light). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90 [background-image:linear-gradient(rgba(0,80,160,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(0,80,160,0.14)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black,transparent)]"
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
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-[2.5rem] leading-[1] tracking-tight text-navy sm:text-[3.6rem] lg:text-[4.3rem]">
          Engineered for <span className="text-vblue italic">the Critical.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-body sm:text-lg">
          {company.about} Trusted across India, the Middle East, Africa and
          Asia-Pacific since {company.established}.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full bg-vblue px-6 py-2.5 text-eyebrow text-[0.72rem] text-white transition-all duration-300 hover:scale-[1.03] hover:bg-vblue-hover"
          >
            Explore Products
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-brochure-modal"))}
            className="text-eyebrow inline-flex items-center gap-2 rounded-full border border-vblue/30 bg-white px-6 py-2.5 text-[0.72rem] text-vblue transition-all duration-300 hover:scale-[1.03] hover:bg-lightblue"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Catalogue</span>
          </button>
          <Link
            href="/contact"
            className="text-eyebrow rounded-full border border-slate-200 bg-white/80 px-6 py-2.5 text-[0.72rem] text-body transition-all duration-300 hover:scale-[1.03] hover:bg-slate-100 hover:text-navy"
          >
            Talk to an Engineer
          </Link>
        </div>
      </motion.div>

      <HeroFan products={fanProducts} className="relative z-10 max-w-5xl" />
    </section>
  );
}
