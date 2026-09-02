"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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

/* -------------------------------------------------------------------------- */
/*                        1. Desktop Sticky 3D Deck Card                     */
/* -------------------------------------------------------------------------- */
function DesktopDeckCard({
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
      className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-navy p-8 lg:p-12 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_30px_60px_-20px_rgba(0,80,160,0.35)]"
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
        className="pointer-events-none absolute -top-4 -right-4 h-32 w-32 text-vblue-bright/30"
      />
      <TechIcon
        icon={card.icon}
        className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 text-white/[0.05]"
      />

      <div className="relative flex h-full flex-col justify-center">
        <span className="text-eyebrow text-[0.65rem] text-gold">
          Step {card.number} / 06
        </span>
        <h3 className="mt-3 font-display text-4xl lg:text-5xl text-white tracking-tight leading-tight">
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
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/70 lg:text-lg">
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

/* -------------------------------------------------------------------------- */
/*                     2. Mobile Horizontal Swipe Carousel                   */
/* -------------------------------------------------------------------------- */
function MobileServicesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.min(Math.max(index, 0), N - 1);
    const card = track.children[clamped] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActive(clamped);

    // Also auto-scroll category pill into view
    const pills = pillsRef.current;
    if (pills) {
      const pill = pills.children[clamped] as HTMLElement | undefined;
      pill?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, []);

  const handleTrackScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = (track.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
    const gap = 16;
    const index = Math.round(track.scrollLeft / (cardWidth + gap));
    const clamped = Math.min(Math.max(index, 0), N - 1);
    setActive(clamped);

    const pills = pillsRef.current;
    if (pills) {
      const pill = pills.children[clamped] as HTMLElement | undefined;
      pill?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, []);

  return (
    <div className="relative py-12 px-4 select-none">
      {/* Section Header */}
      <div className="mx-auto max-w-xl text-center mb-6">
        <p className="text-eyebrow text-[0.7rem] text-vblue">Services / 01</p>
        <h2 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-navy">
          What Vardann <span className="text-vblue italic">Does.</span>
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-body max-w-sm mx-auto">
          Six specialized engineering disciplines — swipe through to explore our capabilities.
        </p>
      </div>

      {/* 1. Synced Horizontal Category Pill Tabs */}
      <div
        ref={pillsRef}
        className="flex gap-2 overflow-x-auto pb-3 mb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-1"
      >
        {capabilities.map((c, i) => {
          const isActive = i === active;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-white shadow-md ring-1 ring-vblue/30 scale-[1.02] border border-vblue/20"
                  : "bg-white/50 text-steel hover:bg-white/80 hover:text-navy border border-slate-200/70"
              }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
                  isActive ? "bg-gold shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "bg-steel/40"
                }`}
              />
              <span
                className={`text-eyebrow text-[0.65rem] transition-colors ${
                  isActive ? "text-vblue font-bold" : "text-steel"
                }`}
              >
                {c.number}
              </span>
              <span
                className={`text-xs whitespace-nowrap transition-colors ${
                  isActive ? "font-bold text-navy" : "text-steel"
                }`}
              >
                {c.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Fluid Horizontal Snap Card Track (No vertical scroll hijack) */}
      <div
        ref={trackRef}
        onScroll={handleTrackScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth px-2 py-2 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {capabilities.map((c, i) => {
          const tags = c.subtitle.split(" / ");
          const targetHref = SERVICE_HREFS[c.id] || "/services";

          return (
            <div
              key={c.id}
              className="relative shrink-0 basis-[86vw] max-w-[350px] [scroll-snap-align:center]"
            >
              <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-navy via-navy to-[#1a2938] p-6 shadow-[0_16px_40px_-12px_rgba(0,40,90,0.4)] min-h-[380px]">
                {/* Background Tech Grids & Icon Watermarks */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:28px_28px]"
                />
                <ServicePattern
                  id={c.id}
                  className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 text-sky-400/20"
                />
                <TechIcon
                  icon={c.icon}
                  className="pointer-events-none absolute -right-6 -bottom-6 h-48 w-48 text-white/[0.04]"
                />

                {/* Content Top */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-eyebrow rounded-full bg-gold/15 border border-gold/40 px-2.5 py-0.5 text-[0.62rem] font-bold text-gold">
                      Step {c.number} / 06
                    </span>
                    <span className="text-xs font-mono font-bold text-white/40">
                      {i + 1} of {N}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-bold text-white tracking-tight leading-snug">
                    {c.title}
                  </h3>

                  {/* Discipline Tags */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="text-eyebrow rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[0.55rem] text-sky-200"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-300">
                    {c.description}
                  </p>
                </div>

                {/* Content Bottom CTA */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={targetHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy shadow-md transition-all hover:bg-amber-300 active:scale-95"
                  >
                    <span>Explore Service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <span className="text-[0.68rem] text-slate-400 font-medium italic">
                    Certified Standards
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Bottom Pagination Dots & Arrow Helpers */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous service"
          onClick={() => scrollToIndex(active - 1)}
          disabled={active === 0}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-navy shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {capabilities.map((c, i) => (
            <button
              key={c.id}
              aria-label={`Go to ${c.title}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-gold" : "w-1.5 bg-steel/30"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next service"
          onClick={() => scrollToIndex(active + 1)}
          disabled={active === N - 1}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-navy shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Main Export Component                             */
/* -------------------------------------------------------------------------- */
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
    <>
      {/* 1. Mobile Experience: Touch Swipe Snap Carousel (Zero scroll-trap) */}
      <div className="block lg:hidden">
        <MobileServicesCarousel />
      </div>

      {/* 2. Desktop Experience: Cinematic 3D Sticky Scroll Deck */}
      <section
        ref={sectionRef}
        className="relative hidden lg:block"
        style={{ height: `${N * SEGMENT_VH}vh` }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_55%_50%_at_80%_20%,rgba(0,80,160,0.10),transparent_65%)]"
        />
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] w-full items-center px-6 lg:px-10">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-eyebrow text-[0.72rem] text-vblue">Services / 01</p>
              <h2 className="mt-2 font-display text-4xl lg:text-5xl leading-[1.08] tracking-tight text-navy">
                What Vardann <span className="text-vblue italic">Does.</span>
              </h2>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-body">
                From advanced NDT and inspection to precision manufacturing and
                metallography — six disciplines, one standard of precision.
              </p>

              {/* Service Navigation Buttons */}
              <div className="mt-6 flex flex-col gap-2">
                {capabilities.map((c, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => goTo(i)}
                      className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-white shadow-md ring-1 ring-vblue/30 scale-[1.02]"
                          : "hover:bg-white/70 hover:translate-x-1"
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

            <div className="relative h-[420px] pt-16">
              {capabilities.map((c, i) => (
                <DesktopDeckCard key={c.id} card={c} index={i} position={activePosition} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
