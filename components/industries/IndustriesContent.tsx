"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RevealObserver from "@/components/ui/RevealObserver";
import IndustryModal from "./IndustryModal";
import { INDUSTRY_MODALS } from "@/lib/industries";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD9tA-rr56TAmeLUnSIaFKlqLG4WOQHKeKl--QJeyBeW4FocUP0_70tEj7xLqMSxysGDlXeHbbhUEYKgQDUx4Bobd1-tTTOPJbQ-sBlHT8xEeBEuI246As9lEE9_tN8TpHTJADF-JYWyVqKw8d_Y9FUF9rfzQdccymjHv0TkPA9KCAip3cT_w1e5ZaTtgmlFM5xlQ17smw7Xjp3FFIyb6tOk2YOJGs4PnucZmYwhk3bSsUt8q0LPvZ0eKBY8BA4-mxFCSsjFeZyefM";

const TECH_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9xG4AOLYtNF6EeqxOIyGlrwnGXVZUlh95ADhGQ5AGSP8iESn5u-6v9g6KADSN3RpjfF6GSiDeK_wNYUVdHIn8wKBxZo_D4u9W7UgkZA4jTj8gm6koZL_FxEZ09iCcpCZPIXctcf8iSUoqEetfgp8MdJ_j2BULAwR3iDzEF6mOP0MVLDYrXY-U0epKLARtpzAZ9k7HEDlc-6_7ehjbIBA8VuQ5uUQMbtKDSe1MNKu1hOQNMOmYz0K1x0EiDW25D-yKgCj4LWADIk";

const STATS = [
  { num: "22", suffix: "+", label: "Years in Industry" },
  { num: "600K", suffix: "+", label: "Units Produced" },
  { num: "150", suffix: "+", label: "Products Available" },
  { num: "5", suffix: "", label: "Export Continents" },
];

const PROCESS_STEPS = [
  {
    id: "step1",
    num: "01",
    delay: "d1",
    title: "Design & Engineering",
    desc: "Custom structural modeling using advanced FEA stress-test simulation software.",
  },
  {
    id: "step2",
    num: "02",
    delay: "d2",
    title: "Raw Material Selection",
    desc: "High-density polymers sourced globally for maximum durability.",
  },
  {
    id: "step3",
    num: "03",
    delay: "d3",
    title: "Injection Molding",
    desc: "Precision high-pressure molding using our 3000-ton press fleet.",
  },
  {
    id: "step4",
    num: "04",
    delay: "d4",
    title: "Quality Control",
    desc: "Individual unit testing for weight capacity, impact resistance, and tolerance.",
  },
  {
    id: "step5",
    num: "05",
    delay: "d5",
    title: "Export Preparation",
    desc: "Optimized palletization and global tracking for seamless international shipping.",
  },
];

const INDUSTRY_CARDS = [
  {
    id: "ind1",
    delay: "d1",
    icon: "directions_car",
    title: "Automotive Manufacturing",
    desc: "VDA-compliant returnable containers and kanban systems for OEM and tier-1 suppliers.",
    tags: ["VDA 4500", "JIT Kanban", "OEM Grade"],
  },
  {
    id: "ind2",
    delay: "d2",
    icon: "science",
    title: "Pharmaceutical & Life Sciences",
    desc: "GDP-validated cold-chain shippers and GMP-certified storage containers for the pharma supply chain.",
    tags: ["GDP Compliant", "GMP Certified", "Cold Chain"],
  },
  {
    id: "ind3",
    delay: "d3",
    icon: "restaurant",
    title: "Food & Beverage",
    desc: "FDA-approved, HACCP-compliant food-contact containers with antimicrobial treatment options.",
    tags: ["FDA Approved", "HACCP", "Washable"],
  },
  {
    id: "ind4",
    delay: "d4",
    icon: "local_shipping",
    title: "Logistics & E-Commerce",
    desc: "RFID-ready totes and precision-toleranced containers for automated fulfillment and sortation systems.",
    tags: ["RFID Ready", "Robotic Grade", "200+ Trips"],
  },
  {
    id: "ind5",
    delay: "d5",
    icon: "grass",
    title: "Agriculture & Fresh Produce",
    desc: "Ultra-lightweight harvest crates and ventilated field bins rated for 10+ seasons of outdoor use.",
    tags: ["UV Stabilized", "32% Ventilation", "Export Grade"],
  },
  {
    id: "ind6",
    delay: "d6",
    icon: "memory",
    title: "Electronics & Technology",
    desc: "IEC 61340-5-1 certified ESD containers and cleanroom totes for sensitive component handling.",
    tags: ["ESD Safe", "IEC 61340", "Cleanroom"],
  },
];

const TECH_ITEMS = [
  {
    id: "tech1",
    icon: "smart_toy",
    iconBg: "bg-primary",
    title: "AI-Driven Robotics",
    desc: "14 collaborative arms with 0.01mm AI vision precision enabling 24/7 unmanned production.",
  },
  {
    id: "tech2",
    icon: "precision_manufacturing",
    iconBg: "bg-secondary",
    title: "5-Axis CNC Machining",
    desc: "In-house tool room with ±0.005mm tolerance, cutting mold repair time to under 72 hours.",
  },
  {
    id: "tech3",
    icon: "settings_input_component",
    iconBg: "",
    title: "High-Precision Molding",
    desc: "Climate-controlled bays at ±1°C preventing material warp, with 18% faster cycle times.",
  },
];

