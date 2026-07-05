import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing the use of the Giant Storage Integrated Solutions website and services.",
};

/**
 * TODO: replace this placeholder with counsel-approved terms text before
 * launch. The page exists so the footer legal links never 404.
 */
export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet py-24">
      <h1 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-background mb-6">
        Terms of Service
      </h1>
      <div className="space-y-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        <p>
          By using the Giant Storage Integrated Solutions website you agree to
          use its content for legitimate business inquiry purposes. Product
          specifications shown are indicative and confirmed in formal
          quotations; quotes issued through this site are non-binding until
          countersigned by both parties.
        </p>
        <p>
          The complete terms of service are being finalized. For questions
          regarding orders, warranties, or commercial terms, contact us at{" "}
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
