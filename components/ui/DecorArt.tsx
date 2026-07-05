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
  return tone === "light" ? "#92d5a6" : "#014e2a";
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
