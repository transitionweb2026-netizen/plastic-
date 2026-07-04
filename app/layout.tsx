import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

/**
 * Material Symbols Outlined is not available through next/font/google,
 * so the variable woff2 (FILL/wght/GRAD/opsz axes) is self-hosted.
 * display "block" prevents the raw ligature text (e.g. "menu") from
 * flashing before the icon font loads.
 */
const materialSymbols = localFont({
  src: "./fonts/material-symbols-outlined.woff2",
  variable: "--font-material-symbols",
  display: "block",
  weight: "100 700",
});

export const metadata: Metadata = {
  title: {
    default: "Giant Storage | Integrated Industrial Solutions",
    template: "%s | Giant Storage",
  },
  description:
    "Giant Storage Integrated Solutions — industrial plastic pallets, crates, and high-density storage systems engineered for warehousing, cold chain, and logistics at scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${materialSymbols.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-background text-on-background antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
