import Link from "next/link";
import Image from "next/image";
import { discount, image, priceTRY, teaser, type Product } from "@/lib/products";
import { hookFor } from "@/content/hooks";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const off = discount(product);
  const shot = hookFor(product.slug)?.shot;
  const src = shot ? `/deck/${shot}.webp` : image(product);
  return (
    <Link href={`/urun/${product.slug}`} className={styles.card}>
      <div className={styles.media}>
        <Image
          src={src}
          alt={product.title}
          width={900}
          height={900}
          className={shot ? styles.shot : undefined}
          sizes="(max-width: 700px) 70vw, 24rem"
          priority={priority}
        />
        {off > 0 && <span className={styles.badge}>%{off}</span>}
      </div>
      <h3 className={styles.title}>{product.title}</h3>
      <p className={styles.teaser}>{teaser(product)}</p>
      <p className={styles.price}>
        <strong>{priceTRY(product.salePrice)}</strong>
        {off > 0 && <del>{priceTRY(product.listPrice)}</del>}
      </p>
    </Link>
  );
}
