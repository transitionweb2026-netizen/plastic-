/**
 * Blog article types. The data itself now lives in Supabase's
 * content_articles table — see lib/articles-data.ts (server-only) for the
 * fetch functions. This file only keeps the type.
 */
export type Article = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  heroImg: string;
  heroAlt: string;
  cardImage: string;
  heroBadge: string;
  bodyHtml: string;
  date: string;
  readTime: string;
  hasCounters: boolean;
  authorBio?: { name: string; roleTitle: string; bio: string };
  showBottomShare?: boolean;
  prevLink: { href: string | null; label: string; title: string; disabled: boolean };
  nextLink: { href: string | null; label: string; title: string; disabled: boolean };
  relatedArticles: { href: string; img: string; category: string; title: string }[];
  cta?: {
    badge: string;
    title: string;
    description: string;
    button1Text: string;
    button1Href: string;
    button2Text: string;
    button2Href: string;
  };
};
