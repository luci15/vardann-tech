import type { Metadata } from "next";
import { serviceMeta, conventionalNdtGroups } from "@/lib/content";
import ServiceHero from "@/components/services/ServiceHero";
import MethodSection from "@/components/services/MethodSection";
import ServiceNav from "@/components/services/ServiceNav";
import CinematicCta from "@/components/services/CinematicCTA";

const meta = serviceMeta.find((s) => s.id === "conventional-ndt")!;

export const metadata: Metadata = {
  title: "Conventional NDT | Vardann Tech and Engg LLP",
  description:
    "Ultrasonic testing, radiography, magnetic particle, liquid penetrant, hardness testing, coating thickness measurement and post weld heat treatment.",
};

export default function ConventionalNdtPage() {
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
        badge="Field-Proven, Portable Methods"
      />

      <section className="border-t border-vblue/10 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-lg leading-relaxed text-navy sm:text-xl">{meta.intro}</p>
        </div>
      </section>

      <div className="bg-continuous-light">
        {conventionalNdtGroups.map((group) => (
          <MethodSection key={group.title} group={group} />
        ))}
      </div>

      <ServiceNav currentId={meta.id} />

      <CinematicCta
        eyebrow="Conventional NDT"
        headline="Let's engineer what comes next."
        supporting="Talk to our engineering team about your inspection, testing or manufacturing requirement."
        visualLabel="Technician performing ultrasonic testing"
        icon={meta.icon}
        image={meta.ctaImage}
      />
    </>
  );
}
