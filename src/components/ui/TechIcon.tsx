import type { IconKey } from "@/lib/content";

type TechIconProps = {
  icon: IconKey;
  className?: string;
};

// Shared line-art icon set — no product photography is available, so every
// product/category visual in the site is one of these technical glyphs
// rendered via currentColor, instead of stock/lifestyle imagery.
const PATHS: Record<IconKey, React.ReactNode> = {
  eddyCurrent: (
    <>
      <circle cx="24" cy="24" r="14" />
      <circle cx="24" cy="24" r="7" />
      <path d="M24 10v-4M24 38v4M10 24H6M38 24h4" strokeLinecap="round" />
    </>
  ),
  ultrasonic: (
    <path
      d="M4 24h6l3-10 5 20 5-16 4 12 3-6h6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  magneticParticle: (
    <>
      <path
        d="M14 10v14a10 10 0 0 0 20 0V10"
        strokeLinecap="round"
      />
      <path d="M14 10H8M14 16H8M34 10h6M34 16h6" strokeLinecap="round" />
    </>
  ),
  radiography: (
    <>
      <circle cx="24" cy="24" r="3" />
      <path
        d="M24 24 8 8M24 24 4 24M24 24l4-16M24 24l16-4M24 24l16 4M24 24l-4 16M24 24 8 40M24 24 40 8"
        strokeLinecap="round"
      />
    </>
  ),
  metallography: (
    <>
      <circle cx="20" cy="20" r="12" />
      <path d="M29 29 40 40" strokeLinecap="round" />
      <path d="M14 20h12M20 14v12" strokeLinecap="round" />
    </>
  ),
  welding: (
    <>
      <path d="M18 6 12 20h8l-4 22 16-26h-8l6-10z" strokeLinejoin="round" />
    </>
  ),
  calibrationTube: (
    <>
      <rect x="10" y="16" width="28" height="16" rx="2" />
      <path d="M16 16v16M24 16v16M32 16v16" strokeLinecap="round" />
    </>
  ),
  probe: (
    <>
      <path d="M12 36 30 18" strokeLinecap="round" />
      <rect x="28" y="8" width="12" height="12" rx="2" transform="rotate(45 34 14)" />
      <circle cx="12" cy="36" r="3" />
    </>
  ),
  testBlock: (
    <path
      d="M6 34h10v-8h10v-8h10v-8h6v24H6z"
      strokeLinejoin="round"
    />
  ),
  weldedSpecimen: (
    <>
      <rect x="6" y="20" width="36" height="8" />
      <path d="M20 20l4-6h0l4 6" strokeLinejoin="round" />
      <path d="M10 28v6M38 28v6" strokeLinecap="round" />
    </>
  ),
  transducer: (
    <>
      <rect x="14" y="10" width="20" height="20" rx="3" />
      <path d="M14 38h20M20 38v-4M28 38v-4" strokeLinecap="round" />
      <path d="M18 20h4l2-4 4 8 2-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  wedge: (
    <>
      <path d="M8 36 34 36 8 10z" strokeLinejoin="round" />
      <path d="M34 36 42 44" strokeLinecap="round" />
    </>
  ),
  manufacturing: (
    <>
      <circle cx="24" cy="24" r="6" />
      <path
        d="M24 12v-4M24 40v-4M12 24H8M40 24h-4M16 16l-3-3M35 35l-3-3M16 32l-3 3M35 13l-3 3"
        strokeLinecap="round"
      />
    </>
  ),
  training: (
    <>
      <path d="M24 8 44 16 24 24 4 16z" strokeLinejoin="round" />
      <path d="M12 20v10c0 4 24 4 24 0V20" strokeLinecap="round" />
      <path d="M44 16v12" strokeLinecap="round" />
    </>
  ),
};

export default function TechIcon({ icon, className = "h-8 w-8" }: TechIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden="true"
    >
      {PATHS[icon]}
    </svg>
  );
}
