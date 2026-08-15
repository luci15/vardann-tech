"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  animate,
  type MotionValue,
} from "framer-motion";
import { capabilities, type Capability } from "@/lib/content";
import ServicePattern from "@/components/ui/ServicePattern";
import TechIcon from "@/components/ui/TechIcon";

const N = capabilities.length;
const SEGMENT_VH = 70;

const SERVICE_HREFS: Record<string, string> = {
  "advanced-ndt": "/services/advanced-ndt",
  "conventional-ndt": "/services/conventional-ndt",
  "inspection-services": "/services/destructive-testing-training",
  "metallography": "/services/destructive-testing-training",
  "precision-manufacturing": "/services/manufacturing",
  "training-certification": "/services/destructive-testing-training",
};

function DeckCard({
  card,
  index,
  position,
}: {
  card: Capability;
  index: number;
  position: MotionValue<number>;
}) {
  const depth = useTransform(position, (p) => index - p);

  // Single Card Smooth Rollback Transforms
  const y = useTransform(depth, [-1, -0.5, 0, 0.5, 1], [-180, -90, 0, 120, 200]);
  const scale = useTransform(depth, [-1, 0, 1], [0.94, 1, 0.96]);
  const rotateX = useTransform(depth, [-1, 0, 1], [12, 0, -8]);
  const opacity = useTransform(depth, [-0.85, -0.4, 0, 0.4, 0.85], [0, 1, 1, 1, 0]);
  const zIndex = useTransform(depth, (d) => (Math.abs(d) < 0.5 ? 20 : 0));

  const tags = card.subtitle.split(" / ");
  const targetHref = SERVICE_HREFS[card.id] || "/services";

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-navy p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_30px_60px_-20px_rgba(0,80,160,0.35)] sm:p-12"
      style={{
        y,
        scale,
        rotateX,
        opacity,
        zIndex,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <ServicePattern
        id={card.id}
        className="pointer-events-none absolute -top-4 -right-4 h-28 w-28 text-vblue-bright/30 sm:h-32 sm:w-32"
      />
      <TechIcon
        icon={card.icon}
        className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 text-white/[0.05] sm:h-72 sm:w-72"
      />

      <div className="relative flex h-full flex-col justify-center">
        <span className="text-eyebrow text-[0.65rem] text-gold">
          Step {card.number} / 06
        </span>
        <h3 className="mt-3 font-display text-3xl text-white sm:text-5xl">
          {card.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="text-eyebrow rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[0.55rem] text-gold"
            >
              {t.trim()}
            </span>
          ))}
        </div>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
          {card.description}
        </p>
        
        {/* Explore Service Interactive Button */}
        <div className="mt-6 flex items-center gap-4">
          <Link
            href={targetHref}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-navy shadow-md transition-all duration-300 hover:bg-amber-300 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <span>Explore Service</span>
            <span className="text-sm">&rarr;</span>
          </Link>
          <div className="h-[2px] w-10 bg-gold/50" />
        </div>
      </div>
    </motion.div>
  );
}

export default function ServiceDeck() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const isClickLocked = useRef(false);
  const lockTimer = useRef<NodeJS.Timeout | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothedScroll = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });

  const scrollPosition = useTransform(smoothedScroll, [0, 1], [0, N - 1]);
  const activePosition = useMotionValue(0);

  // Sync scroll position to activePosition when not locked by a button click
  useEffect(() => {
    const unsub = scrollPosition.on("change", (p) => {
      if (!isClickLocked.current) {
        activePosition.set(p);
        const idx = Math.min(N - 1, Math.max(0, Math.round(p)));
        setActive((prev) => (prev === idx ? prev : idx));
      }
    });
    return unsub;
  }, [scrollPosition, activePosition]);

  const goTo = (i: number) => {
    setActive(i);
    isClickLocked.current = true;

    // Smoothly animate the card position directly to the clicked index
    animate(activePosition, i, {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    });

    const el = sectionRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total > 0) {
        const targetY = window.scrollY + rect.top + (i / (N - 1)) * total;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }

    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      isClickLocked.current = false;
    }, 900);
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
                    className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-left transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-white shadow-md ring-1 ring-vblue/30 scale-[1.02]"
                        : "bg-white/40 hover:bg-white/70 lg:bg-transparent hover:translate-x-1"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
                        isActive ? "bg-gold shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "bg-steel/40"
                      }`}
                    />
                    <span
                      className={`text-eyebrow text-[0.65rem] ${isActive ? "text-vblue font-bold" : "text-steel"}`}
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

          <div className="relative h-[380px] pt-16 sm:h-[400px]">
            {capabilities.map((c, i) => (
              <DeckCard key={c.id} card={c} index={i} position={activePosition} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