const CERTS = [
  {
    id: "cert1",
    delay: "d1",
    icon: "verified",
    title: "ISO 9001:2015",
    subtitle: "Quality Management",
    desc: "International benchmark for quality management systems across all production stages.",
  },
  {
    id: "cert2",
    delay: "d2",
    icon: "eco",
    title: "ISO 14001",
    subtitle: "Environmental Standard",
    desc: "Systematic environmental management with year-on-year carbon reduction targets.",
  },
  {
    id: "cert3",
    delay: "d3",
    icon: "health_and_safety",
    title: "OHSAS 18001",
    subtitle: "Health & Safety",
    desc: "7+ consecutive years zero Lost Time Injury record across 14,000m² facility.",
  },
  {
    id: "cert4",
    delay: "d4",
    icon: "public",
    title: "CE Compliant",
    subtitle: "European Quality",
    desc: "Full EU market access with RoHS and REACH SVHC compliance documentation.",
  },
];

/** Legacy proc-card images keyed by step id (same order as the IMGS constant). */
const STEP_IMAGES: Record<string, string> = Object.fromEntries(
  PROCESS_STEPS.map((s) => [s.id, INDUSTRY_MODALS[s.id].image])
);

export default function IndustriesContent() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="page-industries">
      <RevealObserver />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="hero-img relative w-full h-full">
            <Image
              src={HERO_IMG}
              alt="Giant Storage facility"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>
        <div className="absolute top-20 right-[15%] w-24 h-24 border-2 border-primary/20 rounded-full animate-float-slow hidden lg:block" />
        <div
          className="absolute bottom-24 right-[30%] w-16 h-16 border border-primary/15 rounded-xl rotate-12 animate-float hidden lg:block"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 right-[20%] w-8 h-8 bg-primary/10 rounded-full animate-float-slow hidden lg:block"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto py-24">
          <div className="max-w-2xl">
            <span
              className="hero-badge inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-6"
              style={{ animationDelay: ".1s" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                location_on
              </span>
              Excellence in Cairo, Egypt
            </span>
            <h1
              className="hero-badge font-black text-[38px] md:text-[56px] leading-tight mb-6 text-on-background"
              style={{ animationDelay: ".25s", letterSpacing: "-.02em" }}
            >
              State-of-the-Art
              <br />
              <span className="text-primary">Production Facility</span>
            </h1>
            <p
              className="hero-badge font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg"
              style={{ animationDelay: ".4s" }}
            >
              Discover the epicentre of industrial precision. Our Egyptian
              facility combines global engineering standards with local
              logistical advantages to deliver world-class storage solutions.
            </p>
            <div className="hero-badge flex flex-wrap gap-4" style={{ animationDelay: ".55s" }}>
              <Link href="/products" className="btn-hero-primary">
                Explore Products
                <span className="material-symbols-outlined btn-arrow" style={{ fontSize: 18 }}>
                  arrow_forward
                </span>
              </Link>
              <Link href="/contact" className="btn-hero-outline">
                Contact Us
                <span className="material-symbols-outlined btn-arrow" style={{ fontSize: 18 }}>
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          <div className="absolute right-8 bottom-12 hidden xl:flex flex-col gap-3">
            <div className="glass-badge">22+ Years Experience</div>
            <div className="glass-badge">600K+ Units Exported</div>
            <div className="glass-badge">ISO 9001:2015 Certified</div>
          </div>
        </div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section className="bg-primary">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`stat-item ${
                  i < STATS.length - 1 ? "border-r border-white/20" : ""
                }`}
              >
                <div className="stat-num text-white">
                  {stat.num}
                  {stat.suffix && <span className="text-white/70">{stat.suffix}</span>}
                </div>
                <div className="stat-lbl text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS STEPS ═══ */}
      <section className="py-24 bg-surface" id="manufacturing">
        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 reveal">
                Manufacturing Process
              </p>
              <h2 className="font-headline-xl text-headline-xl reveal d1">
                Integrated Production Workflow
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-4 reveal d2">
                Every Giant Storage product undergoes a rigorous 5-stage
                manufacturing cycle, ensuring structural integrity and precision
                at scale. Click any stage to explore details.
              </p>
            </div>
            <div className="sep w-full md:w-64 reveal d3">
              <div className="sep-dot" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {PROCESS_STEPS.map((step) => (
              <button
                key={step.id}
                type="button"
                className={`proc-card reveal ${step.delay} text-left`}
                onClick={() => setOpenId(step.id)}
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Image
                    className="card-img object-cover"
                    src={STEP_IMAGES[step.id]}
                    alt={step.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="card-overlay absolute inset-0 bg-primary/30 flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      View Details
                    </span>
                  </div>
                  <span className="step-num absolute top-3 left-4">{step.num}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-headline-md text-headline-md mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                    {step.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INDUSTRIES WE SERVE ═══ */}
      <section className="py-24 bg-surface-container-low" id="industries">
        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 reveal">
              Industries We Serve
            </p>
            <h2 className="font-headline-xl text-headline-xl reveal d1">
              Built for Every Sector
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-2xl mx-auto reveal d2">
              From automotive JIT lines to pharmaceutical cold chains, our
              solutions are engineered for your industry&apos;s unique
              requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRY_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                className={`ind-card reveal ${card.delay} text-left`}
                onClick={() => setOpenId(card.id)}
              >
                <div className="ind-icon-wrap">
                  <span className="material-symbols-outlined text-on-primary text-2xl">
                    {card.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant">{card.desc}</p>
                </div>
                <div className="flex gap-2 flex-wrap mt-1">
                  {card.tags.map((tag) => (
                    <span key={tag} className="app-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-primary text-sm font-bold mt-1">
                  Learn More{" "}
                  <span className="material-symbols-outlined ind-arrow" style={{ fontSize: 16 }}>
                    arrow_forward
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-12 text-center reveal">
            <Link href="/products" className="btn-hero-primary inline-flex">
              Browse All Products{" "}
              <span className="material-symbols-outlined btn-arrow" style={{ fontSize: 18 }}>
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TECH HIGHLIGHTS ═══ */}
      <section className="py-24 bg-surface overflow-hidden" id="technology">
        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative reveal-left">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  className="w-full h-auto transition-transform duration-700 hover:scale-105"
                  src={TECH_IMG}
                  alt="Advanced robotics"
                  width={720}
                  height={480}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4 glass-badge flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    verified
                  </span>
                  Industry 4.0 Certified
                </div>
              </div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full animate-float" />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 border-2 border-primary/20 rounded-2xl rotate-12 animate-float-slow" />
            </div>
            <div className="reveal-right">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Technology Infrastructure
              </p>
              <h2 className="font-headline-xl text-headline-xl mb-10">
                Advanced Manufacturing Technology
              </h2>
              <div className="space-y-3">
                {TECH_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="tech-item w-full text-left"
                    onClick={() => setOpenId(item.id)}
                  >
                    <div
                      className={`tech-icon-box ${item.iconBg}`}
                      style={item.iconBg ? undefined : { background: "#246640" }}
                    >
                      <span
                        className={`material-symbols-outlined text-2xl ${
                          item.iconBg ? "text-on-primary" : "text-white"
                        }`}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline-md text-headline-md mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                    <span
                      className="material-symbols-outlined text-primary/40 self-center"
                      style={{ fontSize: 18 }}
                    >
                      arrow_forward_ios
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS ═══ */}
      <section className="py-24 bg-surface-container-low" id="quality">
        <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 reveal">
              Compliance &amp; Standards
            </p>
            <h2 className="font-headline-xl text-headline-xl reveal d1">
              Certified for Global Compliance
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-2xl mx-auto reveal d2">
              Our facility and processes meet the world&apos;s most stringent
              industrial and environmental standards. Click any certification to
              learn more.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {CERTS.map((cert) => (
              <button
                key={cert.id}
                type="button"
                className={`cert-card reveal ${cert.delay}`}
                onClick={() => setOpenId(cert.id)}
              >
                <div className="cert-icon-ring">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    {cert.icon}
                  </span>
                </div>
                <span className="font-headline-md text-headline-md">
                  {cert.title}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  {cert.subtitle}
                </span>
                <p className="text-sm text-on-surface-variant text-center">
                  {cert.desc}
                </p>
                <span className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  View Details{" "}
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    arrow_forward
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%,rgba(255,255,255,.4) 0%,transparent 50%),radial-gradient(circle at 80% 50%,rgba(255,255,255,.3) 0%,transparent 50%)",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-float-slow" />
        <div className="relative z-10 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-container-max-width mx-auto text-center">
          <h2 className="font-headline-xl text-headline-xl text-white mb-4 reveal">
            Ready to Start Your Project?
          </h2>
          <p className="text-white/80 font-body-lg text-body-lg max-w-2xl mx-auto mb-10 reveal d1">
            Our engineering team is available to discuss custom solutions,
            prototyping, and large-format supply contracts.
          </p>
          <div className="flex flex-wrap gap-4 justify-center reveal d2">
            <Link
              href="/request-quote"
              className="bg-white text-primary font-bold px-8 py-4 rounded-lg text-sm hover:shadow-xl active:scale-95 transition-all inline-flex items-center"
              style={{ boxShadow: "0 8px 24px rgba(0,0,0,.2)" }}
            >
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-lg text-sm hover:bg-white/10 active:scale-95 transition-all inline-flex items-center"
            >
              Contact Engineering Team
            </Link>
          </div>
        </div>
      </section>

      <IndustryModal
        data={openId ? INDUSTRY_MODALS[openId] ?? null : null}
        onClose={() => setOpenId(null)}
      />
    </div>
  );
}
