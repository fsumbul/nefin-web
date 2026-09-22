"use client";

import { useEffect, useRef } from "react";
import { manifesto } from "@/content/hooks";
import { gsapReady, reducedMotion } from "@/lib/motion";
import styles from "./Manifesto.module.css";

const EMPHASIS = new Set(["zarafeti,", "güzellik."]);

/** Takvimdeki marka mesajı; kelimeler scroll ile sırayla belirir, altın çizgi çizilir. */
export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const { gsap } = gsapReady();
    const words = el.querySelectorAll<HTMLElement>("[data-w]");
    const line = el.querySelector<HTMLElement>("[data-rule]");
    const tw = gsap.fromTo(words, { opacity: 0.12, y: 6 }, {
      opacity: 1, y: 0, stagger: 0.04, ease: "none",
      scrollTrigger: { trigger: el, start: "top 72%", end: "bottom 60%", scrub: 0.6 },
    });
    const tr = gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 50%", scrub: 0.6 } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); tr.scrollTrigger?.kill(); tr.kill(); };
  }, []);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="manifesto">
      <div className="wrap">
        <p className="eyebrow reveal">Nefin Cosmetics</p>
        <p id="manifesto" className={styles.line}>
          {manifesto.line.split(" ").map((w, i) => (
            <span key={i} data-w className={EMPHASIS.has(w) ? styles.em : undefined}>{w} </span>
          ))}
        </p>
        <i data-rule className={styles.rule} aria-hidden="true" />
        <ol className={styles.order} aria-label="İletişim sırası">
          {manifesto.order.map((o, i) => (
            <li key={o} className="reveal" style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}>
              <span>{String(i + 1).padStart(2, "0")}</span>{o}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
