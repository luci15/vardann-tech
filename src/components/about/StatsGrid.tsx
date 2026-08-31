"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Calendar, Globe2, Layers, ShieldCheck, type LucideIcon } from "lucide-react";

export type StatItem = {
  value: string;
  label: string;
};

const STAT_ICONS: LucideIcon[] = [Calendar, Globe2, Layers, ShieldCheck];

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
    <div className="font-display text-2xl sm:text-3xl font-[950] tracking-[-0.03em] leading-none text-navy">
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
    <div ref={containerRef} className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {stats.map((s, idx) => {
        const Icon = STAT_ICONS[idx % STAT_ICONS.length];
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            animate={hasTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 rounded-2xl border border-vblue/12 bg-white px-5 py-5 shadow-sm"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lightblue">
              <Icon className="h-5 w-5 text-vblue" strokeWidth={1.75} />
            </span>
            <div>
              <CounterValue targetStr={s.value} triggerCount={hasTriggered} />
              <div className="mt-1 text-[0.66rem] font-[800] tracking-[0.1em] text-steel uppercase">
                {s.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
