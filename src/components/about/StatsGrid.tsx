"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, animate } from "framer-motion";

const GlobalGlobe = dynamic(() => import("@/components/sections/GlobalGlobe"), {
  ssr: false,
  loading: () => (
    <div className="relative h-[260px] sm:h-[300px] w-[260px] sm:w-[300px] bg-transparent" />
  ),
});

export type StatItem = {
  value: string;
  label: string;
};

function CounterValue({ targetStr, triggerCount }: { targetStr: string; triggerCount: boolean }) {
  const [displayValue, setDisplayValue] = useState(targetStr);

  const numVal = parseInt(targetStr.replace(/\D/g, ""), 10);
  const isNumeric = !isNaN(numVal) && !targetStr.includes("/");
  const hasPlus = targetStr.includes("+");

  useEffect(() => {
    if (!triggerCount || !isNumeric) return;

    const controls = animate(0, numVal, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        const valStr = Math.floor(value).toString();
        setDisplayValue(hasPlus ? `${valStr}+` : valStr);
      },
    });

    return () => controls.stop();
  }, [triggerCount, numVal, isNumeric, hasPlus]);

  return (
    <div className="font-display text-4xl sm:text-5xl font-[950] tracking-[-0.03em] leading-none text-navy mb-2">
      {isNumeric ? displayValue : targetStr}
    </div>
  );
}

export default function StatsGrid({ stats }: { stats: StatItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasTriggered(true);
    }
  }, [isInView]);

  // Safety fallback: Ensure text is never hidden if user scrolls past instantly
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasTriggered(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-12 border-t border-vblue/15 pt-10 select-none"
    >
      {/* Side-by-Side Aligned Grid: Globe Far Left, Stats Grid Right */}
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
        
        {/* Far-Left Column: Small 3D Light Globe (No Cropping, No White Background) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, x: -40 }}
          animate={hasTriggered ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.88, x: -40 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[260px] sm:h-[300px] w-[260px] sm:w-[300px] lg:h-[320px] lg:w-[320px] shrink-0 justify-self-start lg:-ml-4 bg-transparent"
        >
          <GlobalGlobe />
        </motion.div>

        {/* Right Column: 4 Stats with Bulletproof Scroll Entrance Animations */}
        <div className="grid grid-cols-2 gap-y-10 gap-x-8 sm:gap-x-12">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 35, scale: 0.94 }}
              animate={hasTriggered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 35, scale: 0.94 }}
              transition={{
                duration: 0.65,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-left"
            >
              <CounterValue targetStr={s.value} triggerCount={hasTriggered} />
              <div className="text-[0.72rem] font-[800] tracking-[0.1em] text-vblue uppercase">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
