import Image from "next/image";
import { manufacturingContent } from "@/lib/content";

const PROCESS_PHOTOS = [
  "/services/mfg-process-1.jpg",
  "/services/mfg-process-2.jpg",
  "/services/mfg-process-3.jpg",
  "/services/mfg-process-4.jpg",
  "/services/mfg-process-5.jpg",
  "/services/mfg-process-6.jpg",
];

function TagRow({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-eyebrow text-[0.62rem] text-vblue">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-vblue/15 bg-white px-3.5 py-1.5 text-sm text-navy/85"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// Capabilities / materials / services — presented as technical tag rows
// plus a photo strip of the actual shop floor, so this doesn't read as a
// text-only spec sheet.
export default function ManufacturingCapabilities() {
  return (
    <div className="border-t border-vblue/10 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <h2 className="font-display text-3xl text-navy sm:text-4xl">
          Precision Manufacturing & Fabrication
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-body">
          Comprehensive precision manufacturing and fabrication services for
          industrial, engineering, and NDT applications.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {PROCESS_PHOTOS.map((src, i) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden rounded-lg border border-vblue/10"
            >
              <Image
                src={src}
                alt={`Manufacturing process ${i + 1}`}
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          <TagRow title="Capabilities" items={manufacturingContent.capabilities} />
          <TagRow title="Materials" items={manufacturingContent.materials} />
        </div>

        <div className="mt-10 border-t border-vblue/10 pt-8">
          <p className="text-eyebrow text-[0.62rem] text-vblue">Services</p>
          <ul className="mt-4 flex flex-col gap-2">
            {manufacturingContent.services.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-base text-navy/85">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-vblue/50" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
