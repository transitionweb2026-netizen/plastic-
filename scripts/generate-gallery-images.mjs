/**
 * Generates PLACEHOLDER gallery assets into public/gallery/images/ and the
 * lib/gallery-manifest.json the Gallery page reads.
 *
 * Sources: the industrial/warehouse photography already used across the
 * site (scanned from lib/ and components/), cropped into a masonry-friendly
 * mix of landscape / square / portrait / wide shapes.
 *
 * TODO: when the client's real gallery photos arrive, overwrite the files
 * in public/gallery/images/ (keeping names img-01.jpg … img-NN.jpg and
 * roughly similar shapes) — no code change needed. To change the set size
 * or shapes, edit SHAPES below and re-run:  node scripts/generate-gallery-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "gallery", "images");
const MANIFEST = path.join(ROOT, "lib", "gallery-manifest.json");

// Masonry shape cycle: [width, height]
const SHAPES = [
  [1200, 900], // landscape 4:3
  [1200, 1500], // portrait 4:5
  [1200, 1200], // square
  [1200, 675], // wide 16:9
];
const MAX_IMAGES = 16;
const QUALITY = 76;

// Collect unique lh3 image URLs used across the site's data/components.
const files = [
  "lib/articles.ts",
  "lib/industries.ts",
  "app/page.tsx",
  "app/blog/page.tsx",
  "app/about/page.tsx",
  "components/home/VideoSection.tsx",
  "components/industries/IndustriesContent.tsx",
  "app/contact/page.tsx",
];
const urls = [];
for (const f of files) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  const found =
    fs.readFileSync(p, "utf8").match(/https:\/\/lh3\.googleusercontent\.com[^"'\s\\]+/g) ?? [];
  for (const u of found) if (!urls.includes(u)) urls.push(u);
}
console.log(`Found ${urls.length} unique source images`);

fs.mkdirSync(OUT_DIR, { recursive: true });
const manifest = [];
let n = 0;
for (const url of urls) {
  if (n >= MAX_IMAGES) break;
  const idx = n + 1;
  const [w, h] = SHAPES[n % SHAPES.length];
  const name = `img-${String(idx).padStart(2, "0")}.jpg`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize(w, h, { fit: "cover", position: "attention" })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(path.join(OUT_DIR, name));
    manifest.push({ file: `/gallery/images/${name}`, width: w, height: h });
    console.log(`${name}: ${w}x${h}`);
    n++;
  } catch (err) {
    console.error(`skip (${err.message}): ${url.slice(0, 80)}`);
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${manifest.length} entries -> ${MANIFEST}`);
