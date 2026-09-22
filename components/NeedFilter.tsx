"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/motion/Reveal";
import type { Product } from "@/lib/products";
import styles from "./NeedFilter.module.css";

/**
 * İhtiyaç → ürün. Endişe başlıkları canlı sitenin kendi akordeonundan;
 * eşleme ürün türüne göre (kategori mantığı), pazarlama metni yok.
 * Yeniden dizilişte View Transitions API kullanılır, destek yoksa düz geçiş.
 */
const MAP: Record<string, string[]> = {
  "Yaşlanma Belirtileri": ["kolajen-serum", "goz-cevresi", "collagen-100", "24k-altin"],
  "Akne": ["anti-akne", "acne-derm", "yuz-temizleyici", "collagen-peeling"],
  "Leke": ["leke-serumu", "c-vitamin", "nefin-cc-krem", "aktif-gunes"],
  "Göz Çevresi": ["goz-cevresi", "kolajen-serum"],
  "Kızarıklık": ["24k-altin", "ultra-nemlendirici", "aktif-gunes"],
  "Kuruluk": ["ultra-nemlendirici", "24k-altin", "kolajen-serum", "nefin-cc-krem"],
};

export default function NeedFilter({ products }: { products: Product[] }) {
  const [need, setNeed] = useState<string | null>(null);
  const keys = Object.keys(MAP);
  const shown = need ? products.filter((p) => MAP[need].some((k) => p.slug.startsWith(k))) : products.slice(0, 8);

  const pick = (k: string | null) => {
    const d = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (d.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try { d.startViewTransition(() => setNeed(k)); } catch { setNeed(k); }
    } else setNeed(k);
  };

  return (
    <section className={styles.section} aria-labelledby="ihtiyac-baslik">
      <div className="wrap">
        <p className="eyebrow reveal">İhtiyaç → ürün</p>
        <Reveal as="h2" id="ihtiyac-baslik" className={styles.h2} lines={["Cildin ne", "istiyor?"]} />
        <div className={styles.chips} role="group" aria-label="Cilt ihtiyacı">
          <button className={`glass-chip ${need === null ? styles.on : ""}`} onClick={() => pick(null)}>Hepsi</button>
          {keys.map((k) => (
            <button key={k} className={`glass-chip ${need === k ? styles.on : ""}`} onClick={() => pick(k)} aria-pressed={need === k}>{k}</button>
          ))}
        </div>
        <div className={styles.grid} aria-live="polite">
          {shown.map((p) => (
            <div key={p.id} style={{ viewTransitionName: `card-${p.id}` } as React.CSSProperties}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
