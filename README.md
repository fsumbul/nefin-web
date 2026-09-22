# Nefin Beauty — "Berrak" web sitesi (v2)

Video-öncelikli, scroll-anlatılı marka sitesi. Next.js 16 (App Router) + TypeScript + GSAP ScrollTrigger + Lenis.
Plan ve geçiş promptu: `icerik-vault/02-Websites/projects/nefin-beauty/nefin-web-v2-berrak-plani.md`.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npx next start
```

## İçerik nereden geliyor?

Sitedeki **hiçbir pazarlama metni üretilmemiştir**; tamamı müşterinin kendi kaynaklarından:

| Veri | Kaynak | Yenileme |
|---|---|---|
| Ürünler, fiyatlar, faydalar, kullanım, INCI | canlı nefinbeauty.com | `python3 scripts/scrape-catalog.py` → `content/products.json` |
| Ürün hook cümleleri, aktif vurguları, marka mesajı, hero metinleri | müşterinin aylık içerik takvimi + sunum (vault) | `content/hooks.ts` (elle, birebir) |
| Hakkımızda, cilt endişeleri | nefinbeauty.com | `content/site.ts` |
| 14 klip + 27 packshot | `icerik-vault/01-Presentations/active/nefin-sunum/` | `node scripts/prepare-assets.mjs` → `public/deck/` |
| Instagram mozaiği | `icerik-vault/.../instagram-feed.md` | `node scripts/sync-instagram.mjs` → `content/instagram.json`, `public/ig/` |

`VAULT=/yol/icerik-vault` ile vault yolu değiştirilebilir.

## Sayfa anlatısı (ana sayfa)

Perde (oturumda 1 kez) → video hero (sunumdaki iki kampanya, 9 s döngü) → **ışığa çıkış** (video scroll'la küçülüp krem sayfaya yerleşir, tema koyu→açık) → manifesto (kelime kelime) → ürün hikâyesi (sabit medya + kayan bölümler) → doku galerisi (espresso, cam altyazılar) → rutin (altın çizgi çizilir) → kanıt (keten üstünde buzlu cam INCI paneli) → ihtiyaç→ürün filtresi (View Transitions) → nefin + you → hikâye → koyu kapanış.

## Hareket sözlüğü

`lib/motion.ts` ve `app/globals.css` tek kaynaktır: `cubic-bezier(.2,.7,.2,1)` girişler, `cubic-bezier(.65,0,.35,1)` geçişler, 70/90/40 ms stagger, satır-maske metin (`components/motion/Reveal.tsx`), cam paneller (`.glass`, `.glass-chip`).

Öğrenilen: GSAP `yPercent` tween'inde CSS'ten gelen `translateY(110%)` piksel `y` olarak okunup korunuyor — `y: 0` açıkça verilmeli. Reveal tetikleyicisi IntersectionObserver'dır; gizli sekmede beklemesi normaldir.

## Güvenlik ağı

`prefers-reduced-motion`: perde, Lenis, ScrollTrigger ve satır-maske kapalı; videolar poster olarak kalır. Videolar görünürde yüklenir (`LazyVideo`), sekme arkadayken durur. 3D şişe (`components/scene/`) hero'dan çıkarıldı, ürün sayfasında görüntüleyici olarak kullanılmak üzere duruyor.

## Kapsam

Sepet/ödeme yok (Faz 2–3); "Satın al" mevcut mağazaya gider. Eski `/product-<id>` adresleri yeni slug'lara 301 verir. Retinol Supreme canlı katalogda olmadığından sitede yer almaz. Logo geçici wordmark.
