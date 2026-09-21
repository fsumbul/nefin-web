"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { hasWebGL } from "./scene/Stage";
import styles from "./Hero.module.css";

const Stage = dynamic(() => import("./scene/Stage"), { ssr: false });

/**
 * Açılış: krem zemin, 3D amber şişe, tek vaat, tek CTA.
 * WebGL yoksa ya da hareket azaltma açıksa gerçek ürün fotoğrafı devreye girer —
 * bölüm 3D olmadan da eksiksiz çalışır.
 */
export default function Hero() {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const [use3d, setUse3d] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setUse3d(!reduced && hasWebGL());
  }, []);

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.sticky}>
        <div className={styles.stageWrap} aria-hidden="true">
          {use3d ? (
            <Stage progress={progress} className={styles.stage} />
          ) : (
            <Image
              src="/media/cream-hero.webp"
              alt=""
              width={1400}
              height={1400}
              priority
              className={styles.poster}
            />
          )}
        </div>

        <div className={`${styles.copy} wrap`}>
          <p className={`eyebrow ${styles.eyebrow}`}>Nefin Beauty</p>
          <h1 id="hero-title" className={styles.title}>
            Cildin ne aldığını
            <br />
            bilerek kullan.
          </h1>
          <p className={styles.lede}>
            Her üründe açık INCI listesi, net fayda, sade bir rutin. Abartılı vaat yok —
            ne kullandığın yazıyor.
          </p>
          <div className={styles.actions}>
            <a className="btn" href="#rutin">Rutini keşfet</a>
            <a className="btn btn--ghost" href="/urunler">Tüm ürünler</a>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <span>kaydır</span>
          <i />
        </div>
      </div>
    </section>
  );
}
