export type NavLink = {
  /** Translation key under the "nav" namespace. */
  key: string;
  /** English fallback label (canonical copy lives in messages/*.json). */
  label: string;
  href: string;
  /** Material Symbols icon name, shown in the mobile drawer (from legacy drawer markup). */
  icon: string;
};

/**
 * Canonical navigation — single source of truth for header, mobile drawer,
 * and footer sitemap links. Order and icons match the legacy site's nav.
 */
export const NAV_LINKS: NavLink[] = [
  { key: "home", label: "Home", href: "/", icon: "home" },
  { key: "products", label: "Products", href: "/products", icon: "inventory_2" },
  { key: "industries", label: "Industries", href: "/industries", icon: "precision_manufacturing" },
  { key: "blog", label: "Blog", href: "/blog", icon: "article" },
  { key: "gallery", label: "Gallery", href: "/gallery", icon: "photo_library" },
  { key: "about", label: "About Us", href: "/about", icon: "factory" },
  { key: "contact", label: "Contact", href: "/contact", icon: "mail" },
];

export const REQUEST_QUOTE = { label: "Request Quote", href: "/request-quote" };

/** Canonical contact details (standardized on the legacy contact.html set).
 *  These are the built-in defaults; the CMS can override email/phones (see
 *  resolveContact() below) — address stays translation-driven (messages/*.json). */
export const CONTACT = {
  email: "info@giantstorage.com",
  phoneMain: { display: "+20 102 515 1199", href: "tel:+201025151199" },
  phoneLogistics: { display: "+20 127 013 7779", href: "tel:+201270137779" },
  address: "22 El Tayaran St., Nasr City, Cairo, Egypt",
} as const;

/** Resolves CONTACT with an optional CMS override layered on top
 *  (trim-or-fallback per field, same discipline as the rest of the CMS).
 *  Plain/no "server-only" import here so client components (ContactForm,
 *  QuoteForm) can receive the resolved object as a prop from their parent
 *  server page without pulling in fs-based code. */
export type ResolvedContact = {
  email: string;
  phoneMain: { display: string; href: string };
  phoneLogistics: { display: string; href: string };
};

export function resolveContact(override?: {
  email?: string;
  phoneMainDisplay?: string;
  phoneMainHref?: string;
  phoneLogisticsDisplay?: string;
  phoneLogisticsHref?: string;
}): ResolvedContact {
  return {
    email: override?.email?.trim() || CONTACT.email,
    phoneMain: {
      display: override?.phoneMainDisplay?.trim() || CONTACT.phoneMain.display,
      href: override?.phoneMainHref?.trim() || CONTACT.phoneMain.href,
    },
    phoneLogistics: {
      display: override?.phoneLogisticsDisplay?.trim() || CONTACT.phoneLogistics.display,
      href: override?.phoneLogisticsHref?.trim() || CONTACT.phoneLogistics.href,
    },
  };
}

/** WhatsApp chat deep link derived from the real main office number. */
export const WHATSAPP_HREF = `https://wa.me/${CONTACT.phoneMain.href.replace(/\D/g, "")}`;

/**
 * Social profiles shown in the footer and the home hero contact widget.
 * TODO: replace the placeholder handles below with the company's real
 * profile URLs when available (WhatsApp already uses the real number).
 */
export const SOCIAL_LINKS: { label: string; brand: string; href: string }[] = [
  { label: "WhatsApp", brand: "whatsapp", href: WHATSAPP_HREF },
  { label: "Instagram", brand: "instagram", href: "https://www.instagram.com/giantstorage.eg" },
  { label: "Facebook", brand: "facebook", href: "https://www.facebook.com/giantstorage.eg" },
  { label: "TikTok", brand: "tiktok", href: "https://www.tiktok.com/@giantstorage.eg" },
];

/** Legacy header logo default (remote); admin-overridable via cms_images "header.logo". */
export const LOGO_SRC_DEFAULT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCj4u6eML-VML6aKQcXtxb0-jOV3u1iXfJNa-EvWgzCrnMxbfQ-Oyp6AIhgn7skN7e1VBFT0m1_y25J_achw8C8VGwu2hYIRkj_-Z4tGVsicyfHfp2eUuL7b85R42Z6SN2SSXBK32LZwn2Kto6kBpvRQQLvCWNQvjmgi4jvkNoF8ENyzA-IYJy5VUL8fHiqC0JMLa2QE8gj4OTzL5WBaa--marZfs7hzEMDSHM_kkw1KNUoOq4uZo-jPdB1RofpF5i1CSO3W96uTys";
