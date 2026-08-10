"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#283848,#0050a0)] py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(248,192,40,0.12),transparent_70%)]"
      />
      <motion.div
        className="relative mx-auto max-w-3xl px-6 text-center lg:px-10"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.h2 variants={fadeUp} className="font-display text-4xl tracking-tight text-white sm:text-6xl">
          Let&rsquo;s Engineer <span className="text-gold italic">What&rsquo;s Next.</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
          Talk to our team about your inspection, testing or manufacturing
          requirements.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-eyebrow text-[0.72rem] text-vblue transition-colors hover:bg-gold hover:text-navy"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
