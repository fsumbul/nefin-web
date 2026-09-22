/**
 * Ürün başına onaylı anlatım — kaynak: müşterinin 1 aylık Instagram içerik takvimi
 * (icerik-vault/04-Sosyal-Medya-Icerik/nefin-beauty/aylik-icerik-takvimi.md, PDF'ten).
 * Hook cümleleri ve aktif vurguları birebir alınmıştır; yeni metin üretilmemiştir.
 * Anahtar = canlı katalogdaki ürün slug'ının başlangıcı.
 */

export type Hook = {
  match: string;          // slug ile eşleşme (startsWith)
  hook: string;           // takvimdeki hook / seslendirme cümlesi
  actives: string[];      // takvimdeki aktif/özellik vurguları
  clip?: string;          // public/deck altındaki klip adı
  shot?: string;          // public/deck altındaki packshot adı
  topic: string;          // takvimdeki "ana konu"
};

export const hooks: Hook[] = [
  // shot/clip eşlemesi sunum kontak sayfasından doğrulandı (22 Eylül 2026)
  { match: "24k-altin-tonik", topic: "24K Altın Tonik", hook: "Tonik sadece ferahlatmak için değil.", actives: ["24K altın", "sıkılaştırıcı", "yatıştırıcı"], clip: "gold", shot: "n_goldtonic" },
  { match: "ultra-nemlendirici-krem", topic: "Yoğun Nemlendirici Krem", hook: "Yağlı his bırakmadan yoğun nem mümkün mü?", actives: ["hızlı emilim", "yoğun nem"], clip: "nemli", shot: "n_cream" },
  { match: "nefin-cc-krem", topic: "CC Krem", hook: "Kapatıcılık mı, bakım mı? İkisi bir arada.", actives: ["SPF 30+ PA+++", "alpha arbutin", "kolajen"], clip: "cc", shot: "p_cc" },
  { match: "goz-cevresi-serumu", topic: "Göz Çevresi Serum", hook: "Göz çevresinde neden ayrı ürün kullanılır?", actives: ["peptit", "kafein", "nem desteği"], shot: "p_eye" },
  { match: "anti-akne-serum", topic: "Akne Karşıtı Serum", hook: "Yağı azaltırken cildi kurutmamak neden önemli?", actives: ["sebum dengesi", "aktifler"], clip: "drop", shot: "p_dropper" },
  { match: "acne-derm-krem", topic: "Acne-Derm Krem", hook: "Yağı azaltırken cildi kurutmamak neden önemli?", actives: ["sebum dengesi"], shot: "n_acnederm" },
  { match: "kolajen-serum", topic: "Kolajen Serum", hook: "Sıkılık ve elastikiyet için bakım rutini.", actives: ["kolajen", "peptit", "hyaluronat"], shot: "img_collagen" },
  { match: "c-vitamin-lipozomal-serum", topic: "Vitamin C+ Serum", hook: "Işıltı istiyorsanız rutininizde bu adımı atlamayın.", actives: ["%15 lipozomal C vitamini"], clip: "vitc2", shot: "n_serum" },
  { match: "leke-serumu", topic: "Leke Serumu", hook: "Leke görünümünde tek bir ürün değil, doğru rutin önemlidir.", actives: ["alfa arbutin", "niasinamid", "asitler"], clip: "vitc", shot: "p_tray" },
  { match: "aktif-gunes-kremi", topic: "SPF 50+ Güneş Kremi", hook: "Güneş koruması yaz aylarının konusu değil.", actives: ["SPF 50+ PA+++", "UVA + UVB", "hyaluronik asit"], clip: "sun", shot: "p_sun" },
  { match: "yuz-temizleyici-kopuk", topic: "Temizleme Köpüğü", hook: "İyi bir rutin temiz bir zeminle başlar.", actives: ["nazik temizlik"], clip: "kopuk", shot: "p_foamwet" },
  { match: "collagen-peeling-jel", topic: "Peeling Jel", hook: "İyi bir rutin temiz bir zeminle başlar.", actives: ["kolajen", "peeling"], clip: "dokusu", shot: "c_gel" },
  { match: "collagen-100-saf", topic: "Collagen (takviye)", hook: "Günlük kolajen desteği.", actives: ["Tip 1-2-3", "probiyotik + prebiyotik", "30 günlük"], shot: "n_group" },
];

export const hookFor = (slug: string) => hooks.find((h) => slug.startsWith(h.match));

/** Takvimdeki marka mesajı ve iletişim ilkesi — birebir. */
export const manifesto = {
  line: "Bakımın zarafeti, güvenilir içerik, bilimsel ve çok aşamalı kontrol, sürdürülebilir güzellik.",
  order: ["İçerik", "İhtiyaç", "Kullanım", "Ürün"],
  tone: "bilgili, güven veren, zarif",
};

/** Sunum slayt 9 — müşteriye gösterilen hero örnekleri, birebir. */
export const heroSlides = [
  { eyebrow: "Günlük Bakım", title: "Yoğun nem, kalıcı konfor", cta: "Şimdi Keşfet", clip: "cream", href: "/urun/ultra-nemlendirici-krem" },
  { eyebrow: "Yeni Sezon", title: "Güneşte kalan cilt için", cta: "Koleksiyonu Keşfet", clip: "sun", href: "/urun/aktif-gunes-kremi-spf-50" },
];
