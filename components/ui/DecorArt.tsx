/**
 * Inline-SVG industrial decorations for empty whitespace: blueprint-style
 * line art in the brand palette. Server-rendered, zero JS. Strokes carry
 * pathLength={1} + the .draw-auto class, so they self-draw on load (see
 * globals.css). `tone="light"` switches strokes to the pale green used on
 * dark sections. All art is aria-hidden and pointer-transparent.
 */

type ArtProps = {
  className?: string;
  tone?: "dark" | "light";
};

function strokeColor(tone: "dark" | "light" = "dark") {
  return tone === "light" ? "#92d5a6" : "#0e4a30";
}

const common = {
  fill: "none",
  strokeWidth: 1.5,
  vectorEffect: "non-scaling-stroke",
} as const;

/** Isometric plastic pallet wireframe with a dimension line underneath. */
export function PalletBlueprint({ className = "", tone = "dark" }: ArtProps) {
  const s = strokeColor(tone);
  const p = { ...common, stroke: s, pathLength: 1, className: "draw-auto" };
  return (
    <svg
      viewBox="0 0 340 220"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: tone === "light" ? 0.09 : 0.1 }}
    >
      {/* top deck */}
      <polygon points="60,60 250,20 320,60 130,100" {...p} />
      {/* deck slats */}
      <line x1="95" y1="52.5" x2="165" y2="92.5" {...p} />
      <line x1="133" y1="44.5" x2="203" y2="84.5" {...p} />
      <line x1="171" y1="36.5" x2="241" y2="76.5" {...p} />
      <line x1="209" y1="28.5" x2="279" y2="68.5" {...p} />
      {/* deck thickness */}
      <polyline points="60,60 60,74 130,114 130,100" {...p} />
      <polyline points="320,60 320,74 130,114" {...p} />
      {/* legs */}
      <polyline points="74,82 74,104 100,119 100,96" {...p} />
      <polyline points="160,131 160,152 186,167 186,146" {...p} />
      <polyline points="252,74 252,96 278,111 278,88" {...p} />
      {/* base runner */}
      <polyline points="60,118 160,176 320,118" {...p} />
      {/* dimension line */}
      <line x1="60" y1="202" x2="320" y2="202" {...p} />
      <polyline points="70,196 60,202 70,208" {...p} />
      <polyline points="310,196 320,202 310,208" {...p} />
      <line x1="60" y1="192" x2="60" y2="212" {...p} />
      <line x1="320" y1="192" x2="320" y2="212" {...p} />
    </svg>
  );
}

/** Front-view crate schematic with a vertical dimension line. */
export function CrateSchematic({ className = "", tone = "dark" }: ArtProps) {
  const s = strokeColor(tone);
  const p = { ...common, stroke: s, pathLength: 1, className: "draw-auto" };
  return (
    <svg
      viewBox="0 0 260 210"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: tone === "light" ? 0.09 : 0.1 }}
    >
      <rect x="20" y="20" width="180" height="170" rx="8" {...p} />
      <rect x="34" y="34" width="152" height="142" rx="5" {...p} />
      {/* vertical slats */}
      <line x1="72" y1="34" x2="72" y2="176" {...p} />
      <line x1="110" y1="34" x2="110" y2="176" {...p} />
      <line x1="148" y1="34" x2="148" y2="176" {...p} />
      {/* handle slot */}
      <rect x="86" y="48" width="48" height="14" rx="7" {...p} />
      {/* feet */}
      <line x1="30" y1="190" x2="56" y2="190" {...p} />
      <line x1="164" y1="190" x2="190" y2="190" {...p} />
      {/* vertical dimension line */}
      <line x1="232" y1="20" x2="232" y2="190" {...p} />
      <polyline points="226,30 232,20 238,30" {...p} />
      <polyline points="226,180 232,190 238,180" {...p} />
      <line x1="222" y1="20" x2="242" y2="20" {...p} />
      <line x1="222" y1="190" x2="242" y2="190" {...p} />
    </svg>
  );
}

