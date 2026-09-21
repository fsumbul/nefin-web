import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import LazyVideo from "@/components/LazyVideo";
import ProductCard from "@/components/ProductCard";
import ProductRail from "@/components/ProductRail";
import TextureGrid from "@/components/TextureGrid";
import { about, actives, concerns } from "@/content/site";
import { products, routineProducts, priceTRY, image } from "@/lib/products";
import styles from "./page.module.css";

export default function Home() {
  const routine = routineProducts();
  const featured = products.slice(0, 4);

  return (
    <>
      <Hero />

      {/* 2 — Damla: tek damlanın içinde ne var */}
      <section className={styles.drop} aria-labelledby="damla-baslik">
        <div className={`${styles.dropInner} wrap`}>
          <div className={`${styles.dropMedia} reveal`}>
            <LazyVideo
              src="/media/pipette.mp4"
              poster="/media/pipette-poster.webp"
              label="Damlalıktan düşen serum damlası"
            />
          </div>
          <div className={styles.dropCopy}>
            <p className="eyebrow reveal">Tek damla</p>
            <h2 id="damla-baslik" className={`${styles.h2} reveal`} style={{ "--delay": "80ms" } as React.CSSProperties}>
              İçinde ne olduğunu
              <br /> saklamıyoruz.
            </h2>
            <ul className={styles.actives}>
              {actives.map((a, i) => (
                <li
                  key={a.name}
                  className="reveal"
                  style={{ "--delay": `${120 + i * 70}ms` } as React.CSSProperties}
                >
                  <strong>{a.name}</strong>
                  <span>{a.note}</span>
                </li>
              ))}
            </ul>
            <p className={`${styles.footnote} reveal`}>
              Aktif madde açıklamaları Leke Karşıtı Serum&apos;un kendi ürün sayfasından alınmıştır.
            </p>
          </div>
        </div>
      </section>

      {/* 3 — Ürün ailesi: yatay ray */}
      <ProductRail products={products} />

      {/* 4 — Rutin */}
      <section id="rutin" className={styles.routine} aria-labelledby="rutin-baslik">
        <div className="wrap">
          <header className={styles.sectionHead}>
            <p className="eyebrow reveal">Dört adım</p>
            <h2 id="rutin-baslik" className={`${styles.h2} reveal`}>Rutin, karmaşık olmak zorunda değil.</h2>
            <p className={`lede reveal ${styles.sectionLede}`}>
              Arındır, serum, nemlendir, koru. Her adımda tek ürün yeter.
            </p>
          </header>

          <ol className={styles.steps}>
            {routine.map((r, i) => (
              <li key={r.step} className="reveal" style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}>
                <span className={styles.stepNo}>{r.step}</span>
                <h3 className={styles.stepTitle}>{r.title}</h3>
                <p className={styles.stepNote}>{r.note}</p>
                {r.product && (
                  <Link href={`/urun/${r.product.slug}`} className={styles.stepProduct}>
                    <Image src={image(r.product)} alt="" width={200} height={200} sizes="8rem" />
                    <span>
                      <em>{r.product.title}</em>
                      <b>{priceTRY(r.product.salePrice)}</b>
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 — Kanıt: INCI şeffaflığı */}
      <section id="kanit" className={styles.proof} aria-labelledby="kanit-baslik">
        <div className={`${styles.proofInner} wrap`}>
          <figure className={`${styles.proofFigure} reveal`}>
            <Image
              src="/media/editorial-cream.webp"
              alt="Krem dokusu, krem rengi keten üzerinde"
              width={1600}
              height={1067}
              sizes="(max-width: 900px) 100vw, 44rem"
            />
          </figure>
          <div className={styles.proofCopy}>
            <p className="eyebrow reveal">Kanıt</p>
            <h2 id="kanit-baslik" className={`${styles.h2} reveal`}>
              Her ürünün tam
              <br /> INCI listesi açık.
            </h2>
            <p className={`reveal ${styles.proofText}`}>
              Ürün sayfalarında faydalar, kullanım ve içindekiler ayrı ayrı yazılı. Ne
              sürdüğünü okumadan karar vermek zorunda değilsin.
            </p>
            <div className={`${styles.inciSample} reveal`}>
              <span className={styles.inciLabel}>Leke Karşıtı Serum · İçindekiler</span>
              <p>
                Aqua, Ascorbic Acid, Aloe Barbadensis Leaf Juice, Panthenol, Propylene Glycol,
                Sorbitol, Glycerin, Niacinamide, Hydrolyzed Collagen, Carbomer, Phenoxyethanol,
                Caffeine, Glutathione, Sodium Ascorbyl Phosphate…
              </p>
              <Link href="/urun/leke-serumu-cilt-tonu-dengeleyici-leke-karsiti-30ml" className="btn btn--ghost">
                Tam listeyi gör
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Doku */}
      <TextureGrid />

      {/* 7 — Cilt endişeleri */}
      <section className={styles.concerns} aria-labelledby="endise-baslik">
        <div className="wrap">
          <p className="eyebrow reveal">Neye göre seçmeli</p>
          <h2 id="endise-baslik" className={`${styles.h2} reveal`}>Cildin ne istiyor?</h2>
          <ul className={styles.chips}>
            {concerns.map((c, i) => (
              <li key={c} className="reveal" style={{ "--delay": `${i * 60}ms` } as React.CSSProperties}>
                <Link href="/urunler">{c}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 — Öne çıkan ürünler */}
      <section className={styles.featured} aria-labelledby="one-cikan">
        <div className="wrap">
          <header className={styles.sectionHead}>
            <p className="eyebrow reveal">Seçkiler</p>
            <h2 id="one-cikan" className={`${styles.h2} reveal`}>Çok tercih edilenler</h2>
          </header>
          <div className={styles.grid}>
            {featured.map((p, i) => (
              <div key={p.id} className="reveal" style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <p className={styles.more}>
            <Link href="/urunler" className="btn btn--ghost">Tüm ürünler ({products.length})</Link>
          </p>
        </div>
      </section>

      {/* 9 — Hikaye */}
      <section id="hikaye" className={styles.story} aria-labelledby="hikaye-baslik">
        <div className={`${styles.storyInner} wrap`}>
          <div className={styles.storyCopy}>
            <p className="eyebrow reveal">Hakkımızda</p>
            <h2 id="hikaye-baslik" className={`${styles.h2} reveal`}>{about.title}</h2>
            {about.paragraphs.map((p, i) => (
              <p key={i} className="reveal" style={{ "--delay": `${80 + i * 70}ms` } as React.CSSProperties}>
                {p}
              </p>
            ))}
          </div>
          <figure className={`${styles.storyFigure} reveal`}>
            <Image
              src="/media/editorial-2.webp"
              alt="Nefin ürünleri, krem tonlarında editoryal kompozisyon"
              width={1400}
              height={1400}
              sizes="(max-width: 900px) 100vw, 30rem"
            />
          </figure>
        </div>
      </section>

      {/* 10 — Kapanış */}
      <section className={styles.cta}>
        <div className={`${styles.ctaInner} wrap reveal`}>
          <h2 className={styles.ctaTitle}>Rutinini kur.</h2>
          <p className={styles.ctaText}>
            Cildine uygun ürünü seç, içindekileri oku, tek adımda başla.
          </p>
          <Link href="/urunler" className="btn btn--light">Ürünleri keşfet</Link>
        </div>
      </section>
    </>
  );
}
