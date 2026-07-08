/**
 * Industries-page content types. The data itself (5 manufacturing stages,
 * 3 technology highlights, 6 industries, 4 certifications) now lives in
 * Supabase's content_industries table — see lib/industries-data.ts
 * (server-only) for the fetch functions. This file only keeps the type,
 * which client components (IndustryModal.tsx) need to import.
 */
export type IndustryModal = {
  image: string;
  category: string;
  badge: string;
  status: string;
  statusClass: "status-badge-green" | "status-badge-blue" | "status-badge-amber";
  title: string;
  description: string;
  specs: [string, string][];
  features: string[];
  applications: string[];
  industries: string[];
  availability: string;
};
