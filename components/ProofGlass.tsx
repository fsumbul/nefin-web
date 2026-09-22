"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsapReady, reducedMotion } from "@/lib/motion";
import Reveal from "@/components/motion/Reveal";
import styles from "./ProofGlass.module.css";

/**
 * Kanıt/şeffaflık: keten fotoğrafı üstünde buzlu cam panel, gerçek INCI listesi.
 * Fotoğraf hafif paralaks (±8%), INCI satırları stagger ile belirir.
 */
export default function ProofGlass({ inci, productTitle, href }: { inci: string; productTitle: string; href: string }) {
  const ref = useRef<HTMLElement>(null);
  const items = inci.split(",").map((s) => s.trim()).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const { gsap } = gsapReady();
    const bg = el.querySelector("[data-bg]");
    const rows = el.querySelectorAll("[data-inci]");
    const p = gsap.fromTo(bg, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    const r = gsap.fromTo(rows, { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 60%", once: true } });
    return () => { p.scrollTrigger?.kill(); p.kill(); r.scrollTrigger?.kill(); r.kill(); };
  }, []);

  return (
    <section ref={ref} id="kanit" className={styles.section} aria-labelledby="kanit-baslik">
      <div className={styles.bg} data-bg>
        <Image src="/deck/p_linen.webp" alt="" fill sizes="100vw" />
      </div>
      <div className={`${styles.inner} wrap`}>
        <div className={`${styles.panel} glass`}>
          <p className="eyebrow">Kanıt</p>
          <Reveal as="h2" id="kanit-baslik" className={styles.h2} lines={["Her ürünün tam", "INCI listesi açık."]} />
          <p className={styles.text}>
            Ürün sayfalarında faydalar, kullanım ve içindekiler ayrı ayrı yazılı. Ne sürdüğünü okumadan karar vermek zorunda değilsin.
          </p>
          <p className={styles.label}>{productTitle} · İçindekiler</p>
          <ul className={styles.inci}>
            {items.map((x) => <li key={x} data-inci>{x}</li>)}
          </ul>
          <Link href={href} className="btn btn--ghost">Ürünü gör</Link>
        </div>
      </div>
    </section>
  );
}
