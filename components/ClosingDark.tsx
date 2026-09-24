import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import styles from "./ClosingDark.module.css";

/** Kitap kapağı: açılışla aynı espresso + bokeh; header teması data-theme ile koyuya döner. */
export default function ClosingDark() {
  return (
    <section className={styles.section} data-theme="dark">
      <video className={styles.bokeh} src="/deck/bg.mp4" poster="/deck/bg-poster.webp" muted loop playsInline autoPlay preload="metadata" aria-hidden="true" />
      <div className={`${styles.inner} wrap`}>
        <p className={`eyebrow ${styles.eyebrow} reveal`}>Nefin Cosmetics</p>
        <Reveal as="h2" className={styles.h2} lines={["Rutinini", <em key="k">kur.</em>]} />
        <p className={`${styles.text} reveal`}>Cildine uygun ürünü seç, içindekileri oku, tek adımda başla.</p>
        <Link href="/urunler" className="btn btn--gold">Ürünleri keşfet</Link>
      </div>
    </section>
  );
}
