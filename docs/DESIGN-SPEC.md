# Giant Storage — UI Design Specification

**Source of truth:** extracted directly from the production codebase
(`app/globals.css` design tokens, component source, Tailwind v4 utilities).
No estimated values. Tailwind spacing scale: `1 unit = 4px`.

- **Stack:** Next.js App Router · Tailwind CSS v4 · Inter / Lora / Material Symbols
- **Pages:** Home `/` · About `/about` · Products `/products` · Industries `/industries` · Blog `/blog` + 4 articles · Contact `/contact` · Request Quote `/request-quote`

---

## 1. Global Layout

| Property | Value |
|---|---|
| Max container width | **1440px** (`.max-w-container-max-width`) |
| Secondary content widths | 1280px (`max-w-7xl`, About) · 896px (`max-w-4xl`, article body & page intros) |
| Grid system | CSS Grid (Tailwind utilities), no fixed column library |
| Columns | 12-col mosaic (Home products: spans 7/5/4/8) · 12-col split (Contact 4+8, Quote 8+4) · 3-col card grids (Products, Industries, Blog) · 4-col (footer, stats, certifications) · 6-col (Home industries strip) · 2-col (heroes, About bento 7+5) |
| Container side padding — mobile (<768px) | **20px** (`--spacing-margin-mobile`; About/Contact/Products use 16px `px-4`) |
| Container side padding — tablet (≥768px) | **32px** (`--spacing-margin-tablet`) |
| Container side padding — desktop (≥1024px) | **64px** (`--spacing-margin-desktop`) |
| Section vertical padding (standard) | **96px** (`py-24`) |
| Section vertical padding (variants) | 80px (`py-20` — stats band, CTA banners, blog sections) · 64px (`py-16` footer main) · 48px (`py-12` About stats) · bottom-only: 112px (`pb-28` Home about), 96px, 80px, 128px (`pb-32` Quote) |
| Gap between sections (Home) | Decorative separator row, **48px padding top+bottom** (`.sep-line` 3rem 0) |
| Gap between cards | **24px** (`gap-6`) standard · **32px** (`gap-gutter`) blog & footer grids · 20px (`gap-5` Home industries) |
| Home mosaic row height | **320px** (`auto-rows-[320px]`) |

### Border radius scale

| Token | Value | Used on |
|---|---|---|
| default | 4px | small tags (`.app-tag` 6.4px, share buttons 4px) |
| `rounded-lg` | 8px | inputs, rectangular buttons, pagination |
| `rounded-xl` | 12px | contact info cards, glass form card, bento tiles |
| `.prod-card` | 14px (0.875rem) | product catalog cards |
| `rounded-2xl` / cards | 16px (1rem) | most cards (product/article/industry/video/process), widget panel |
| `.cert-card` (Home) | 17.6px (1.1rem) | certification cards |
| Modal | 20px (1.25rem) | product & industry detail modals |
| `rounded-3xl` | 24px | About hero image, manufacturing teaser |
| About CTA panel | 40px (`rounded-[40px]`) | "Build Your Infrastructure" banner |
| `rounded-full` | 9999px | pills, icon circles, filter chips |

### Shadow scale

| Name | Value |
|---|---|
| `.premium-shadow` | `0 4px 20px rgba(0,0,0,.05)` |
| `.industrial-shadow` / `.soft-industrial-shadow` | `0 4px 20px rgba(14,74,48,.06)` |
| Card resting (catalog) | `0 4px 20px rgba(14,74,48,.07)` |
| Card hover (catalog) | `0 20px 48px rgba(14,74,48,.16), 0 0 0 1px rgba(1,78,42,.07)` |
| Card resting (Home mosaic) | `0 4px 20px rgba(0,0,0,.07)` |
| Card hover (Home mosaic) | `0 24px 52px rgba(0,0,0,.15), 0 0 0 1px rgba(1,78,42,.08)` |
| Video card hover | `0 20px 48px rgba(0,0,0,.14), 0 0 0 1px rgba(1,78,42,.1), 0 0 28px rgba(1,78,42,.07)` |
| Primary button | `0 6px 24px rgba(1,78,42,.35)` → hover `0 14px 36px rgba(1,78,42,.42)` |
| Header CTA pill | `0 4px 18px rgba(1,78,42,.3)` |
| Modal | `0 32px 80px rgba(0,0,0,.28), 0 0 0 1px rgba(255,255,255,.15)` |
| About hero image | `0 24px 64px rgba(1,78,42,.18)` |
| Widget panel | `0 8px 32px rgba(0,0,0,.28)` |

