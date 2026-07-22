"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SocialIcon from "@/components/ui/SocialIcon";
import { WHATSAPP_HREF, resolveContact, type ResolvedContact } from "@/lib/nav";
import { trackWhatsapp } from "@/lib/googleAds";
import PhoneLink from "@/components/tracking/PhoneLink";

const formId = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID;
const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const whatsappBase = envNumber ? `https://wa.me/${envNumber}` : WHATSAPP_HREF;

type Status = "idle" | "loading" | "success" | "error";

const INQUIRY_KEYS = ["warehouse", "pallets", "coldChain", "bulk", "support"] as const;

const inputClass =
  "w-full h-12 px-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md form-input-focus transition-all";

/** Shared sizing/typography for the two channel buttons (mirrors the submit button). */
const channelBtnClass =
  "h-14 rounded-lg font-label-md text-label-md active:scale-95 transition-all industrial-shadow whitespace-nowrap flex items-center justify-center gap-3 w-full sm:flex-1";

/** Reads the form into a plain object after the same native validation the submit uses. */
function collectForm(form: HTMLFormElement | null): Record<string, string> | null {
  if (!form || !form.reportValidity()) return null;
  const data = new FormData(form);
  return Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v)]));
}

/**
 * Contact inquiry form (from legacy contact.html). "Send Inquiry" posts
 * FormData to Formspree; the two channel buttons above the consent row
 * send the same validated data via the visitor's email client or WhatsApp.
 */
export default function ContactForm({
  contact = resolveContact(),
}: {
  /** Resolved contact info (CMS override applied) — passed from the
   *  server-rendered parent page since CMS reads are server-only. */
  contact?: ResolvedContact;
}) {
  const t = useTranslations("contactForm");
  const tc = useTranslations("common");
  const [status, setStatus] = useState<Status>("idle");

  /** Formats the inquiry as readable multi-line text for email/WhatsApp bodies. */
  const formatInquiry = (d: Record<string, string>): string =>
    [
      t("messageIntro"),
      "",
      `${t("fieldName")}: ${d.name}`,
      `${t("fieldEmail")}: ${d.email}`,
      `${t("fieldCompany")}: ${d.company || "-"}`,
      `${t("fieldInquiryType")}: ${d.inquiry_type}`,
      "",
      `${t("fieldProjectDetails")}:`,
      d.message || "-",
    ].join("\n");

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
    const subject = t("emailSubject", { type: d.inquiry_type, name: d.name });
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(formatInquiry(d))}`;
  };

  const sendViaWhatsApp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const d = collectForm(e.currentTarget.form);
    if (!d) return;
    trackWhatsapp();
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
          {t("fullName")}
        </label>
        <input
          className={inputClass}
          id="contact-name"
          name="name"
          placeholder={t("fullNamePlaceholder")}
          type="text"
          required
        />
      </div>
      <div className="space-y-2">
        <label
          className="font-label-md text-label-md text-on-surface-variant block"
          htmlFor="contact-email"
        >
          {t("email")}
        </label>
        <input
          className={inputClass}
          id="contact-email"
          name="email"
          placeholder={t("emailPlaceholder")}
          type="email"
          required
          dir="ltr"
        />
      </div>
      <div className="space-y-2">
        <label
          className="font-label-md text-label-md text-on-surface-variant block"
          htmlFor="contact-company"
        >
          {t("company")}
        </label>
        <input
          className={inputClass}
          id="contact-company"
          name="company"
          placeholder={t("companyPlaceholder")}
          type="text"
        />
      </div>
      <div className="space-y-2">
        <label
          className="font-label-md text-label-md text-on-surface-variant block"
          htmlFor="contact-inquiry"
        >
          {t("inquiryType")}
        </label>
        <select
          className={`${inputClass} appearance-none`}
          id="contact-inquiry"
          name="inquiry_type"
        >
          {INQUIRY_KEYS.map((key) => (
            <option key={key}>{t(`inquiryTypes.${key}`)}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2 space-y-2">
        <label
          className="font-label-md text-label-md text-on-surface-variant block"
          htmlFor="contact-message"
        >
          {t("message")}
        </label>
        <textarea
          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md form-input-focus transition-all"
          id="contact-message"
          name="message"
          placeholder={t("messagePlaceholder")}
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
          {tc("sendViaEmail")}
          <span className="material-symbols-outlined" aria-hidden>
            mail
          </span>
        </button>
        <button
          className={`${channelBtnClass} bg-[#25D366] text-white hover:bg-[#1eb857]`}
          type="button"
          onClick={sendViaWhatsApp}
        >
          {tc("sendViaWhatsApp")}
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
            {t("terms")}
          </label>
        </div>
      </div>
      {status === "error" && (
        <p className="md:col-span-2 text-error text-sm">
          {formId ? t("errorConfigured") : t("errorNotConfigured")}{" "}
          {t("reachDirectly")}{" "}
          <a className="underline font-semibold" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>{" "}
          {t("or")}{" "}
          <PhoneLink
            className="underline font-semibold"
            href={contact.phoneMain.href}
            dir="ltr"
          >
            {contact.phoneMain.display}
          </PhoneLink>
          .
        </p>
      )}
      {status === "success" && (
        <p className="md:col-span-2 text-primary text-sm font-semibold">
          {t("successMessage")}
        </p>
      )}
    </form>
  );
}
