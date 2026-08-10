import SectionHeading from "@/components/ui/SectionHeading";
import { GlobeCdn, type GlobeArc, type GlobeMarker } from "@/components/ui/cobe-globe-cdn";

// India as the hub, with spokes out to the other regions the brochure
// names as served markets.
const india: [number, number] = [20.5937, 78.9629];
const middleEast: [number, number] = [25.2048, 55.2708];
const africa: [number, number] = [-1.2921, 36.8219];
const asiaPacific: [number, number] = [1.3521, 103.8198];

const markers: GlobeMarker[] = [
  { location: india, size: 0.08, label: "India" },
  { location: middleEast, size: 0.06, label: "Middle East" },
  { location: africa, size: 0.06, label: "Africa" },
  { location: asiaPacific, size: 0.06, label: "Asia-Pacific" },
];

const arcs: GlobeArc[] = [
  { from: india, to: middleEast },
  { from: india, to: africa },
  { from: india, to: asiaPacific },
];

const regions = ["India", "Middle East", "Africa", "Asia-Pacific"];

export default function GlobalPresence() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_45%_45%_at_50%_60%,rgba(0,80,160,0.12),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Global Presence"
          title={
            <>
              Trusted Across <span className="text-vblue italic">Continents.</span>
            </>
          }
          subtitle="Our products and services are trusted by clients across India, the Middle East, Africa, and the Asia-Pacific region."
        />

        <div className="mx-auto mt-6 w-full max-w-[360px] sm:max-w-md lg:max-w-lg">
          <GlobeCdn markers={markers} arcs={arcs} />
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-3 text-center">
          <p className="text-eyebrow text-[0.65rem] text-steel">
            Our Products &amp; Services Are Delivered Across
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {regions.map((r) => (
              <span
                key={r}
                className="rounded-full border border-vblue/15 bg-white px-4 py-1.5 text-sm text-navy shadow-sm"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
