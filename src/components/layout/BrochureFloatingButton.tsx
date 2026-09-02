"use client";

import React, { useState, useEffect } from "react";
import { Download, X, CheckCircle2, ShieldCheck, ArrowRight, FileText, User, Mail, Phone, ChevronDown } from "lucide-react";

// Alphabetically sorted list of world countries with clean dial codes
const COUNTRY_CODES = [
  { name: "Afghanistan", code: "+93" },
  { name: "Albania", code: "+355" },
  { name: "Algeria", code: "+213" },
  { name: "Argentina", code: "+54" },
  { name: "Armenia", code: "+374" },
  { name: "Australia", code: "+61" },
  { name: "Austria", code: "+43" },
  { name: "Azerbaijan", code: "+994" },
  { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" },
  { name: "Belarus", code: "+375" },
  { name: "Belgium", code: "+32" },
  { name: "Brazil", code: "+55" },
  { name: "Bulgaria", code: "+359" },
  { name: "Canada", code: "+1" },
  { name: "Chile", code: "+56" },
  { name: "China", code: "+86" },
  { name: "Colombia", code: "+57" },
  { name: "Croatia", code: "+385" },
  { name: "Cyprus", code: "+357" },
  { name: "Czech Republic", code: "+420" },
  { name: "Denmark", code: "+45" },
  { name: "Egypt", code: "+20" },
  { name: "Estonia", code: "+372" },
  { name: "Finland", code: "+358" },
  { name: "France", code: "+33" },
  { name: "Georgia", code: "+995" },
  { name: "Germany", code: "+49" },
  { name: "Ghana", code: "+233" },
  { name: "Greece", code: "+30" },
  { name: "Hong Kong", code: "+852" },
  { name: "Hungary", code: "+36" },
  { name: "Iceland", code: "+354" },
  { name: "India", code: "+91" },
  { name: "Indonesia", code: "+62" },
  { name: "Iran", code: "+98" },
  { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" },
  { name: "Israel", code: "+972" },
  { name: "Italy", code: "+39" },
  { name: "Japan", code: "+81" },
  { name: "Jordan", code: "+962" },
  { name: "Kazakhstan", code: "+7" },
  { name: "Kenya", code: "+254" },
  { name: "Kuwait", code: "+965" },
  { name: "Latvia", code: "+371" },
  { name: "Lebanon", code: "+961" },
  { name: "Lithuania", code: "+370" },
  { name: "Luxembourg", code: "+352" },
  { name: "Malaysia", code: "+60" },
  { name: "Maldives", code: "+960" },
  { name: "Mauritius", code: "+230" },
  { name: "Mexico", code: "+52" },
  { name: "Morocco", code: "+212" },
  { name: "Myanmar", code: "+95" },
  { name: "Nepal", code: "+977" },
  { name: "Netherlands", code: "+31" },
  { name: "New Zealand", code: "+64" },
  { name: "Nigeria", code: "+234" },
  { name: "Norway", code: "+47" },
  { name: "Oman", code: "+968" },
  { name: "Pakistan", code: "+92" },
  { name: "Panama", code: "+507" },
  { name: "Peru", code: "+51" },
  { name: "Philippines", code: "+63" },
  { name: "Poland", code: "+48" },
  { name: "Portugal", code: "+351" },
  { name: "Qatar", code: "+974" },
  { name: "Romania", code: "+40" },
  { name: "Russia", code: "+7" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Serbia", code: "+381" },
  { name: "Singapore", code: "+65" },
  { name: "Slovakia", code: "+421" },
  { name: "Slovenia", code: "+386" },
  { name: "South Africa", code: "+27" },
  { name: "South Korea", code: "+82" },
  { name: "Spain", code: "+34" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Sweden", code: "+46" },
  { name: "Switzerland", code: "+41" },
  { name: "Taiwan", code: "+886" },
  { name: "Tanzania", code: "+255" },
  { name: "Thailand", code: "+66" },
  { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" },
  { name: "Ukraine", code: "+380" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Uzbekistan", code: "+998" },
  { name: "Venezuela", code: "+58" },
  { name: "Vietnam", code: "+84" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function BrochureFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Validation criteria
  const isNameValid = name.trim().length > 0;
  const isEmailValid = email.trim().length > 0 && email.includes("@") && email.includes(".");
  const isPhoneValid = phone.trim().replace(/\D/g, "").length >= 6;
  const isFormValid = isNameValid && isEmailValid && isPhoneValid && agreed;

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setSubmitted(false);
    setError("");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please fill out all required fields and accept the Privacy Policy.");
      return;
    }

    setError("");
    setSubmitted(true);

    // Trigger PDF brochure download
    const link = document.createElement("a");
    link.href = "/vardann-tech-brochure.pdf";
    link.download = "vardann-tech-brochure.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Site-wide Floating Brochure Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpen}
          type="button"
          aria-label="Download Company Brochure"
          className="group relative flex items-center gap-2.5 rounded-full bg-vblue px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,87,164,0.4)] border border-white/20 transition-all duration-300 hover:bg-vblue-hover hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-vblue/30"
        >
          {/* Subtle pulse aura */}
          <span className="absolute -inset-1 rounded-full bg-sky-400/20 blur-md transition-all group-hover:bg-sky-400/40" />

          {/* Download Icon with animate bounce on hover */}
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-white/25">
            <Download className="h-4 w-4" />
          </span>

          <span className="relative tracking-wide font-medium">Brochure</span>

          {/* Golden Badge Accent Dot */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
        </button>
      </div>

      {/* Modal Backdrop & Popup Card */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 transition-all animate-in zoom-in-95 duration-200"
          >
            {/* Header Banner */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-navy via-vblue to-navy px-6 py-5 text-white">
              {/* Decorative background accent */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-xl" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-gold shadow-inner">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">
                      Download Official Brochure
                    </h3>
                    <p className="text-xs text-sky-100/80 mt-0.5">
                      Vardann Tech &amp; Engg LLP Capabilities Overview
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  type="button"
                  aria-label="Close modal"
                  className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <p className="text-xs font-medium text-slate-500">
                    Please fill in your details below to download our official brochure.
                  </p>

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600 font-medium">
                      {error}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label htmlFor="brochure-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        id="brochure-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-vblue focus:bg-white focus:outline-none focus:ring-2 focus:ring-vblue/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email / Gmail */}
                  <div>
                    <label htmlFor="brochure-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Gmail / Business Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        id="brochure-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@gmail.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-vblue focus:bg-white focus:outline-none focus:ring-2 focus:ring-vblue/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Country Selector (Full-width Dropdown with Chevron Down Icon) */}
                  <div>
                    <label htmlFor="country-code" className="block text-xs font-semibold text-slate-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="country-code"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3.5 pr-10 text-xs font-medium text-slate-800 focus:border-vblue focus:bg-white focus:outline-none focus:ring-2 focus:ring-vblue/20 transition-all cursor-pointer"
                      >
                        {COUNTRY_CODES.map((item) => (
                          <option key={item.name + item.code} value={item.code}>
                            {item.name} ({item.code})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Phone Number with Selected Country Code Prefix */}
                  <div>
                    <label htmlFor="brochure-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700 select-none">
                        {countryCode}
                      </span>
                      <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Phone className="h-4 w-4" />
                        </div>
                        <input
                          id="brochure-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full rounded-r-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-vblue focus:bg-white focus:outline-none focus:ring-2 focus:ring-vblue/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Privacy Policy Box */}
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                      <ShieldCheck className="h-4 w-4 text-vblue" />
                      <span>Privacy Policy &amp; Data Commitment</span>
                    </div>
                    <p className="text-[0.7rem] leading-relaxed text-slate-600">
                      We value your privacy. The information provided ({name || "Name"}, {email || "Email"}, {countryCode} {phone || "Phone"}) will strictly be used by Vardann Tech and Engg LLP to send you our brochure and official technical communication. We maintain strict data confidentiality and do not share your details with third parties.
                    </p>
                  </div>

                  {/* Privacy Checkbox */}
                  <div className="flex items-start gap-2.5 pt-0.5">
                    <input
                      id="privacy-consent"
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-vblue focus:ring-vblue cursor-pointer"
                    />
                    <label htmlFor="privacy-consent" className="text-xs text-slate-600 leading-snug cursor-pointer select-none">
                      I have read and agree to the <span className="font-semibold text-slate-800">Privacy Policy</span> and consent to receiving the brochure.
                    </label>
                  </div>

                  {/* Submit / Next Button (Restricted until all details are filled) */}
                  <div>
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className="w-full mt-1 flex items-center justify-center gap-2 rounded-xl bg-vblue py-3 px-4 font-semibold text-sm text-white shadow-md transition-all hover:bg-vblue-hover hover:shadow-lg disabled:opacity-40 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                      <span>Next &amp; Download Brochure</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    {!isFormValid && (
                      <p className="text-[0.68rem] text-slate-400 text-center font-medium mt-1.5">
                        * Fill in Name, Email, Phone number, and check Privacy Policy to enable button.
                      </p>
                    )}
                  </div>
                </form>
              ) : (
                /* Success Screen */
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Thank You, {name}!</h4>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1.5 leading-relaxed">
                      Your download for the official <span className="font-semibold text-slate-800">Vardann Tech Brochure</span> has started automatically for <span className="font-medium text-vblue">{countryCode} {phone}</span>.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href="/vardann-tech-brochure.pdf"
                      download="vardann-tech-brochure.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-vblue px-4 py-2.5 text-xs font-semibold text-white hover:bg-vblue-hover transition-colors shadow-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>Click here if download didn&apos;t start</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-xs text-slate-500 hover:text-slate-800 py-1 font-medium transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
