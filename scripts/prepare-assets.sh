#!/usr/bin/env bash
# prepare-assets.sh — vault'taki gerçek Nefin medyasını ve canlı katalog görsellerini
# web için optimize edip public/ altına koyar. ffmpeg gerekir.
set -euo pipefail

VAULT="${VAULT:-$HOME/icerik-vault}"
IMG="$VAULT/03-Assets/images/nefin-beauty"
VID="$VAULT/03-Assets/videos/nefin-beauty"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public"

mkdir -p "$OUT/media" "$OUT/urun"

webp() { # kaynak hedef genişlik kalite
  [ -f "$1" ] || { echo "  ! yok: $1"; return 0; }
  ffmpeg -v error -y -i "$1" -vf "scale='min($3,iw)':-2" -c:v libwebp -quality "${4:-82}" "$2"
  echo "  ✓ $(basename "$2") $(du -h "$2" | cut -f1)"
}

mp4() { # kaynak hedef genişlik
  [ -f "$1" ] || { echo "  ! yok: $1"; return 0; }
  ffmpeg -v error -y -i "$1" -vf "scale='min($3,iw)':-2" -c:v libx264 -crf 27 -preset slow \
    -profile:v high -pix_fmt yuv420p -movflags +faststart -an "$2"
  ffmpeg -v error -y -i "$2" -frames:v 1 -vf "scale=640:-2" "${2%.mp4}.webp" -c:v libwebp -quality 78
  echo "  ✓ $(basename "$2") $(du -h "$2" | cut -f1) (+poster)"
}

echo "Görseller:"
webp "$IMG/nefin_hero.png"                                        "$OUT/media/hero.webp"            1800
webp "$IMG/nefin-beauty-cream-texture-editorial-v1.png"           "$OUT/media/editorial-cream.webp" 1600
webp "$IMG/nefin-beauty-gold-tonic-liquid-macro-v1.jpg"           "$OUT/media/macro-gold.webp"      1600
webp "$IMG/nefin-beauty-gel-droplet-texture-macro-referans-v1.png" "$OUT/media/macro-gel.webp"      1600
webp "$IMG/nefin-beauty-daily-moisture-cream-ecommerce-hero-v1.png" "$OUT/media/cream-hero.webp"    1400
webp "$IMG/Gemini_Generated_Image_fqpt5kfqpt5kfqpt.png"           "$OUT/media/editorial-1.webp"     1400
webp "$IMG/Gemini_Generated_Image_uuhqycuuhqycuuhq.png"           "$OUT/media/editorial-2.webp"     1400
webp "$IMG/Gemini_Generated_Image_ogdjmvogdjmvogdj.jpeg"          "$OUT/media/editorial-3.webp"     1400
for t in vitamin-c-serum gold-tonic daily-moisture-cream acne-derm retinol-supreme; do
  webp "$IMG/nefin-beauty-$t-ingredient-tubes-v1.png" "$OUT/media/tubes-$t.webp" 1200
done

echo "Videolar:"
mp4 "$VID/nefin-beauty-gold-tonic-hero-v1.mp4"                    "$OUT/media/gold-tonic.mp4"   1280
mp4 "$VID/nefin-beauty-daily-moisture-cream-hero-v1.mp4"          "$OUT/media/cream.mp4"        1280
mp4 "$VID/karma/nefin-beauty-vitamin-c-serum-pipette-drop-karma-v1.mp4" "$OUT/media/pipette.mp4" 1280
mp4 "$VID/nefin-beauty-sunscreen-natural-application-v1.mp4"      "$OUT/media/sunscreen.mp4"    1280

echo "Katalog görselleri (canlı siteden):"
node - <<'JS'
const fs=require('fs'), path=require('path'), https=require('https');
const out=path.join(__dirname,'..','public','urun');
const products=JSON.parse(fs.readFileSync(path.join(__dirname,'..','content','products.json'),'utf8'));
(async()=>{
  for (const p of products) {
    const url=p.images[0]; if(!url) continue;
    const file=path.join(out, `${p.slug}.webp`);
    if (fs.existsSync(file)) { console.log('  · var', p.slug); continue; }
    await new Promise((res,rej)=>https.get(url,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{
      if(r.statusCode!==200){ console.log('  ! ', r.statusCode, p.slug); r.resume(); return res(); }
      const w=fs.createWriteStream(file); r.pipe(w); w.on('finish',()=>{ console.log('  ✓', p.slug); res(); });
    }).on('error',rej));
  }
})();
JS
echo
du -sh "$OUT/media" "$OUT/urun"
