import Link from "next/link";
import { company, navLinks, serviceMeta } from "@/lib/content";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.3fr_0.9fr_1fr_0.9fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/60">
              {company.about}
            </p>
            <p className="text-eyebrow mt-5 text-[0.65rem] text-gold">
              Formerly known as {company.formerlyKnownAs}
            </p>
          </div>

          <div>
            <p className="text-eyebrow text-[0.68rem] text-white/50">Navigate</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-eyebrow text-[0.68rem] text-white/50">Services</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {serviceMeta.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-white/60 transition-colors hover:text-gold"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-eyebrow text-[0.68rem] text-white/50">Connect</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/60">
              <li>{company.website}</li>
              <li>Instagram / YouTube: {company.social}</li>
              <li className="pt-2 text-xs italic text-white/40">
                &ldquo;{company.quote}&rdquo;
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="text-eyebrow text-[0.62rem] text-white/50">
            {company.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
