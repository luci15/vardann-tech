"use client";

import { motion, type Variants } from "framer-motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <motion.div
      className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.p variants={fadeUp} className="text-eyebrow text-[0.72rem] text-vblue">
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="mt-3 font-display text-4xl leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-[3.25rem]"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeUp} className="mt-4 text-base leading-relaxed text-body sm:text-lg">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
