import Image from "next/image";

// The subtext ("TECH AND ENGG LLP") and tagline are baked into the PNG in
// a light blue-gray, meant to read against a dark background (the footer,
// still navy). `logo-light.png` is the same file with just that subtext
// recolored to navy for use on light backgrounds (the navbar) — the mark
// and "VARDANN" itself are untouched in both.
export default function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src={variant === "light" ? "/logo-light.png" : "/logo.png"}
        alt="Vardann Tech and Engg LLP — Powering Precision Globally"
        width={1041}
        height={239}
        className="h-8 w-auto max-w-[180px] object-contain sm:h-9.5 sm:max-w-[240px] lg:h-11 lg:max-w-[280px]"
        priority
      />
    </span>
  );
}
