"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(0,80,160,0.16),transparent_65%)]"
      />
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
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-[2.6rem] leading-[1] tracking-tight text-navy sm:text-6xl lg:text-7xl">
          Engineered for <span className="text-vblue italic">the Critical.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-body sm:text-lg">
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
