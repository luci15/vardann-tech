import type { Metadata } from "next";
import { Check } from "lucide-react";
import { serviceGroups } from "@/lib/content";
import PageHeader from "@/components/ui/PageHeader";
import TechIcon from "@/components/ui/TechIcon";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "Services | Vardann Tech and Engg LLP",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Inspection Services"
        title="Zero Compromise Towards Safety."
        subtitle="Advanced and conventional NDT, plus specialized third-party inspection — delivered to ASME and international standards."
      />

      <section className="bg-soft-light pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {serviceGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-2xl border border-vblue/10 bg-white p-7 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-eyebrow text-[0.68rem] text-vblue">
                    {group.number}
                  </span>
                  <TechIcon icon={group.icon} className="h-8 w-8 text-vblue" />
                </div>
                <h2 className="mt-4 font-heading text-xl font-bold text-navy">
                  {group.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-body">
                  {group.summary}
                </p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-base text-navy/90"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-vblue" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
