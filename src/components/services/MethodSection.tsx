"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import TechIcon from "@/components/ui/TechIcon";
import type { ServiceMethodGroup } from "@/lib/content";

// Two-column documentation layout: a real photo + the group heading pinned
// on the left, method rows on the right — instead of a wall of text with a
// tiny icon per row. Rows still reveal with a light stagger on scroll.
export default function MethodSection({ group }: { group: ServiceMethodGroup }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="border-t border-vblue/10 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-vblue/10">
              <Image
                src={group.image}
                alt={group.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <h2 className="mt-6 font-display text-3xl text-navy sm:text-4xl">{group.title}</h2>
            {group.intro && (
              <p className="mt-3 text-lg leading-relaxed text-body">{group.intro}</p>
            )}
          </div>

          <div className="divide-y divide-vblue/10">
            {group.methods.map((m, i) => (
              <motion.div
                key={m.code}
                className="flex flex-col gap-5 py-7 first:pt-0 sm:flex-row sm:items-start sm:gap-6"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex shrink-0 items-center gap-4 sm:w-52">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-vblue/15 bg-white text-vblue">
                    <TechIcon icon={m.icon} className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-eyebrow text-[0.7rem] text-vblue">{m.code}</p>
                    <p className="mt-0.5 font-heading text-base font-bold text-navy">{m.name}</p>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-eyebrow text-[0.62rem] text-steel">{m.scope}</p>
                  <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-center gap-1.5 text-base text-navy/85">
                        <span className="h-1 w-1 rounded-full bg-vblue/50" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  {m.advantages && m.advantages.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.advantages.map((a) => (
                        <span
                          key={a}
                          className="text-eyebrow rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[0.58rem] text-gold"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
