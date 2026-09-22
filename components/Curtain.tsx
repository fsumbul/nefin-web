"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Curtain.module.css";

/**
 * Perde açılışı — sunumun espresso + altın bokeh açılışının web karşılığı.
 * Oturumda bir kez, 1,4 s; tıklayınca ya da hareket azaltmada atlanır.
 */
export default function Curtain() {
  const [state, setState] = useState<"idle" | "on" | "off">("idle");
  const decided = useRef(false);

  useEffect(() => {
    // StrictMode efekti iki kez çalıştırır; karar bir kez verilir, bayrak perde bitince yazılır.
    if (decided.current) return;
    decided.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("nefin-curtain") === "1"; } catch { /* özel pencere */ }
    if (reduced || seen) { setState("off"); return; }
    setState("on");
    document.documentElement.classList.add("curtain-on");
    // 1,05 s bekleme + 0,9 s kaldırma (Curtain.module.css `lift`) — öğe animasyon bitince kaldırılır
    const t = setTimeout(() => setState("off"), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (state === "off") {
      document.documentElement.classList.remove("curtain-on");
      try { sessionStorage.setItem("nefin-curtain", "1"); } catch { /* yok sayılır */ }
    }
  }, [state]);

  if (state !== "on") return null;

  return (
    <div className={styles.curtain} onClick={() => setState("off")} aria-hidden="true">
      <video className={styles.bokeh} src="/deck/bg.mp4" poster="/deck/bg-poster.webp" muted autoPlay playsInline />
      <div className={styles.mark}>
        <span className={styles.word}>NEFIN</span>
        <span className={styles.sub}>cosmetics</span>
      </div>
    </div>
  );
}
