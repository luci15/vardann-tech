"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Eye, X } from "lucide-react";
import type { Product } from "@/lib/content";

// Order follows the brochure's own "Our Product" page sequence (tube
// probes → transducers/cables/accessories → ultrasonic test blocks → MPI
// kits → welded specimens → PWHT), not alphabetical — so the grouped page
// reads the same way the source document does. Any category not listed
// here (shouldn't happen, but content.ts isn't statically constrained to
// this list) falls back to appearing after these, alphabetically.
const CATEGORY_ORDER = [
  "Tube Inspection",
  "Probe Accessories",
  "Accessories",
  "Calibration Standards",
  "Conventional NDT",
  "Welded Specimens",
  "Inspection Equipment",
  "Post Weld Heat Treatment",
];

function groupByCategory(products: Product[]) {
  const byCategory = new Map<string, Product[]>();
  products.forEach((p) => {
    const bucket = byCategory.get(p.category) ?? [];
    bucket.push(p);
    byCategory.set(p.category, bucket);
  });

  const known = CATEGORY_ORDER.filter((c) => byCategory.has(c));
  const rest = [...byCategory.keys()].filter((c) => !CATEGORY_ORDER.includes(c)).sort();

  return [...known, ...rest].map((category) => ({
    category,
    items: byCategory.get(category)!,
  }));
}

// Cards show only a small gist (image, category, name) — the eye button
// opens a modal with the full description/spec, per the client's request
// to keep the grid itself scannable rather than dense with text. Products
// are grouped under their category as a heading, matching how the
// company's own brochure organizes them, rather than one flat grid.
export default function ProductGrid({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Product | null>(null);
  const groups = groupByCategory(products);

  return (
    <>
      <div className="space-y-14">
        {groups.map((group) => (
          <div key={group.category}>
            <h2 className="mb-6 font-display text-2xl text-navy sm:text-3xl">
              {group.category}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActive(p)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-vblue/10 bg-white shadow-sm transition-colors hover:border-vblue/50"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 30vw"
                      className="object-contain p-6"
                    />
                    <button
                      type="button"
                      onClick={() => setActive(p)}
                      aria-label={`View details for ${p.name}`}
                      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-vblue shadow-md backdrop-blur transition-all hover:bg-vblue hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-7 pt-0">
                    <p className="text-eyebrow text-[0.62rem] text-vblue">{p.category}</p>
                    <h3 className="mt-1.5 font-heading text-lg font-bold text-navy">{p.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={active.name}
              className="relative grid w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:grid-cols-2"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy shadow-md hover:bg-lightblue"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative aspect-square w-full bg-offwhite sm:aspect-auto">
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain p-8"
                />
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-8">
                <p className="text-eyebrow text-[0.62rem] text-vblue">{active.category}</p>
                <h3 className="mt-2 font-display text-2xl text-navy">{active.name}</h3>
                <p className="mt-3 text-base leading-relaxed text-body">{active.description}</p>
                <p className="mt-4 text-[0.8rem] leading-snug tracking-normal text-steel italic">
                  {active.spec}
                </p>
                <a
                  href="/vardann-tech-brochure.pdf"
                  download
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-vblue bg-white px-5 py-2.5 text-eyebrow text-[0.65rem] text-vblue transition-colors hover:bg-lightblue"
                >
                  <Download className="h-4 w-4" />
                  Download Brochure
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
