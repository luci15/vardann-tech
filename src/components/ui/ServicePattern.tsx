import type { ReactElement } from "react";

type ServicePatternProps = {
  id: string;
  className?: string;
};

// Small, restrained abstract motifs — one per service, used as a corner
// accent on the active content panel, never a full-bleed background
// texture. viewBox is a tight 120x120 square so each stays compact.
function WaveMotif() {
  return (
    <>
      {[24, 48, 72, 96].map((y, i) => (
        <path
          key={y}
          d={`M -10 ${y} Q 30 ${y - 16} 60 ${y} T 130 ${y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          opacity={0.9 - i * 0.18}
        />
      ))}
    </>
  );
}

function GridMotif() {
  const lines = [];
  for (let x = 15; x <= 105; x += 30) {
    lines.push(<line key={`v${x}`} x1={x} y1={5} x2={x} y2={115} stroke="currentColor" strokeWidth={1.5} />);
  }
  for (let y = 15; y <= 105; y += 30) {
    lines.push(<line key={`h${y}`} x1={5} y1={y} x2={115} y2={y} stroke="currentColor" strokeWidth={1.5} />);
  }
  return <>{lines}</>;
}

function CrosshairMotif() {
  return (
    <>
      <line x1={60} y1={8} x2={60} y2={112} stroke="currentColor" strokeWidth={1.5} />
      <line x1={8} y1={60} x2={112} y2={60} stroke="currentColor" strokeWidth={1.5} />
      <circle cx={60} cy={60} r={26} fill="none" stroke="currentColor" strokeWidth={1.5} />
      <circle cx={60} cy={60} r={46} fill="none" stroke="currentColor" strokeWidth={1.5} />
    </>
  );
}

function MicrostructureMotif() {
  const cells = [
    "M15 20 L45 12 L58 40 L38 58 L12 48 Z",
    "M58 40 L88 18 L108 46 L92 68 L64 62 Z",
    "M12 48 L38 58 L48 88 L20 100 L4 78 Z",
    "M64 62 L92 68 L102 96 L74 110 L52 92 Z",
  ];
  return (
    <>
      {cells.map((d) => (
        <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth={1.5} />
      ))}
    </>
  );
}

function MachiningMotif() {
  const r = 34;
  // Rounded to 3dp: the raw trig results differ in their last float digit
  // between Node and the browser, which React reports as a hydration
  // mismatch on these <line> coords.
  const round = (n: number) => Math.round(n * 1000) / 1000;
  const teeth = Array.from({ length: 10 }, (_, t) => {
    const angle = (t / 10) * Math.PI * 2;
    const x1 = Number((60 + Math.cos(angle) * r).toFixed(2));
    const y1 = Number((60 + Math.sin(angle) * r).toFixed(2));
    const x2 = Number((60 + Math.cos(angle) * (r + 10)).toFixed(2));
    const y2 = Number((60 + Math.sin(angle) * (r + 10)).toFixed(2));
    return (
      <line
        key={t}
        x1={round(60 + Math.cos(angle) * r)}
        y1={round(60 + Math.sin(angle) * r)}
        x2={round(60 + Math.cos(angle) * (r + 10))}
        y2={round(60 + Math.sin(angle) * (r + 10))}
        stroke="currentColor"
        strokeWidth={1.5}
      />
    );
  });
  return (
    <>
      <circle cx={60} cy={60} r={r} fill="none" stroke="currentColor" strokeWidth={1.5} />
      <circle cx={60} cy={60} r={12} fill="none" stroke="currentColor" strokeWidth={1.5} />
      {teeth}
    </>
  );
}

function TrainingMotif() {
  const points: [number, number][] = [
    [20, 20],
    [60, 12],
    [100, 28],
    [30, 60],
    [80, 66],
    [22, 100],
    [70, 104],
    [104, 88],
  ];
  const connections: [number, number][] = [
    [0, 1],
    [1, 2],
    [1, 3],
    [3, 4],
    [2, 4],
    [3, 5],
    [4, 6],
    [6, 7],
  ];
  return (
    <>
      {connections.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a][0]}
          y1={points[a][1]}
          x2={points[b][0]}
          y2={points[b][1]}
          stroke="currentColor"
          strokeWidth={1.2}
        />
      ))}
      {points.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill="currentColor" />
      ))}
    </>
  );
}

const PATTERNS: Record<string, () => ReactElement> = {
  "advanced-ndt": WaveMotif,
  "conventional-ndt": GridMotif,
  "inspection-services": CrosshairMotif,
  metallography: MicrostructureMotif,
  "precision-manufacturing": MachiningMotif,
  "training-certification": TrainingMotif,
};

export default function ServicePattern({ id, className = "" }: ServicePatternProps) {
  const Pattern = PATTERNS[id] ?? WaveMotif;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <Pattern />
    </svg>
  );
}
