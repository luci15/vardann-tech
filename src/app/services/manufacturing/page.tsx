import type { Metadata } from "next";
import { serviceMeta } from "@/lib/content";
import ServiceHero from "@/components/services/ServiceHero";
import ManufacturingCapabilities from "@/components/services/ManufacturingCapabilities";
import ManufacturingProducts from "@/components/services/ManufacturingProducts";
import ServiceNav from "@/components/services/ServiceNav";
import CinematicCta from "@/components/services/CinematicCTA";

const meta = serviceMeta.find((s) => s.id === "manufacturing")!;

export const metadata: Metadata = {
  title: "Manufacturing | Vardann Tech and Engg LLP",
  description:
    "Precision CNC turning, milling, VMC, EDM, wire cut EDM and fabrication — welded flawed specimens, calibration tubes and probes, calibration blocks.",
};

export default function ManufacturingPage() {
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
        badge="NABL / NPL Traceable"
      />

      <section className="border-t border-vblue/10 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-lg leading-relaxed text-navy sm:text-xl">{meta.intro}</p>
        </div>
      </section>

      <div className="bg-continuous-light">
        <ManufacturingCapabilities />
        <ManufacturingProducts />
      </div>

      <ServiceNav currentId={meta.id} />

      <CinematicCta
        eyebrow="Manufacturing"
        headline="Let's engineer what comes next."
        supporting="Talk to our engineering team about your inspection, testing or manufacturing requirement."
        visualLabel="CNC turning of a calibration tube blank"
        icon={meta.icon}
        image={meta.ctaImage}
      />
    </>
  );
}
