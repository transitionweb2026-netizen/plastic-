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
| `ADMIN_PASSWORD` | Login password for the SEO CMS at `/admin` (see below) |

Forms show a friendly "not configured" message (with direct contact info)
until their Formspree IDs are set. The WhatsApp button renders only when a
number is configured.

## Structure

- `app/[locale]/` — bilingual (EN/AR) routes: `/`, `/about`, `/products`,
  `/industries`, `/blog`, `/blog/[slug]`, `/gallery`, `/contact`,
  `/request-quote`, legal pages, plus `[...rest]` (localized 404)
- `app/admin/`, `app/api/admin/`, `app/uploads/` — the SEO CMS (see below)
- `app/sitemap.ts` / `app/robots.ts` — CMS-driven, regenerated per request
- `proxy.ts` — locale routing + CMS Redirect Manager enforcement
- `i18n/` — next-intl routing/navigation config; `messages/*.json` — UI strings
- `components/layout/` — shared Header, Footer, MobileDrawer, LanguageSwitcher
- `components/{home,products,industries,blog,gallery,forms,ui,admin}/` — page/CMS components
- `lib/` — content types (`products.ts`, `industries.ts`, `articles.ts`,
  `gallery.ts`) + their Supabase-backed fetch functions (`products-data.ts`,
  `industries-data.ts`, `articles-data.ts`, `gallery-data.ts`);
  navigation/contact config (`nav.ts`), site constants (`site.ts`)
- `lib/cms/` — the CMS's data layer (types, storage, auth, validation)
- `lib/supabase/client.ts` — server-only Supabase client (service role)
- `content/uploads/` — OG/favicon image uploads (gitignored; see below)

## SEO CMS (`/admin`)

An enterprise-style SEO management system layered on top of the site's
content — every public page, product, blog article, and gallery image has
independent, per-locale (EN/AR) SEO fields editable without touching code:
meta title/description with live character-count guidance, slug (for blog
articles), canonical URL, Open Graph image (auto-cropped to 1200×630 on
upload, with Facebook/LinkedIn/WhatsApp share previews and a live Google
result preview), plus a Health tab that scores every page and flags missing
titles/descriptions/alt text/OG images/duplicate slugs/invalid canonicals.
It also manages: the Organization schema (feeds `Organization` JSON-LD sitewide
— name, logo, address, social links), favicon/apple-touch-icon, `robots.txt`
rules, a 301/302 redirect manager, and the 404 page's SEO. Product and
Article JSON-LD, BreadcrumbList, and gallery ImageObject schema are all
generated automatically from this data.

**Login:** visit `/admin` and sign in with `ADMIN_PASSWORD` (falls back to
`giant-admin` in development with a warning banner — set a real password
before deploying). Sessions are a signed cookie; there's no public sign-up.

**How it wires into the site:** every page's `generateMetadata` calls
`cmsMetadata(pageKey, locale)` (`lib/cms/seo.ts`), which layers a *published*
CMS override on top of the page's built-in default text — nothing is
hardcoded, but nothing breaks if the CMS is untouched, either. Saving in the
admin panel calls `revalidatePath("/", "layout")`, so changes go live
immediately with no rebuild.

**Storage:** Supabase Postgres is the *only* persistence layer — both the
shipped default copy and every CMS edit live in the same tables (see
`lib/cms/storage.ts`, `content-storage.ts`, `translations-storage.ts`, and
the `content_products`/`content_industries`/`content_articles`/
`content_site_contact`/`cms_pages`/`cms_product_seo`/`cms_global`/
`cms_redirects`/`translations`/`gallery_images`/`gallery_videos` tables).
Reads go through `lib/supabase/client.ts` (service-role key, server-only —
every consumer is a Server Component or Route Handler, so no RLS policies
are needed). Each read function is wrapped in Next's `unstable_cache` under
a domain tag; every write function calls `revalidateTag` (immediate
expiration, `{ expire: 0 }`) for its tag plus `revalidatePath("/", "layout")`,
so admin edits go live on the next request with no rebuild or redeploy.
`scripts/seed-supabase.ts` was the one-time script that populated these
tables from the original hardcoded `lib/*.ts` data.

**Uploads** (`content/uploads/`, also gitignored) are deliberately **not**
under `public/`: Next.js's production server (`next start`) scans `public/`
once at process startup, so files an admin uploads at runtime would 404 until
someone restarts the server. Uploads are instead served by
`app/uploads/[...path]/route.ts`, a Route Handler that reads the file fresh
from disk on every request — new uploads work immediately.

**Redirect Manager precedence:** enforced in `proxy.ts`, not in a page-level
catch-all. Next.js always prefers a literal route (e.g. `app/[locale]/blog/
[slug]`) over a catch-all, so a redirect for `/blog/old-slug` would never be
reached by `app/[locale]/[...rest]/page.tsx` — `proxy.ts` intercepts every
request before route resolution, so it's the only place a redirect for an
already-defined route segment can actually fire.

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