---

## 2. Typography

**Font families**
- **Inter** (variable 100–900, `next/font`) — all UI text. CSS: `--font-inter` / `--font-sans`
- **Lora** (400, normal + italic) — footer "Created by Transition" credit only. CSS: `--font-lora` / `--font-serif`
- **Material Symbols Outlined** (variable, self-hosted) — icon font

**Token scale** (defined in `app/globals.css` `@theme`)

| Token | Size | Weight | Line height | Letter spacing | Transform |
|---|---|---|---|---|---|
| `display-lg` | 64px | 700 | 1.1 | −0.02em | none |
| `headline-xl` | 48px | 600 | 1.2 | −0.01em | none |
| `headline-xl-mobile` | 32px | 600 | 1.2 | 0 | none |
| `headline-lg` | 32px | 600 | 1.3 | −0.01em* | none |
| `headline-lg-mobile` | 28px | 600 | 1.3 | 0 | none |
| `headline-md` | 24px | 600 | 1.4 | 0 | none |
| `body-lg` | 18px | 400 | 1.6 | 0 | none |
| `body-md` | 16px | 400 | 1.6 | 0 | none |
| `label-lg` | 14px | 600 | 1.2 | +0.05em | none (uppercase where applied) |
| `label-md` | 14px | 600 | 20px | +0.01em | none |
| `label-sm` | 12px | 500 | 1.2 | 0 | none |

**Style usage map**

| Element | Token / values | Color |
|---|---|---|
| Hero heading (Home) | `display-lg` 64px desktop / `headline-xl-mobile` 32px mobile (clamped `1.6rem–2rem` <640px); text-shadow `0 2px 16px rgba(0,0,0,.3)` | `#ffffff` |
| Hero subtitle (Home) | `body-lg` 18px/1.6, max-width 576px, 90% opacity; text-shadow `0 1px 10px rgba(0,0,0,.25)` | `#ffffff` |
| Hero heading (About) | `clamp(1.65rem, 7vw, 3.5rem)` = 26.4–56px, 700, −0.02em | `#014e2a` (+ `#707971` second line) |
| Hero heading (Industries) | 38px mobile / 56px desktop, 900, −0.02em | `#1b1c1d` (+ `#014e2a` accent line) |
| Hero heading (Blog) | `clamp(2rem, 5vw, 3.6rem)` = 32–57.6px, 900, −0.02em, lh 1.08 | `#ffffff` (+ `#92d5a6` accent line) |
| Section eyebrow pill | 11.52px (0.72rem), 700, +0.16em, UPPERCASE | `#014e2a` on `#adf2c1`, radius 9999px, padding 5.12×15.2px |
| Section title | `headline-xl` 48px | `#1b1c1d` |
| Section description | `body-md` 16px / `body-lg` 18px | `#404941` |
| Card title | `headline-md` 24px | `#1b1c1d` |
| Card body text | `body-md` 16px or 14px (`text-sm`) | `#404941` |
| Card category label | 12px, 700, +0.1em–0.25em, UPPERCASE | `#014e2a` (60% opacity on catalog) |
| Button text | `label-lg` 14px 600 / `.btn-primary` 14.4px 700 +0.05em | `#ffffff` |
| Navigation links | `label-lg` 14px 600 (+0.05em) | `#404941` → hover/active `#014e2a` (active also 700) |
| Footer headings | `label-lg` 14px 700 UPPERCASE | `#1b1c1d` |
| Footer links/text | `body-md` 16px | `#404941` → hover `#014e2a` |
| Footer copyright | `label-sm` 12px, 60% opacity | `#1b1c1d` |
| Footer credit | Lora italic 11.52px, +0.02em, 40% opacity → hover 75% `#014e2a` | inherit |
| Article prose H2 | 24.8px (1.55rem), 700, −0.01em, lh 1.3 | `#014e2a` |
| Article prose body | 16px, lh 1.8 | `#404941` |
| Stats numbers (Home band) | 48px `headline-xl`, tabular-nums | `#ffffff` |
| Stats numbers (Industries strip) | 36px (2.25rem), 800, lh 1 | `#ffffff` |

