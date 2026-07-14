import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard — Giant Storage",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon-default.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

/** Standalone admin shell (outside the locale tree, always LTR English). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={inter.variable}>
      <body className="min-h-screen bg-surface-container-low text-on-background antialiased">
        {children}
      </body>
    </html>
  );
}
