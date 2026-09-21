"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { image, priceTRY, type Product } from "@/lib/products";
import styles from "./ProductRail.module.css";

/**
 * Ürün ailesi — yatay ray. Klavye, tekerlek ve dokunmatikle gezilir;
 * pinned scroll hijack yok (erişilebilirlik ve mobil için bilinçli tercih).
 */
export default function ProductRail({ products }: { products: Product[] }) {
  const track = useRef<HTMLDivElement>(null);

  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 520), behavior: "smooth" });
  };

  return (
    <section className={styles.rail} aria-labelledby="aile-baslik">
      <div className={`${styles.head} wrap`}>
        <div>
          <p className="eyebrow reveal">Ürün ailesi</p>
          <h2 id="aile-baslik" className={`${styles.h2} reveal`}>Serumlar, kremler, koruma.</h2>
        </div>
        <div className={styles.controls}>
          <button onClick={() => nudge(-1)} aria-label="Önceki ürünler">←</button>
          <button onClick={() => nudge(1)} aria-label="Sonraki ürünler">→</button>
        </div>
      </div>

      <div ref={track} className={styles.track} tabIndex={0} aria-label="Ürün listesi, yatay kaydırılır">
        {products.map((p, i) => (
          <Link key={p.id} href={`/urun/${p.slug}`} className={styles.item}>
            <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.media}>
              <Image src={image(p)} alt="" width={900} height={900} sizes="18rem" />
            </span>
            <span className={styles.name}>{p.title}</span>
            <span className={styles.price}>{priceTRY(p.salePrice)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
