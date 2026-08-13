"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type MarqueeProps = {
  items: string[];
  className?: string;
  /** Seconds for one full cycle. Defaults to 42s — spec calls for a slow,
   *  35–50s loop, not something scaled down by item count. */
  duration?: number;
};

// Every item — including the LAST one in the group — gets the same
// trailing [half-gap, dot, half-gap], so the bullet sits centered between
// words everywhere, including at the seam between the two groups.
function ItemGroup({ items, gapPx, ariaHidden }: { items: string[]; gapPx: number; ariaHidden?: boolean }) {
  const half = gapPx / 2;
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="text-eyebrow text-[0.68rem] text-steel">{item}</span>
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-vblue/40"
            style={{ marginLeft: half, marginRight: half }}
          />
        </span>
      ))}
    </div>
  );
}

// Continuous right-to-left marquee, driven by requestAnimationFrame rather
// than a CSS @keyframes animation. Two identical item groups sit side by
// side; every frame, x is set to -(elapsed time × speed) and then wrapped
// with a modulo against the first group's measured width, so it's always
// a value in [-groupWidth, 0] — mathematically guaranteed continuous, with
// no dependency on @keyframes naming, stylesheet load order, or any CSS
// animation-restart behaviour (this replaced an @keyframes version after
// it animated correctly on one page but stayed frozen on another with the
// identical component — switching to plain per-frame JS removes whatever
// that environment-specific CSS variable was, since both routes now run
// the exact same imperative code path).
export default function Marquee({ items, className = "", duration = 42 }: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const gapPx = 32; // matches the eyebrow tag spacing used elsewhere (gap-8)

  useEffect(() => {
    if (reduceMotion) return;
    const track = trackRef.current;
    if (!track) return;

    const firstGroup = track.children[0] as HTMLElement | undefined;
    if (!firstGroup) return;
    const groupWidth = firstGroup.getBoundingClientRect().width;
    if (groupWidth <= 0) return;

    const pxPerMs = groupWidth / (duration * 1000);
    let rafId = 0;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const x = -((elapsed * pxPerMs) % groupWidth);
      track.style.transform = `translateX(${x}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
    // items.join(...) is a stable primitive — depending on the array
    // itself would re-run this effect (tearing down and restarting the
    // rAF loop, resetting startTime to null) on every single re-render of
    // whichever parent passes a freshly-computed array literal as this
    // prop, which is exactly what was happening: the loop kept restarting
    // before it ever accumulated visible movement, looking permanently
    // frozen even though it was technically "running" every time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, duration, items.join("")]);

  if (reduceMotion) {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-3 ${className}`}>
        {items.map((item) => (
          <span key={item} className="text-eyebrow text-[0.68rem] text-steel">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div ref={trackRef} className="flex w-max items-center" style={{ willChange: "transform" }}>
        <ItemGroup items={items} gapPx={gapPx} />
        <ItemGroup items={items} gapPx={gapPx} ariaHidden />
      </div>
    </div>
  );
}
