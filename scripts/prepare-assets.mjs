#!/usr/bin/env node
/**
 * prepare-assets.mjs — vault'taki gerçek Nefin medyasını ve canlı katalog
 * görsellerini web için optimize edip public/ altına koyar.
 *
 *   node scripts/prepare-assets.mjs
 *
 * Görseller: sharp (webp + avif). Videolar: ffmpeg (h264, sessiz, faststart) + poster.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const VAULT = process.env.VAULT || path.join(process.env.HOME, "icerik-vault");
const IMG = path.join(VAULT, "03-Assets/images/nefin-beauty");
const VID = path.join(VAULT, "03-Assets/videos/nefin-beauty");
const OUT = path.join(ROOT, "public");
const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0) + " KB";

fs.mkdirSync(path.join(OUT, "media"), { recursive: true });
fs.mkdirSync(path.join(OUT, "urun"), { recursive: true });

async function image(src, name, width, quality = 80) {
  if (!fs.existsSync(src)) return console.log(`  ! yok: ${path.basename(src)}`);
  const base = path.join(OUT, "media", name);
  await sharp(src).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(`${base}.webp`);
  await sharp(src).rotate().resize({ width, withoutEnlargement: true }).avif({ quality: quality - 10 }).toFile(`${base}.avif`);
  console.log(`  ✓ ${name}  webp ${kb(`${base}.webp`)} · avif ${kb(`${base}.avif`)}`);
}

function video(src, name, width = 1280) {
  if (!fs.existsSync(src)) return console.log(`  ! yok: ${path.basename(src)}`);
  const mp4 = path.join(OUT, "media", `${name}.mp4`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", src,
    "-vf", `scale='min(${width},iw)':-2`, "-c:v", "libx264", "-crf", "27", "-preset", "slow",
    "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4]);
  const tmp = path.join(OUT, "media", `${name}-poster.png`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "0.3", "-i", mp4, "-frames:v", "1", tmp]);
  return sharp(tmp).resize({ width: 960 }).webp({ quality: 74 })
    .toFile(path.join(OUT, "media", `${name}-poster.webp`))
    .then(() => { fs.unlinkSync(tmp); console.log(`  ✓ ${name}.mp4 ${kb(mp4)} (+poster)`); });
}

const download = (url, file) => new Promise((res, rej) => {
  https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
    if (r.statusCode !== 200) { r.resume(); return res(false); }
    const w = fs.createWriteStream(file);
    r.pipe(w); w.on("finish", () => res(true)); w.on("error", rej);
  }).on("error", rej);
});

console.log("Görseller (vault):");
await image(path.join(IMG, "nefin_hero.png"), "hero", 1800, 82);
await image(path.join(IMG, "nefin-beauty-cream-texture-editorial-v1.png"), "editorial-cream", 1600);
await image(path.join(IMG, "nefin-beauty-gold-tonic-liquid-macro-v1.jpg"), "macro-gold", 1600);
await image(path.join(IMG, "nefin-beauty-gel-droplet-texture-macro-referans-v1.png"), "macro-gel", 1600);
await image(path.join(IMG, "nefin-beauty-daily-moisture-cream-ecommerce-hero-v1.png"), "cream-hero", 1400);
await image(path.join(IMG, "Gemini_Generated_Image_fqpt5kfqpt5kfqpt.png"), "editorial-1", 1400);
await image(path.join(IMG, "Gemini_Generated_Image_uuhqycuuhqycuuhq.png"), "editorial-2", 1400);
await image(path.join(IMG, "Gemini_Generated_Image_ogdjmvogdjmvogdj.jpeg"), "editorial-3", 1400);
for (const t of ["vitamin-c-serum", "gold-tonic", "daily-moisture-cream", "acne-derm", "retinol-supreme"]) {
  await image(path.join(IMG, `nefin-beauty-${t}-ingredient-tubes-v1.png`), `tubes-${t}`, 1200);
}

console.log("Videolar (vault):");
await video(path.join(VID, "nefin-beauty-gold-tonic-hero-v1.mp4"), "gold-tonic");
await video(path.join(VID, "nefin-beauty-daily-moisture-cream-hero-v1.mp4"), "cream");
await video(path.join(VID, "karma/nefin-beauty-vitamin-c-serum-pipette-drop-karma-v1.mp4"), "pipette");
await video(path.join(VID, "nefin-beauty-sunscreen-natural-application-v1.mp4"), "sunscreen");

console.log("Katalog görselleri (canlı siteden):");
const products = JSON.parse(fs.readFileSync(path.join(ROOT, "content/products.json"), "utf8"));
for (const p of products) {
  const dest = path.join(OUT, "urun", `${p.slug}.webp`);
  if (fs.existsSync(dest)) { console.log(`  · ${p.slug} (var)`); continue; }
  const tmp = dest + ".tmp";
  const ok = p.images[0] && await download(p.images[0], tmp);
  if (!ok) { console.log(`  ! ${p.slug} indirilemedi`); continue; }
  await sharp(tmp).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
  fs.unlinkSync(tmp);
  console.log(`  ✓ ${p.slug} ${kb(dest)}`);
}

const size = (d) => execFileSync("du", ["-sh", path.join(OUT, d)]).toString().trim();
console.log(`\n${size("media")}\n${size("urun")}`);
