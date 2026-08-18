"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { navLinks, serviceMeta } from "@/lib/content";
import Logo from "./Logo";
import ImmersiveMegaMenu from "./ImmersiveMegaMenu";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // The trigger link and the mega menu panel are not the same DOM subtree
  // (the panel is a fixed-position sibling further down the page), so a
  // plain onMouseLeave on the trigger closes the menu the instant the
  // cursor moves toward it — before it ever reaches the panel. A short
  // close delay, cancelled if the cursor lands on either the trigger or
  // the panel, bridges that gap (the standard mega-menu hover pattern).
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 350);
  };

  // Close the mega menu / mobile panel on route change — adjusted during
  // render (React's recommended pattern for "reset state when a prop
  // changes") rather than in an effect, which would cause an extra render.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setServicesOpen(false);
    setOpen(false);
  }

  // Escape should close whichever menu is open — mega menus shouldn't trap
  // keyboard users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-5">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/15 bg-[linear-gradient(135deg,rgba(52,73,94,0.92),rgba(40,56,72,0.94)_55%,rgba(0,80,160,0.55))] px-4 py-2 shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_18px_40px_-12px_rgba(0,80,160,0.4),0_10px_25px_-8px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:px-6 sm:py-2.5 lg:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            const isServices = link.href === "/services";

            if (isServices) {
              return (
                <div key={link.href} onMouseEnter={openServices} onMouseLeave={scheduleCloseServices}>
                  <Link
                    href={link.href}
                    aria-haspopup="menu"
                    aria-expanded={servicesOpen}
                    onFocus={openServices}
                    className={`text-eyebrow relative flex items-center gap-1 rounded-full px-4 py-2 text-[0.68rem] transition-colors duration-300 ${
                      active || servicesOpen
                        ? "bg-white/10 text-gold"
                        : "text-white/65 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </Link>
                </div>
              );
            }

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

      <ImmersiveMegaMenu
        open={servicesOpen}
        onClose={() => setServicesOpen(false)}
        onMouseEnter={openServices}
        onMouseLeave={scheduleCloseServices}
      />

      {open && (
        <nav className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(52,73,94,0.96),rgba(40,56,72,0.97)_55%,rgba(0,80,160,0.6))] p-4 shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_18px_40px_-12px_rgba(0,80,160,0.4),0_10px_25px_-8px_rgba(0,0,0,0.55)] backdrop-blur-xl md:hidden">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            const isServices = link.href === "/services";

            if (isServices) {
              return (
                <div key={link.href}>
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`text-eyebrow flex-1 rounded-full px-4 py-2.5 text-[0.72rem] transition-colors ${
                        active ? "bg-white/10 text-gold" : "text-white/70"
                      }`}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      aria-label={mobileServicesOpen ? "Collapse services" : "Expand services"}
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      className="flex h-9 w-9 items-center justify-center text-white/70"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                  {mobileServicesOpen && (
                    <ul className="mb-1 flex flex-col gap-0.5 pl-6">
                      {serviceMeta.map((s) => (
                        <li key={s.id}>
                          <Link
                            href={`/services/${s.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-eyebrow flex items-center gap-3 rounded-full px-4 py-2 text-[0.65rem] text-white/60 hover:text-white"
                          >
                            <span className="text-white/35">{s.number}</span>
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }

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
