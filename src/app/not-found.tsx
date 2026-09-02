import Link from "next/link";
import { FileDown, Home, Mail, Package, ShieldCheck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-continuous-light px-6 py-20 lg:px-10">
      {/* Background Decorative Rings */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-vblue/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-vblue/15 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-vblue animate-pulse" />
          <span className="text-eyebrow text-[0.68rem] text-vblue font-bold tracking-wider uppercase">
            Error 404 · Page Not Found
          </span>
        </div>

        {/* Big Code & Heading */}
        <h1 className="mt-6 font-display text-5xl sm:text-7xl font-bold tracking-tight text-navy">
          We couldn&apos;t calibrate <span className="italic text-vblue">this route.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-body max-w-xl mx-auto">
          The requested page could not be located or may have been updated. Explore our core engineering divisions or return home below.
        </p>

        {/* Primary Action Button */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3 text-eyebrow text-[0.72rem] text-white shadow-lg shadow-navy/20 transition-all duration-300 hover:scale-[1.03] hover:bg-vblue"
          >
            <Home className="h-4 w-4" />
            Return to Homepage
          </Link>

          <a
            href="/vardann-tech-brochure.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-vblue/20 bg-white/80 px-6 py-3 text-eyebrow text-[0.72rem] text-navy backdrop-blur-md transition-all duration-300 hover:border-vblue hover:bg-lightblue/60"
          >
            <FileDown className="h-4 w-4 text-vblue" />
            Download Brochure
          </a>
        </div>

        {/* Quick Navigation Cards */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
          <Link
            href="/products"
            className="group rounded-2xl border border-vblue/10 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-vblue/30 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lightblue text-vblue transition-colors group-hover:bg-vblue group-hover:text-white">
              <Package className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-navy">Product Catalog</h3>
            <p className="mt-1 text-xs text-body leading-relaxed">
              Explore ASME calibration blocks, probes, and welded specimen sets.
            </p>
          </Link>

          <Link
            href="/services"
            className="group rounded-2xl border border-vblue/10 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-vblue/30 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lightblue text-vblue transition-colors group-hover:bg-vblue group-hover:text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-navy">Inspection Services</h3>
            <p className="mt-1 text-xs text-body leading-relaxed">
              Advanced & conventional NDT, metallography, and QA/QC surveillance.
            </p>
          </Link>

          <Link
            href="/contact"
            className="group rounded-2xl border border-vblue/10 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-vblue/30 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lightblue text-vblue transition-colors group-hover:bg-vblue group-hover:text-white">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-navy">Contact Engineering</h3>
            <p className="mt-1 text-xs text-body leading-relaxed">
              Submit your project specifications or request an immediate technical quote.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
