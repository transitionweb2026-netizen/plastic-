import Link from "next/link";
import SocialIcon from "@/components/ui/SocialIcon";
import { CONTACT, SOCIAL_LINKS } from "@/lib/nav";

/**
 * Canonical site footer: home.html's 4-column layout and styling, with the
 * placeholder href="#" sitemap replaced by the real link set from the legacy
 * about-us footer. Contact info is standardized and uses tel:/mailto: links.
 */
export default function Footer() {
  return (
    <footer className="bg-surface-container-highest text-on-surface border-t border-outline-variant relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern-light opacity-30 pointer-events-none" />

      <div className="relative w-full py-16 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="col-span-1">
          <h3 className="font-headline-md text-headline-md font-black text-primary mb-6">
            GIANT STORAGE
          </h3>
          <p className="font-body-md text-body-md mb-8 opacity-80">
            Innovative plastic solutions for the world&apos;s most demanding
            logistics challenges. Precision engineered in Egypt.
          </p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                className="footer-social w-10 h-10 border border-outline rounded-full flex items-center justify-center hover:bg-primary hover:text-on-primary hover:border-primary"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                <SocialIcon brand={s.brand} size={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <h4 className="font-label-lg text-label-lg font-bold mb-6 uppercase">
            Products
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md nav-link"
                href="/products"
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md nav-link"
                href="/products?category=pallets"
              >
                Pallets &amp; Crates
              </Link>
            </li>
            <li>
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md nav-link"
                href="/products?category=bins"
              >
                Bins &amp; Containers
              </Link>
            </li>
            <li>
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md nav-link"
                href="/request-quote"
              >
                Custom Molding
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="font-label-lg text-label-lg font-bold mb-6 uppercase">
            Company
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md nav-link"
                href="/industries"
              >
                Industries
              </Link>
            </li>
            <li>
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md nav-link"
                href="/blog"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md nav-link"
                href="/about"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md nav-link"
                href="/contact"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="font-label-lg text-label-lg font-bold mb-6 uppercase">
            Contact Headquarters
          </h4>
          <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary" aria-hidden>
                location_on
              </span>
              <span>{CONTACT.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" aria-hidden>
                call
              </span>
              <a
                className="hover:text-primary transition-colors"
                href={CONTACT.phoneMain.href}
              >
                {CONTACT.phoneMain.display}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" aria-hidden>
                mail
              </span>
              <a
                className="hover:text-primary transition-colors"
                href={`mailto:${CONTACT.email}`}
              >
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar — "Model 7" reference: primary-green band, credit lockup
          left, legal links right, dot texture fading in from the right. */}
      <div className="relative bg-primary text-on-primary overflow-hidden">
        <div className="fbar-dots" aria-hidden />
        <div className="relative py-7 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
            <p className="font-body-md text-body-md">
              © {new Date().getFullYear()} Giant Storage Integrated Solutions.
              All rights reserved.
            </p>
            {/* TODO: point the credit at the agency's site when a URL is available. */}
            <span className="fbar-credit">
              <span className="font-body-md text-body-md opacity-90">
                Created by
              </span>
              <span className="fbar-t-badge" aria-hidden>
                T
              </span>
              <span className="text-[17px] font-bold tracking-tight">
                Transition
              </span>
            </span>
          </div>

          <nav
            aria-label="Legal"
            className="flex items-center justify-center flex-wrap gap-x-0 gap-y-2"
          >
            <Link
              className="fbar-link font-body-md text-body-md px-5 first:pl-0"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
            <span className="h-4 w-px bg-white/25" aria-hidden />
            <Link
              className="fbar-link font-body-md text-body-md px-5"
              href="/terms-of-service"
            >
              Terms of Service
            </Link>
            <span className="h-4 w-px bg-white/25" aria-hidden />
            <Link
              className="fbar-link font-body-md text-body-md px-5 last:pr-0"
              href="/contact"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
