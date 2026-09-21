# Nefin Beauty — 3D scroll web sitesi

Marka sitesi: Next.js 16 (App Router) + TypeScript + React Three Fiber.
Plan ve strateji: `icerik-vault/02-Websites/projects/nefin-beauty/nefin-web-3d-plani.md`.

## Çalıştırma

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npx next start
```

## İçerik nereden geliyor?

Sitedeki **hiçbir pazarlama metni üretilmemiştir**; tamamı müşterinin kendi kaynaklarından alınır:

| Veri | Kaynak | Yenileme |
|---|---|---|
| Ürünler, fiyatlar, faydalar, kullanım, INCI | canlı nefinbeauty.com | `python3 scripts/scrape-catalog.py` → `content/products.json` |
| Hakkımızda metni, cilt endişeleri | nefinbeauty.com/hakkimizda ve ana sayfa | `content/site.ts` (elle) |
| Ürün/doku videoları, editoryal görseller | `icerik-vault/03-Assets/.../nefin-beauty` | `node scripts/prepare-assets.mjs` |

`prepare-assets.mjs` görselleri sharp ile webp+avif'e, videoları ffmpeg ile 1280px h264'e çevirir
ve poster kareleri üretir. `VAULT=/yol/icerik-vault` ile vault yolu değiştirilebilir.

## 3D

`components/scene/` — amber damlalıklı şişe **prosedürel** olarak modellenmiştir (LatheGeometry +
MeshTransmissionMaterial). Müşteriden çok açılı stüdyo fotoğrafları gelince Blender'da modellenen
glTF ile değiştirilecek; `<Bottle />` arayüzü aynı kalır.

Güvenlik ağı: WebGL yoksa veya `prefers-reduced-motion: reduce` ise sahne hiç yüklenmez, yerine
gerçek ürün fotoğrafı gösterilir. Zayıf cihazlarda (`deviceMemory`/`hardwareConcurrency`) pahalı
cam malzemesi ve altın tanecikler kapanır.

## Ölçümler (yerel üretim derlemesi)

| | Canlı site | Bu site |
|---|---|---|
| İlk yük | 13,7 MB | **559 KB** |
| İstek | 58 | 27 |
| LCP | — | ~0,1 sn (yerel) |

## Kapsam

Faz 1: marka sitesi + katalog + ürün sayfaları. Sepet/ödeme henüz yok — "Satın al" mevcut
mağazadaki ürün sayfasına gider. Eski `/product-<id>` adresleri yeni slug'lara 301 yönlendirilir
(`next.config.ts`).
