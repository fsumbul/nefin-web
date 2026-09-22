"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { gsapReady } from "@/lib/motion";

/**
 * Hareket kökü: Lenis (yumuşak scroll) + GSAP ScrollTrigger senkronu,
 * `.reveal` görünürlük belirmesi ve `html.js` sınıfı (satır-maske CSS'i yalnızca JS varken gizler).
 * prefers-reduced-motion açıkken Lenis ve ScrollTrigger hiç kurulmaz.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) document.documentElement.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    if (reduced) return () => io.disconnect();

    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    let cancelled = false;
    const { gsap, ScrollTrigger } = gsapReady();

    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      const l = new LenisCtor({ lerp: 0.09, wheelMultiplier: 0.9, touchMultiplier: 1.6 });
      lenis = l;
      l.on("scroll", ScrollTrigger.update);
      tick = (time: number) => l.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.dataset.lenis = "on";
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      io.disconnect();
      delete document.documentElement.dataset.lenis;
    };
  }, []);

  return null;
}
