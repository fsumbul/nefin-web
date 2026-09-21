import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Accordion from "@/components/Accordion";
import { bySlug, discount, image, priceTRY, products } from "@/lib/products";
import styles from "./page.module.css";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description || p.intro.slice(0, 160),
    alternates: { canonical: `/urun/${p.slug}` },
    openGraph: { title: p.title, description: p.description, images: [image(p)] },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) notFound();

  const off = discount(product);
  const others = products.filter((p) => p.id !== product.id).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.intro,
    image: [image(product)],
    brand: { "@type": "Brand", name: "Nefin Beauty" },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.salePrice ?? undefined,
      availability: "https://schema.org/InStock",
      url: `https://nefinbeauty.com${product.legacyUrl}`,
    },
  };

  return (
    <article className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className={`${styles.crumbs} wrap`} aria-label="Konum">
        <Link href="/">Ana sayfa</Link>
        <span aria-hidden="true">/</span>
        <Link href="/urunler">Ürünler</Link>
      </nav>

      <div className={`${styles.top} wrap`}>
        <figure className={styles.gallery}>
          <Image
            src={image(product)}
            alt={product.title}
            width={900}
            height={900}
            priority
            sizes="(max-width: 900px) 92vw, 34rem"
          />
          {off > 0 && <figcaption className={styles.badge}>%{off} indirim</figcaption>}
        </figure>

        <div className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>

          <p className={styles.price}>
            <strong>{priceTRY(product.salePrice)}</strong>
            {off > 0 && <del>{priceTRY(product.listPrice)}</del>}
          </p>

          <p className={styles.intro}>{product.intro}</p>

          <div className={styles.buy}>
            <a
              className="btn"
              href={`https://nefinbeauty.com${product.legacyUrl}`}
              rel="noreferrer"
            >
              Satın al
            </a>
            <span className={styles.buyNote}>
              Ödeme adımı şimdilik mevcut mağazada tamamlanıyor.
            </span>
          </div>

          <Accordion sections={product.sections} />
        </div>
      </div>

      <section className={`${styles.more} wrap`}>
        <h2 className={styles.moreTitle}>Diğer ürünler</h2>
        <div className={styles.moreGrid}>
          {others.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </article>
  );
}
