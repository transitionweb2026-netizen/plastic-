# Giant Storage — Integrated Industrial Solutions

Marketing site for Giant Storage Integrated Solutions, built with Next.js
(App Router, TypeScript, Tailwind CSS v4). Migrated from a static HTML site
(preserved in `legacy-html-reference/` during the migration).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## Configuration (required before going live)

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_FORMSPREE_CONTACT_ID` | Contact page form ([formspree.io](https://formspree.io) form ID) |
| `NEXT_PUBLIC_FORMSPREE_QUOTE_ID` | Request-quote wizard form ID |
| `NEXT_PUBLIC_FORMSPREE_NEWSLETTER_ID` | Blog newsletter signup form ID |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Enables the floating WhatsApp button (e.g. `201025151199`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used in sitemap/robots/OG/share links |

Forms show a friendly "not configured" message (with direct contact info)
until their Formspree IDs are set. The WhatsApp button renders only when a
number is configured.

## Structure

- `app/` — routes: `/`, `/about`, `/products`, `/industries`, `/blog`,
  `/blog/[slug]`, `/contact`, `/request-quote`, plus `sitemap.ts`/`robots.ts`
- `components/layout/` — shared Header, Footer, MobileDrawer
- `components/{home,products,industries,blog,forms,ui}/` — page components
- `lib/` — content data (`products.ts`, `industries.ts`, `articles.ts`),
  navigation/contact config (`nav.ts`), site constants (`site.ts`)

## Remaining TODOs

- **Social links**: fill real URLs in `lib/nav.ts` `SOCIAL_LINKS` — footer
  icons and the home hero contact widget stay hidden until set.
- **Video URLs**: home "Latest Videos" cards and the facility-tour play
  button need real video links (were dead in the legacy site too).
- **"Created by Transition" credit** (footer): plain text until an agency
  URL is provided.
- **Images**: all imagery is remote (`lh3.googleusercontent.com` — these
  AI-studio URLs may expire — and `upload.wikimedia.org`). Consider
  downloading to `public/images/` and updating the source constants.
- **Privacy policy**: newsletter/contact reference a privacy policy that
  doesn't exist as a page yet (legacy linked the About page).