\* `headline-lg` letter-spacing −0.01em applies via the products/about legacy variant; the global token carries no tracking.

---

## 3. Colors

Material-3-derived palette. All values are CSS variables in `@theme` (usable as Tailwind classes, e.g. `bg-primary`, `text-on-surface-variant`).

### Core brand

| Role | HEX | RGB | CSS variable | Usage |
|---|---|---|---|---|
| Primary | `#014e2a` | 1, 78, 42 | `--color-primary` | Brand green: buttons, links, icons, accents |
| On Primary | `#ffffff` | 255, 255, 255 | `--color-on-primary` | Text/icons on primary |
| Primary Container | `#246640` | 36, 102, 64 | `--color-primary-container` | Hover fills, About CTA panel, hours card |
| On Primary Container | `#9de1b1` | 157, 225, 177 | `--color-on-primary-container` | Text on primary container |
| Primary Fixed | `#adf2c1` | 173, 242, 193 | `--color-primary-fixed` | Eyebrow pills, icon chips |
| Primary Fixed Dim | `#92d5a6` | 146, 213, 166 | `--color-primary-fixed-dim` | Light-green accents on dark, gradient end |
| Secondary | `#32694c` | 50, 105, 76 | `--color-secondary` | Button hover state, secondary icons |
| Secondary Container | `#b5f0cb` | 181, 240, 203 | `--color-secondary-container` | Badges, active drawer item |
| On Secondary Container | `#386f52` | 56, 111, 82 | `--color-on-secondary-container` | Text on secondary container |

### Neutrals / surfaces

| Role | HEX | RGB | CSS variable | Usage |
|---|---|---|---|---|
| Background | `#fbf9fb` | 251, 249, 251 | `--color-background` / `--color-surface` | Page background |
| On Background / Text Primary | `#1b1c1d` | 27, 28, 29 | `--color-on-background` / `--color-on-surface` | Headings, body on light |
| Text Secondary | `#404941` | 64, 73, 65 | `--color-on-surface-variant` | Descriptions, secondary text |
| Surface Container Lowest | `#ffffff` | 255, 255, 255 | `--color-surface-container-lowest` | Cards, form panel |
| Surface Container Low | `#f5f3f5` | 245, 243, 245 | `--color-surface-container-low` | Alternating sections, chips |
| Surface Container | `#efedef` | 239, 237, 239 | `--color-surface-container` | About stats band, spec dividers |
| Surface Container High | `#e9e7ea` | 233, 231, 234 | `--color-surface-container-high` | Inactive stepper, hover fills |
| Surface Container Highest | `#e4e2e4` | 228, 226, 228 | `--color-surface-container-highest` / `--color-surface-variant` | Footer background |
| Surface Dim | `#dbd9dc` | 219, 217, 220 | `--color-surface-dim` | (token, reserved) |
| Inverse Surface | `#303032` | 48, 48, 50 | `--color-inverse-surface` | About dark factory section |
| Inverse On Surface | `#f2f0f2` | 242, 240, 242 | `--color-inverse-on-surface` | Text on inverse |
| Border | `#707971` | 112, 121, 113 | `--color-outline` | Input borders, pagination |
| Border Subtle | `#c0c9bf` | 192, 201, 191 | `--color-outline-variant` | Card borders, dividers, footer top border |

