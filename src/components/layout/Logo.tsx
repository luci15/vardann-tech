import Image from "next/image";

// The supplied brand PNG, cropped to its artwork bounds (1041x239).
// Height drives the size; width follows the aspect ratio.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Vardann Tech and Engg LLP — Powering Precision Globally"
        width={1041}
        height={239}
        priority
        className="h-[26px] w-auto sm:h-[30px]"
      />
    </span>
  );
}
