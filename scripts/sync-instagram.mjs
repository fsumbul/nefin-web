#!/usr/bin/env node
/**
 * sync-instagram.mjs — vault'taki instagram-feed.md notundan "nefin + you" bölümü için
 * derleme zamanı veri üretir: content/instagram.json + public/ig/ kapak görselleri.
 * Metin (caption) taşınmaz; yalnızca görsel/poster ve hikaye kapakları.
 *
 *   node scripts/sync-instagram.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const VAULT = process.env.VAULT || path.join(process.env.HOME, "icerik-vault");
const OUT = path.join(ROOT, "public", "ig");
fs.mkdirSync(OUT, { recursive: true });

const { readFeed } = await import(pathToFileURL(path.join(VAULT, "scripts/lib/feed-note.js")).href);
const feed = readFeed("nefin-beauty");
if (!feed) { console.log("feed notu yok"); process.exit(0); }

async function thumb(rel, name, w = 720) {
  if (!rel) return "";
  const abs = path.join(VAULT, rel);
  if (!fs.existsSync(abs)) return "";
  const out = path.join(OUT, `${name}.webp`);
  await sharp(abs).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
  return `/ig/${name}.webp`;
}

const posts = [];
for (const [i, p] of feed.posts.slice(0, 9).entries()) {
  const src = p.poster || (/\.(mp4|mov)$/i.test(p.image) ? "" : p.image);
  const img = await thumb(src, `post-${i + 1}`);
  if (img) posts.push({ img, video: /\.(mp4|mov)$/i.test(p.image), status: p.status });
}
const stories = [];
for (const [i, s] of (feed.stories || []).entries()) {
  const src = s.poster || (/\.(mp4|mov)$/i.test(s.image) ? "" : s.image);
  const img = await thumb(src, `story-${i + 1}`, 240);
  if (img) stories.push({ img, text: s.text || "" });
}
const data = { username: feed.username, avatar: await thumb(feed.avatar, "avatar", 200), posts, stories, syncedAt: new Date().toISOString().slice(0, 10) };
fs.writeFileSync(path.join(ROOT, "content", "instagram.json"), JSON.stringify(data, null, 2));
console.log(`instagram.json → ${posts.length} gönderi, ${stories.length} hikaye`);
