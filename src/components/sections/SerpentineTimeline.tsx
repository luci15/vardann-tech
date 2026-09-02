"use client";

import { useEffect, useRef } from "react";
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

const PATH_DATA =
  "M 235,0 L 235,320 A 145 145 0 0 0 380 465 L 620,465 A 145 145 0 0 1 620 755 L 380,755 A 145 145 0 0 0 380 1045 L 620,1045 A 145 145 0 0 1 765 1190 L 765,1500";

export default function SerpentineTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const truckRef = useRef<SVGGElement>(null);

  // Scroll progress for frame-by-frame path animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 60%", "end 85%"],
  });

  // Smooth spring physics for path drawing and vehicle motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    restDelta: 0.001,
  });

  // Dynamically translate & rotate the mini truck along the SVG path tangent
  useEffect(() => {
    const path = pathRef.current;
    const truck = truckRef.current;
    if (!path || !truck) return;

    const totalLength = path.getTotalLength();

    const updateTruckPosition = (progress: number) => {
      const clamped = Math.max(0, Math.min(1, progress));
      const currentLength = clamped * totalLength;
      const pt = path.getPointAtLength(currentLength);

      // Sample a small delta ahead & behind to calculate precise tangent angle
      const delta = 2;
      const ptAhead = path.getPointAtLength(Math.min(totalLength, currentLength + delta));
      const ptBehind = path.getPointAtLength(Math.max(0, currentLength - delta));
      const angle =
        Math.atan2(ptAhead.y - ptBehind.y, ptAhead.x - ptBehind.x) * (180 / Math.PI);

      truck.setAttribute("transform", `translate(${pt.x}, ${pt.y}) rotate(${angle})`);
      truck.style.opacity = clamped > 0.005 ? "1" : "0";
    };

    updateTruckPosition(smoothProgress.get());

    const unsubscribe = smoothProgress.on("change", (latest) => {
      updateTruckPosition(latest);
    });

    return () => unsubscribe();
  }, [smoothProgress]);

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

        {/* Unified Responsive Serpentine Roadmap & Moving Truck for Mobile & Desktop */}
        <div className="relative aspect-[1000/1500] w-full">
          {/* Continuous Serpentine Road & Moving Truck SVG */}
          <svg
            className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-visible"
            viewBox="0 0 1000 1500"
            fill="none"
          >
            <defs>
              {/* Headlight beam radial/linear gradient */}
              <linearGradient id="headlight-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
                <stop offset="35%" stopColor="#fef08a" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
              </linearGradient>
              {/* Subtle road elevation shadow */}
              <filter id="road-elevation" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.2" />
              </filter>
              {/* Synchronized Scroll Reveal Mask for Road & Dashes */}
              <mask id="road-reveal-mask">
                <motion.path
                  d={PATH_DATA}
                  stroke="#ffffff"
                  strokeWidth="36"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ pathLength: smoothProgress }}
                />
              </mask>
            </defs>

            {/* Invisible Reference Path for point/tangent measurements */}
            <path
              ref={pathRef}
              d={PATH_DATA}
              fill="none"
              stroke="transparent"
            />

            {/* 1. Subtle background track outline (faint blueprint guide) */}
            <path
              d={PATH_DATA}
              stroke="rgba(0, 80, 160, 0.07)"
              strokeWidth="2"
              strokeDasharray="6 8"
              fill="none"
            />

            {/* 2. Paved Road & Broken Yellow Dashes (--- --- ---) revealed by mask */}
            <g mask="url(#road-reveal-mask)">
              {/* Road Curb / Shadow Outer Border */}
              <path
                d={PATH_DATA}
                stroke="#0f172a"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#road-elevation)"
              />

              {/* Asphalt Road Surface */}
              <path
                d={PATH_DATA}
                stroke="#334155"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Broken Yellow Dashes Centerline */}
              <path
                d={PATH_DATA}
                stroke="#f8c028"
                strokeWidth="2.5"
                strokeDasharray="14 14"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* 5. Miniature Animated Inspection Truck (Driving at leading edge of road) */}
            <g
              ref={truckRef}
              style={{ opacity: 0, transition: "opacity 0.2s ease-out" }}
              className="pointer-events-none"
            >
              {/* Soft Drop Shadow under truck */}
              <ellipse cx="0" cy="0" rx="16" ry="9" fill="rgba(0,0,0,0.45)" filter="blur(2px)" />

              {/* Headlight beam casting light forward */}
              <polygon
                points="13,-4 42,-14 42,14 13,4"
                fill="url(#headlight-beam)"
              />

              {/* Wheels (4 Black rubber tires) */}
              <rect x="-10" y="-8.5" width="5" height="2.5" rx="1" fill="#0f172a" />
              <rect x="-10" y="6" width="5" height="2.5" rx="1" fill="#0f172a" />
              <rect x="5" y="-8.5" width="5" height="2.5" rx="1" fill="#0f172a" />
              <rect x="5" y="6" width="5" height="2.5" rx="1" fill="#0f172a" />

              {/* Main Truck Chassis */}
              <rect x="-12" y="-6.5" width="24" height="13" rx="2" fill="#1e293b" />

              {/* Rear Cargo Container (Vardann Tech Navy/Blue) */}
              <rect x="-12" y="-6" width="15" height="12" rx="1.5" fill="#0050a0" />
              <line x1="-9" y1="-5" x2="-9" y2="5" stroke="#003b78" strokeWidth="0.8" />
              <line x1="-5" y1="-5" x2="-5" y2="5" stroke="#003b78" strokeWidth="0.8" />
              <line x1="-1" y1="-5" x2="-1" y2="5" stroke="#003b78" strokeWidth="0.8" />
              
              {/* Gold Accent Stripe on Container */}
              <rect x="-11.5" y="-1" width="13.5" height="2" fill="#f8c028" rx="0.4" />

              {/* Front Driver Cabin (Clean White) */}
              <path
                d="M 3 -6 L 10.5 -5 C 12 -4.5, 13 -2.5, 13 0 C 13 2.5, 12 4.5, 10.5 5 L 3 6 Z"
                fill="#ffffff"
              />
              
              {/* Windshield (Sky Blue Glass) */}
              <path
                d="M 4 -4.5 L 8.5 -3.8 C 9.5 -3, 10 -1, 10 0 C 10 1, 9.5 3, 8.5 3.8 L 4 4.5 Z"
                fill="#38bdf8"
              />
              {/* Windshield glare highlight */}
              <line x1="5.5" y1="-2.5" x2="7.5" y2="0.5" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />

              {/* Side Mirrors */}
              <rect x="5.5" y="-8" width="1.5" height="2" rx="0.8" fill="#0f172a" />
              <rect x="5.5" y="6" width="1.5" height="2" rx="0.8" fill="#0f172a" />

              {/* Dual Front Headlights (Warm Glow) */}
              <circle cx="12" cy="-3" r="1.1" fill="#fef08a" />
              <circle cx="12" cy="3" r="1.1" fill="#fef08a" />
              
              {/* Rear Taillights (Red) */}
              <rect x="-12.5" y="-5" width="0.8" height="2" rx="0.4" fill="#ef4444" />
              <rect x="-12.5" y="3" width="0.8" height="2" rx="0.4" fill="#ef4444" />
            </g>
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
            threshold={0.86}
          />
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
      {/* 1. Milestone Year Circle (Proportionately scaled) */}
      <motion.div
        className="absolute rounded-full bg-vblue shadow-[0_8px_20px_rgba(0,87,164,0.25)] sm:shadow-[0_18px_40px_rgba(0,87,164,0.35)] flex items-center justify-center text-white"
        style={{
          left: pctX(circleX - r),
          width: pctX(circleSize),
          height: pctY(circleSize),
          scale: circleScale,
          opacity: opacity,
        }}
      >
        <span className="font-mono text-xs sm:text-xl md:text-3xl lg:text-4xl font-black text-white/95 tracking-tight">
          {step.year}
        </span>
      </motion.div>

      {/* 2. Pure Typography Text (Responsive alignment & text sizes) */}
      <motion.div
        className="absolute w-[44%] sm:w-[42%] max-w-[420px]"
        style={{
          top: pctY(25),
          left: isCircleLeft ? pctX(535) : "auto",
          right: isCircleLeft ? "auto" : pctX(535),
          textAlign: isCircleLeft ? "left" : "right",
          opacity: opacity,
          x: textX,
        }}
      >
        {/* Step Number + Title */}
        <div className={`flex items-baseline gap-1 sm:gap-2 lg:gap-3 ${isCircleLeft ? "" : "justify-end"}`}>
          <span className="font-mono text-[0.7rem] sm:text-base md:text-xl lg:text-2xl font-black text-navy">
            {step.number}
          </span>
          <h3 className="font-display text-[0.68rem] sm:text-base md:text-xl lg:text-2xl font-bold text-navy tracking-tight leading-tight">
            {step.title}
          </h3>
        </div>

        {/* Subtitle */}
        <p className="mt-0.5 sm:mt-1 text-[0.45rem] sm:text-[0.55rem] md:text-[0.62rem] lg:text-[0.68rem] font-bold uppercase tracking-wider sm:tracking-widest text-vblue">
          {step.subtitle}
        </p>

        {/* Description Text */}
        <p className="mt-0.5 sm:mt-2 lg:mt-3 text-[0.52rem] sm:text-xs md:text-sm leading-snug sm:leading-relaxed text-body">
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}
