"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { capabilities } from "@/lib/content";
import ServicePattern from "@/components/ui/ServicePattern";

const N = capabilities.length;
const SEGMENT_VH = 70;

export default function ServiceDeck() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const updateFromScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = scrolled / total;
    const idx = Math.min(N - 1, Math.floor(progress * N));
    setActive((prev) => (prev === idx ? prev : idx));
  }, []);

  useEffect(() => {
    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, [updateFromScroll]);

  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;
    const bandSize = total / N;
    const targetY = window.scrollY + rect.top + i * bandSize + bandSize / 2;
    setActive(i);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const item = capabilities[active];
  const tags = item.subtitle.split(" / ");

  return (
    <section
      ref={sectionRef}
      className="relative bg-soft-blue"
      style={{ height: `${N * SEGMENT_VH}vh` }}
    >
      <div className="sticky top-20 flex h-[calc(100vh-5rem)] w-full items-center overflow-hidden px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="text-eyebrow text-[0.72rem] text-gold">Services / 01</p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-4xl">
              What Vardann Does.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-body">
              From advanced NDT and inspection to precision manufacturing and
              metallography — six disciplines, one standard of precision.
            </p>

            <div className="mt-8 flex flex-col gap-1.5">
              {capabilities.map((c, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors duration-300 ${
                      isActive ? "bg-white shadow-sm" : "hover:bg-white/50"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                        isActive ? "bg-gold" : "bg-steel/40"
                      }`}
                    />
                    <span
                      className={`text-eyebrow text-[0.62rem] ${isActive ? "text-vblue" : "text-steel"}`}
                    >
                      {c.number}
                    </span>
                    <span
                      className={`text-sm transition-colors ${
                        isActive ? "font-bold text-navy" : "text-steel"
                      }`}
                    >
                      {c.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative h-[380px] sm:h-[400px]">
            <AnimatePresence initial={false}>
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 overflow-hidden rounded-2xl bg-navy p-8 sm:p-12"
              >
                <ServicePattern
                  id={item.id}
                  className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-vblue-bright/30 sm:h-32 sm:w-32"
                />

                <div className="relative flex h-full flex-col justify-center">
                  <span className="text-eyebrow text-[0.65rem] text-gold">
                    Step {item.number} / 06
                  </span>
                  <h3 className="mt-3 font-heading text-2xl font-bold text-white sm:text-4xl">
                    {item.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="text-eyebrow rounded-full border border-vblue-bright/40 px-2.5 py-1 text-[0.55rem] text-vblue-bright"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                    {item.description}
                  </p>
                  <div className="mt-6 h-[2px] w-10 bg-gold" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
