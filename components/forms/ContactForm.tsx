"use client";

import { useState } from "react";
import SocialIcon from "@/components/ui/SocialIcon";
import { CONTACT, WHATSAPP_HREF } from "@/lib/nav";

const formId = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID;
const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const whatsappBase = envNumber ? `https://wa.me/${envNumber}` : WHATSAPP_HREF;

type Status = "idle" | "loading" | "success" | "error";

const INQUIRY_TYPES = [
  "Warehouse Automation",
  "Industrial Pallets/Crates",
  "Cold Chain Logistics",
  "Bulk Storage Systems",
  "General Support",
];

const inputClass =
  "w-full h-12 px-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md form-input-focus transition-all";

/** Shared sizing/typography for the two channel buttons (mirrors the submit button). */
const channelBtnClass =
  "h-14 rounded-lg font-label-md text-label-md active:scale-95 transition-all industrial-shadow whitespace-nowrap flex items-center justify-center gap-3 w-full sm:flex-1";

/** Reads the form into a plain object after the same native validation the submit uses. */
function collectForm(form: HTMLFormElement | null): Record<string, string> | null {
  if (!form || !form.reportValidity()) return null;
  const data = new FormData(form);
  return Object.fromEntries(
    [...data.entries()].map(([k, v]) => [k, String(v)])
  );
}

/** Formats the inquiry as readable multi-line text for email/WhatsApp bodies. */
function formatInquiry(d: Record<string, string>): string {
  return [
    "New inquiry from the Giant Storage website",
    "",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Company: ${d.company || "-"}`,
    `Inquiry Type: ${d.inquiry_type}`,
    "",
    "Project Details:",
    d.message || "-",
  ].join("\n");
}

/**
 * Contact inquiry form (from legacy contact.html). "Send Inquiry" posts
 * FormData to Formspree via NEXT_PUBLIC_FORMSPREE_CONTACT_ID (shows a clear
 * not-configured message until a real ID is provided). The two channel
 * buttons above the consent row send the same validated form data through
 * the visitor's own client instead: mailto: draft or wa.me chat message.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!formId) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const sendViaEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    const d = collectForm(e.currentTarget.form);
    if (!d) return;
    const subject = `Website Inquiry — ${d.inquiry_type} (${d.name})`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(formatInquiry(d))}`;
  };

  const sendViaWhatsApp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const d = collectForm(e.currentTarget.form);
    if (!d) return;
    window.open(
      `${whatsappBase}?text=${encodeURIComponent(formatInquiry(d))}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label
          className="font-label-md text-label-md text-on-surface-variant block"
          htmlFor="contact-name"
        >
          Full Name
        </label>
        <input
          className={inputClass}
          id="contact-name"
          name="name"
          placeholder="John Doe"
          type="text"
          required
        />
      </div>
      <div className="space-y-2">
        <label
          className="font-label-md text-label-md text-on-surface-variant block"
          htmlFor="contact-email"
        >
          Professional Email
        </label>
        <input
          className={inputClass}
          id="contact-email"
          name="email"
          placeholder="j.doe@company.com"
          type="email"
          required
        />
      </div>
      <div className="space-y-2">
        <label
          className="font-label-md text-label-md text-on-surface-variant block"
          htmlFor="contact-company"
        >
          Company Name
        </label>
        <input
          className={inputClass}
          id="contact-company"
          name="company"
          placeholder="Manufacturing Ltd."
          type="text"
        />
      </div>
      <div className="space-y-2">
        <label
          className="font-label-md text-label-md text-on-surface-variant block"
          htmlFor="contact-inquiry"
        >
          Inquiry Type
        </label>
        <select
          className={`${inputClass} appearance-none`}
          id="contact-inquiry"
          name="inquiry_type"
        >
          {INQUIRY_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2 space-y-2">
        <label
          className="font-label-md text-label-md text-on-surface-variant block"
          htmlFor="contact-message"
        >
          Project Details
        </label>
        <textarea
          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md form-input-focus transition-all"
          id="contact-message"
          name="message"
          placeholder="Tell us about your storage requirements or specific facility challenges..."
          rows={4}
        />
      </div>

      {/* Channel buttons — send the same validated form data via the
          visitor's email client or WhatsApp */}
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
        <button
          className={`${channelBtnClass} bg-primary text-on-primary hover:bg-secondary`}
          type="button"
          onClick={sendViaEmail}
        >
          Send via Email
          <span className="material-symbols-outlined" aria-hidden>
            mail
          </span>
        </button>
        <button
          className={`${channelBtnClass} bg-[#25D366] text-white hover:bg-[#1eb857]`}
          type="button"
          onClick={sendViaWhatsApp}
        >
          Send via WhatsApp
          <SocialIcon brand="whatsapp" size={20} />
        </button>
      </div>

      <div className="md:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="flex items-start gap-3">
          <input
            className="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
            id="terms"
            name="terms_accepted"
            type="checkbox"
            value="yes"
            required
          />
          <label
            className="font-label-sm text-label-sm text-on-surface-variant leading-tight"
            htmlFor="terms"
          >
            I agree to Giant Storage&apos;s privacy policy and terms for data
            processing.
          </label>
        </div>
        <button
          className="bg-primary text-on-primary h-14 px-10 rounded-lg font-label-md text-label-md active:scale-95 transition-all industrial-shadow whitespace-nowrap flex items-center justify-center gap-3 disabled:opacity-70"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading"
            ? "Sending…"
            : status === "success"
              ? "Inquiry Sent ✓"
              : "Send Inquiry"}
          {status === "idle" && (
            <span className="material-symbols-outlined">send</span>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="md:col-span-2 text-error text-sm">
          {formId
            ? "Something went wrong sending your inquiry."
            : "The contact form isn't configured yet."}{" "}
          Please reach us directly at{" "}
          <a className="underline font-semibold" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>{" "}
          or{" "}
          <a className="underline font-semibold" href={CONTACT.phoneMain.href}>
            {CONTACT.phoneMain.display}
          </a>
          .
        </p>
      )}
      {status === "success" && (
        <p className="md:col-span-2 text-primary text-sm font-semibold">
          Thank you — an engineering consultant will contact you within 24
          business hours.
        </p>
      )}
    </form>
  );
}