### Status / semantic

| Role | HEX | RGB | Source | Usage |
|---|---|---|---|---|
| Error | `#ba1a1a` | 186, 26, 26 | `--color-error` | Form error text |
| Error Container | `#ffdad6` | 255, 218, 214 | `--color-error-container` | (token, reserved) |
| Success badge | `#d1fae5` bg / `#065f46` text | 209,250,229 / 6,95,70 | `.status-badge-green` | "In Stock", "Pharma Ready" |
| Info badge | `#dbeafe` bg / `#1d4ed8` text | 219,234,254 / 29,78,216 | `.status-badge-blue` | "Bulk Available", "ESD Safe" |
| Warning badge | `#fef3c7` bg / `#92400e` text | 254,243,199 / 146,64,14 | `.status-badge-amber` | "New Arrival" |
| App tag | `#e8f5ee` bg / `#014e2a` text | 232,245,238 | `.app-tag` | Application chips |
| WhatsApp | `#25D366` | 37, 211, 102 | floating button | Brand accent |
| Facebook share | `#1877f2` | 24, 119, 242 | article share | Brand accent |
| LinkedIn share | `#0a66c2` | 10, 102, 194 | article share | Brand accent |

> Tertiary family (`#6e2d37` maroon set) and surface-tint `#296a44` exist as tokens but are **unused** in current layouts.

---

## 4. Buttons

| Style | Width / Height | Radius | Padding | Font | Background → Hover | Active | Border | Shadow |
|---|---|---|---|---|---|---|---|---|
| **Primary pill** `.btn-primary` (Home/global) | auto × ≥44px | 9999px | 13.6px × 32px | 14.4px / 700 / +0.05em, white | `#014e2a` → `#08522e` + translateY(−3px) + radial white sheen | scale(0.97) | none | `0 6px 24px rgba(1,78,42,.35)` → `0 14px 36px rgba(1,78,42,.42)` |
| **Header "Request Quote"** | auto × 44px | 9999px | 10px × 24px | 14px / 600 (`label-lg`), white | `#014e2a` → `#32694c` | scale(0.95) | none | `0 4px 18px rgba(1,78,42,.3)` |
| **Hero outline (Home)** | auto × ≥44px | 9999px | 16px × 32px | 14px / 600, white | transparent → white fill, text `#014e2a` | — | 2px `#ffffff` | none |
| **Industries hero primary** `.btn-hero-primary` | auto | 8px | 16px × 32px | 14px / 700 / +0.04em, white | `#014e2a` + light-sweep `::before` → translateY(−3px) scale(1.03); arrow +5px | scale(0.97) | none | `0 6px 24px rgba(1,78,42,.35)` → `0 16px 40px rgba(1,78,42,.45)` |
| **Industries hero outline** `.btn-hero-outline` | auto | 8px | 16px × 32px | 14px / 700 / +0.04em, `#1b1c1d` | transparent → `#014e2a` fill, white text | scale(0.97) | 2px `rgba(1,78,42,.5)` → `#014e2a` | hover `0 12px 30px rgba(1,78,42,.32)` |
| **Blog rect primary** (scoped `.btn-primary`) | auto | 8px | 14px × 28px | 14px / 700 / +0.04em, white | `#014e2a` + sweep → translateY(−2px) scale(1.03) | scale(0.97) | none | `0 6px 20px rgba(1,78,42,.32)` → `0 14px 34px .42` |
| **"View Details"** `.btn-view` | auto × ≥44px | 8px | 7.2px × 20px | 13.12px / 600 / +0.02em, `#014e2a` | transparent → `#014e2a` fill white, translateY(−1px) | scale(0.96) | 2px `#014e2a` | hover `0 6px 16px rgba(1,78,42,.28)` |
| **Pagination** `.page-btn` | **40 × 40px** | 8px | — | 13.12px / 600, `#404941` | transparent → `#f5f3f5` −1px; **active:** `#014e2a` white, scale(1.06) | — | 1px `#707971` (nav variant `#c0c9bf`) | active `0 4px 14px rgba(1,78,42,.32)` |
| **Category filter pill** | auto × 44px | 9999px | 8px × 24px | 14px / 600 (`label-md`) | inactive `#f5f3f5`/`#404941` → `#e9e7ea`; active `#014e2a` white | — | none | none |
| **Form submit (Contact)** | auto × **56px** | 8px | 0 × 40px | 14px / 600, white | `#014e2a`; disabled 70% opacity | scale(0.95) | none | industrial-shadow |
| **Wizard next/submit (Quote)** | auto | 8px | 16px × 40–48px | 14px / 600, white | `#014e2a` → `#246640` | — | none | `shadow-lg` primary/10–20 |
| **Environment picker (Quote)** | auto | 8px | 12px × 16px | 14px / 600 | selected: `rgba(146,213,166,.2)` fill, `#014e2a` text+border · unselected: transparent, `#404941` | — | 1px (`#014e2a` / `#707971`) | none |

