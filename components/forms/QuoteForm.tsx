"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SocialIcon from "@/components/ui/SocialIcon";
import { CONTACT, WHATSAPP_HREF } from "@/lib/nav";

const formId = process.env.NEXT_PUBLIC_FORMSPREE_QUOTE_ID;
const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const whatsappBase = envNumber ? `https://wa.me/${envNumber}` : WHATSAPP_HREF;

type Status = "idle" | "loading" | "success" | "error";

const PRODUCT_TYPE_KEYS = ["racking", "mezzanines", "shelving", "custom"] as const;
const LEAD_TIME_KEYS = ["urgent", "standard", "future"] as const;
const ENVIRONMENT_KEYS = ["cold", "ambient", "hazardous", "humidity"] as const;
const STEP_KEYS = ["project", "logistics", "company"] as const;

const inputClass =
  "w-full bg-transparent border border-outline rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none";

/** Shared recipe for the two channel buttons (mirrors this page's primary buttons). */
const channelBtnClass =
  "w-full sm:flex-1 px-10 py-4 rounded-lg font-label-lg text-label-lg transition-all shadow-lg flex items-center justify-center gap-3";

/**
 * 3-step quote wizard (from legacy request qoute.html), with the legacy
 * defects fixed: every field has a name attribute and the environment
 * picker actually selects. Posts to Formspree; the channel buttons send
 * the same validated data via email client / WhatsApp.
 */
