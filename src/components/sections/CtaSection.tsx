import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#283848,#0050a0)] py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(248,192,40,0.12),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Let&rsquo;s Engineer What&rsquo;s Next.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
          Talk to our team about your inspection, testing or manufacturing
          requirements.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-eyebrow text-[0.72rem] text-vblue transition-colors hover:bg-gold hover:text-navy"
        >
          Contact Us
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
