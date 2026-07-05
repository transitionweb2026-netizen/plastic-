/**
 * Generates per-product image sets under public/products/product-{id}/
 * and the lib/product-images.json manifest the catalog reads.
 *
 * PLACEHOLDER STRATEGY: until real studio photography exists, every "angle"
 * is derived from the product's own catalog photo (square crop, mirror,
 * close-up zoom, top crop, wide) — always the SAME product. When the
 * photographer delivers real 1200×1200 white-background shots, overwrite
 * the files in each product folder (keeping the file names) and re-run
 * nothing — or add/remove files and re-run this script with --manifest-only
 * after editing the folders.
 *
 * Usage: node scripts/generate-product-images.mjs [--manifest-only]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "products");
const MANIFEST = path.join(ROOT, "lib", "product-images.json");
const SIZE = 1200;
const QUALITY = 78;

// Extract {id, image} pairs from lib/products.ts
const src = fs.readFileSync(path.join(ROOT, "lib", "products.ts"), "utf8");
const products = [];
const re = /"id":\s*(\d+)[\s\S]*?"image":\s*"(https:[^"]+)"/g;
let m;
while ((m = re.exec(src))) products.push({ id: +m[1], image: m[2] });
console.log(`Found ${products.length} products`);

// Recognized gallery file names, in display order (first found = default
// image). The generator only creates the first five; clients may supply any.
const ANGLES = [
  "front",
  "back",
  "left",
  "right",
  "side",
  "top",
  "detail",
  "lifestyle",
];
const manifestOnly = process.argv.includes("--manifest-only");

async function makeVariants(id, buf) {
  const dir = path.join(OUT_DIR, `product-${id}`);
  fs.mkdirSync(dir, { recursive: true });
  const img = sharp(buf);
  const meta = await img.metadata();
  const side = Math.min(meta.width, meta.height);
  const sq = (extra) =>
    sharp(buf)
      .extract({
        left: Math.floor((meta.width - side) / 2),
        top: Math.floor((meta.height - side) / 2),
        width: side,
        height: side,
        ...extra,
      })
      .resize(SIZE, SIZE);

  const jobs = {
    "cover.jpg": sq(),
    "front.jpg": sq(),
    "back.jpg": sq().flop(),
    // close-up: center 62% of the square
    "detail.jpg": sharp(buf)
      .extract({
        left: Math.floor((meta.width - side * 0.62) / 2),
        top: Math.floor((meta.height - side * 0.62) / 2),
        width: Math.floor(side * 0.62),
        height: Math.floor(side * 0.62),
      })
      .resize(SIZE, SIZE),
    // side: mirrored close-ish crop (78%)
    "side.jpg": sharp(buf)
      .extract({
        left: Math.floor((meta.width - side * 0.78) / 2),
        top: Math.floor((meta.height - side * 0.78) / 2),
        width: Math.floor(side * 0.78),
        height: Math.floor(side * 0.78),
      })
      .flop()
      .resize(SIZE, SIZE),
    // top: crop biased to the upper part of the frame
    "top.jpg": sharp(buf)
      .extract({
        left: Math.floor((meta.width - side) / 2),
        top: 0,
        width: side,
        height: side,
      })
      .resize(SIZE, SIZE),
  };
  for (const [name, pipeline] of Object.entries(jobs)) {
    await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(
      path.join(dir, name)
    );
  }
}

const manifest = {};
for (const p of products) {
  const dir = path.join(OUT_DIR, `product-${p.id}`);
  if (!manifestOnly) {
    try {
      const res = await fetch(p.image);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await makeVariants(p.id, buf);
      console.log(`product-${p.id}: generated`);
    } catch (err) {
      console.error(`product-${p.id}: FAILED (${err.message}) — skipped`);
    }
  }
  // Manifest reflects whatever files actually exist in the folder.
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
    const cover = files.find((f) => f.startsWith("cover"));
    const angles = ANGLES.map((a) =>
      files.find((f) => f.startsWith(a))
    ).filter(Boolean);
    if (cover || angles.length) {
      manifest[p.id] = {
        ...(cover && { cover: `/products/product-${p.id}/${cover}` }),
        images: angles.map((f) => `/products/product-${p.id}/${f}`),
      };
    }
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote manifest for ${Object.keys(manifest).length} products -> ${MANIFEST}`);