All interactive elements have **min-height 44px** (touch target rule) and a global focus style: `outline: 2px solid #014e2a; outline-offset: 2px`.

---

## 5. Cards

| Card | Width | Height | Padding | Radius | Shadow (rest) | Hover effect |
|---|---|---|---|---|---|---|
| Home mosaic `.product-card` | grid spans 7/5/4/8 of 12 | 320px row | text block 32px | 16px | `0 4px 20px rgba(0,0,0,.07)` | translateY(−8px), image scale(1.08) 0.65s, CTA lifts −2px |
| Catalog `.prod-card` | ⅓ col (24px gaps) | auto; image 4:3 | body 24px | 14px | `0 4px 20px rgba(14,74,48,.07)` | translateY(−8px), img scale(1.08), "Quick View" overlay `rgba(1,78,42,.55)` fades in |
| Blog `.art-card` | ⅓ col (32px gaps) | image 208px | body 28px | 16px | `0 4px 20px rgba(0,0,0,.05)` | translateY(−7px), img scale(1.09), title → `#014e2a` |
| Featured `.feat-card` | 2-col split | image ≥288px | 32px / 56px desktop | 16px | `0 4px 24px rgba(0,0,0,.07)` | translateY(−5px), img scale(1.05) |
| Industry `.ind-card` | ⅓ col | auto | 32px, internal gap 16px | 16px | `0 2px 12px rgba(14,74,48,.05)`, border `#e4e2e4` | translateY(−6px), border `rgba(1,78,42,.3)`, subtle green gradient fill, icon chip scale(1.12) rotate(−3°) |
| Process `.proc-card` | ⅕ col | image 3:4 | body 20px | 16px | `0 4px 16px rgba(14,74,48,.07)` | translateY(−8px), img scale(1.08), overlay `rgba(1,78,42,.3)` + "View Details" chip |
| Cert (Home) `.cert-card` | ¼ col | auto | 36px × 24px | 17.6px | border `#c0c9bf` | translateY(−7px), border `#014e2a`, radial glow, icon rotate(10°) scale(1.12), `0 20px 48px rgba(1,78,42,.13)` |
| Video `.video-card` | ⅓ col | thumb 16:9 | body 20px | 16px | `0 4px 24px rgba(0,0,0,.08)` | translateY(−6px), img scale(1.06), play ring scale(1.14), overlay → `rgba(1,78,42,.48)` |
| Mini-stat (Home about) | ½ of column | auto | 20px | 12px | none (bg `#f5f3f5`) | translateY(−4px), `0 12px 28px rgba(1,78,42,.12)` |
| Contact info card | sidebar col | auto | 24px | 12px | industrial-shadow, border `rgba(192,201,191,.3)` | translateY(−4px) |
| Quote glass card | 8 of 12 cols | auto | 32–48px | 12px | `0 4px 20px rgba(0,0,0,.05)`; bg `rgba(255,255,255,.8)` + blur(12px), border `rgba(228,226,228,.5)` | — |
| Detail modal `.modal-box` | max 920px | max 90vh, image 16:9 | 24–32px | 20px | `0 32px 80px rgba(0,0,0,.28)` | entrance: scale 0.94→1 + translateY 16→0, spring easing |

