import Image from "next/image";

export default function Logo({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Vardann Tech and Engg LLP — Powering Precision Globally"
        width={1041}
        height={239}
        className="h-8 w-auto max-w-[180px] object-contain sm:h-9.5 sm:max-w-[240px] lg:h-11 lg:max-w-[280px]"
        priority
      />
    </span>
  );
}
