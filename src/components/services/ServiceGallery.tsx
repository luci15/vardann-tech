"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { serviceMeta } from "@/lib/content";

// Asymmetric capability gallery — one dominant panel, two mid panels, one
// wide panel beneath. Each panel owns its own hover choreography (zoom,
// overlay, descriptor, arrow) since these are interactive nav tiles, not
// passive image slots.
const LAYOUT: Record<string, string> = {
  "advanced-ndt": "lg:col-span-5 lg:row-span-2",
  "conventional-ndt": "lg:col-span-4 lg:row-span-1",
  manufacturing: "lg:col-span-3 lg:row-span-1",
  "destructive-testing-training": "lg:col-span-7 lg:row-span-1",
};

function GalleryPanel({ index }: { index: number }) {
  const s = serviceMeta[index];
  return (
    <Link
      href={`/services/${s.slug}`}
      className={`group relative block h-[42vh] overflow-hidden rounded-lg border border-vblue/10 bg-navy focus-visible:ring-2 focus-visible:ring-vblue focus-visible:outline-none lg:h-full ${LAYOUT[s.id]}`}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={s.galleryImage}
          alt={s.title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </motion.div>

      {/* Dark overlay strengthens on hover for readability + emphasis. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,62,80,0.35),rgba(44,62,80,0.8))] transition-all duration-400 group-hover:bg-[linear-gradient(180deg,rgba(0,87,164,0.35),rgba(44,62,80,0.92))]" />

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <span className="text-eyebrow text-[0.62rem] text-gold">{s.number} / 04</span>
          <ArrowUpRight className="h-5 w-5 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
        </div>

        <div>
          <motion.h3
            className="font-display text-2xl text-white sm:text-3xl"
            initial={{ y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
          >
            {s.title}
          </motion.h3>
          <p className="mt-2 max-h-0 overflow-hidden text-sm text-white/75 opacity-0 transition-all duration-400 group-hover:mt-2 group-hover:max-h-16 group-hover:opacity-100">
            {s.cardDescriptor}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function ServiceGallery() {
  return (
    <section className="bg-continuous-light py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-3 lg:grid-cols-12 lg:[grid-auto-flow:dense] lg:[grid-auto-rows:340px] lg:gap-4">
          {serviceMeta.map((_, i) => (
            <GalleryPanel key={serviceMeta[i].id} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
