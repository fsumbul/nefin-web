"use client";

import { useEffect } from "react";

/**
 * Lenis yumuşak scroll + `.reveal` öğelerinin görünürlükle belirmesi.
 * prefers-reduced-motion açıkken ikisi de devre dışı kalır; sayfa normal scroll'la çalışır.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const l = new Lenis({ duration: 1.05, lerp: 0.09, wheelMultiplier: 0.9, touchMultiplier: 1.6 });
      lenis = l;
      const raf = (time: number) => {
        l.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
      document.documentElement.dataset.lenis = "on";
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
      io.disconnect();
      delete document.documentElement.dataset.lenis;
    };
  }, []);

  return null;
}
