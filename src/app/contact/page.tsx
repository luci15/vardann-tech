import type { Metadata } from "next";
import { company } from "@/lib/content";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Vardann Tech and Engg LLP",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Let's Engineer What's Next."
        subtitle="Talk to our team about your inspection, testing or manufacturing requirements."
      />

      <section className="bg-soft-light pb-20 sm:pb-28">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-[1fr_1.2fr] lg:px-10">
          <div>
            <p className="text-eyebrow text-[0.68rem] text-steel">Get in Touch</p>
            <div className="mt-4 flex flex-col gap-4 text-sm text-body">
              <div>
                <p className="text-navy">Website</p>
                <p>{company.website}</p>
              </div>
              <div>
                <p className="text-navy">Instagram / YouTube</p>
                <p>{company.social}</p>
              </div>
              <div>
                <p className="text-navy">Regions Served</p>
                <p>India, Middle East, Africa, Asia-Pacific</p>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
