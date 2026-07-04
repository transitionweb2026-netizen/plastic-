import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/forms/ContactForm";
import { CONTACT } from "@/lib/nav";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Us | Giant Storage Integrated Solutions",
  },
  description:
    "Connect with Giant Storage's Cairo-based engineering team — technical inquiries, warehouse automation, cold chain logistics, and bulk storage consultations.",
};

const MAP_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAgvTljDfpm5vdwOxt5YpPXyz6xER5qgSXF6dDaZ79iz-kz7ePQWF_O8kBSsiZvZ5OFdhGSvxBxG5aL2jR4b93DZHeib8J-x2Tx73QsZaLg82vrG6jo3uhxePwjmpTQeDEQRBB62pAn44sbNE6fy9q4xvuCnw-RCv26idq29XO6h8Y9juWS5zL8gRmMj-UpPF0p8G2Gfje6xenL-DRx84Oe_76rIdWqYztjDLZWIjR-QZIaUg_QgGEC9nNeKx1ziUAEJ60BYYG8krCO";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  CONTACT.address
)}`;

export default function ContactPage() {
  return (
    <div className="pt-6 pb-20">
      {/* Hero */}
      <section className="px-4 md:px-margin-desktop mb-20">
        <div className="max-w-4xl">
          <span className="text-primary font-label-md text-label-md tracking-widest uppercase mb-4 block">
            Connect with our Experts
          </span>
          <h1 className="font-display-lg text-4xl md:text-display-lg text-on-surface mb-6 leading-tight">
            Global Storage Solutions, <br />
            <span className="text-primary">Local Support.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Whether you&apos;re streamlining a pharmaceutical warehouse or
            optimizing heavy industrial logistics, our Cairo-based team is ready
            to engineer your efficiency.
          </p>
        </div>
      </section>

      {/* Bento grid */}
      <section className="px-4 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Info cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 industrial-shadow hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary">
                location_on
              </span>
            </div>
            <h3 className="font-headline-md text-xl mb-2">Regional HQ</h3>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              22 El Tayaran St., Nasr City,
              <br />
              Cairo, Egypt
            </p>
            <a
              className="text-primary font-label-md text-label-md flex items-center gap-2 hover:underline"
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 industrial-shadow hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary">call</span>
            </div>
            <h3 className="font-headline-md text-xl mb-2">Direct Lines</h3>
            <div className="space-y-2">
              <p className="text-on-surface-variant flex flex-wrap items-center justify-between gap-1">
                <span>Main Office</span>
                <a className="font-bold text-primary" href={CONTACT.phoneMain.href}>
                  {CONTACT.phoneMain.display}
                </a>
              </p>
              <p className="text-on-surface-variant flex flex-wrap items-center justify-between gap-1">
                <span>Logistics Dept.</span>
                <a
                  className="font-bold text-primary"
                  href={CONTACT.phoneLogistics.href}
                >
                  {CONTACT.phoneLogistics.display}
                </a>
              </p>
            </div>
          </div>

          <div className="bg-primary-container text-on-primary p-6 rounded-xl industrial-shadow">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-white">
                schedule
              </span>
            </div>
            <h3 className="font-headline-md text-xl mb-4 text-white">
              Business Hours
            </h3>
            <ul className="space-y-3 font-label-md text-label-md">
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span>Sun — Thu</span>
                <span>08:00 — 18:00</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span>Saturday</span>
                <span>10:00 — 14:00</span>
              </li>
              <li className="flex justify-between text-white/60">
                <span>Friday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Inquiry form */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 md:p-12 rounded-xl border border-outline-variant/30 industrial-shadow">
          <div className="mb-12">
            <h3 className="font-headline-lg text-headline-lg mb-2">
              Technical Inquiry
            </h3>
            <p className="text-on-surface-variant">
              Fill out the form below and an engineering consultant will contact
              you within 24 business hours.
            </p>
          </div>
          <ContactForm />
        </div>

        {/* Map */}
        <div className="lg:col-span-12 h-[450px] relative rounded-xl overflow-hidden industrial-shadow border border-outline-variant/30">
          <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center z-0">
            <span className="material-symbols-outlined text-primary/20 text-6xl">
              map
            </span>
          </div>
          <div className="absolute inset-0 z-10">
            <Image
              src={MAP_IMG}
              alt="Stylized map of Nasr City, Cairo, marking Giant Storage's headquarters at 22 El Tayaran Street"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute bottom-6 left-6 z-20 hidden md:block max-w-xs glass-panel p-6 rounded-xl border border-white/40 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary">
                location_on
              </span>
              <h4 className="font-headline-md text-primary text-lg">
                Main Logistics Hub
              </h4>
            </div>
            <p className="text-on-surface-variant text-sm mb-4">
              Strategic location for rapid deployment across the MENA region.
            </p>
            {/* Legacy button had no handler — now a real maps link */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 bg-primary/10 text-primary font-label-md text-label-md rounded hover:bg-primary/20 transition-colors text-center"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
