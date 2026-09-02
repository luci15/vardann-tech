"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/content";

interface HeroFanProps {
  products: Product[];
  className?: string;
}

// Curated collage positions — each card gets its own rotation and vertical
// offset so the row reads as an art-directed spread of product/specimen
// boards rather than a straight, evenly-spaced carousel.
const CARD_META = [
  { rotate: -7, y: 16 },
  { rotate: 4, y: -20 },
  { rotate: -3, y: 8 },
  { rotate: 5, y: -22 },
  { rotate: -6, y: 10 },
  { rotate: 3, y: -14 },
];

export default function HeroFan({ products, className = "" }: HeroFanProps) {
  const cards = products.slice(0, CARD_META.length);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Desktop / tablet — overlapping, rotated collage. */}
      <div className="hidden items-center justify-center pt-10 pb-6 sm:flex">
        <div className="flex">
          {cards.map((p, i) => {
            const meta = CARD_META[i % CARD_META.length];
            return (
              <motion.div
                key={p.id}
                className={`relative h-40 w-28 shrink-0 md:h-52 md:w-36 lg:h-64 lg:w-44 ${
                  i === 0 ? "" : "-ml-10 md:-ml-12 lg:-ml-14"
                }`}
                style={{ zIndex: i }}
                initial={{ rotate: 0, y: 50, opacity: 0 }}
                whileInView={{ rotate: meta.rotate, y: meta.y, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ rotate: 0, y: meta.y - 14, scale: 1.06, zIndex: 30 }}
                transition={{
                  delay: 0.15 + i * 0.09,
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] border border-white/5 bg-white p-3.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.55)] transition-shadow duration-500 hover:shadow-[0_30px_60px_-10px_rgba(0,80,160,0.4)]">
                  <div className="relative h-full w-full">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="220px"
                      className="object-contain"
                      priority={i < 2}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile — clean 2-column grid, no overlap, minimal rotation. */}
      <div className="grid grid-cols-2 gap-3.5 px-1 pt-4 sm:hidden">
        {cards.map((p, i) => (
          <motion.div
            key={p.id}
            className="relative h-36 w-full"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
            viewport={{ once: true }}
            whileTap={{ scale: 0.97 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.5 }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-vblue/10 bg-white p-3 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)]">
              <div className="relative h-full w-full">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="180px"
                  className="object-contain"
                  priority={i < 2}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
