"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/content";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-5">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/15 bg-[linear-gradient(135deg,rgba(52,73,94,0.92),rgba(40,56,72,0.94)_55%,rgba(0,80,160,0.55))] px-5 py-2.5 shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_18px_40px_-12px_rgba(0,80,160,0.4),0_10px_25px_-8px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:px-7">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-eyebrow relative rounded-full px-4 py-2 text-[0.68rem] transition-colors duration-300 ${
                  active
                    ? "bg-white/10 text-gold"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-full bg-gold px-5 py-2 text-eyebrow text-[0.66rem] text-navy transition-all duration-300 hover:scale-[1.04] hover:bg-white md:inline-flex"
        >
          Get in Touch
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(52,73,94,0.96),rgba(40,56,72,0.97)_55%,rgba(0,80,160,0.6))] p-4 shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_18px_40px_-12px_rgba(0,80,160,0.4),0_10px_25px_-8px_rgba(0,0,0,0.55)] backdrop-blur-xl md:hidden">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-eyebrow rounded-full px-4 py-2.5 text-[0.72rem] transition-colors ${
                  active ? "bg-white/10 text-gold" : "text-white/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="text-eyebrow mt-1 rounded-full bg-gold px-5 py-2.5 text-center text-[0.7rem] text-navy"
          >
            Get in Touch
          </Link>
        </nav>
      )}
    </header>
  );
}
