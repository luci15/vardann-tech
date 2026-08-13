import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { serviceMeta } from "@/lib/content";

// Connects the four service pages into one sequence — previous/next,
// wrapping around at the ends.
export default function ServiceNav({ currentId }: { currentId: string }) {
  const idx = serviceMeta.findIndex((s) => s.id === currentId);
  const prev = serviceMeta[(idx - 1 + serviceMeta.length) % serviceMeta.length];
  const next = serviceMeta[(idx + 1) % serviceMeta.length];

  return (
    <nav
      aria-label="Service pages"
      className="border-t border-vblue/10 py-10"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 lg:px-10">
        <Link
          href={`/services/${prev.slug}`}
          className="group flex items-center gap-3 text-left"
        >
          <ArrowLeft className="h-4 w-4 text-vblue transition-transform duration-300 group-hover:-translate-x-1" />
          <span>
            <span className="text-eyebrow block text-[0.58rem] text-steel">Previous Service</span>
            <span className="mt-0.5 block font-heading text-sm font-bold text-navy">
              {prev.title}
            </span>
          </span>
        </Link>

        <span className="text-eyebrow hidden text-[0.62rem] text-steel sm:block">
          {String(idx + 1).padStart(2, "0")} / {serviceMeta.length}
        </span>

        <Link
          href={`/services/${next.slug}`}
          className="group flex items-center gap-3 text-right"
        >
          <span>
            <span className="text-eyebrow block text-[0.58rem] text-steel">Next Service</span>
            <span className="mt-0.5 block font-heading text-sm font-bold text-navy">
              {next.title}
            </span>
          </span>
          <ArrowRight className="h-4 w-4 text-vblue transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </nav>
  );
}
