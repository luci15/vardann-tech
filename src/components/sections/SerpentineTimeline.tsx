"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export type TimelineStep = {
  number: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
};

export const timelineSteps: TimelineStep[] = [
  {
    number: "01",
    year: "2019",
    title: "Foundation & Core NDT Excellence",
    subtitle: "ESTABLISHED IN VADODARA, GUJARAT",
    description:
      "Founded as Advanced NDT Services LLP with a singular commitment: delivering ethical engineering practices and uncompromising quality across industrial inspections.",
  },
  {
    number: "02",
    year: "2021",
    title: "Advanced Ultrasonic & Eddy Current Expansion",
    subtitle: "TECHNOLOGY SCALING",
    description:
      "Expanded specialized capabilities to include Phased Array (PAUT), Time of Flight Diffraction (TOFD), and Remote Field / Eddy Current Tube Inspection.",
  },
  {
    number: "03",
    year: "2023",
    title: "Rebranding & Precision Manufacturing Facility",
    subtitle: "LLP STRUCTURAL GROWTH",
    description:
      "Rebranded as Vardann Tech and Engg LLP. Established our dedicated precision CNC & EDM manufacturing unit for ASME/NABL compliant calibration standards.",
  },
  {
    number: "04",
    year: "2025",
    title: "Global Supply & Multi-Region Footprint",
    subtitle: "GLOBAL REACH",
    description:
      "Extending engineering supply chains and third-party QA/QC surveillance across India, the Middle East, Africa, and the Asia-Pacific region.",
  },
];

