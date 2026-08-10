import { company, industriesServed } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";

export default function WhyVardann() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_50%_at_15%_90%,rgba(248,192,40,0.10),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Why Vardann"
          title={
            <>
              Zero Compromise Towards <span className="text-vblue italic">Safety.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-vblue/10 bg-[linear-gradient(160deg,#283848,#0050a0)] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/20 blur-2xl"
            />
            <p className="text-eyebrow text-[0.68rem] text-gold">Vision</p>
            <p className="relative mt-4 text-base leading-relaxed text-white/90">
              {company.vision}
            </p>
          </div>
          <div className="rounded-2xl border border-vblue/10 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-vblue/40 hover:shadow-xl">
            <p className="text-eyebrow text-[0.68rem] text-vblue">Mission</p>
            <p className="mt-4 text-base leading-relaxed text-navy">
              {company.mission}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-eyebrow text-[0.68rem] text-steel">
            Industries We Serve
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {industriesServed.map((ind) => (
              <span
                key={ind}
                className="rounded-full border border-vblue/15 bg-white px-4 py-1.5 text-base text-body shadow-sm transition-colors duration-200 hover:border-gold hover:text-navy"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
