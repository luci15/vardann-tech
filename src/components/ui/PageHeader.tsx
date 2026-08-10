type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-soft-light pt-16 pb-14 sm:pt-20 sm:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(0,80,160,0.12),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <p className="text-eyebrow text-[0.72rem] text-gold">{eyebrow}</p>
        <h1 className="mx-auto mt-4 max-w-2xl font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-body sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
