"use client";

import { useEffect, useRef } from "react";

/**
 * Bir bölümün scroll ilerlemesini (0–1) React render'ı tetiklemeden ref'te tutar.
 * 3D sahne bu ref'i useFrame içinde okur; böylece her scroll olayında yeniden render yok.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const progress = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const node = ref.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      progress.current = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}
