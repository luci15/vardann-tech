type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-eyebrow text-[0.72rem] text-gold">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
