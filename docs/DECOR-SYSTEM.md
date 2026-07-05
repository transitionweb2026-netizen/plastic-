# Decorative Background System

Reusable industrial SVG decorations for empty whitespace. Everything lives in
[`components/ui/DecorArt.tsx`](../components/ui/DecorArt.tsx) (server components, zero JS)
with supporting CSS in `app/globals.css`. Brand palette only.

## Shared conventions

- **Position & size via `className`** — components render an `<svg>`/`<div>`; you place it:
  `className="absolute -bottom-8 right-4 w-[380px] hidden lg:block"`
- **`tone`** — `"dark"` (default, `#014e2a` strokes for light backgrounds) or
  `"light"` (`#92d5a6` strokes for dark sections).
- **`opacity`** — 0.02–0.06 recommended (each component has a tuned default).
- **Host section** needs `relative` (usually `relative overflow-hidden`).
- Everything is `aria-hidden` + `pointer-events: none` — never interactive, never read by screen readers.
- Line art **draws itself on load** (`.draw-auto` stroke animation, 2.4s).
- All motion is transform/opacity/stroke only (GPU-composited) and disabled under `prefers-reduced-motion`.

### Motion add-ons (via `className`)

| Class | Effect |
|---|---|
| `decor-breathe` | slow 9s scale/opacity breathing |
| `decor-scroll-rotate` | rotates with scroll position (CSS scroll timeline; static fallback) |

## Catalog

### Technical line art (self-drawing)

| Component | What it draws | Good for |
|---|---|---|
| `PalletBlueprint` | isometric pallet wireframe + dimension line | hero side whitespace, dark bands (`tone="light"`) |
| `CrateSchematic` | front-view crate with slats + vertical dimension line | bottom corners, sidebars |
| `RackOutline` | racking bay with palletized loads | section edges, marquee corners |
| `CircuitLines` | angular schematic traces with nodes | top/bottom margins |
| `EngineeringLines` | centerlines, arcs, callout leaders, reference square | large empty backgrounds |
| `DimensionLine` | horizontal measure line with arrows + ticks | under/behind headings, between blocks |
| `BlueprintFrame` | drawing-sheet double border + title block | framing big empty areas |

### Geometric outlines

| Component | Props beyond shared | Notes |
|---|---|---|
| `HexOutline` | — | single large hexagon |
| `HexCluster` | — | 3-hex honeycomb |
| `OutlineCircle` | `dashed` | crosshair center marks included |
| `OutlineSquare` | — | outer solid + inner dashed square |

### Patterns & fills

| Component | Props beyond shared | Notes |
|---|---|---|
| `BlueprintGridBlock` | `fade`: `top/bottom/left/right/radial/none` | 40px engineering grid |
| `DotGrid` | `fade` | 18px dot matrix |
| `WarehousePattern` | `fade` | repeating stacked pallet/box tile |

### Accents

| Component | Props | Notes |
|---|---|---|
| `CornerAccent` | `corner`: `tl/tr/bl/br` | thin 56px L-shaped corner line |
| `IconWatermark` | `icon` (Material Symbols name) | size via `className` font-size, e.g. `text-[180px]` |

### CSS-only utilities (plain `div` + class)

`decor-orb` (drifting radial glow) · `decor-ring` / `decor-ring-static` (floating outline square) ·
`decor-icon` (legacy watermark) · `blueprint-grid` · `noise-overlay` (grain for dark bands).

## Usage examples

```tsx
import {
  PalletBlueprint,
  DotGrid,
  CornerAccent,
  IconWatermark,
} from "@/components/ui/DecorArt";

<section className="relative overflow-hidden py-24">
  {/* breathing blueprint in the right whitespace, desktop only */}
  <PalletBlueprint className="decor-breathe absolute top-8 right-6 w-[420px] hidden lg:block" />

  {/* dot matrix fading out toward the bottom */}
  <DotGrid fade="bottom" className="absolute inset-x-0 top-0 h-64 w-full" />

  {/* corner + watermark */}
  <CornerAccent corner="tr" className="absolute top-6 right-6 hidden md:block" />
  <IconWatermark icon="forklift" opacity={0.03} className="absolute bottom-4 left-8 text-[200px] hidden xl:block" />

  {/* …existing content untouched… */}
</section>
```

On dark sections, add `tone="light"`:

```tsx
<RackOutline tone="light" className="absolute -bottom-6 -left-8 w-[300px]" />
```

**Placement rules of thumb:** put art in genuinely empty zones (side margins,
corners, between blocks); hide big pieces on mobile (`hidden lg:block`); one or
two pieces per section maximum — the system reads premium at low density.
