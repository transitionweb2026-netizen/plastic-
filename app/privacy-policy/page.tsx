import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Giant Storage Integrated Solutions collects, uses, and protects your information.",
};

/**
 * TODO: replace this placeholder with counsel-approved privacy policy text
 * before launch. The page exists so the footer legal links never 404.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet py-24">
      <h1 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-background mb-6">
        Privacy Policy
      </h1>
      <div className="space-y-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        <p>
          Giant Storage Integrated Solutions respects your privacy. Information
          submitted through our contact and quote forms — such as your name,
          email address, company, and phone number — is used solely to respond
          to your inquiry and is never sold or shared with third parties for
          marketing purposes.
        </p>
        <p>
          The full privacy policy is being finalized. In the meantime, if you
          have any questions about how your data is handled, contact us at{" "}
          <a
            className="text-primary font-semibold hover:underline"
            href={`mailto:${CONTACT.email}`}
          >
            {CONTACT.email}
          </a>{" "}
          or call{" "}
          <a
            className="text-primary font-semibold hover:underline"
            href={CONTACT.phoneMain.href}
          >
            {CONTACT.phoneMain.display}
          </a>
          .
        </p>
        <p>
          <Link className="text-primary font-semibold hover:underline" href="/contact">
            Contact us →
          </Link>
        </p>
      </div>
    </div>
  );
}
