import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Products from "@/components/sections/Products";
import WhyVardann from "@/components/sections/WhyVardann";
import CtaSection from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <>
      <div className="bg-continuous-light">
        <Hero />
        <Services />
        <GlobalPresence />
        <Products />
        <WhyVardann />
      </div>
      <CtaSection />
    </>
  );
}
