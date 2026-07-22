"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackPhoneCall } from "@/lib/googleAds";

type PhoneLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

/**
 * Drop-in replacement for a plain `<a href="tel:...">` — renders identically
 * (every prop passes straight through) but fires the Google Ads phone-call
 * conversion before the dialer opens. Exists so Server Components (Footer,
 * FloatingContactWidget, the home/contact/legal pages) can render a tracked
 * phone link without becoming Client Components themselves — this is the
 * one interactive leaf they delegate to.
 */
export default function PhoneLink({ href, onClick, children, ...rest }: PhoneLinkProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        trackPhoneCall(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