/** Warehouse racking wireframe with palletized loads. */
export function RackOutline({ className = "", tone = "dark" }: ArtProps) {
  const s = strokeColor(tone);
  const p = { ...common, stroke: s, pathLength: 1, className: "draw-auto" };
  return (
    <svg
      viewBox="0 0 300 230"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: tone === "light" ? 0.09 : 0.1 }}
    >
      {/* uprights */}
      <line x1="20" y1="10" x2="20" y2="220" {...p} />
      <line x1="280" y1="10" x2="280" y2="220" {...p} />
      {/* bracing */}
      <line x1="20" y1="40" x2="280" y2="90" {...p} />
      <line x1="20" y1="130" x2="280" y2="90" {...p} />
      {/* beams */}
      <line x1="20" y1="90" x2="280" y2="90" {...p} />
      <line x1="20" y1="160" x2="280" y2="160" {...p} />
      <line x1="20" y1="220" x2="280" y2="220" {...p} />
      {/* loads: level 1 */}
      <rect x="42" y="120" width="60" height="40" rx="3" {...p} />
      <rect x="120" y="120" width="60" height="40" rx="3" {...p} />
      <rect x="198" y="120" width="60" height="40" rx="3" {...p} />
      {/* loads: level 2 */}
      <rect x="42" y="50" width="60" height="40" rx="3" {...p} />
      <rect x="198" y="50" width="60" height="40" rx="3" {...p} />
      {/* floor pallets */}
      <rect x="80" y="184" width="64" height="36" rx="3" {...p} />
      <rect x="162" y="184" width="64" height="36" rx="3" {...p} />
    </svg>
  );
}

/** Angular circuit/schematic traces with connection nodes. */
export function CircuitLines({ className = "", tone = "dark" }: ArtProps) {
  const s = strokeColor(tone);
  const p = { ...common, stroke: s, pathLength: 1, className: "draw-auto" };
  return (
    <svg
      viewBox="0 0 340 170"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: tone === "light" ? 0.1 : 0.11 }}
    >
      <polyline points="10,150 90,150 120,120 210,120" {...p} />
      <polyline points="40,150 40,80 80,40 170,40" {...p} />
      <polyline points="210,120 240,90 320,90" {...p} />
      <polyline points="170,40 210,40 250,10 330,10" {...p} />
      <polyline points="120,120 120,70 150,70" {...p} />
      <circle cx="210" cy="120" r="4" {...p} />
      <circle cx="170" cy="40" r="4" {...p} />
      <circle cx="320" cy="90" r="4" {...p} />
      <circle cx="330" cy="10" r="4" {...p} />
      <circle cx="150" cy="70" r="4" {...p} />
      <circle cx="10" cy="150" r="4" {...p} />
    </svg>
  );
}

/** Horizontal engineering dimension line with end stops and center ticks. */
export function DimensionLine({ className = "", tone = "dark" }: ArtProps) {
  const s = strokeColor(tone);
  const p = { ...common, stroke: s, pathLength: 1, className: "draw-auto" };
  return (
    <svg
      viewBox="0 0 420 36"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: tone === "light" ? 0.12 : 0.13 }}
    >
      <line x1="6" y1="18" x2="414" y2="18" {...p} />
      <polyline points="18,11 6,18 18,25" {...p} />
      <polyline points="402,11 414,18 402,25" {...p} />
      <line x1="6" y1="4" x2="6" y2="32" {...p} />
      <line x1="414" y1="4" x2="414" y2="32" {...p} />
      <line x1="140" y1="12" x2="140" y2="24" {...p} />
      <line x1="210" y1="10" x2="210" y2="26" {...p} />
      <line x1="280" y1="12" x2="280" y2="24" {...p} />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * DECORATIVE BACKGROUND SYSTEM — reusable building blocks
 * (see docs/DECOR-SYSTEM.md for the catalog and usage examples)
 *
 * Conventions shared by everything below:
 *  - Position/size via `className` (Tailwind: absolute, w-[...], hidden lg:block …)
 *  - `tone="light"` for dark sections (pale-green strokes) — default "dark"
 *  - `opacity` between 0.02 and 0.06 (defaults 0.05) — palette colors only
 *  - All elements render aria-hidden with pointer-events disabled
 *  - Line art draws itself on load (.draw-auto); add "decor-breathe" or
 *    "decor-scroll-rotate" through className for extra motion
 * ════════════════════════════════════════════════════════════════════ */

