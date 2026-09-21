import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Tüm ürünler",
  description: "Nefin Beauty serum, tonik, krem ve güneş koruyucu ürünlerinin tamamı.",
};

export default function Urunler() {
  return (
    <div className={styles.page}>
      <header className={`${styles.head} wrap`}>
        <p className="eyebrow">Katalog</p>
        <h1 className={styles.title}>Tüm ürünler</h1>
        <p className="lede">
          {products.length} ürün. Her birinin faydaları, kullanımı ve tam INCI listesi kendi
          sayfasında yazılı.
        </p>
      </header>

      <div className={`${styles.grid} wrap`}>
        {products.map((p, i) => (
          <div key={p.id} className="reveal" style={{ "--delay": `${(i % 4) * 70}ms` } as React.CSSProperties}>
            <ProductCard product={p} priority={i < 4} />
          </div>
        ))}
      </div>
    </div>
  );
}
