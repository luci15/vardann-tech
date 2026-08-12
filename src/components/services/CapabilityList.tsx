"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { whyVardann } from "@/lib/content";

// A single editorial list rather than seven matching cards. Hover shifts
// the number, expands an underline, and colors the row — no invented
// supporting copy, since the brochure gives one line per point and nothing
// more.
export default function CapabilityList() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <ul className="mx-auto max-w-3xl">
      {whyVardann.map((item, i) => {
        const isHovered = hovered === i;
        return (
          <li
            key={item}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative border-b border-vblue/10 py-6"
          >
            <motion.div
              className="flex items-baseline gap-5"
              animate={{ x: isHovered ? 8 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span
                className="text-eyebrow text-[0.7rem] text-steel"
                animate={{ color: isHovered ? "var(--color-gold)" : undefined }}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>
              <span
                className={`font-heading text-lg transition-colors duration-300 sm:text-xl ${
                  isHovered ? "text-vblue" : "text-navy"
                }`}
              >
                {item}
              </span>
            </motion.div>
            <motion.span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[1.5px] bg-gold"
              initial={{ width: 0 }}
              animate={{ width: isHovered ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </li>
        );
      })}
    </ul>
  );
}
