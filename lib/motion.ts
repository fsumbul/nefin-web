"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Hareket sözlüğü — tek kaynak. Değerler icerik-vault'taki v2 planındaki
 * "ileri seviye geçiş promptu" ile birebir aynıdır.
 */
export const EASE_OUT = "cubic-bezier(.2,.7,.2,1)";
export const EASE_SILK = "cubic-bezier(.65,0,.35,1)";
export const easeOut = "power3.out";
export const STAGGER = { line: 0.07, card: 0.09, word: 0.04 };

let registered = false;
export function gsapReady() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Satır-maske reveal: her .line öğesi translateY(110%) → 0 */
export function revealLines(scope: Element, opts: { delay?: number; trigger?: Element | null; stagger?: number } = {}) {
  const { gsap, ScrollTrigger } = gsapReady();
  const lines = scope.querySelectorAll<HTMLElement>("[data-line]");
  if (!lines.length) return;
  if (reducedMotion()) { lines.forEach((l) => (l.style.transform = "none")); return; }
  gsap.fromTo(
    lines,
    { yPercent: 110, y: 0, opacity: 0 },
    {
      yPercent: 0, y: 0, opacity: 1, duration: 1.05, ease: easeOut,
      stagger: opts.stagger ?? STAGGER.line, delay: opts.delay ?? 0,
      scrollTrigger: opts.trigger === undefined ? { trigger: scope, start: "top 82%", once: true } : opts.trigger ? { trigger: opts.trigger, start: "top 82%", once: true } : undefined,
    }
  );
  ScrollTrigger.refresh();
}

/** Görsel maske: clip-path alttan açılır + hafif scale */
export function revealMedia(el: Element) {
  const { gsap } = gsapReady();
  if (reducedMotion()) return;
  gsap.fromTo(
    el,
    { clipPath: "inset(100% 0 0 0)", scale: 1.06 },
    { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 1.15, ease: easeOut, scrollTrigger: { trigger: el, start: "top 85%", once: true } }
  );
}
