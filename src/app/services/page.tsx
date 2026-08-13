import type { Metadata } from "next";
import HubHero from "@/components/services/HubHero";
import ServiceGallery from "@/components/services/ServiceGallery";
import WhyVardannSplit from "@/components/services/WhyVardannSplit";
import CinematicCta from "@/components/services/CinematicCTA";
import TextReveal from "@/components/services/TextReveal";

export const metadata: Metadata = {
  title: "Services | Vardann Tech and Engg LLP",
  description:
    "Advanced NDT, conventional NDT, destructive testing & training, and precision manufacturing — engineering inspection and fabrication services from Vardann Tech and Engg LLP.",
};

export default function ServicesPage() {
  return (
    <>
      <HubHero />

      <ServiceGallery />

      <section className="border-t border-vblue/10 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h2 className="font-display text-4xl tracking-tight text-navy sm:text-5xl">
            <TextReveal text="One standard of" />
            {" "}
            <TextReveal text="precision." delay={0.25} className="text-vblue italic" />
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg">
            Vardann Tech combines advanced NDT, conventional NDT, destructive
            testing, metallurgical analysis, training, and precision
            manufacturing — under one roof, to one standard, for every
            project we take on.
          </p>
        </div>
      </section>

      <WhyVardannSplit />

      <CinematicCta
        eyebrow="Vardann Tech and Engg LLP"
        headline="One team. Every layer of precision."
        supporting="From advanced inspection to precision manufacturing, Vardann Tech brings the expertise, equipment and engineering support required to move with confidence."
        visualLabel="Engineering team on a plant inspection"
        icon="manufacturing"
        image="/services/hub-cta.jpg"
      />
    </>
  );
}
