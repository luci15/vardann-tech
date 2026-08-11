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
        alt="Vardann Tech and Engg LLP"
        width={400}
        height={100}
        className="h-10 w-auto max-w-[220px] object-contain drop-shadow-md sm:h-14 sm:max-w-[300px] lg:h-16 lg:max-w-[360px]"
        priority
      />
    </span>
  );
}
