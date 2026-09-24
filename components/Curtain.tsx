"use client";

import { useEffect, useState } from "react";
import styles from "./Curtain.module.css";

/**
 * Perde açılışı — sunumun espresso + altın bokeh açılışının web karşılığı.
 * Oturumda bir kez (~2 s); tıklayınca ya da hareket azaltmada atlanır.
 *
 * Efekt idempotenttir: StrictMode'un çift çalıştırmasında zamanlayıcı yeniden kurulur.
 * "Görüldü" bayrağı perde KAPANINCA yazılır; `curtain-on` sınıfı her çıkış yolunda
 * (zaman aşımı, tıklama, sayfa değişimi/unmount) kaldırılır — aksi hâlde sayfa kaydırılamıyordu.
 */
export default function Curtain() {
  const [state, setState] = useState<"idle" | "on" | "off">("idle");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("nefin-curtain") === "1"; } catch { /* özel pencere */ }
    if (reduced || seen) { setState("off"); return; }
    setState("on");
    document.documentElement.classList.add("curtain-on");
    // 1,05 s bekleme + 0,9 s kaldırma (Curtain.module.css `lift`)
    const t = setTimeout(() => setState("off"), 2000);
    return () => {
      clearTimeout(t);
      document.documentElement.classList.remove("curtain-on");
    };
  }, []);

  useEffect(() => {
    if (state !== "off") return;
    document.documentElement.classList.remove("curtain-on");
    try { sessionStorage.setItem("nefin-curtain", "1"); } catch { /* yok sayılır */ }
    // Perde kalkınca altında kalan bölüme göre header temasını yeniden hesaplat (SmoothScroll dinler).
    window.dispatchEvent(new Event("scroll"));
  }, [state]);

  if (state !== "on") return null;

  return (
    <div className={styles.curtain} data-theme="dark" onClick={() => setState("off")} aria-hidden="true">
      <video className={styles.bokeh} src="/deck/bg.mp4" poster="/deck/bg-poster.webp" muted autoPlay playsInline />
      <div className={styles.mark}>
        <span className={styles.word}>NEFIN</span>
        <span className={styles.sub}>cosmetics</span>
      </div>
    </div>
  );
}
