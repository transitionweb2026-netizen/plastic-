# Product Photography Specification — Giant Storage

Hand this document to the photographer / client. Sizes below are **calculated
from the actual rendered layout**, not generic guesses.

## How the layout actually renders (the math)

| Surface | Largest CSS render | Largest physical pixels needed (retina) |
|---|---|---|
| Product card image frame | 421 × 316 px (desktop 3-col) · up to ~428 px wide full-bleed on phones | ≈ **1284 × 963 px** (428 CSS × 3× DPR phones) |
| Modal main preview (16:9 frame, square images shown un-cropped) | 518 × 518 px | ≈ **1036 × 1036 px** (2× DPR) |
| Gallery thumbnails | 76 × 57 px | ≈ 228 × 171 px (generated automatically from gallery files) |

**Conclusion: 1200 × 1200 px is the correct target for this design** — it covers
the worst-case physical resolution of both surfaces with headroom, and larger
files would only add weight with no visible gain. No separate thumbnail files
are needed.

## 1. Card cover image (collapsed card) — 1 per product

| Property | Requirement |
|---|---|
| File name | `cover.webp` (or `cover.jpg` / `cover.png`) |
| Size | **1200 × 1200 px** (1:1) |
| Format | WebP preferred · JPG or PNG accepted |
| Background | Pure white `#FFFFFF` or transparent (page shows a light `#f5f3f5` behind transparency) |
| **⚠ Safe area** | The card frame crops the square to **4:3** — only the **central 1200 × 900 px** is visible. Keep the entire product (and its shadow) inside that central band; nothing important in the top or bottom **150 px**. |
| Target weight | ≤ 250 KB |

## 2. Gallery images (expanded card) — 4–5 per product

| Property | Requirement |
|---|---|
| Quantity | 4–5 images, **same product** in every frame (no color/model changes) |
| File names | Choose from: `front` · `back` · `left` · `right` · `side` · `top` · `detail` · `lifestyle` (+ `.webp`/`.jpg`/`.png`). Display order follows that list; `front` is the default selected image. |
| Size | **1200 × 1200 px** each (1:1) — displayed un-cropped, so no safe-area worries |
| Background | Pure white `#FFFFFF` (mandatory — the preview pane is white, so the photo must blend seamlessly) |
| Consistency | Identical lighting, shadow style, camera height, and product scale across all angles of a product — and ideally across all 30 products |
| Target weight | ≤ 250 KB each |

## 3. Recommended shot list per product (5 frames)

1. `front.webp` — straight-on front view
2. `back.webp` — straight-on back view
3. `side.webp` — left or right profile (or supply both `left`/`right` as the 4–5th)
4. `top.webp` — top-down view (important for pallets/crates — shows deck pattern)
5. `detail.webp` — close-up of a signature feature (corner reinforcement, lid seal, RFID pocket…)

`lifestyle.webp` (in-warehouse context shot) is optional as a 6th; white
background is **not** required for lifestyle only.

## 4. Delivery structure

One folder per product, exactly:

```
products/
  product-1/   cover.webp  front.webp  back.webp  side.webp  top.webp  detail.webp
  product-2/   …
  ⋮
  product-30/  …
```

Product IDs 1–30 map to the catalog in `lib/products.ts` (ID is shown in the
admin/dev data; we can supply an ID ↔ product-name sheet on request).

## 5. Installation (for the developer — no code changes)

1. Drop the delivered folders into `public/products/`, **deleting the
   placeholder `.jpg` files first** (if a placeholder `cover.jpg` sits next to
   a new `cover.webp`, the `.jpg` wins alphabetically).
2. Run `node scripts/generate-product-images.mjs --manifest-only` to refresh
   the manifest.
3. Done — cards, galleries, and thumbnails update automatically.

**Total deliverable: 30 covers + 120–150 gallery shots, all 1200 × 1200 px.**
