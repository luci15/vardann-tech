"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { capabilities, type Capability } from "@/lib/content";
import ServicePattern from "@/components/ui/ServicePattern";
import TechIcon from "@/components/ui/TechIcon";

const N = capabilities.length;
const SEGMENT_VH = 70;

// Deck geometry, keyed on a card's continuous distance from the front of the
// stack ("depth"). Because depth is a float driven straight off scroll
// progress, every card eases through these values instead of snapping
// between them — that's what makes one card feel like it's sliding back as
// the next comes forward.
const DEPTH_STOPS = [-1, 0, 1, 2, 3];
const Y_AT_DEPTH = [170, 0, -34, -62, -84];
const SCALE_AT_DEPTH = [1.05, 1, 0.94, 0.89, 0.85];
const BRIGHTNESS_AT_DEPTH = [1, 1, 0.82, 0.66, 0.55];

function DeckCard({
  card,
  index,
  position,
}: {
  card: Capability;
  index: number;
  /** Continuous front-of-stack pointer, 0..N-1. */
  position: MotionValue<number>;
}) {
  const depth = useTransform(position, (p) => index - p);

  const y = useTransform(depth, DEPTH_STOPS, Y_AT_DEPTH);
  const scale = useTransform(depth, DEPTH_STOPS, SCALE_AT_DEPTH);
  // Fade out once a card has dropped past the front, and again as it falls
  // off the back of the visible stack.
  const opacity = useTransform(depth, [-1, -0.55, -0.1, 2.2, 3], [0, 0, 1, 1, 0]);
  const brightness = useTransform(depth, DEPTH_STOPS, BRIGHTNESS_AT_DEPTH);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);
  // Nearest-to-front paints on top; passed cards drop below the deck.
  const zIndex = useTransform(depth, (d) =>
    d < -0.05 ? 0 : Math.round(N - Math.abs(d)),
  );

  const tags = card.subtitle.split(" / ");

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-navy p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_30px_60px_-20px_rgba(0,80,160,0.35)] sm:p-12"
      style={{
        y,
        scale,
        opacity,
        filter,
        zIndex,
        transformOrigin: "top center",
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
        <div className="mt-6 h-[2px] w-10 bg-gold" />
      </div>
    </motion.div>
  );
}

export default function ServiceDeck() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Scroll progress across the section's tall scroll band, 0 at the moment it
  // pins and 1 when it releases.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // A light spring keeps the deck gliding instead of tracking the wheel
  // step-for-step, which is what read as "laggy" before.
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });
  const position = useTransform(smoothed, [0, 1], [0, N - 1]);

  // Mirror the front card into React state, but only when the rounded index
  // changes, so the side list re-renders once per card rather than per frame.
  useEffect(() => {
    const unsubscribe = position.on("change", (p) => {
      const idx = Math.min(N - 1, Math.max(0, Math.round(p)));
      setActive((prev) => (prev === idx ? prev : idx));
    });
    return unsubscribe;
  }, [position]);

  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;
    const targetY = window.scrollY + rect.top + (i / (N - 1)) * total;
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
      <div className="sticky top-20 flex h-[calc(100vh-5rem)] w-full items-center overflow-hidden px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="text-eyebrow text-[0.72rem] text-vblue">Services / 01</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.08] tracking-tight text-navy sm:text-5xl">
              What Vardann <span className="text-vblue italic">Does.</span>
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-body">
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

          <div className="relative h-[380px] pt-16 sm:h-[400px]">
            {capabilities.map((c, i) => (
              <DeckCard key={c.id} card={c} index={i} position={position} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
