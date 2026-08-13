import type { Metadata } from "next";
import { serviceMeta, advancedNdtGroups } from "@/lib/content";
import ServiceHero from "@/components/services/ServiceHero";
import MethodSection from "@/components/services/MethodSection";
import ServiceNav from "@/components/services/ServiceNav";
import CinematicCta from "@/components/services/CinematicCTA";

const meta = serviceMeta.find((s) => s.id === "advanced-ndt")!;

export const metadata: Metadata = {
  title: "Advanced NDT | Vardann Tech and Engg LLP",
  description:
    "Eddy current, remote field, IRIS, near field, phased array, TOFD, long range ultrasonic and pulsed eddy current testing for tubes, welds and pipelines.",
};

export default function AdvancedNdtPage() {
  return (
    <>
      <ServiceHero
        number={meta.number}
        title={meta.title}
        subtitle={meta.subtitle}
        headline={meta.headline}
        visualLabel={meta.heroVisualLabel}
        icon={meta.icon}
        image={meta.heroImage}
        codes={meta.eyebrow.split(" · ")}
        badge="ASME Standards Compliant"
      />

      <section className="border-t border-vblue/10 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-lg leading-relaxed text-navy sm:text-xl">{meta.intro}</p>
        </div>
      </section>

      <div className="bg-continuous-light">
        {advancedNdtGroups.map((group) => (
          <MethodSection key={group.title} group={group} />
        ))}
      </div>

      <ServiceNav currentId={meta.id} />

      <CinematicCta
        eyebrow="Advanced NDT"
        headline="Let's engineer what comes next."
        supporting="Talk to our engineering team about your inspection, testing or manufacturing requirement."
        visualLabel="Refinery pipeline inspection"
        icon={meta.icon}
        image={meta.ctaImage}
      />
    </>
  );
}
