import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Accordion from "@/components/Accordion";
import { bySlug, discount, image, priceTRY, products } from "@/lib/products";
import { hookFor } from "@/content/hooks";
import LazyVideo from "@/components/LazyVideo";
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
  const h = hookFor(product.slug);
  const shot = h?.shot ? `/deck/${h.shot}.webp` : image(product);

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
        <div className={styles.galleryCol}>
          <figure className={styles.gallery} style={{ viewTransitionName: `card-${product.id}` } as React.CSSProperties}>
            <Image src={shot} alt={product.title} width={1600} height={1200} priority sizes="(max-width: 900px) 92vw, 34rem" className={h?.shot ? styles.cover : undefined} />
            {off > 0 && <figcaption className={styles.badge}>%{off} indirim</figcaption>}
          </figure>
          {h?.clip && (
            <div className={styles.clip}>
              <LazyVideo src={`/deck/${h.clip}.mp4`} poster={`/deck/${h.clip}-poster.webp`} label={`${product.title} videosu`} />
            </div>
          )}
        </div>

        <div className={styles.info}>
          {h && <p className={`eyebrow ${styles.topic}`}>{h.topic}</p>}
          <h1 className={styles.title}>{product.title}</h1>
          {h && <p className={styles.hook}>{h.hook}</p>}
          {h && <ul className={styles.actives}>{h.actives.map((a) => <li key={a} className="glass-chip">{a}</li>)}</ul>}

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