export default function QuoteForm() {
  const t = useTranslations("quoteForm");
  const tc = useTranslations("common");
  const [step, setStep] = useState(1);
  const [environment, setEnvironment] = useState<string>("cold");
  const [status, setStatus] = useState<Status>("idle");
  const wrapRef = useRef<HTMLDivElement>(null);

  const goToStep = (n: number) => {
    setStep(n);
    // Legacy behavior: scroll back to the top of the form on step change.
    const top = wrapRef.current?.getBoundingClientRect().top ?? 0;
    window.scrollTo({ top: window.scrollY + top - 110, behavior: "smooth" });
  };

  const environmentLabel = (key: string) =>
    t(`environments.${key as (typeof ENVIRONMENT_KEYS)[number]}`);

  /** Formats the full quote request as readable multi-line text. */
  const formatQuote = (d: Record<string, string>): string =>
    [
      t("messageIntro"),
      "",
      t("sectionProject"),
      `${t("fieldProductType")}: ${d.product_type}`,
      `${t("fieldQuantity")}: ${d.quantity || "-"}`,
      `${t("fieldEnvironment")}: ${d.storage_environment}`,
      "",
      t("sectionLogistics"),
      `${t("fieldDestination")}: ${d.destination || "-"}`,
      `${t("fieldLeadTime")}: ${d.lead_time}`,
      `${t("fieldAssembly")}: ${d.installation_required === "yes" ? t("yes") : t("no")}`,
      "",
      t("sectionCompany"),
      `${t("fieldCompany")}: ${d.company || "-"}`,
      `${t("fieldBusinessEmail")}: ${d.email}`,
      `${t("fieldIndustry")}: ${d.industry_sector || "-"}`,
      `${t("fieldPhone")}: ${d.phone || "-"}`,
      "",
      `${t("fieldBrief")}:`,
      d.project_brief || "-",
    ].join("\n");

  /**
   * Same validation as the main submission: if a required field is invalid,
   * jump the wizard to that field's step and surface the native prompt.
   */
  const collectQuote = (
    form: HTMLFormElement | null
  ): Record<string, string> | null => {
    if (!form) return null;
    if (!form.checkValidity()) {
      const panel = form.querySelector(":invalid")?.closest("[data-quote-step]");
      const target = panel ? Number(panel.getAttribute("data-quote-step")) : step;
      if (target !== step) goToStep(target);
      window.setTimeout(() => form.reportValidity(), target !== step ? 450 : 0);
      return null;
    }
    const data = new FormData(form);
    data.set("storage_environment", environmentLabel(environment));
    return Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v)]));
  };

  const sendViaEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    const d = collectQuote(e.currentTarget.form);
    if (!d) return;
    const subject = t("emailSubject", {
      product: d.product_type,
      company: d.company || d.email,
    });
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
      data.set("storage_environment", environmentLabel(environment));
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

  return (
    <div
      ref={wrapRef}
      className="glass-card rounded-xl p-8 md:p-12 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]"
    >
      {/* Stepper */}
      <div className="flex items-center gap-4 mb-12">
        {STEP_KEYS.map((key, i) => (
          <div key={key} className="contents">
            {i > 0 && <div className="h-px bg-outline-variant flex-1" />}
            <div
              className={`flex items-center gap-2 ${
                step >= i + 1 ? "text-primary font-bold" : "text-on-surface-variant"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm ${
                  step >= i + 1
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {i + 1}
              </span>
              <span className="font-label-lg text-label-lg hidden md:block">
                {t(`steps.${key}`)}
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
            {t("successTitle")}
          </h3>
          <p className="text-on-surface-variant">{t("successMessage")}</p>
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
                  {t("productTypes")}
                </label>
                <select
                  className={inputClass}
                  id="quote-product-type"
                  name="product_type"
                >
                  {PRODUCT_TYPE_KEYS.map((key) => (
                    <option key={key}>{t(`productTypeOptions.${key}`)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-quantity"
                >
                  {t("quantity")}
                </label>
                <input
                  className={inputClass}
                  id="quote-quantity"
                  name="quantity"
                  placeholder={t("quantityPlaceholder")}
                  type="number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <span className="font-label-lg text-label-lg text-on-surface block">
                {t("environment")}
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ENVIRONMENT_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={environment === key}
                    onClick={() => setEnvironment(key)}
                    className={
                      environment === key
                        ? "border border-primary bg-primary-fixed-dim/20 text-primary px-4 py-3 rounded-lg text-label-lg transition-all hover:bg-primary-fixed-dim/40"
                        : "border border-outline text-on-surface-variant px-4 py-3 rounded-lg text-label-lg transition-all hover:border-primary"
                    }
                  >
                    {t(`environments.${key}`)}
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
                {t("nextLogistics")}
              </button>

              {/* Channel buttons — send the completed quote via the visitor's
                  email client or WhatsApp (same validation as the submit) */}
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <button
                  className={`${channelBtnClass} bg-primary text-on-primary hover:bg-primary-container shadow-primary/10`}
                  type="button"
                  onClick={sendViaEmail}
                >
                  {tc("sendViaEmail")}
                  <span className="material-symbols-outlined" aria-hidden>
                    mail
                  </span>
                </button>
                <button
                  className={`${channelBtnClass} bg-[#25D366] text-white hover:bg-[#1eb857] shadow-[#25D366]/20`}
                  type="button"
                  onClick={sendViaWhatsApp}
                >
                  {tc("sendViaWhatsApp")}
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
                  {t("destination")}
                </label>
                <input
                  className={inputClass}
                  id="quote-destination"
                  name="destination"
                  placeholder={t("destinationPlaceholder")}
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-lead-time"
                >
                  {t("leadTime")}
                </label>
                <select className={inputClass} id="quote-lead-time" name="lead_time">
                  {LEAD_TIME_KEYS.map((key) => (
                    <option key={key}>{t(`leadTimes.${key}`)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <span className="font-label-lg text-label-lg text-on-surface block">
                {t("installation")}
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
                    {t("installationLabel")}
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
                {t("back")}
              </button>
              <button
                className="flex-1 md:flex-none bg-primary text-on-primary px-10 py-4 rounded-lg font-label-lg text-label-lg hover:bg-primary-container transition-all"
                onClick={() => goToStep(3)}
                type="button"
              >
                {t("nextCompany")}
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
                  {t("companyName")}
                </label>
                <input
                  className={inputClass}
                  id="quote-company"
                  name="company"
                  placeholder={t("companyPlaceholder")}
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-email"
                >
                  {t("businessEmail")}
                </label>
                <input
                  className={inputClass}
                  id="quote-email"
                  name="email"
                  placeholder={t("businessEmailPlaceholder")}
                  type="email"
                  required
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-industry"
                >
                  {t("industrySector")}
                </label>
                <input
                  className={inputClass}
                  id="quote-industry"
                  name="industry_sector"
                  placeholder={t("industrySectorPlaceholder")}
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="quote-phone"
                >
                  {t("phone")}
                </label>
                <input
                  className={inputClass}
                  id="quote-phone"
                  name="phone"
                  placeholder={t("phonePlaceholder")}
                  type="tel"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="font-label-lg text-label-lg text-on-surface"
                htmlFor="quote-brief"
              >
                {t("brief")}
              </label>
              <textarea
                className={inputClass}
                id="quote-brief"
                name="project_brief"
                placeholder={t("briefPlaceholder")}
                rows={4}
              />
            </div>
            <div className="pt-4 flex gap-4">
              <button
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-label-lg text-label-lg hover:bg-primary/5 transition-all"
                onClick={() => goToStep(2)}
                type="button"
              >
                {t("back")}
              </button>
              <button
                className="flex-1 md:flex-none bg-primary text-on-primary px-12 py-4 rounded-lg font-label-lg text-label-lg hover:bg-primary-container transition-all shadow-xl shadow-primary/20 uppercase tracking-widest disabled:opacity-70"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? t("sending") : t("submit")}
              </button>
            </div>
            {status === "error" && (
              <p className="text-error text-sm">
                {formId ? t("errorConfigured") : t("errorNotConfigured")}{" "}
                {t("reachDirectly")}{" "}
                <a
                  className="underline font-semibold"
                  href={`mailto:${CONTACT.email}`}
                >
                  {CONTACT.email}
                </a>{" "}
                {t("or")}{" "}
                <a
                  className="underline font-semibold"
                  href={CONTACT.phoneMain.href}
                  dir="ltr"
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
