import type { Metadata } from "next";
import { company } from "@/lib/content";
import PageHeader from "@/components/ui/PageHeader";
import WhyVardann from "@/components/sections/WhyVardann";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "About Us | Vardann Tech and Engg LLP",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Company Profile."
        subtitle={`Formerly known as ${company.formerlyKnownAs}. We have rebranded as ${company.name} to reflect our broader vision and global commitment to engineering excellence.`}
      />

      <section className="bg-soft-light pb-20 sm:pb-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="text-base leading-relaxed text-navy">
            {company.about}
          </p>
          <p className="mt-5 text-base leading-relaxed text-body">
            {company.history}
          </p>
        </div>
      </section>

      <WhyVardann />
      <CtaSection />
    </>
  );
}
