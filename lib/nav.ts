export type NavLink = {
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
  { label: "Home", href: "/", icon: "home" },
  { label: "Products", href: "/products", icon: "inventory_2" },
  { label: "Industries", href: "/industries", icon: "precision_manufacturing" },
  { label: "Blog", href: "/blog", icon: "article" },
  { label: "About Us", href: "/about", icon: "factory" },
  { label: "Contact", href: "/contact", icon: "mail" },
];

export const REQUEST_QUOTE = { label: "Request Quote", href: "/request-quote" };

/** Canonical contact details (standardized on the legacy contact.html set). */
export const CONTACT = {
  email: "info@giantstorage.com",
  phoneMain: { display: "+20 102 515 1199", href: "tel:+201025151199" },
  phoneLogistics: { display: "+20 127 013 7779", href: "tel:+201270137779" },
  address: "22 El Tayaran St., Nasr City, Cairo, Egypt",
} as const;

/**
 * TODO: fill in real social profile URLs. The legacy footer had Facebook/Share
 * icons pointing at href="#"; icons are hidden until a real URL is provided so
 * the site ships with no dead links.
 */
export const SOCIAL_LINKS: { label: string; icon: string; href: string }[] = [
  { label: "Facebook", icon: "thumb_up", href: "" }, // TODO: e.g. https://facebook.com/giantstorage
  { label: "Instagram", icon: "photo_camera", href: "" }, // TODO: e.g. https://instagram.com/giantstorage
  { label: "TikTok", icon: "music_note", href: "" }, // TODO: e.g. https://tiktok.com/@giantstorage
  { label: "LinkedIn", icon: "share", href: "" }, // TODO: e.g. https://linkedin.com/company/giantstorage
];

export function socialHref(label: string): string {
  return SOCIAL_LINKS.find((s) => s.label === label)?.href ?? "";
}

/** Legacy header logo (remote; see README note about re-hosting images locally). */
export const LOGO_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCj4u6eML-VML6aKQcXtxb0-jOV3u1iXfJNa-EvWgzCrnMxbfQ-Oyp6AIhgn7skN7e1VBFT0m1_y25J_achw8C8VGwu2hYIRkj_-Z4tGVsicyfHfp2eUuL7b85R42Z6SN2SSXBK32LZwn2Kto6kBpvRQQLvCWNQvjmgi4jvkNoF8ENyzA-IYJy5VUL8fHiqC0JMLa2QE8gj4OTzL5WBaa--marZfs7hzEMDSHM_kkw1KNUoOq4uZo-jPdB1RofpF5i1CSO3W96uTys";
