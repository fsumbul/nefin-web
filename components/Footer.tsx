import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} data-theme="dark">
      <div className={`${styles.inner} wrap`}>
        <div className={styles.brand}>
          <span className={styles.mark}>NEFIN</span>
          <p className={styles.note}>
            Kanıtlı içerik, sade rutin. Ürün metinleri ve INCI listeleri üretici tarafından
            sağlanmıştır.
          </p>
        </div>

        <nav className={styles.cols} aria-label="Alt menü">
          <div>
            <h4>Ürünler</h4>
            <Link href="/urunler">Tüm ürünler</Link>
            <Link href="/#rutin">Rutin</Link>
            <Link href="/#kanit">İçindekiler</Link>
          </div>
          <div>
            <h4>Kurumsal</h4>
            <a href="https://nefinbeauty.com/hakkimizda">Hakkımızda</a>
            <a href="https://nefinbeauty.com/iletisim">İletişim</a>
            <a href="https://nefinbeauty.com/blog">Blog</a>
          </div>
          <div>
            <h4>Destek</h4>
            <a href="tel:+908502411004">+90 850 241 1004</a>
            <a href="mailto:info@nefin.com.tr">info@nefin.com.tr</a>
          </div>
        </nav>
      </div>

      <div className={`${styles.legal} wrap`}>
        <span>© {new Date().getFullYear()} Nefin Beauty Cosmetics</span>
        <span className={styles.wip}>
          Önizleme sürümü — sepet ve ödeme akışı mevcut mağazada
        </span>
      </div>
    </footer>
  );
}
