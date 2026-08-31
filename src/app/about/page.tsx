import type { Metadata } from "next";
import { company } from "@/lib/content";
import AboutHero from "@/components/about/AboutHero";
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
        <AboutHero />

        <section className="pb-10 sm:pb-14">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <p className="text-base leading-relaxed text-navy">
              {company.about}
            </p>
            <p className="mt-5 text-base leading-relaxed text-body">
              {company.history}
            </p>
          </div>

          {/* Wider than the paragraph column above — the stats cards need
              more than max-w-3xl gives them, or values like "ASME / NABL"
              and labels like "STANDARDS MET" wrap awkwardly. */}
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <StatsGrid stats={stats} />
          </div>
        </section>

        {/* Serpentine Timeline Section */}
        <SerpentineTimeline />

        <WhyVardann />
      </div>

      {/* One CTA band instead of two stacked dark sections (a separate
          quote block followed immediately by the standard CtaSection read
          as redundant) — the quote becomes this section's heading, with
          the usual Contact Us CTA kept underneath. */}
      <CtaSection
        heading={<span className="italic">&ldquo;{company.quote}&rdquo;</span>}
        headingClassName="text-3xl sm:text-4xl leading-snug"
        subtitle={<span className="text-eyebrow text-gold">{company.name}</span>}
      />
    </>
  );
}