type SystemProps = ArtProps & {
  /** 0.02–0.06 recommended; defaults to 0.05 */
  opacity?: number;
};

type FadeEdge = "none" | "top" | "bottom" | "left" | "right" | "radial";

function fadeMask(fade: FadeEdge): React.CSSProperties {
  if (fade === "none") return {};
  const img =
    fade === "radial"
      ? "radial-gradient(circle, black 35%, transparent 75%)"
      : `linear-gradient(to ${fade}, black, transparent)`;
  return { maskImage: img, WebkitMaskImage: img };
}

/** Blueprint grid block (40px engineering grid) with an optional fade edge. */
export function BlueprintGridBlock({
  className = "",
  fade = "none",
}: {
  className?: string;
  fade?: FadeEdge;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none blueprint-grid ${className}`}
      style={fadeMask(fade)}
    />
  );
}

/** Dot-matrix grid (SVG pattern) with an optional fade edge. */
export function DotGrid({
  className = "",
  tone = "dark",
  opacity = 0.05,
  fade = "none",
}: SystemProps & { fade?: FadeEdge }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={fadeMask(fade)}
    >
      <defs>
        {/* Fixed ids are safe: duplicate defs are identical, so any
            instance resolving to the first still renders correctly. */}
        <pattern
          id={`decor-dots-${tone}`}
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="2"
            cy="2"
            r="1.5"
            fill={strokeColor(tone)}
            fillOpacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#decor-dots-${tone})`} />
    </svg>
  );
}

/** Repeating warehouse pattern: rows of stacked pallet/box outlines. */
export function WarehousePattern({
  className = "",
  tone = "dark",
  opacity = 0.045,
  fade = "none",
}: SystemProps & { fade?: FadeEdge }) {
  const s = strokeColor(tone);
  return (
    <svg
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={fadeMask(fade)}
    >
      <defs>
        <pattern
          id={`decor-warehouse-${tone}`}
          width="96"
          height="72"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke={s} strokeOpacity={opacity} strokeWidth="1.5">
            {/* box + pallet base, offset every second row */}
            <rect x="8" y="8" width="36" height="24" rx="2" />
            <line x1="8" y1="36" x2="44" y2="36" />
            <line x1="12" y1="36" x2="12" y2="40" />
            <line x1="40" y1="36" x2="40" y2="40" />
            <rect x="56" y="44" width="36" height="24" rx="2" />
            <line x1="56" y1="72" x2="92" y2="72" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#decor-warehouse-${tone})`} />
    </svg>
  );
}

/** Single large hexagon outline (self-drawing). */
export function HexOutline({
  className = "",
  tone = "dark",
  opacity = 0.06,
}: SystemProps) {
  const p = {
    ...common,
    stroke: strokeColor(tone),
    pathLength: 1,
    className: "draw-auto",
  };
  return (
    <svg
      viewBox="0 0 200 174"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: opacity }}
    >
      <polygon points="50,5 150,5 195,87 150,169 50,169 5,87" {...p} />
    </svg>
  );
}

/** Honeycomb cluster of hexagon outlines (self-drawing). */
export function HexCluster({
  className = "",
  tone = "dark",
  opacity = 0.05,
}: SystemProps) {
  const p = {
    ...common,
    stroke: strokeColor(tone),
    pathLength: 1,
    className: "draw-auto",
  };
  return (
    <svg
      viewBox="0 0 300 240"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: opacity }}
    >
      <polygon points="40,10 100,10 130,62 100,114 40,114 10,62" {...p} />
      <polygon points="160,40 220,40 250,92 220,144 160,144 130,92" {...p} />
      <polygon points="70,130 130,130 160,182 130,234 70,234 40,182" {...p} />
    </svg>
  );
}

