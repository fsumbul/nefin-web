"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { themeOnEnter } from "@/lib/motion";
import Reveal from "@/components/motion/Reveal";
import styles from "./ClosingDark.module.css";

/** Kitap kapağı: açılışla aynı espresso + bokeh; tema tekrar koyuya döner. */
export default function ClosingDark() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = themeOnEnter(ref.current, "dark");
    return () => t.kill();
  }, []);
  return (
    <section ref={ref} className={styles.section}>
      <video className={styles.bokeh} src="/deck/bg.mp4" poster="/deck/bg-poster.webp" muted loop playsInline autoPlay preload="metadata" aria-hidden="true" />
      <div className={`${styles.inner} wrap`}>
        <p className={`eyebrow ${styles.eyebrow} reveal`}>Nefin Cosmetics</p>
        <Reveal as="h2" className={styles.h2} lines={["Rutinini", <em key="k">kur.</em>]} />
        <p className={`${styles.text} reveal`}>Cildine uygun ürünü seç, içindekileri oku, tek adımda başla.</p>
        <Link href="/urunler" className="btn btn--gold">Ürünleri keşfet</Link>
      </div>
    </section>
  );
}
