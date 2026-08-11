"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { capabilities } from "@/lib/content";
import ServicePattern from "@/components/ui/ServicePattern";
import TechIcon from "@/components/ui/TechIcon";

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

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${N * SEGMENT_VH}vh` }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_55%_50%_at_80%_20%,rgba(0,80,160,0.10),transparent_65%)]"
      />
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] w-full items-center px-4 sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="text-eyebrow text-[0.72rem] text-vblue">Services / 01</p>
            <h2 className="mt-2 font-display text-3xl leading-[1.08] tracking-tight text-navy sm:text-5xl">
              What Vardann <span className="text-vblue italic">Does.</span>
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-body sm:mt-4 sm:text-base">
              From advanced NDT and inspection to precision manufacturing and
              metallography — six disciplines, one standard of precision.
            </p>

            {/* Service Navigation Buttons */}
            <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-6 lg:flex-col lg:overflow-visible lg:pb-0">
              {capabilities.map((c, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-left transition-colors duration-300 sm:px-4 sm:py-2.5 ${
                      isActive
                        ? "bg-white shadow-md ring-1 ring-vblue/20"
                        : "bg-white/40 hover:bg-white/70 lg:bg-transparent"
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
                      className={`text-xs whitespace-nowrap sm:text-sm transition-colors ${
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

          {/* Flicker-Free Rollback Card Animation Container */}
          <div className="relative h-[320px] w-full max-w-[500px] justify-self-center sm:h-[390px] lg:justify-self-end">
            {capabilities.map((item, i) => {
              const isMain = i === active;
              const diff = i - active;
              const tags = item.subtitle.split(" / ");

              let targetY = 0;
              let targetScale = 1;
              let targetOpacity = 0;

              if (diff === 0) {
                targetY = 0;
                targetScale = 1;
                targetOpacity = 1;
              } else if (diff < 0) {
                // Rolled back card
                targetY = -50;
                targetScale = 0.94;
                targetOpacity = 0;
              } else {
                // Upcoming card
                targetY = 50;
                targetScale = 0.94;
                targetOpacity = 0;
              }

              return (
                <motion.div
                  key={item.id}
                  animate={{
                    y: targetY,
                    scale: targetScale,
                    opacity: targetOpacity,
                    zIndex: isMain ? 20 : 10,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ pointerEvents: isMain ? "auto" : "none" }}
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-vblue/50 bg-navy p-6 shadow-xl sm:p-10"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:32px_32px]"
                  />
                  <ServicePattern
                    id={item.id}
                    className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 text-vblue-bright/30 sm:h-32 sm:w-32"
                  />
                  <TechIcon
                    icon={item.icon}
                    className="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 text-white/[0.05] sm:h-72 sm:w-72"
                  />

                  <div className="relative flex h-full flex-col justify-center">
                    <span className="text-eyebrow text-[0.65rem] text-gold">
                      Step {item.number} / 06
                    </span>
                    <h3 className="mt-2 font-display text-2xl text-white sm:mt-3 sm:text-4xl lg:text-5xl">
                      {item.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="text-eyebrow rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[0.55rem] text-gold"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 sm:mt-4 sm:text-lg">
                      {item.description}
                    </p>
                    <div className="mt-4 h-[2px] w-10 bg-gold sm:mt-6" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}



