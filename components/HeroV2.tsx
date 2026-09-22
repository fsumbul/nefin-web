"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { heroSlides } from "@/content/hooks";
import { gsapReady, reducedMotion, themeOnEnter } from "@/lib/motion";
import Reveal from "@/components/motion/Reveal";
import styles from "./HeroV2.module.css";

const ROTATE_MS = 9000;

/**
 * Hero + "ışığa çıkış": sunum slayt 9'daki iki kampanya (metinler birebir),
 * 9 s'de bir çapraz geçiş. Scroll'da video küçülüp köşeleri yuvarlanarak
 * krem sayfaya "yerleşir"; tema koyu → açık.
 */
export default function HeroV2() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // kampanya döngüsü
  useEffect(() => {
    if (reducedMotion()) return;
    const t = setInterval(() => setActive((i) => (i + 1) % heroSlides.length), ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  // aktif klibi oynat, diğerini durdur; sekme geri görünür olunca kaldığı yerden sürdür
  useEffect(() => {
    const sync = () => {
      const vids = section.current?.querySelectorAll<HTMLVideoElement>("video") ?? [];
      vids.forEach((v, i) => { if (i === active && !document.hidden) v.play().catch(() => {}); else v.pause(); });
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [active]);

  // scroll: küçülme + tema
  useEffect(() => {
    const el = section.current;
    if (!el || !frame.current) return;
    document.body.dataset.theme = "dark";
    if (reducedMotion()) return;

    const { gsap, ScrollTrigger } = gsapReady();
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 },
    });
    tl.to(copy.current, { opacity: 0, y: -40, duration: 0.35, ease: "none" }, 0)
      .to(frame.current, { scale: 0.58, borderRadius: 28, duration: 1, ease: "none" }, 0.05);

    const theme = ScrollTrigger.create({
      trigger: el,
      start: "55% top",
      onEnter: () => (document.body.dataset.theme = "light"),
      onLeaveBack: () => (document.body.dataset.theme = "dark"),
    });
    return () => { tl.scrollTrigger?.kill(); tl.kill(); theme.kill(); };
  }, []);

  const slide = heroSlides[active];

  return (
    <section ref={section} className={styles.hero} aria-label="Öne çıkan kampanyalar">
      <div className={styles.sticky}>
        <div ref={frame} className={styles.frame}>
          {heroSlides.map((s, i) => (
            <video
              key={s.clip}
              className={`${styles.video} ${i === active ? styles.on : ""}`}
              src={`/deck/${s.clip}.mp4`}
              poster={`/deck/${s.clip}-poster.webp`}
              muted
              loop
              playsInline
              autoPlay
              preload={i === 0 ? "auto" : "metadata"}
              aria-hidden="true"
            />
          ))}
          <div className={styles.shade} />
        </div>

        <div ref={copy} className={`${styles.copy} wrap`} key={active}>
          <Reveal as="p" className={`eyebrow ${styles.eyebrow}`}>{slide.eyebrow}</Reveal>
          <Reveal as="h1" className={styles.title} lines={slide.title.split(", ").map((t, i, a) => (i < a.length - 1 ? `${t},` : t))} delay={0.12} />
          <div className={styles.actions}>
            <Link href={slide.href} className="btn btn--gold">{slide.cta}</Link>
            <Link href="/urunler" className="btn btn--glass">Tüm ürünler</Link>
          </div>
          <div className={styles.dots} aria-hidden="true">
            {heroSlides.map((s, i) => (
              <button key={s.clip} className={i === active ? styles.dotOn : ""} onClick={() => setActive(i)} aria-label={s.eyebrow} />
            ))}
          </div>
        </div>

        <div className={styles.hint} aria-hidden="true"><span>kaydır</span><i /></div>
      </div>
    </section>
  );
}
