import { getTranslations } from "next-intl/server";
import { WHATSAPP_HREF, resolveContact } from "@/lib/nav";
import { siteContactOverride } from "@/lib/cms/content-overlay";

const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const whatsappHref = envNumber ? `https://wa.me/${envNumber}` : WHATSAPP_HREF;

/**
 * Floating contact rail — fixed to the inline-end edge (right in LTR,
 * mirrored left in RTL via globals.css), vertically centered.
 * Two circular actions: phone call (main office) and WhatsApp chat.
 */
export default async function FloatingContactWidget() {
  const t = await getTranslations("widget");
  const CONTACT = resolveContact(siteContactOverride());
  return (
    <div className="fcw" aria-label={t("quickContact")}>
      <a
        href={CONTACT.phoneMain.href}
        className="fcw-btn fcw-btn-phone"
        aria-label={t("callAria", { phone: CONTACT.phoneMain.display })}
        title={t("callTitle", { phone: CONTACT.phoneMain.display })}
      >
        <span
          className="material-symbols-outlined fcw-icon"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden="true"
        >
          call
        </span>
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fcw-btn fcw-btn-whatsapp"
        aria-label={t("whatsappAria")}
        title={t("whatsappTitle")}
      >
        {/* WhatsApp glyph (inline SVG — Material Symbols has no WhatsApp icon) */}
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          aria-hidden="true"
          className="fcw-icon"
        >
          <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.59 4.46 1.72 6.4L3.2 28.8l6.58-1.72a12.75 12.75 0 0 0 6.22 1.59h.01c7.06 0 12.79-5.74 12.79-12.8 0-3.42-1.33-6.63-3.75-9.05a12.72 12.72 0 0 0-9.05-3.62zm0 23.36h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.02 1.05 1.07-3.92-.25-.4a10.55 10.55 0 0 1-1.63-5.66c0-5.87 4.78-10.64 10.65-10.64 2.84 0 5.51 1.11 7.52 3.12a10.57 10.57 0 0 1 3.11 7.53c0 5.87-4.78 10.63-10.65 10.63zm5.84-7.97c-.32-.16-1.89-.93-2.19-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.82.67.76.24 1.46.21 2.01.13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </a>
    </div>
  );
}
