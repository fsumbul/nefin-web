/**
 * Site metinleri. TAMAMI müşterinin kendi kaynaklarından alınmıştır —
 * hiçbir pazarlama metni burada üretilmemiştir.
 *   · Ürün metinleri/INCI  → content/products.json (canlı nefinbeauty.com)
 *   · Hakkımızda           → nefinbeauty.com/hakkimizda (birebir)
 *   · Cilt endişeleri      → canlı ana sayfa akordeonu
 */

export const about = {
  title: "Doğadan gelen aktifler, bilimsel yaklaşım",
  paragraphs: [
    "Nefin Beauty, cilt bakımında doğadan gelen aktifleri bilimsel yaklaşım ile bir araya getiren bir bakım markasıdır. Formüllerimiz; cilt bariyerini desteklemeye, cildin nem dengesini korumaya ve daha canlı, dengeli ve sağlıklı bir görünüm kazandırmaya odaklanır.",
    "Ürünlerimiz; paraben, silikon ve ciltte hassasiyet yaratabilecek gereksiz içeriklerden kaçınan, etkili ve güvenli bakım deneyimi sunmak üzere geliştirilir. Cilt bakımını kısa vadeli bir çözüm değil, düzenli ve sürdürülebilir bir bakım rutini olarak ele alırız.",
    "Nefin Beauty olarak hedefimiz; farklı cilt ihtiyaçlarına yönelik anlaşılır, güvenilir ve etkili ürünler sunmak, kullanıcıların kendi cilt rutinlerini doğru ürünlerle daha bilinçli şekilde oluşturmasına yardımcı olmaktır.",
  ],
};

/** Canlı sitedeki cilt endişesi akordeonunun başlıkları. */
export const concerns = [
  "Yaşlanma Belirtileri",
  "Akne",
  "Leke",
  "Göz Çevresi",
  "Kızarıklık",
  "Kuruluk",
];

/** Leke Karşıtı Serum'un kendi "Avantajlar" bölümünden alınan aktifler. */
export const actives = [
  { name: "C Vitamini", note: "Aydınlatmaya ve antioksidan korumaya yardımcı olur." },
  { name: "Alpha Arbutin", note: "Cilt tonu eşitsizliklerinin görünümünü azaltmayı destekler." },
  { name: "Niacinamide", note: "Cilt bariyerini destekler, tonun dengelenmesine katkı sağlar." },
  { name: "Hyaluronik Asit", note: "Yoğun nem desteği sunar." },
  { name: "Panthenol", note: "Cildi yatıştırmaya ve nem dengesini korumaya yardımcı olur." },
  { name: "Glutathione", note: "Güçlü antioksidan desteği sağlar." },
];

export const textures = [
  { src: "/media/pipette", label: "Serum", note: "Damlalıktan tek damla" },
  { src: "/media/cream", label: "Krem", note: "Yoğun nemlendirici doku" },
  { src: "/media/gold-tonic", label: "Tonik", note: "24K altın tanecikleri" },
  { src: "/media/sunscreen", label: "Güneş koruyucu", note: "Beyaz iz bırakmayan uygulama" },
];
