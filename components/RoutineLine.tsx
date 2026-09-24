"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { image, priceTRY, routineProducts } from "@/lib/products";
import { hookFor } from "@/content/hooks";
import { gsapReady, reducedMotion } from "@/lib/motion";
import Reveal from "@/components/motion/Reveal";
import styles from "./RoutineLine.module.css";

/** Dört adım; altın çizgi scroll ile çizilir, adımlar sırayla belirir. */
export default function RoutineLine() {
  const ref = useRef<HTMLElement>(null);
  const routine = routineProducts();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const { gsap } = gsapReady();
    const path = el.querySelector<SVGPathElement>("path");
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    const t = gsap.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 70%", scrub: 0.6 } });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);

  return (
    <section ref={ref} id="rutin" className={styles.section} aria-labelledby="rutin-baslik">
      <div className="wrap">
        <div className={styles.head}>
          <p className="eyebrow reveal">Dört adım</p>
          <Reveal as="h2" id="rutin-baslik" className={styles.h2} lines={["Rutin, karmaşık", "olmak zorunda değil."]} />
        </div>

        <div className={styles.grid}>
          <svg className={styles.line} viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 20 C 200 0, 400 40, 600 20 S 1000 0, 1200 20" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
          </svg>
          {routine.map((r, i) => {
            const h = r.product ? hookFor(r.product.slug) : null;
            const src = h?.shot ? `/deck/${h.shot}.webp` : r.product ? image(r.product) : "";
            return (
              <div key={r.step} className={`${styles.step} reveal`} style={{ "--delay": `${i * 110}ms` } as React.CSSProperties}>
                <span className={styles.dot} />
                <span className={styles.no}>{r.step}</span>
                <h3 className={styles.title}>{r.title}</h3>
                <p className={styles.note}>{r.note}</p>
                {r.product && (
                  <Link href={`/urun/${r.product.slug}`} className={`${styles.card} glass glass--light`}>
                    <Image src={src} alt="" width={400} height={300} sizes="10rem" />
                    <span><em>{r.product.title}</em><b>{priceTRY(r.product.salePrice)}</b></span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
