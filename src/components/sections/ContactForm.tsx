"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const EMPTY: FormState = { name: "", email: "", company: "", message: "" };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<FormState> = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!isValidEmail(form.email)) nextErrors.email = "Enter a valid email.";
    if (!form.message.trim()) nextErrors.message = "Tell us a bit about your requirement.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setForm(EMPTY);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-vblue/25 bg-lightblue px-8 py-14 text-center">
        <CheckCircle2 className="h-10 w-10 text-vblue" />
        <p className="font-heading text-xl font-bold text-navy">
          Message received.
        </p>
        <p className="max-w-sm text-base text-body">
          Thanks for reaching out — our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-eyebrow mt-2 text-[0.68rem] text-vblue hover:text-vblue-hover"
        >
          Send another message
        </button>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-lg border border-vblue/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-steel outline-none transition-colors focus:border-vblue";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <input
            className={fieldClass}
            placeholder="Full name"
            value={form.name}
            onChange={update("name")}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <input
            className={fieldClass}
            placeholder="Email address"
            value={form.email}
            onChange={update("email")}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <input
        className={fieldClass}
        placeholder="Company (optional)"
        value={form.company}
        onChange={update("company")}
      />

      <div>
        <textarea
          className={`${fieldClass} min-h-[140px] resize-none`}
          placeholder="Tell us about your inspection, testing or manufacturing requirement"
          value={form.message}
          onChange={update("message")}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-2 self-start rounded-full bg-vblue px-8 py-3.5 text-eyebrow text-[0.72rem] text-white transition-colors hover:bg-vblue-hover"
      >
        Send Message
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
