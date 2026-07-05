"use client";

import { useRef, useState } from "react";
import SocialIcon from "@/components/ui/SocialIcon";
import { CONTACT, WHATSAPP_HREF } from "@/lib/nav";

const formId = process.env.NEXT_PUBLIC_FORMSPREE_QUOTE_ID;
const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const whatsappBase = envNumber ? `https://wa.me/${envNumber}` : WHATSAPP_HREF;

type Status = "idle" | "loading" | "success" | "error";

const PRODUCT_TYPES = [
  "Automated Racking Systems",
  "Heavy-Duty Mezzanines",
  "Industrial Shelving",
  "Custom Warehouse Integration",
];

const LEAD_TIMES = [
  "Urgent (30 Days)",
  "Standard (60-90 Days)",
  "Future Planning (6+ Months)",
];

const ENVIRONMENTS = ["Cold Storage", "Ambient", "Hazardous", "High-Humidity"];

const STEPS = [
  { num: 1, label: "Project Details" },
  { num: 2, label: "Logistics" },
  { num: 3, label: "Company Info" },
];

const inputClass =
  "w-full bg-transparent border border-outline rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none";

/** Shared recipe for the two channel buttons (mirrors this page's primary buttons). */
const channelBtnClass =
  "w-full sm:flex-1 px-10 py-4 rounded-lg font-label-lg text-label-lg transition-all shadow-lg flex items-center justify-center gap-3";

/** Formats the full quote request as readable multi-line text for email/WhatsApp. */
function formatQuote(d: Record<string, string>): string {
  return [
    "New quote request from the Giant Storage website",
    "",
    "— Project Details —",
    `Product Type: ${d.product_type}`,
    `Estimated Quantity: ${d.quantity || "-"}`,
    `Storage Environment: ${d.storage_environment}`,
    "",
    "— Logistics —",
    `Destination: ${d.destination || "-"}`,
    `Lead Time: ${d.lead_time}`,
    `On-site Assembly: ${d.installation_required === "yes" ? "Yes" : "No"}`,
    "",
    "— Company —",
    `Company: ${d.company || "-"}`,
    `Business Email: ${d.email}`,
    `Industry Sector: ${d.industry_sector || "-"}`,
    `Phone: ${d.phone || "-"}`,
    "",
    "Project Brief:",
    d.project_brief || "-",
  ].join("\n");
}

/**
 * 3-step quote wizard (from legacy request qoute.html), with the legacy
 * defects fixed: every field now has a name attribute (the legacy form
 * submitted empty FormData), and the storage-environment picker buttons
 * actually select (they were inert). Posts to Formspree via
 * NEXT_PUBLIC_FORMSPREE_QUOTE_ID.
 */