/** Large outline circle with crosshair center — optionally dashed. */
export function OutlineCircle({
  className = "",
  tone = "dark",
  opacity = 0.05,
  dashed = false,
}: SystemProps & { dashed?: boolean }) {
  const s = strokeColor(tone);
  const stroke = {
    fill: "none",
    stroke: s,
    strokeWidth: 1.5,
    vectorEffect: "non-scaling-stroke",
  } as const;
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: opacity }}
    >
      <circle
        cx="100"
        cy="100"
        r="95"
        {...stroke}
        strokeDasharray={dashed ? "6 8" : undefined}
      />
      <line x1="100" y1="88" x2="100" y2="112" {...stroke} />
      <line x1="88" y1="100" x2="112" y2="100" {...stroke} />
    </svg>
  );
}

/** Large outline square (rounded) with an inner dashed square. */
export function OutlineSquare({
  className = "",
  tone = "dark",
  opacity = 0.05,
}: SystemProps) {
  const s = strokeColor(tone);
  const stroke = {
    fill: "none",
    stroke: s,
    strokeWidth: 1.5,
    vectorEffect: "non-scaling-stroke",
  } as const;
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: opacity }}
    >
      <rect x="5" y="5" width="190" height="190" rx="20" {...stroke} />
      <rect
        x="35"
        y="35"
        width="130"
        height="130"
        rx="12"
        {...stroke}
        strokeDasharray="4 8"
      />
    </svg>
  );
}

/** Thin corner decoration; pick which corner it hugs. */
export function CornerAccent({
  className = "",
  corner = "tl",
}: {
  className?: string;
  corner?: "tl" | "tr" | "bl" | "br";
}) {
  return <div aria-hidden className={`decor-corner-${corner} ${className}`} />;
}

/** Large Material Symbols icon watermark (size via className font-size). */
export function IconWatermark({
  icon,
  className = "",
  tone = "dark",
  opacity = 0.04,
}: SystemProps & { icon: string }) {
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined pointer-events-none select-none leading-none ${className}`}
      style={{ color: strokeColor(tone), opacity }}
    >
      {icon}
    </span>
  );
}

/** Abstract engineering sheet: centerlines, arcs, and callout leaders. */
export function EngineeringLines({
  className = "",
  tone = "dark",
  opacity = 0.06,
}: SystemProps) {
  const p = {
    ...common,
    stroke: strokeColor(tone),
    pathLength: 1,
    className: "draw-auto",
  };
  return (
    <svg
      viewBox="0 0 360 200"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: opacity }}
    >
      <line x1="90" y1="20" x2="90" y2="180" strokeDasharray="14 6 3 6" {...p} />
      <line x1="10" y1="100" x2="170" y2="100" strokeDasharray="14 6 3 6" {...p} />
      <path d="M 150 100 A 60 60 0 0 0 90 40" {...p} />
      <path d="M 130 100 A 40 40 0 0 0 90 60" {...p} />
      <polyline points="150,58 210,30 300,30" {...p} />
      <circle cx="300" cy="30" r="4" {...p} />
      <polyline points="140,130 220,168 330,168" {...p} />
      <circle cx="330" cy="168" r="4" {...p} />
      <rect x="260" y="80" width="56" height="56" rx="6" {...p} />
      <line x1="260" y1="108" x2="316" y2="108" {...p} />
    </svg>
  );
}

/** Blueprint sheet frame: double border + title-block corner. */
export function BlueprintFrame({
  className = "",
  tone = "dark",
  opacity = 0.05,
}: SystemProps) {
  const p = {
    ...common,
    stroke: strokeColor(tone),
    pathLength: 1,
    className: "draw-auto",
  };
  return (
    <svg
      viewBox="0 0 400 260"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ strokeOpacity: opacity }}
    >
      <rect x="6" y="6" width="388" height="248" rx="4" {...p} />
      <rect x="16" y="16" width="368" height="228" rx="2" {...p} />
      <polyline points="384,196 284,196 284,244" {...p} />
      <line x1="284" y1="212" x2="384" y2="212" {...p} />
      <line x1="284" y1="228" x2="384" y2="228" {...p} />
      <line x1="334" y1="196" x2="334" y2="244" {...p} />
    </svg>
  );
}
