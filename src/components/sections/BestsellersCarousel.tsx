"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { bestsellerProducts } from "@/lib/content";

export default function BestsellersCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = bestsellerProducts.length;

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = (index + total) % total;
    const card = track.children[clamped] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setActive(clamped);
  }, [total]);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = (track.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
    const gap = 20;
    const index = Math.round(track.scrollLeft / (cardWidth + gap));
    setActive(Math.min(Math.max(index, 0), total - 1));
  }, [total]);

  return (
    <div className="relative px-4 sm:px-14">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-5 overflow-x-auto scroll-smooth px-1 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {bestsellerProducts.map((p) => (
          <div
            key={p.id}
            className="relative shrink-0 basis-full sm:basis-[calc((100%-20px)/2)] lg:basis-[calc((100%-40px)/3)]"
            style={{ scrollSnapAlign: "start" }}
          >
            <Link
              href="/products"
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-vblue/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-vblue/50 hover:shadow-xl"
            >
              <div className="relative aspect-square w-full shrink-0">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex flex-1 flex-col p-7 pt-0">
                <p className="text-eyebrow text-[0.62rem] text-vblue">
                  {p.category}
                </p>
                <h3 className="mt-1.5 font-heading text-lg font-bold text-navy">
                  {p.name}
                </h3>
                <p className="mt-2.5 text-base leading-relaxed text-body">
                  {p.description}
                </p>
                <p className="mt-3 text-[0.78rem] leading-snug tracking-normal text-steel italic">
                  {p.spec}
                </p>

                <div className="flex items-center gap-2 pt-5 text-eyebrow text-[0.65rem] text-vblue">
                  View Product
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous product"
        onClick={() => scrollToIndex(active - 1)}
        className="absolute left-0 top-[calc(38%+1.5rem)] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-vblue/30 bg-white text-navy shadow-md transition-all hover:border-vblue hover:text-vblue hover:shadow-lg"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Next product"
        onClick={() => scrollToIndex(active + 1)}
        className="absolute right-0 top-[calc(38%+1.5rem)] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-vblue/30 bg-white text-navy shadow-md transition-all hover:border-vblue hover:text-vblue hover:shadow-lg"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="relative z-10 mt-3 flex items-center justify-center gap-2">
        {bestsellerProducts.map((p, i) => (
          <button
            key={p.id}
            aria-label={`Go to ${p.name}`}
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-gold" : "w-1.5 bg-steel/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
