"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { gsapReady } from "@/lib/motion";

const HEADER_LINE = 64; // header'ın alt çizgisi — temayı bu yükseklikteki bölüm belirler

/**
 * Hareket kökü — layout'ta bir kez yaşar, sayfa geçişlerinde yok olmaz:
 * - Lenis (yumuşak scroll) + GSAP ScrollTrigger senkronu
 * - `.reveal` belirmesi: MutationObserver ile SONRADAN eklenen öğeler de izlenir
 *   (aksi hâlde istemci tarafı sayfa geçişinde yeni sayfanın içeriği hiç görünmüyordu)
 * - Header teması: header çizgisinin altındaki bölümün `data-theme`'i okunur
 *   (her iki scroll yönünde ve sayfa geçişinde doğru; varsayılan "light")
 * - Sayfa değişince: scroll başa, ScrollTrigger yeniden ölçüm, tema yeniden hesap
 * prefers-reduced-motion açıkken Lenis ve ScrollTrigger kurulmaz; tema ve belirme yine çalışır.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const themeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) document.documentElement.classList.add("js");

    // --- .reveal belirmesi (sonradan eklenenler dahil) ---
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    const watch = (root: ParentNode) =>
      root.querySelectorAll?.(".reveal:not(.is-in)").forEach((el) => io.observe(el));
    watch(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches(".reveal:not(.is-in)")) io.observe(n);
          watch(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // --- header teması ---
    let themeRaf = 0;
    const computeTheme = () => {
      themeRaf = 0;
      const x = Math.round(window.innerWidth / 2);
      const stack = document.elementsFromPoint(x, HEADER_LINE);
      const under = stack.find((el) => !el.closest("header"));
      // Durum body[data-header-theme]'de tutulur; bölümler yalnızca data-theme BİLDİRİR.
      // (İkisi aynı öznitelik olunca closest() body'ye tırmanıp kendi eski değerini okuyordu.)
      const theme = under?.closest<HTMLElement>("[data-theme]")?.dataset.theme ?? "light";
      if (document.body.dataset.headerTheme !== theme) document.body.dataset.headerTheme = theme;
    };
    const scheduleTheme = () => { if (!themeRaf) themeRaf = requestAnimationFrame(computeTheme); };
    themeRef.current = scheduleTheme;
    window.addEventListener("scroll", scheduleTheme, { passive: true });
    window.addEventListener("resize", scheduleTheme);
    scheduleTheme();

    if (reduced) {
      return () => {
        io.disconnect(); mo.disconnect();
        window.removeEventListener("scroll", scheduleTheme);
        window.removeEventListener("resize", scheduleTheme);
      };
    }

    // --- Lenis + ScrollTrigger ---
    let tick: ((t: number) => void) | null = null;
    let cancelled = false;
    const { gsap, ScrollTrigger } = gsapReady();

    // Görseller/fontlar yüklendikçe sayfa boyu değişir; tetikleyici konumları yeniden ölçülür.
    let refreshT = 0;
    const refreshSoon = () => { clearTimeout(refreshT); refreshT = window.setTimeout(() => ScrollTrigger.refresh(), 150); };
    const ro = new ResizeObserver(refreshSoon);
    ro.observe(document.body);
    window.addEventListener("load", refreshSoon);
    document.fonts?.ready.then(refreshSoon);

    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      const l = new LenisCtor({ lerp: 0.09, wheelMultiplier: 0.9, touchMultiplier: 1.6, anchors: true });
      lenisRef.current = l;
      l.on("scroll", () => { ScrollTrigger.update(); scheduleTheme(); });
      tick = (time: number) => l.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.dataset.lenis = "on";
      refreshSoon();
    });

    return () => {
      cancelled = true;
      if (tick) gsap.ticker.remove(tick);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      io.disconnect(); mo.disconnect(); ro.disconnect();
      clearTimeout(refreshT);
      window.removeEventListener("load", refreshSoon);
      window.removeEventListener("scroll", scheduleTheme);
      window.removeEventListener("resize", scheduleTheme);
      delete document.documentElement.dataset.lenis;
    };
  }, []);

  // Sayfa değişimi: başa dön (hash yoksa), yeniden ölç, temayı yeniden hesapla.
  useEffect(() => {
    const l = lenisRef.current;
    if (!window.location.hash) {
      l?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    const t = window.setTimeout(() => {
      const { ScrollTrigger } = gsapReady();
      ScrollTrigger.refresh();
      themeRef.current();
    }, 60);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
