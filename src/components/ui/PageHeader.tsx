"use client";

import { motion } from "framer-motion";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-soft-light pt-16 pb-14 sm:pt-20 sm:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(0,80,160,0.12),transparent_65%)]"
      />
      <motion.div
        className="relative mx-auto max-w-4xl px-6 text-center lg:px-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={fadeUp} className="text-eyebrow text-[0.72rem] text-vblue">
          {eyebrow}
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="mx-auto mt-4 max-w-2xl font-display text-5xl tracking-tight text-navy sm:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg">
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
