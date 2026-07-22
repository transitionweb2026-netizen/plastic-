"use client";

import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { trackBookAppointment } from "@/lib/googleAds";

type BookAppointmentLinkProps = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for the locale-aware `<Link href="/request-quote">`
 * used for this site's "Book Appointment" equivalent (Request a Quote) —
 * renders identically but fires the Google Ads tracking event first. Exists
 * so Server Components (e.g. the About page's CTA banner) can render a
 * tracked link without becoming Client Components themselves.
 */
export default function BookAppointmentLink({ onClick, children, ...rest }: BookAppointmentLinkProps) {
  return (
    <Link
      onClick={(e) => {
        onClick?.(e);
        trackBookAppointment();
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