export default function SerpentineTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for frame-by-frame path animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 60%", "end 85%"],
  });

  // Smooth spring physics for path drawing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden py-12 sm:py-16 select-none"
    >
      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center mb-10">
          <p className="text-eyebrow text-[0.72rem] text-vblue">Company Roadmap</p>
          <h2 className="mt-2 font-display text-3xl leading-[1.08] tracking-tight text-navy sm:text-5xl">
            Project Steps & <span className="text-vblue italic">Milestones.</span>
          </h2>
        </div>

        {/* Desktop View: Exact Concentric Serpentine SVG Path & 230px Red Circles.
            The wrapper's aspect ratio is locked to the SVG viewBox (1000x1500)
            so the path and the absolutely-positioned circles always share the
            same coordinate space — without this, the SVG scales to whatever
            the section's actual content width is (~944px, from max-w-5xl minus
            padding) while raw-pixel circle positions stay unscaled, drifting
            the circles off the curve. */}
        <div className="relative hidden lg:block aspect-[1000/1500] w-full">
          {/* Continuous Serpentine Line SVG */}
          <svg
            className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-visible"
            viewBox="0 0 1000 1500"
            fill="none"
          >
            {/* Background Light Guide Track */}
            <path
              d="M 235,0 L 235,320 A 145 145 0 0 0 380 465 L 620,465 A 145 145 0 0 1 620 755 L 380,755 A 145 145 0 0 0 380 1045 L 620,1045 A 145 145 0 0 1 620 1335 L 620,1500"
              stroke="rgba(248, 192, 40, 0.25)"
              strokeWidth="4.5"
              fill="none"
            />

            {/* Frame-by-Frame Travelling Animated Line */}
            <motion.path
              d="M 235,0 L 235,320 A 145 145 0 0 0 380 465 L 620,465 A 145 145 0 0 1 620 755 L 380,755 A 145 145 0 0 0 380 1045 L 620,1045 A 145 145 0 0 1 620 1335 L 620,1500"
              stroke="#f8c028"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
              style={{ pathLength: smoothProgress }}
            />
          </svg>

          {/* Step 01: Circle Left (Center X=380, Y=320), Text Right */}
          <DesktopStepRow
            step={timelineSteps[0]}
            circleX={380}
            circleY={320}
            isCircleLeft={true}
            smoothProgress={smoothProgress}
            threshold={0.18}
          />

          {/* Step 02: Circle Right (Center X=620, Y=610), Text Left */}
          <DesktopStepRow
            step={timelineSteps[1]}
            circleX={620}
            circleY={610}
            isCircleLeft={false}
            smoothProgress={smoothProgress}
            threshold={0.42}
          />

          {/* Step 03: Circle Left (Center X=380, Y=900), Text Right */}
          <DesktopStepRow
            step={timelineSteps[2]}
            circleX={380}
            circleY={900}
            isCircleLeft={true}
            smoothProgress={smoothProgress}
            threshold={0.65}
          />

          {/* Step 04: Circle Right (Center X=620, Y=1190), Text Left */}
          <DesktopStepRow
            step={timelineSteps[3]}
            circleX={620}
            circleY={1190}
            isCircleLeft={false}
            smoothProgress={smoothProgress}
            threshold={0.88}
          />
        </div>

        {/* Mobile View Layout (Large Solid Red Circles & Clean Text, No Boxes) */}
        <div className="relative space-y-16 lg:hidden">
          {timelineSteps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              {/* Solid Red Circle */}
              <div className="flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full bg-vblue shadow-[0_18px_40px_rgba(0,80,160,0.35)] text-white">
                <span className="font-mono text-2xl sm:text-3xl font-black">{step.year}</span>
              </div>
              
              {/* Pure Typography */}
              <div className="mt-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-2xl font-black text-navy">{step.number}</span>
                  <h3 className="font-display text-xl font-bold text-navy">{step.title}</h3>
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-vblue">
                  {step.year} — {step.subtitle}
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-body">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DesktopStepRow({
  step,
  circleX,
  circleY,
  isCircleLeft,
  smoothProgress,
  threshold,
}: {
  step: TimelineStep;
  circleX: number;
  circleY: number;
  isCircleLeft: boolean;
  smoothProgress: any;
  threshold: number;
}) {
  // Frame-by-frame scale and opacity transforms
  const circleScale = useTransform(
    smoothProgress,
    [threshold - 0.12, threshold, threshold + 0.1],
    [0.3, 1.08, 1]
  );

  const opacity = useTransform(
    smoothProgress,
    [threshold - 0.1, threshold],
    [0, 1]
  );

  const textX = useTransform(
    smoothProgress,
    [threshold - 0.08, threshold + 0.04],
    [isCircleLeft ? 35 : -35, 0]
  );

  // All positions are expressed as % of the 1000x1500 viewBox coordinate
  // space (see the wrapper's locked aspect-ratio above), not raw pixels —
  // that's what keeps these in sync with the SVG path at any render width.
  const circleSize = 230;
  const r = circleSize / 2;
  const pctX = (v: number) => `${(v / 1000) * 100}%`;
  const pctY = (v: number) => `${(v / 1500) * 100}%`;

  return (
    <div
      className="absolute w-full"
      style={{ top: pctY(circleY - r), height: pctY(1500) }}
    >
      {/* 1. Large 230px Solid Red Circle (Matching Reference Image) */}
      <motion.div
        className="absolute rounded-full bg-vblue shadow-[0_18px_40px_rgba(0,87,164,0.35)] flex items-center justify-center text-white"
        style={{
          left: pctX(circleX - r),
          width: pctX(circleSize),
          height: pctY(circleSize),
          scale: circleScale,
          opacity: opacity,
        }}
      >
        <span className="font-mono text-4xl font-black text-white/95 tracking-tight">
          {step.year}
        </span>
      </motion.div>

      {/* 2. Pure Typography Text (NO BOXES / NO CARDS - Matching Reference Image) */}
      <motion.div
        className="absolute max-w-[420px]"
        style={{
          top: pctY(50),
          left: isCircleLeft ? pctX(540) : "auto",
          right: isCircleLeft ? "auto" : pctX(540),
          textAlign: isCircleLeft ? "left" : "right",
          opacity: opacity,
          x: textX,
        }}
      >
        {/* Step Number + Title */}
        <div className={`flex items-baseline gap-3 ${isCircleLeft ? "" : "justify-end"}`}>
          <span className="font-mono text-2xl font-black text-navy">
            {step.number}
          </span>
          <h3 className="font-display text-2xl font-bold text-navy tracking-tight">
            {step.title}
          </h3>
        </div>

        {/* Subtitle */}
        <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-widest text-vblue">
          {step.subtitle}
        </p>

        {/* Description Text */}
        <p className="mt-3 text-sm leading-relaxed text-body">
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}
