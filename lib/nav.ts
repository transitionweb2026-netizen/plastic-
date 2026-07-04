export type NavLink = {
  label: string;
  href: string;
};

/**
 * Canonical navigation — single source of truth for header, mobile drawer,
 * and footer sitemap links. Order matches the legacy site's nav.
 */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const REQUEST_QUOTE = { label: "Request Quote", href: "/request-quote" };

/** Canonical contact details (standardized on the legacy contact.html set). */
export const CONTACT = {
  email: "info@giantstorage.com",
  phoneMain: { display: "+20 102 515 1199", href: "tel:+201025151199" },
  phoneLogistics: { display: "+20 127 013 7779", href: "tel:+201270137779" },
  address: "22 El Tayaran St., Nasr City, Cairo, Egypt",
} as const;
