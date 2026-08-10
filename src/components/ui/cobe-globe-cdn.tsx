"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export interface GlobeMarker {
  location: [number, number];
  size?: number;
  label?: string;
}

export interface GlobeArc {
  from: [number, number];
  to: [number, number];
}

interface GlobeCdnProps {
  className?: string;
  speed?: number;
  /** How strongly page scroll adds extra spin on top of the continuous auto-rotation. */
  scrollSensitivity?: number;
  markers?: GlobeMarker[];
  arcs?: GlobeArc[];
}

// Projects a lat/lon onto the sphere given the globe's current phi/theta,
// returning screen-space offset from center (in units of radius) and
// whether the point currently faces the camera. Used to draw markers/arcs
// as a synced 2D overlay instead of cobe's own `markers`/`arcs` — those
// reliably fail to draw (silently, no visible output) on cobe@2.0.1 +
// ANGLE/Direct3D11, cobe's default GL backend on Windows Chrome, even
// though the base sphere renders fine. See cobe-globe-cdn memory notes.
function project(lat: number, lon: number, phi: number, theta: number) {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  const x0 = Math.cos(latRad) * Math.sin(lonRad);
  const y0 = Math.sin(latRad);
  const z0 = Math.cos(latRad) * Math.cos(lonRad);

  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const x1 = x0 * cosPhi + z0 * sinPhi;
  const z1 = -x0 * sinPhi + z0 * cosPhi;
  const y1 = y0;

  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const y2 = y1 * cosTheta - z1 * sinTheta;
  const z2 = y1 * sinTheta + z1 * cosTheta;
  const x2 = x1;

  return { x: x2, y: -y2, z: z2, visible: z2 > 0.32 };
}

export function GlobeCdn({
  className = "",
  speed = 0.0012,
  scrollSensitivity = 0.0012,
  markers = [],
  arcs = [],
}: GlobeCdnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const arcRefs = useRef<(SVGPathElement | null)[]>([]);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      scrollOffsetRef.current += (currentY - lastScrollY) * scrollSensitivity;
      lastScrollY = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollSensitivity]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 0;

    function updateOverlay(currentPhi: number, currentTheta: number) {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const size = overlay.offsetWidth;
      const radius = size / 2;

      const projected = markers.map((m) =>
        project(m.location[0], m.location[1], currentPhi, currentTheta)
      );

      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const p = projected[i];
        const cx = radius + p.x * radius;
        const cy = radius + p.y * radius;
        dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) scale(${p.visible ? 1 : 0})`;
        dot.style.opacity = p.visible ? "1" : "0";
      });

      arcRefs.current.forEach((path, i) => {
        if (!path) return;
        const arc = arcs[i];
        if (!arc) return;
        const from = project(arc.from[0], arc.from[1], currentPhi, currentTheta);
        const to = project(arc.to[0], arc.to[1], currentPhi, currentTheta);
        const x1 = radius + from.x * radius;
        const y1 = radius + from.y * radius;
        const x2 = radius + to.x * radius;
        const y2 = radius + to.y * radius;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - radius * 0.18;
        path.setAttribute("d", `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
        path.style.opacity = from.visible && to.visible ? "0.85" : "0";
      });
    }

    function animate() {
      if (!isPausedRef.current) phi += speed;
      const currentPhi = phi + phiOffsetRef.current + dragOffset.current.phi + scrollOffsetRef.current;
      const currentTheta = 0.24 + thetaOffsetRef.current + dragOffset.current.theta;
      globe?.update({ phi: currentPhi, theta: currentTheta });
      updateOverlay(currentPhi, currentTheta);
      animationId = requestAnimationFrame(animate);
    }

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.24,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 35000,
        mapBrightness: 6,
        baseColor: [0.15, 0.22, 0.32],
        markerColor: [0.65, 0.70, 0.78],
        glowColor: [0.2, 0.4, 0.75],
        opacity: 1,
      });

      animate();
      canvas.style.opacity = "1";
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [speed, markers, arcs]);

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 1,
          touchAction: "none",
        }}
      />
      <div ref={overlayRef} className="pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          {arcs.map((arc, i) => (
            <path
              key={`${arc.from.join(",")}-${arc.to.join(",")}`}
              ref={(el) => {
                arcRefs.current[i] = el;
              }}
              fill="none"
              stroke="#0058a0"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray="1 6"
              opacity={0}
              style={{ animation: "arc-flow 1s linear infinite" }}
            />
          ))}
        </svg>
        {markers.map((m, i) => (
          <span
            key={m.location.join(",")}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 flex items-center gap-1.5"
            style={{ opacity: 0, transition: "opacity 120ms linear" }}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-vblue shadow-[0_0_6px_2px_rgba(0,80,160,0.55)]" />
            {m.label && (
              <span className="text-eyebrow whitespace-nowrap rounded-sm bg-white/85 px-1.5 py-0.5 text-[0.55rem] text-navy shadow-sm">
                {m.label}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default GlobeCdn;
