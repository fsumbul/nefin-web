import raw from "@/content/products.json";

export type Section = { label: string; body: string };

export type Product = {
  id: number;
  slug: string;
  title: string;
  legacyUrl: string;
  description: string;
  intro: string;
  listPrice: number | null;
  salePrice: number | null;
  currency: string;
  sections: Section[];
  images: string[];
};

/** Katalog, canlı nefinbeauty.com'dan çekilen gerçek veridir (scripts/scrape-catalog.py). */
export const products = raw as Product[];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);

export const priceTRY = (n: number | null) =>
  n == null ? "" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(n);

export const image = (p: Product) => `/urun/${p.slug}.webp`;

export const discount = (p: Product) =>
  p.listPrice && p.salePrice && p.listPrice > p.salePrice
    ? Math.round((1 - p.salePrice / p.listPrice) * 100)
    : 0;

/** Kısa, kart altına sığan tek cümle — ürünün kendi metninden alınır, yeniden yazılmaz. */
export const teaser = (p: Product, max = 110) => {
  const src = (p.description || p.intro || "").replace(/\s+/g, " ").trim();
  if (src.length <= max) return src;
  const cut = src.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
};

export const section = (p: Product, label: string) =>
  p.sections.find((s) => s.label.toLocaleLowerCase("tr").includes(label.toLocaleLowerCase("tr")));

export const inci = (p: Product) => section(p, "içindekiler")?.body ?? "";

/** Rutin adımları — ürünler kendi kategorilerine göre eşlenir. */
export const ROUTINE = [
  { step: "01", title: "Arındır", match: ["temizleyici", "peeling"], note: "Gün içinde biriken kalıntıyı alır." },
  { step: "02", title: "Serum", match: ["serum", "tonik"], note: "Aktif maddenin cilde girdiği adım." },
  { step: "03", title: "Nemlendir", match: ["krem", "nemlendirici"], note: "Bariyeri destekler, etkiyi kilitler." },
  { step: "04", title: "Koru", match: ["güneş", "spf"], note: "Gündüz rutini güneş koruyucusuz tamamlanmaz." },
] as const;

export const routineProducts = () =>
  ROUTINE.map((r) => ({
    ...r,
    product: products.find((p) => r.match.some((m) => p.title.toLocaleLowerCase("tr").includes(m))) ?? null,
  }));
