"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsapReady, reducedMotion, STAGGER, easeOut } from "@/lib/motion";

/**
 * Satır-maske metin belirmesi. Her satır overflow:hidden bir kabın içinde
 * translateY(110%)'den 0'a yükselir (sunumdaki `rise` ile aynı easing).
 * Tetikleyici IntersectionObserver'dır (ScrollTrigger'ın ilk ölçüm zamanlamasına bağlı değil);
 * tween temizlikte öldürülür, StrictMode çift efektinde çakışma olmaz.
 *
 *   <Reveal as="h2" lines={["Yoğun nem,", "kalıcı konfor"]} />
 */
export default function Reveal({
  as = "div",
  lines,
  children,
  className,
  delay = 0,
  id,
  style,
}: {
  as?: ElementType;
  lines?: ReactNode[];
  children?: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-line]");
    if (!targets.length) return;
    if (reducedMotion()) { targets.forEach((t) => { t.style.transform = "none"; t.style.opacity = "1"; }); return; }

    const { gsap } = gsapReady();
    let tween: gsap.core.Tween | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // y: 0 şart — aksi hâlde GSAP, CSS'teki translateY(110%)'i piksel `y` olarak okuyup korur.
        tween = gsap.fromTo(targets, { yPercent: 110, y: 0, opacity: 0 }, { yPercent: 0, y: 0, opacity: 1, duration: 1.05, ease: easeOut, stagger: STAGGER.line, delay, overwrite: true });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => { io.disconnect(); tween?.kill(); };
  }, [delay]);

  const items = lines ?? [children];
  return createElement(
    as,
    { ref, className, id, style },
    items.map((line, i) => (
      <span className="lm" key={i}>
        <span data-line>{line}</span>
      </span>
    ))
  );
}