export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const [environment, setEnvironment] = useState(ENVIRONMENTS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const wrapRef = useRef<HTMLDivElement>(null);

  const goToStep = (n: number) => {
    setStep(n);
    // Legacy behavior: scroll back to the top of the form on step change.
    const top = wrapRef.current?.getBoundingClientRect().top ?? 0;
    window.scrollTo({ top: window.scrollY + top - 110, behavior: "smooth" });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!formId) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const data = new FormData(form);
      data.set("storage_environment", environment);
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      setStatus("success");
      form.reset();
      goToStep(1);
    } catch {
      setStatus("error");
    }
  };

  const stepClass = (n: number) =>
    step === n ? "step-active space-y-8" : "step-inactive space-y-8";

  /**
   * Same validation as the main submission: if a required field is invalid,
   * jump the wizard to that field's step and surface the native prompt
   * (the browser can't focus fields hidden in inactive steps).
   */
  const collectQuote = (
    form: HTMLFormElement | null
  ): Record<string, string> | null => {
    if (!form) return null;
    if (!form.checkValidity()) {
      const panel = form
        .querySelector(":invalid")
        ?.closest("[data-quote-step]");
      const target = panel
        ? Number(panel.getAttribute("data-quote-step"))
        : step;
      if (target !== step) goToStep(target);
      window.setTimeout(() => form.reportValidity(), target !== step ? 450 : 0);
      return null;
    }
    const data = new FormData(form);
    data.set("storage_environment", environment);
    return Object.fromEntries(
      [...data.entries()].map(([k, v]) => [k, String(v)])
    );
  };

  const sendViaEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    const d = collectQuote(e.currentTarget.form);
    if (!d) return;
    const subject = `Quote Request — ${d.product_type} (${d.company || d.email})`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(formatQuote(d))}`;
  };

  const sendViaWhatsApp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const d = collectQuote(e.currentTarget.form);
    if (!d) return;
    window.open(
      `${whatsappBase}?text=${encodeURIComponent(formatQuote(d))}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div ref={wrapRef} className="glass-card rounded-xl p-8 md:p-12 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
      {/* Stepper */}
      <div className="flex items-center gap-4 mb-12">
        {STEPS.map((s, i) => (
          <div key={s.num} className="contents">
            {i > 0 && <div className="h-px bg-outline-variant flex-1" />}
            <div
              className={`flex items-center gap-2 ${
                step >= s.num
                  ? "text-primary font-bold"
                  : "text-on-surface-variant"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm ${
                  step >= s.num
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {s.num}
              </span>
              <span className="font-label-lg text-label-lg hidden md:block">
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {status === "success" ? (
        <div className="text-center py-12">
          <span
            className="material-symbols-outlined text-primary text-6xl mb-4 inline-block"
            style={{
              fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48",
            }}
          >
            check_circle
          </span>
          <h3 className="font-headline-md text-headline-md text-primary mb-2">
            Quote Request Received
          </h3>
          <p className="text-on-surface-variant">
            Our engineering team will send your comprehensive technical proposal
            within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          {/* Step 1: Project Details */}
          <div className={stepClass(1)} data-quote-step={1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-product-type"
                >
                  Product Types
                </label>
                <select
                  className={inputClass}
                  id="quote-product-type"
                  name="product_type"
                >
                  {PRODUCT_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-quantity"
                >
                  Estimated Quantity
                </label>
                <input
                  className={inputClass}
                  id="quote-quantity"
                  name="quantity"
                  placeholder="e.g. 500 units"
                  type="number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <span className="font-label-lg text-label-lg text-on-surface block">
                Storage Environment
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ENVIRONMENTS.map((env) => (
                  <button
                    key={env}
                    type="button"
                    aria-pressed={environment === env}
                    onClick={() => setEnvironment(env)}
                    className={
                      environment === env
                        ? "border border-primary bg-primary-fixed-dim/20 text-primary px-4 py-3 rounded-lg text-label-lg transition-all hover:bg-primary-fixed-dim/40"
                        : "border border-outline text-on-surface-variant px-4 py-3 rounded-lg text-label-lg transition-all hover:border-primary"
                    }
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <button
                className="w-full md:w-auto bg-primary text-on-primary px-10 py-4 rounded-lg font-label-lg text-label-lg hover:bg-primary-container transition-all shadow-lg shadow-primary/10"
                onClick={() => goToStep(2)}
                type="button"
              >
                Next: Logistics Requirements
              </button>

              {/* Channel buttons — send the completed quote via the visitor's
                  email client or WhatsApp (same validation as the submit) */}
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <button
                  className={`${channelBtnClass} bg-primary text-on-primary hover:bg-primary-container shadow-primary/10`}
                  type="button"
                  onClick={sendViaEmail}
                >
                  Send via Email
                  <span className="material-symbols-outlined" aria-hidden>
                    mail
                  </span>
                </button>
                <button
                  className={`${channelBtnClass} bg-[#25D366] text-white hover:bg-[#1eb857] shadow-[#25D366]/20`}
                  type="button"
                  onClick={sendViaWhatsApp}
                >
                  Send via WhatsApp
                  <SocialIcon brand="whatsapp" size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Logistics */}
          <div className={stepClass(2)} data-quote-step={2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-destination"
                >
                  Destination Port/City
                </label>
                <input
                  className={inputClass}
                  id="quote-destination"
                  name="destination"
                  placeholder="e.g. Rotterdam, NL"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-lead-time"
                >
                  Lead Time Preference
                </label>
                <select className={inputClass} id="quote-lead-time" name="lead_time">
                  {LEAD_TIMES.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <span className="font-label-lg text-label-lg text-on-surface block">
                Installation Services
              </span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    className="w-5 h-5 rounded border-outline text-primary focus:ring-primary transition-all"
                    type="checkbox"
                    name="installation_required"
                    value="yes"
                  />
                  <span className="text-on-surface-variant group-hover:text-primary transition-colors">
                    On-site Assembly Required
                  </span>
                </label>
              </div>
            </div>
            <div className="pt-4 flex gap-4">
              <button
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-label-lg text-label-lg hover:bg-primary/5 transition-all"
                onClick={() => goToStep(1)}
                type="button"
              >
                Back
              </button>
              <button
                className="flex-1 md:flex-none bg-primary text-on-primary px-10 py-4 rounded-lg font-label-lg text-label-lg hover:bg-primary-container transition-all"
                onClick={() => goToStep(3)}
                type="button"
              >
                Next: Company Information
              </button>
            </div>
          </div>

          {/* Step 3: Company Info */}
          <div className={stepClass(3)} data-quote-step={3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-company"
                >
                  Company Name
                </label>
                <input
                  className={inputClass}
                  id="quote-company"
                  name="company"
                  placeholder="Global Logistics Corp"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-email"
                >
                  Business Email
                </label>
                <input
                  className={inputClass}
                  id="quote-email"
                  name="email"
                  placeholder="procurement@company.com"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-industry"
                >
                  Industry Sector
                </label>
                <input
                  className={inputClass}
                  id="quote-industry"
                  name="industry_sector"
                  placeholder="e.g. E-commerce, Manufacturing"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-phone"
                >
                  Phone Number
                </label>
                <input
                  className={inputClass}
                  id="quote-phone"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="font-label-lg text-label-lg text-on-surface"
                htmlFor="quote-brief"
              >
                Project Brief / Special Instructions
              </label>
              <textarea
                className={inputClass}
                id="quote-brief"
                name="project_brief"
                placeholder="Briefly describe your project scope..."
                rows={4}
              />
            </div>
            <div className="pt-4 flex gap-4">
              <button
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-label-lg text-label-lg hover:bg-primary/5 transition-all"
                onClick={() => goToStep(2)}
                type="button"
              >
                Back
              </button>
              <button
                className="flex-1 md:flex-none bg-primary text-on-primary px-12 py-4 rounded-lg font-label-lg text-label-lg hover:bg-primary-container transition-all shadow-xl shadow-primary/20 uppercase tracking-widest disabled:opacity-70"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending…" : "Direct Inquiry"}
              </button>
            </div>
            {status === "error" && (
              <p className="text-error text-sm">
                {formId
                  ? "Something went wrong sending your request."
                  : "The quote form isn't configured yet."}{" "}
                Please contact us directly at{" "}
                <a
                  className="underline font-semibold"
                  href={`mailto:${CONTACT.email}`}
                >
                  {CONTACT.email}
                </a>{" "}
                or{" "}
                <a
                  className="underline font-semibold"
                  href={CONTACT.phoneMain.href}
                >
                  {CONTACT.phoneMain.display}
                </a>
                .
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
