"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackWhatsapp } from "@/lib/googleAds";

type WhatsAppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

/**
 * Drop-in replacement for a plain `<a href={waLink} target="_blank">` —
 * renders identically but fires the Google Ads/GA4 WhatsApp-click event
 * first. Exists so Server Components can render a tracked WhatsApp link
 * without becoming Client Components themselves. Always opens in a new
 * tab, so (unlike PhoneLink) there's no need to gate the navigation behind
 * the tracking call — see lib/googleAds.ts's trackWhatsapp().
 */
export default function WhatsAppLink({
  href,
  target = "_blank",
  rel = "noopener noreferrer",
  onClick,
  children,
  ...rest
}: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={(e) => {
        onClick?.(e);
        trackWhatsapp();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
