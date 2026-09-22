"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { hookFor } from "@/content/hooks";
import { priceTRY, type Product } from "@/lib/products";
import { gsapReady, reducedMotion } from "@/lib/motion";
import Reveal from "@/components/motion/Reveal";
import styles from "./ProductStory.module.css";

/**
 * Ürün hikâyesi — sol tarafta sabit medya (klipler 0,7 s çapraz geçer),
 * sağda bölümler kayar. Metinler takvimdeki onaylı hook cümleleri.
 */
export default function ProductStory({ products }: { products: Product[] }) {
  const chapters = products.map((p) => ({ p, h: hookFor(p.slug)! })).filter((c) => c.h?.clip);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-chapter]");
    if (reducedMotion()) return;
    const { ScrollTrigger } = gsapReady();
    const triggers = Array.from(items).map((it, i) =>
      ScrollTrigger.create({ trigger: it, start: "top 55%", end: "bottom 55%", onEnter: () => setActive(i), onEnterBack: () => setActive(i) })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    vids.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) { if (!v.src) v.src = v.dataset.src || ""; v.play().catch(() => {}); }
      else v.pause();
    });
  }, [active]);

  return (
    <section ref={root} className={styles.section} aria-labelledby="hikaye-baslik">
      <div className={`${styles.head} wrap`}>
        <p className="eyebrow reveal">Ürün hikâyesi</p>
        <Reveal as="h2" id="hikaye-baslik" className={styles.h2} lines={["Her ürünün", "bir sorusu var."]} />
      </div>

      <div className={`${styles.layout} wrap`}>
        <div className={styles.media}>
          <div className={styles.stack}>
            {chapters.map(({ h }, i) => (
              <video
                key={h.clip}
                ref={(v) => { vids.current[i] = v; }}
                // ilk bölümün klibi hemen bağlanır ki poster/kare gecikmesiz görünsün; diğerleri sırası gelince
                src={i === 0 ? `/deck/${h.clip}.mp4` : undefined}
                data-src={`/deck/${h.clip}.mp4`}
                poster={`/deck/${h.clip}-poster.webp`}
                className={`${styles.clip} ${i === active ? styles.on : ""}`}
                muted loop playsInline preload={i === 0 ? "metadata" : "none"}
                aria-hidden="true"
              />
            ))}
            <div className={styles.progress} aria-hidden="true">
              {chapters.map((c, i) => <i key={c.p.id} className={i === active ? styles.pOn : i < active ? styles.pDone : ""} />)}
            </div>
          </div>
        </div>

        <ol className={styles.chapters}>
          {chapters.map(({ p, h }, i) => (
            <li key={p.id} data-chapter className={`${styles.chapter} ${i === active ? styles.cOn : ""}`}>
              <span className={styles.no}>{String(i + 1).padStart(2, "0")}</span>
              <p className={`eyebrow ${styles.topic}`}>{h.topic}</p>
              <h3 className={styles.hook}>{h.hook}</h3>
              <p className={styles.name}>{p.title}</p>
              <ul className={styles.actives}>
                {h.actives.map((a) => <li key={a} className="glass-chip">{a}</li>)}
              </ul>
              <div className={styles.row}>
                <span className={styles.price}>{priceTRY(p.salePrice)}</span>
                <Link href={`/urun/${p.slug}`} className="btn btn--ghost">İncele</Link>
              </div>
              {h.shot && (
                <div className={styles.shot} aria-hidden="true">
                  <Image src={`/deck/${h.shot}.webp`} alt="" width={800} height={600} sizes="(max-width: 900px) 90vw, 30rem" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
