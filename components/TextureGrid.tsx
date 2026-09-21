import LazyVideo from "@/components/LazyVideo";
import { textures } from "@/content/site";
import styles from "./TextureGrid.module.css";

/**
 * Doku bölümü — dört gerçek ürün videosu. Videolar yalnızca görünür
 * olduklarında indirilir ve oynar (LazyVideo).
 */
export default function TextureGrid() {
  return (
    <section className={styles.section} aria-labelledby="doku-baslik">
      <div className="wrap">
        <p className="eyebrow reveal">Doku</p>
        <h2 id="doku-baslik" className={`${styles.h2} reveal`}>Ciltte nasıl hissettirir?</h2>
      </div>
      <ul className={`${styles.grid} wrap`}>
        {textures.map((t, i) => (
          <li key={t.label} className="reveal" style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}>
            <LazyVideo
              src={`${t.src}.mp4`}
              poster={`${t.src}-poster.webp`}
              label={`${t.label} dokusu`}
            />
            <div className={styles.caption}>
              <strong>{t.label}</strong>
              <span>{t.note}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
