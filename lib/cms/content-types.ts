/**
 * Content CMS data model — layered on top of the hardcoded records in
 * lib/products.ts, lib/industries.ts, lib/articles.ts (and, for contact
 * info, lib/nav.ts's CONTACT constant). Same trim-or-fallback-if-published
 * discipline as the SEO CMS (lib/cms/seo.ts's effectiveSeo()), kept in a
 * separate file/driver so seo.json doesn't grow unbounded — see
 * lib/cms/content-storage.ts.
 */

export type ProductFields = {
  name?: string;
  category?: string;
  badge?: string;
  status?: string;
  shortDesc?: string;
  description?: string;
  material?: string;
  dimensions?: string;
  loadCapacity?: string;
  colors?: string[];
  applications?: string[];
  features?: string[];
  availability?: string;
};

export type IndustryFields = {
  title?: string;
  description?: string;
  specs?: [string, string][];
  features?: string[];
  applications?: string[];
  industries?: string[];
  availability?: string;
};

export type ArticleFields = {
  title?: string;
  h1?: string;
  description?: string;
  /** Prose only (headings/paragraphs/lists/blockquotes) — rich-text edited. */
  bodyHtml?: string;
  authorBio?: { name: string; roleTitle: string; bio: string };
  prevLink?: { href: string | null; label: string; title: string; disabled: boolean };
  nextLink?: { href: string | null; label: string; title: string; disabled: boolean };
  relatedArticles?: { href: string; img: string; category: string; title: string }[];
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

export type ContentRecord<T> = {
  published: boolean;
  en: T;
  ar: T;
  updatedAt?: string;
};

/** Site-wide contact info shown in the Footer, forms, hero widget, etc.
 *  Not locale-split — phone numbers/email are the same in both languages. */
export type SiteContactOverride = {
  email?: string;
  phoneMainDisplay?: string;
  phoneMainHref?: string;
  phoneLogisticsDisplay?: string;
  phoneLogisticsHref?: string;
};

export type ContentOverrides = {
  version: 1;
  products: Record<string, ContentRecord<Partial<ProductFields>>>;
  industries: Record<string, ContentRecord<Partial<IndustryFields>>>;
  articles: Record<string, ContentRecord<Partial<ArticleFields>>>;
  siteContact: SiteContactOverride;
};

export function emptyContentOverrides(): ContentOverrides {
  return { version: 1, products: {}, industries: {}, articles: {}, siteContact: {} };
}
