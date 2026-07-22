/**
 * Google Ads conversion tracking — single source of truth for the account
 * ID and every trackable interaction (phone calls, WhatsApp clicks, quote/
 * appointment CTAs). Pure functions only, safe to import from both Server
 * and Client Components: every export checks for `window`/`gtag` first and
 * no-ops if either is missing, so nothing ever throws during SSR/SSG.
 *
 * gtag.js itself is loaded once, in app/[locale]/layout.tsx, via
 * next/script with strategy="afterInteractive" — this module never injects
 * scripts, it only calls the `gtag` function that script defines.
 */

export const GOOGLE_ADS_ID = "AW-18327446684";

type ConversionKey = "phoneCall" | "whatsapp" | "bookAppointment";

/**
 * send_to target per tracked interaction. Only "phoneCall" was given an
 * actual Google Ads conversion action so far. The others fire as plain
 * gtag events (still visible in GA4/Ads as events, usable for audiences)
 * until their own conversion actions exist in the Google Ads account —
 * fill in their send_to string here once they do, and trackWhatsapp() /
 * trackBookAppointment() start reporting real conversions with no other
 * code changes anywhere in the app.
 */
const CONVERSIONS: Record<ConversionKey, string | undefined> = {
  phoneCall: "AW-18327446684/fUNsCJjA5tQcEJzJmqNE",
  whatsapp: undefined,
  bookAppointment: undefined,
};

/** Fallback plain-event name used for a key while it has no send_to yet. */
const FALLBACK_EVENT_NAME: Record<ConversionKey, string> = {
  phoneCall: "phone_call_click",
  whatsapp: "whatsapp_click",
  bookAppointment: "book_appointment_click",
};

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

function hasGtag(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

function fireConversion(key: ConversionKey, eventCallback?: () => void): void {
  if (!hasGtag()) {
    eventCallback?.();
    return;
  }
  const sendTo = CONVERSIONS[key];
  window.gtag!("event", sendTo ? "conversion" : FALLBACK_EVENT_NAME[key], {
    ...(sendTo ? { send_to: sendTo } : {}),
    ...(eventCallback ? { event_callback: eventCallback } : {}),
  });
}

/**
 * Tracks a phone-call click and only THEN navigates to the tel: link —
 * via gtag's own event_callback, or a 1s safety timeout if gtag is slow,
 * blocked (ad blockers), or never loaded. Callers must preventDefault()
 * the click and pass the link's href; this function performs the actual
 * navigation. Gating navigation matters here specifically because tel:
 * links replace the current tab/app, which can otherwise cancel the
 * in-flight conversion beacon before it sends.
 */
export function trackPhoneCall(href: string): void {
  if (typeof window === "undefined") return;
  let navigated = false;
  const go = () => {
    if (navigated) return;
    navigated = true;
    window.location.href = href;
  };
  fireConversion("phoneCall", go);
  window.setTimeout(go, 1000);
}

/**
 * Tracks a WhatsApp click. Fire-and-forget: WhatsApp links always open in
 * a new tab (target="_blank"), so the current page/tab is never at risk of
 * unloading before the beacon sends — no need to gate the click behind a
 * callback the way trackPhoneCall does.
 */
export function trackWhatsapp(): void {
  fireConversion("whatsapp");
}

/**
 * Tracks a "Book Appointment" click — this project's equivalent is its
 * Request a Quote CTA, the site's primary lead-gen action. Fire-and-forget:
 * these are same-origin Next.js <Link> transitions (client-side routing),
 * not full page unloads, so there's no navigation race to guard against.
 */
export function trackBookAppointment(): void {
  fireConversion("bookAppointment");
}
