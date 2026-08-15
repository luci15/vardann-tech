import type { Metadata } from "next";
import { company } from "@/lib/content";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/about/StatsGrid";
import SerpentineTimeline from "@/components/sections/SerpentineTimeline";
import WhyVardann from "@/components/sections/WhyVardann";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "About Us | Vardann Tech and Engg LLP",
};

const stats = [
  { value: `${company.established}`, label: "Founded" },
  { value: "4+", label: "Regions Served" },
  { value: "6", label: "Core Disciplines" },
  { value: "ASME / NABL", label: "Standards Met" },
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-continuous-light">
        <PageHeader
          eyebrow="About Us"
          title="Company Profile."
          subtitle={`Formerly known as ${company.formerlyKnownAs}. We have rebranded as ${company.name} to reflect our broader vision and global commitment to engineering excellence.`}
        />

        <section className="pb-20 sm:pb-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <p className="text-base leading-relaxed text-navy">
              {company.about}
            </p>
            <p className="mt-5 text-base leading-relaxed text-body">
              {company.history}
            </p>

            <StatsGrid stats={stats} />
          </div>
        </section>

        {/* Serpentine Timeline Section */}
        <SerpentineTimeline />

        <WhyVardann />
      </div>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#283848,#0050a0)] py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(248,192,40,0.12),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="font-display text-3xl leading-snug text-white italic sm:text-4xl">
            &ldquo;{company.quote}&rdquo;
          </p>
          <p className="text-eyebrow mt-6 text-[0.65rem] text-gold">
            {company.name}
          </p>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
