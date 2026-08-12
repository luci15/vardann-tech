import type { Metadata } from "next";
import { serviceMeta, destructiveTestingGroups } from "@/lib/content";
import ServiceHero from "@/components/services/ServiceHero";
import MethodSection from "@/components/services/MethodSection";
import ServiceNav from "@/components/services/ServiceNav";
import CinematicCta from "@/components/services/CinematicCTA";

const meta = serviceMeta.find((s) => s.id === "destructive-testing-training")!;

export const metadata: Metadata = {
  title: "Destructive Testing & Training | Vardann Tech and Engg LLP",
  description:
    "Positive material identification, optical emission spectroscopy, in-situ metallography, and ASNT-aligned NDT Level I, II & III training and certification.",
};

export default function DestructiveTestingTrainingPage() {
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
        badge="ASNT Level I, II & III"
      />

      {/* A touch warmer than the inspection pages — this discipline is as
          much about people (training, certification) as equipment. */}
      <section className="border-t border-vblue/10 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-lg leading-relaxed text-navy sm:text-xl">{meta.intro}</p>
        </div>
      </section>

      <div className="bg-continuous-light">
        {destructiveTestingGroups.map((group) => (
          <MethodSection key={group.title} group={group} />
        ))}
      </div>

      <ServiceNav currentId={meta.id} />

      <CinematicCta
        eyebrow="Destructive Testing & Training"
        headline="Build the expertise your team needs."
        supporting="Talk to our engineering team about your inspection, testing or manufacturing requirement."
        visualLabel="ASNT-aligned NDT training session"
        icon={meta.icon}
        image={meta.ctaImage}
      />
    </>
  );
}
