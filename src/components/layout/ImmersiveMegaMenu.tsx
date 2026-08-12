"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { serviceMeta } from "@/lib/content";

type ImmersiveMegaMenuProps = {
  open: boolean;
  onClose: () => void;
  /** Forwarded to Navbar's hover-intent timer so the gap between the nav
   *  trigger and this panel doesn't cause an instant close. */
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

// Full-width immersive panel for the "Services" nav item — a numbered
// category list on the left, a single dynamic visual on the right that
// masks/reveals as the hovered (or focused) category changes. Built as its
// own controlled component so Navbar only owns the open/closed boolean.
export default function ImmersiveMegaMenu({
  open,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: ImmersiveMegaMenuProps) {
  const [active, setActive] = useState(0);
  const current = serviceMeta[active];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            role="menu"
            aria-label="Services"
            className="fixed inset-x-3 top-[4.75rem] z-40 mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-navy shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] sm:inset-x-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1fr]">
              <div className="p-8 sm:p-10">
                <p className="text-eyebrow text-[0.62rem] text-white/45">Services</p>
                <ul className="mt-6 flex flex-col">
                  {serviceMeta.map((s, i) => (
                    <li key={s.id} className="border-b border-white/10">
                      <Link
                        href={`/services/${s.slug}`}
                        role="menuitem"
                        onFocus={() => setActive(i)}
                        onMouseEnter={() => setActive(i)}
                        onClick={onClose}
                        className={`group flex items-center justify-between gap-4 py-4 transition-colors ${
                          active === i ? "text-gold" : "text-white/70 hover:text-white"
                        }`}
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="text-eyebrow text-[0.62rem]">{s.number}</span>
                          <span className="font-display text-2xl sm:text-3xl">{s.title}</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services"
                  onClick={onClose}
                  className="text-eyebrow mt-6 inline-flex items-center gap-2 text-[0.65rem] text-white/50 hover:text-white"
                >
                  View all services
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="relative hidden overflow-hidden border-l border-white/10 lg:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    className="absolute inset-0 flex flex-col justify-between p-10"
                    initial={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={current.galleryImage}
                      alt={current.title}
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,62,80,0.25),rgba(44,62,80,0.85))]"
                    />
                    <span className="text-eyebrow relative z-10 text-[0.6rem] text-white/45">
                      {current.number} / 04
                    </span>
                    <div className="relative z-10">
                      <h3 className="font-display text-3xl text-white">{current.title}</h3>
                      <p className="mt-2 max-w-sm text-sm text-white/65">
                        {current.cardDescriptor}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