---

## 6. Images

| Image | Display size | Aspect ratio | Object fit | Radius | Notes |
|---|---|---|---|---|---|
| Home hero background | full-bleed, 90vh (min 600px) | viewport | cover | 0 | zoom animation 1→1.08 over 16s; overlay `linear-gradient(to right, rgba(27,28,29,.88), rgba(27,28,29,.55), transparent)` |
| Home about photo | col width × **500px** | ~1.44:1 (720×500 source box) | cover | 16px | float animation + mouse-tilt parallax; hover scale(1.04) |
| Product mosaic images | fill span | fills 320px rows | cover | 16px (card) | bottom gradient `rgba(27,28,29,.82)→transparent` |
| Catalog product images | card width | **4:3** | cover | 14px top | — |
| Video thumbnails | card width | **16:9** | cover | 16px top | dark overlay `rgba(0,0,0,.22)` + 58px play circle |
| Client logos | auto × **40px** | native | contain | 0 | `grayscale(1) opacity(.65)` → full color on hover; white chip 16×28px padding, radius 14px |
| Manufacturing teaser | container × **520px** | — | cover | 24px | hover scale(1.05) over 1s; overlay gradient `rgba(27,28,29,.65→.35)` |
| Industries hero | full-bleed, min 680px | viewport | cover | 0 | zoom 1.05→1.12 over 18s; light gradient overlays (background-colored) |
| Article hero | full-bleed × **480px** (520px ≥768px) | — | cover | 0 | zoom 18s; overlay `rgba(0,0,0,.8)→.4→.1` bottom-up |
| Blog card images | card width × **208px** | — | cover | 16px top | scale(1.09) on hover |
| About hero | col × 400px (600px ≥768px) | — | cover | 24px | gradient `rgba(1,78,42,.4)→transparent` bottom-up |
| Factory cards (About) | ⅓ col | **16:9** | cover | 16px | scale(1.10) hover over 0.7s |
| Contact map | full width × **450px** | — | cover | 12px | glass info card overlay bottom-left |
| Modal hero image | 920px max | **16:9** | cover | 20px top | — |

---

## 7. Icons

| Property | Value |
|---|---|
| Primary library | **Material Symbols Outlined** (variable font, self-hosted woff2) |
| Default variation | `FILL 0, wght 400, GRAD 0, opsz 24` (filled variants use `FILL 1`) |
| Default size | 24px (font-size inherit) |
| Size variants | 14px (chip checks) · 16px (inline arrows) · 18px (button arrows, footer contact) · 20px (drawer) · 28px (play) · 30px (`text-3xl` feature icons) · 36px (`text-4xl` industry icons, ISO badge) |
| Icon color | `#014e2a` on light · `#ffffff` on dark/primary |
| Icon containers | 40px circle (footer social, widget) · 48px rounded-lg chip (contact cards) · 56px rounded-[14px] (industry/tech) · 64–72px circle (feature rings, cert rings) |
| Hover effects | footer social: rotate(12°) scale(1.15) + primary fill · widget social: translateY(−3px) scale(1.12), spring easing · feature ring: rotate(−6°) scale(1.1) + halo · industry icon: bounce keyframe 0.5s |
| Brand icons | Custom inline SVGs (24×24 viewBox): WhatsApp, Instagram, Facebook, TikTok — 17–18px inside 40px circles |

