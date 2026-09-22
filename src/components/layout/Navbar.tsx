"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, Menu, X } from "lucide-react";
import { navLinks, serviceMeta } from "@/lib/content";
import Logo from "./Logo";
import ImmersiveMegaMenu from "./ImmersiveMegaMenu";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Hover-only menu: opens on hover/focus, closes when the cursor leaves
  // both the trigger and the panel. The trigger and the panel aren't in the
  // same DOM subtree (the panel is a fixed-position sibling), so a plain
  // onMouseLeave would close it the instant the cursor set off toward the
  // panel. A short close delay — cancelled by entering either the trigger
  // or the panel — bridges that, together with the hover bridge span below
  // that covers the pill's padding between the two.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 260);
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
      {/* z-50 is load-bearing: the mega menu's full-screen backdrop is a
          `fixed inset-0 z-40` sibling rendered inside this same header
          (a z-50 stacking context), so without an explicit z-index here the
          pill's z-auto loses to it and the backdrop paints over the whole
          nav bar whenever the menu is open — swallowing hover states and
          clicks on the logo and every nav link. */}
      <div className="relative z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-vblue/10 bg-white/95 px-4 py-2 shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_18px_40px_-14px_rgba(0,87,164,0.25),0_10px_25px_-10px_rgba(15,35,60,0.15)] backdrop-blur-xl sm:px-6 sm:py-2.5 lg:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo variant="light" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            const isServices = link.href === "/services";

            if (isServices) {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleCloseServices}
                >
                  <Link
                    href={link.href}
                    aria-haspopup="menu"
                    aria-expanded={servicesOpen}
                    onFocus={openServices}
                    className={`text-eyebrow relative flex items-center gap-1 rounded-full px-4 py-2 text-[0.68rem] transition-colors duration-300 ${
                      active || servicesOpen
                        ? "bg-lightblue text-vblue"
                        : "text-steel hover:bg-lightblue/60 hover:text-navy"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </Link>
                  {/* Hover bridge: the trigger's bottom edge (~64px) and the
                      panel's hittable top edge (~84px) are separated by the
                      nav pill's own padding, so a straight cursor path down
                      to the menu leaves both and starts the close timer.
                      This spans that gap as a child of the wrapper, so the
                      wrapper never sees a mouseleave mid-traverse. */}
                  {servicesOpen && (
                    <span aria-hidden="true" className="absolute -inset-x-2 top-full h-6" />
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-eyebrow relative rounded-full px-4 py-2 text-[0.68rem] transition-colors duration-300 ${
                  active
                    ? "bg-lightblue text-vblue"
                    : "text-steel hover:bg-lightblue/60 hover:text-navy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-brochure-modal"))}
            className="flex items-center gap-1.5 rounded-full border border-vblue/20 bg-lightblue/60 px-4 py-2 text-eyebrow text-[0.66rem] text-vblue transition-all duration-300 hover:scale-[1.04] hover:bg-vblue hover:text-white"
          >
            <Download className="h-3 w-3" />
            <span>Catalogue</span>
          </button>

          <Link
            href="/contact"
            className="rounded-full bg-gold px-5 py-2 text-eyebrow text-[0.66rem] text-navy transition-all duration-300 hover:scale-[1.04] hover:bg-vblue hover:text-white"
          >
            Get in Touch
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center text-navy md:hidden"
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
        <nav className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border border-vblue/10 bg-white/95 p-4 shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_18px_40px_-14px_rgba(0,87,164,0.25),0_10px_25px_-10px_rgba(15,35,60,0.15)] backdrop-blur-xl md:hidden">
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
                        active ? "bg-lightblue text-vblue" : "text-steel"
                      }`}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      aria-label={mobileServicesOpen ? "Collapse services" : "Expand services"}
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      className="flex h-9 w-9 items-center justify-center text-steel"
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
                            className="text-eyebrow flex items-center gap-3 rounded-full px-4 py-2 text-[0.65rem] text-steel hover:text-navy"
                          >
                            <span className="text-steel/50">{s.number}</span>
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
                  active ? "bg-lightblue text-vblue" : "text-steel"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent("open-brochure-modal"));
            }}
            className="flex items-center justify-center gap-2 rounded-full border border-vblue/20 bg-lightblue py-2.5 text-eyebrow text-[0.68rem] text-vblue"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Catalogue</span>
          </button>
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
