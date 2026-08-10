export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-8 w-8 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M4 6 L20 34 L36 6 L28 6 L20 20 L12 6 Z"
          fill="var(--color-vblue-bright)"
        />
        <circle cx="20" cy="14" r="5" fill="var(--color-gold)" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[1.05rem] font-extrabold tracking-tight text-white">
          VARDANN <span className="font-semibold text-gold">TECH</span>
        </span>
        <span className="text-eyebrow text-[0.5rem] text-white/55">
          Powering Precision Globally
        </span>
      </span>
    </span>
  );
}
