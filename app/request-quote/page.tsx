import type { Metadata } from "next";
import Image from "next/image";
import QuoteForm from "@/components/forms/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Custom Industrial Quote Request for high-scale storage solutions. Provide your project specifications to receive a comprehensive technical proposal within 24 hours.",
};

const SPOTLIGHT_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCu-r1AtSl49qnI-a6NpF3tIMe9S-lR-_cjAB-1B1UFjSmtwMjuChO8r_vHNeznJ12flZiGZ4SxWZ8hD6TGOulSfBizqWR9qxtIJY52SlcUX1Mbk_7JJGm5n7rwbflv7mWhPhh6LBAqkdIc70TCCcuCPfd_hvvH2WiPZLU-qSWh2krADab1dLpe8oZl16qEn98rf1MTStEiM_YPxBIJSdPGtm31NnmvEbgU0j7AymSOMtp4_TySD5AhRTnoUwHxZpWeQNr9Ri9ZfAg";

const WHY_ITEMS = [
  {
    icon: "verified",
    title: "ISO 9001 Certified",
    desc: "Highest manufacturing standards for seismic and heavy-duty load capacities.",
  },
  {
    icon: "public",
    title: "Global Distribution",
    desc: "Strategic manufacturing hubs in 4 continents ensuring rapid deployment.",
  },
  {
    icon: "engineering",
    title: "Expert Consultation",
    desc: "Free CAD design and facility optimization analysis included with every quote.",
  },
];

export default function RequestQuotePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-16 pb-8 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
        <span aria-hidden className="material-symbols-outlined decor-icon absolute top-6 right-10 hidden lg:block">request_quote</span>
        <div aria-hidden className="decor-corner-tl absolute top-8 left-2 hidden md:block" />
        <div className="max-w-3xl">
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary mb-4">
            Custom Industrial Quote Request
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Tailored logistics solutions for global infrastructure. Provide your
            project specifications below to receive a comprehensive technical
            proposal within 24 hours.
          </p>
        </div>
      </section>

      {/* Form + aside */}
      <section className="relative px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto pb-32">
        <div aria-hidden className="decor-orb absolute -right-24 top-16 w-80 h-80 hidden xl:block" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 blueprint-grid [mask-image:linear-gradient(to_top,black,transparent)]" />
        <div aria-hidden className="decor-corner-br absolute bottom-10 right-2 hidden md:block" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-8">
            <QuoteForm />
          </div>

          <aside className="lg:col-span-4 space-y-gutter">
            <div className="bg-surface-container-low rounded-xl p-8 space-y-6">
              <h3 className="font-headline-md text-headline-md text-primary">
                Why Giant Storage?
              </h3>
              <ul className="space-y-4">
                {WHY_ITEMS.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="material-symbols-outlined text-secondary shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-label-lg text-label-lg text-on-surface">
                        {item.title}
                      </p>
                      <p className="text-on-surface-variant text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-video group">
              <Image
                className="object-cover"
                src={SPOTLIGHT_IMG}
                alt="Modern industrial warehouse interior with automated shelving systems"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-all" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-label-sm font-bold text-primary mb-1">
                  PROJECT SPOTLIGHT
                </p>
                <p className="text-sm font-medium">
                  1.2M Sq Ft Logistic Hub, Singapore
                </p>
              </div>
            </div>

            <div className="border-l-4 border-primary p-6 bg-surface-container-high/50 italic text-on-surface-variant">
              &quot;The technical precision provided in the initial quote phase
              was the deciding factor. Giant Storage understood our unique
              seismic requirements for our Tokyo facility better than anyone
              else.&quot;
              <p className="not-italic font-bold text-on-surface mt-4 text-sm">
                — Director of Operations, TechLogistics APAC
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
