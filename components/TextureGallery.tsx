"use client";

import { useEffect, useRef } from "react";
import LazyVideo from "@/components/LazyVideo";
import Reveal from "@/components/motion/Reveal";
import styles from "./TextureGallery.module.css";

/** Sunum slayt 8 "Doku ve his" — yatay sürükle-kaydır galeri, cam altyazılar. */
const ITEMS = [
  { clip: "dokusu", label: "Krem", note: "Yoğun nemlendirici doku" },
  { clip: "drop", label: "Serum", note: "Damlalıktan tek damla" },
  { clip: "gold", label: "Tonik", note: "24K altın tanecikleri" },
  { clip: "kopuk", label: "Köpük", note: "Temizleyici köpük" },
  { clip: "woman_foam", label: "Temizleme", note: "Yüzde köpük" },
  { clip: "cc", label: "CC Krem", note: "Hafif doku, doğal kapatıcılık" },
];

export default function TextureGallery() {
  const track = useRef<HTMLUListElement>(null);

  // masaüstünde fare ile sürükleyerek kaydırma
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let down = false, startX = 0, startLeft = 0;
    const onDown = (e: PointerEvent) => { if (e.pointerType !== "mouse") return; down = true; startX = e.clientX; startLeft = el.scrollLeft; el.classList.add(styles.drag); };
    const onMove = (e: PointerEvent) => { if (!down) return; el.scrollLeft = startLeft - (e.clientX - startX); };
    const onUp = () => { down = false; el.classList.remove(styles.drag); };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { el.removeEventListener("pointerdown", onDown); window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, []);

  return (
    <section className={styles.section} data-theme="dark" aria-labelledby="doku-baslik">
      <div className={`${styles.head} wrap`}>
        <p className="eyebrow reveal">Doku ve his</p>
        <Reveal as="h2" id="doku-baslik" className={styles.h2} lines={[<span key="a"><em>Ciltte</em> nasıl</span>, "hissettirir?"]} />
        <p className={`${styles.hint} reveal`}>Sürükleyerek gez</p>
      </div>
      <ul ref={track} className={styles.track} tabIndex={0} aria-label="Doku klipleri, yatay kaydırılır">
        {ITEMS.map((t, i) => (
          <li key={t.clip} className={`${styles.item} reveal`} style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}>
            <LazyVideo src={`/deck/${t.clip}.mp4`} poster={`/deck/${t.clip}-poster.webp`} label={`${t.label} dokusu`} />
            <div className={`${styles.caption} glass`}>
              <strong>{t.label}</strong><span>{t.note}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
