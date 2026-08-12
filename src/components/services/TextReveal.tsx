"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type TextRevealProps = {
  text: string;
  className?: string;
  /** "mount" plays immediately (hero content); "inView" waits for scroll. */
  trigger?: "mount" | "inView";
  delay?: number;
  /** Stagger step between words, in seconds. */
  stagger?: number;
};

// Editorial composition effect for headlines — words settle into place with
// opacity + a small upward drift + a touch of blur, staggered just enough to
// read as "being written" rather than a typewriter or a bouncy reveal.
// Renders an inline <span> — wrap it in the real heading tag (h1/h2/...) at
// the call site so semantics/SEO stay correct.
// Respects prefers-reduced-motion by falling back to a plain fade.
export default function TextReveal({
  text,
  className = "",
  trigger = "inView",
  delay = 0,
  stagger = 0.045,
}: TextRevealProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0 }}
        {...(trigger === "mount"
          ? { animate: { opacity: 1 } }
          : { whileInView: { opacity: 1 }, viewport: { once: true } })}
        transition={{ duration: 0.4, delay }}
      >
        {text}
      </motion.span>
    );
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      {...(trigger === "mount"
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, amount: 0.6 } })}
    >
      {words.map((w, i) => (
        // The space is a plain sibling text node in the outer span's normal
        // inline flow — NOT content inside any inline-block box. A space at
        // the trailing edge of an inline-block gets collapsed away by the
        // browser, which is what was causing every reveal to render with no
        // gaps between words.
        <Fragment key={i}>
          <motion.span
            variants={word}
            style={{ display: "inline-block", willChange: "transform, opacity, filter" }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </motion.span>
  );
}
