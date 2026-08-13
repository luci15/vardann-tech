"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import TechIcon from "@/components/ui/TechIcon";
import type { IconKey } from "@/lib/content";

type ImageSlotProps = {
  /** Caption shown in the corner — the credit/description for a real photo,
   *  or (when no `image` is given) what this visual should eventually show. */
  label: string;
  icon: IconKey;
  /** Real photo path. When omitted, renders the labelled placeholder. */
  image?: string;
  className?: string;
  tone?: "light" | "dark";
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  priority?: boolean;
  /** "mount" plays immediately — required for anything above the fold,
   *  since "inView" (IntersectionObserver) is not guaranteed to fire
   *  right away for an element already in the viewport on first paint,
   *  which left hero images stuck invisible. "inView" (default) is for
   *  content genuinely below the fold. */
  trigger?: "mount" | "inView";
};

// Same reveal system either way — clip-path + blur-to-sharp on scroll — so
// a real photo and a placeholder are visually interchangeable. Where no
// process photography exists yet, this falls back to a clearly-labelled
// technical slot (blueprint grid + line-art icon) rather than invented
// stock imagery, so a real photo can drop in later without touching
// anything else.
export default function ImageSlot({
  label,
  icon,
  image,
  className = "",
  tone = "light",
  direction = "up",
  delay = 0,
  priority = false,
  trigger = "inView",
}: ImageSlotProps) {
  const reduceMotion = useReducedMotion();
  const isDark = tone === "dark";

  const clipFrom =
    direction === "up"
      ? "inset(100% 0% 0% 0%)"
      : direction === "down"
        ? "inset(0% 0% 100% 0%)"
        : direction === "left"
          ? "inset(0% 100% 0% 0%)"
          : "inset(0% 0% 0% 100%)";

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg ${
        isDark ? "border border-white/10 bg-navy" : "border border-vblue/12 bg-white"
      } ${className}`}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { clipPath: clipFrom, opacity: 0.4, y: direction === "down" ? -32 : 0 }
      }
      {...(trigger === "mount"
        ? {
            animate: reduceMotion
              ? { opacity: 1 }
              : { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 0 },
          }
        : {
            whileInView: reduceMotion
              ? { opacity: 1 }
              : { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.3 },
          })}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? { scale: 1, filter: "blur(0px)" } : { scale: 1.08, filter: "blur(6px)" }}
        {...(trigger === "mount"
          ? { animate: { scale: 1, filter: "blur(0px)" } }
          : { whileInView: { scale: 1, filter: "blur(0px)" }, viewport: { once: true, amount: 0.3 } })}
        transition={{ duration: 0.9, delay: delay + 0.05, ease: [0.16, 1, 0.3, 1] }}
      >
        {image ? (
          <>
            <Image
              src={image}
              alt={label}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className={`absolute inset-0 ${isDark ? "bg-navy/15" : "bg-navy/5"}`}
            />
          </>
        ) : (
          <>
            {/* Watermark glyph */}
            <TechIcon
              icon={icon}
              className={`absolute right-[8%] bottom-[6%] h-[38%] w-[38%] ${
                isDark ? "text-white/[0.08]" : "text-vblue/[0.10]"
              }`}
            />
            {/* Registration corners */}
            {(["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"] as const).map(
              (pos) => (
                <span
                  key={pos}
                  className={`absolute h-2.5 w-2.5 border-t border-l ${pos} ${
                    isDark ? "border-white/25" : "border-vblue/30"
                  }`}
                  style={{
                    transform:
                      pos.includes("right") && pos.includes("bottom")
                        ? "rotate(180deg)"
                        : pos.includes("right")
                          ? "rotate(90deg)"
                          : pos.includes("bottom")
                            ? "rotate(-90deg)"
                            : undefined,
                  }}
                />
              ),
            )}
          </>
        )}
      </motion.div>

      {!image && (
        <span
          className={`text-eyebrow absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[0.55rem] tracking-[0.16em] ${
            isDark ? "bg-white/10 text-white/70" : "bg-navy/5 text-steel"
          }`}
        >
          VISUAL — {label}
        </span>
      )}
    </motion.div>
  );
}