---

## 8. Navbar

| Property | Value |
|---|---|
| Height | **80px** (`h-20`) |
| Background | `rgba(251,249,251,.8)` + `backdrop-blur-md` (12px) |
| Border | bottom 1px `rgba(192,201,191,.3)` |
| Container | 1440px max, side padding 20/32/64px (breakpoint-based) |
| Logo image | **48px height** (`h-12`), width auto |
| Wordmark | "GIANT STORAGE" — 24px `headline-md`, 700, uppercase, tracking-tighter, `#014e2a`; 16px gap from logo |
| Menu item spacing | **32px** (`gap-8`) |
| Link font | 14px / 600 / +0.05em (`label-lg`), `#404941` |
| Active link | `#014e2a`, 700, full underline (2px, radius 99px) |
| Hover | color → `#014e2a` + underline grows 0→100% width, 0.3s `cubic-bezier(.4,0,.2,1)`, positioned −4px below |
| CTA | "Request Quote" pill (see Buttons) |
| Sticky behavior | `position: sticky; top: 0; z-index: 50`; gains `shadow-md` after 8px scroll (0.3s transition) |
| Mobile (<768px) | hamburger (24px icon) opens 320px left drawer (max 85vw), overlay `rgba(0,0,0,.5)`, slide 0.3s; icon+label rows 12px padding, active row `#b5f0cb` pill |

---

## 9. Footer

| Property | Value |
|---|---|
| Background | `#e4e2e4` (surface-container-highest) + dot pattern overlay at 30% opacity |
| Top border | 1px `#c0c9bf` |
| Main padding | **64px top/bottom** (`py-16`), container side padding; <768px forced to 20px sides |
| Columns | **4 equal** (stack to 1 on mobile), gap **32px** |
| Column 1 | Brand 24px 900 `#014e2a` + 16px body + 4 social circles (40px, 1px `#707971` border → primary fill, rotate 12° scale 1.15) |
| Columns 2–3 | Heading 14px 700 uppercase, links 16px `#404941` → `#014e2a` with underline-grow hover, 16px row spacing |
| Column 4 | Contact rows with 24px primary icons: address (text), phone (`tel:`), email (`mailto:`) |
| Bottom bar | border-top `rgba(192,201,191,.3)`, **32px padding** (`py-8`), centered |
| Copyright | 12px, 60% opacity |
| Credit | "Created by Transition" — Lora italic 11.52px, 40% → 75% opacity + `#014e2a` on hover |

---

## 10. Responsive Breakpoints

Tailwind v4 defaults; used in code as prefixes:

| Name | Min-width | Usage in project |
|---|---|---|
| Mobile (base) | 0 | single column, drawer nav, video carousel, 16–20px margins |
| `sm` | **640px** | video grid replaces carousel, 2-col product cards |
| `md` (Tablet) | **768px** | desktop nav appears, 32px margins, 2–4 col grids, hero contact widget visible |
| `lg` (Laptop/Desktop) | **1024px** | 64px margins, 3-col cards, 12-col splits, hero decorations |
| `xl` | **1280px** | Industries floating glass badges only |
| Max container | **1440px** | content stops growing |

Custom max-width rules: `≤479px` hides hero contact widget · `≤639px` hero text clamps, newsletter stacks, wizard buttons full-width · `≤767px` footer padding override, heavy animations slowed/disabled (logo marquee 50s, hero zoom 32s, cursor glow & orbs off).

---

## 11. Animations

**Global easing defaults:** `ease-out` for entrances, `cubic-bezier(.4,0,.2,1)` for movement, spring `cubic-bezier(.34,1.56,.64,1)` for pop effects. All animations disabled under `prefers-reduced-motion`.

