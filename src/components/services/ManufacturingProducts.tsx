"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { manufacturingContent } from "@/lib/content";

// "What we manufacture" — real product photography presented as
// documentation rows (spec + material lines), matching MethodSection's
// language rather than e-commerce product cards.
export default function ManufacturingProducts() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="border-t border-vblue/10 py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <p className="text-eyebrow text-[0.68rem] text-vblue">What We Manufacture</p>

        <div className="mt-8 divide-y divide-vblue/10">
          {manufacturingContent.products.map((p, i) => (
            <motion.div
              key={p.name}
              className="flex flex-col gap-5 py-8 sm:flex-row sm:items-start sm:gap-8"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg border border-vblue/15 bg-white sm:h-28 sm:w-40">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-bold text-navy">{p.name}</h3>
                <p className="mt-1.5 max-w-2xl text-base leading-relaxed text-body">
                  {p.description}
                </p>
                <ul className="mt-3 flex flex-col gap-1">
                  {p.specs.map((s) => (
                    <li key={s} className="text-eyebrow text-[0.62rem] text-steel">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
