"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { capabilities } from "@/lib/content";
import TechIcon from "@/components/ui/TechIcon";

const VISIBLE_STACK = 3;

// depth 0 = featured (large, fully detailed). depth 1..VISIBLE_STACK sit
// behind it as narrow strips; anything deeper is parked just off the right
// edge, invisible, waiting to be promoted.
function layoutFor(depth: number) {
  if (depth === 0) {
    return { left: "0%", width: "64%", scale: 1, opacity: 1, zIndex: 50 };
  }
  if (depth <= VISIBLE_STACK) {
    const left = 58 + depth * 13;
    return {
      left: `${left}%`,
      width: "15%",
      scale: 0.95,
      opacity: 1,
      zIndex: 50 - depth,
    };
  }
  return { left: "100%", width: "15%", scale: 0.9, opacity: 0, zIndex: 1 };
}

export default function CapabilitiesShowcase() {
  const [order, setOrder] = useState(capabilities.map((_, i) => i));

  const next = () => setOrder((prev) => [...prev.slice(1), prev[0]]);
  const prev = () =>
    setOrder((p) => [p[p.length - 1], ...p.slice(0, p.length - 1)]);
  const promote = (depth: number) =>
    setOrder((p) => [p[depth], ...p.filter((_, i) => i !== depth)]);

  return (
    <div className="relative h-[400px] w-full sm:h-[380px]">
      {order.map((capIndex, depth) => {
        const item = capabilities[capIndex];
        const isFeatured = depth === 0;
        const { left, width, scale, opacity, zIndex } = layoutFor(depth);

        return (
          <motion.div
            key={item.id}
            onClick={() => !isFeatured && depth <= VISIBLE_STACK && promote(depth)}
            className={`absolute top-0 h-full overflow-hidden rounded-2xl border bg-white shadow-sm ${
              !isFeatured && depth <= VISIBLE_STACK ? "cursor-pointer" : ""
            }`}
            animate={{
              left,
              width,
              scale,
              opacity,
              zIndex,
              borderColor: isFeatured
                ? "rgba(0,80,160,0.4)"
                : "rgba(40,56,72,0.12)",
            }}
            whileHover={
              !isFeatured && depth <= VISIBLE_STACK
                ? { borderColor: "rgba(248,192,40,0.6)" }
                : undefined
            }
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [background:linear-gradient(160deg,rgba(0,80,160,0.05),transparent_55%)]"
            />

            <div className="relative flex h-full flex-col justify-between p-5 sm:p-7">
              <div className="flex items-start justify-between">
                <span className="text-eyebrow text-[0.68rem] text-vblue">
                  {item.number}
                </span>
                <TechIcon
                  icon={item.icon}
                  className={`text-vblue ${isFeatured ? "h-9 w-9" : "h-6 w-6"}`}
                />
              </div>

              <div>
                <h3
                  className={`font-heading font-bold text-navy ${
                    isFeatured ? "text-2xl sm:text-3xl" : "text-sm"
                  }`}
                >
                  {item.title}
                </h3>

                {isFeatured && (
                  <>
                    <p className="text-eyebrow mt-2 text-[0.62rem] text-steel">
                      {item.subtitle}
                    </p>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-body">
                      {item.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-eyebrow text-[0.68rem] text-vblue">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      <div className="absolute bottom-5 right-5 z-[60] flex gap-2 sm:bottom-7 sm:right-7">
        <button
          type="button"
          aria-label="Previous capability"
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-vblue/20 bg-white/90 text-navy backdrop-blur-sm transition-colors hover:border-vblue hover:text-vblue"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          aria-label="Next capability"
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-vblue/20 bg-white/90 text-navy backdrop-blur-sm transition-colors hover:border-vblue hover:text-vblue"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