| Animation | Type | Duration | Delay | Easing | Trigger |
|---|---|---|---|---|---|
| Hero title/copy/buttons | fade-up 44px (`heroFadeUp`) | 0.9s | 0.2 / 0.5 / 0.75 / 0.95s | ease-out | page load |
| Contact widget entrance | slide-in from right 44px | 0.9s | 1.1s | ease-out | page load |
| Widget social icons | fade-up stagger | 0.55s | 1.3s + 0.12s×n | ease-out | page load |
| Widget social hover | lift + scale 1.12 | 0.25s | — | spring `(.34,1.56,.64,1)` | hover |
| Hero background zoom | scale 1→1.08 | 16s (32s mobile) | — | ease-in-out, alternate ∞ | page load |
| Blog/article/industries hero zoom | scale (1.05)→1.12 | 18s | — | ease-in-out, alternate ∞ | page load |
| Scroll indicator | fade-up then bounce 8px | 0.9s + 2s ∞ | 1.5s / 2.5s | ease-out / ease-in-out | page load |
| Scroll reveal (`.reveal → .in-view`) | fade + translateY 28–32px (or ±36–44px X, scale 0.9) | 0.65–0.7s | staggers 0.05–0.46s | ease-out | IntersectionObserver, threshold 0.1–0.12, once |
| Stat counters (Home) | count-up + pulse scale 1.06 | 1.9s + 0.55s | — | cubic ease-out `1−(1−p)³` | observer at 30% visible, once |
| Article counters | count-up | 1.6s | — | cubic ease-out | observer at 30%, once |
| Logo marquee | translateX 0→−50% loop | 30s (50s mobile) | — | linear ∞ | always; **pauses on hover** |
| Floating elements (`floatY`, `floatImg`, `floatSlow`) | vertical drift 8–12px (±2° rotate) | 3–12s | 0–3s | ease-in-out ∞ | always |
| Stats orbs | drift 16px + scale 1.05 | 8–10s | 0–3s | ease-in-out ∞ | always (hidden mobile) |
| Play button ring | pulse ring scale 1→1.75, fade | 2s | — | ease-out ∞ | always |
| Card hovers | translateY(−4 to −8px) + shadow | 0.3–0.35s | — | `cubic-bezier(.4,0,.2,1)` | hover |
| Card image zoom | scale 1.05–1.10 | 0.55–0.7s | — | `cubic-bezier(.4,0,.2,1)` | card hover |
| Nav underline | width 0→100% | 0.3s | — | `cubic-bezier(.4,0,.2,1)` | hover |
| Button hovers | lift −1 to −3px, shadow deepen, sweep highlight | 0.2–0.28s | — | ease / cubic-bezier | hover |
| Modal open | fade backdrop + scale 0.94→1, rise 16px | 0.3s / 0.35s | — | ease / spring `(.34,1.56,.64,1)` | click |
| Mobile drawer | slide −100%→0 + overlay fade | 0.3s | — | ease | hamburger |
| Video carousel slide | translateX per slide | 0.45s | — | `cubic-bezier(.4,0,.2,1)` | swipe (>40px) / arrows / dots |
| Quote wizard steps | fade + rise 10px between steps | 0.4s | — | ease | step buttons |
| Cursor glow (Home) | 480px radial follows cursor | rAF (instant) + 0.4s opacity | — | — | mousemove (desktop only) |
| About image parallax | 3D tilt ±7° + scale 1.02 | 0.08s follow / 0.5s reset | — | ease-out | mousemove (hover-capable only) |
| Scroll progress bar | width 0→100%, 2px gradient `#014e2a→#92d5a6` | 0.1s | — | linear | scroll |

---

*Generated from the codebase on 2026-07-04. Key files: `app/globals.css` (all tokens & component CSS), `components/layout/*` (nav/footer), `components/ui/*`, per-page components under `components/` and `app/`.*
