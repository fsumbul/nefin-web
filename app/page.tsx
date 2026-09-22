import Image from "next/image";
import Curtain from "@/components/Curtain";
import HeroV2 from "@/components/HeroV2";
import Manifesto from "@/components/Manifesto";
import ProductStory from "@/components/ProductStory";
import TextureGallery from "@/components/TextureGallery";
import RoutineLine from "@/components/RoutineLine";
import ProofGlass from "@/components/ProofGlass";
import NeedFilter from "@/components/NeedFilter";
import Social from "@/components/Social";
import ClosingDark from "@/components/ClosingDark";
import Reveal from "@/components/motion/Reveal";
import { about } from "@/content/site";
import { bySlug, inci, products } from "@/lib/products";
import styles from "./page.module.css";

const STORY_ORDER = ["c-vitamin-lipozomal-serum", "24k-altin-tonik", "ultra-nemlendirici-krem", "aktif-gunes-kremi-spf-50"];

export default function Home() {
  const story = STORY_ORDER.map((s) => bySlug(s)).filter((p): p is NonNullable<typeof p> => !!p);
  const leke = bySlug("leke-serumu-cilt-tonu-dengeleyici-leke-karsiti-30ml");

  return (
    <>
      <Curtain />
      <HeroV2 />
      <Manifesto />
      <ProductStory products={story} />
      <TextureGallery />
      <RoutineLine />
      {leke && <ProofGlass inci={inci(leke)} productTitle={leke.title} href={`/urun/${leke.slug}`} />}
      <NeedFilter products={products} />
      <Social />

      {/* Hikâye — Hakkımızda metni birebir */}
      <section id="hikaye" className={styles.story} aria-labelledby="hikaye-baslik">
        <div className={`${styles.storyInner} wrap`}>
          <div className={styles.storyCopy}>
            <p className="eyebrow reveal">Hakkımızda</p>
            <Reveal as="h2" id="hikaye-baslik" className={styles.h2} lines={["Doğadan gelen aktifler,", <em key="e">bilimsel yaklaşım</em>]} />
            {about.paragraphs.map((p, i) => (
              <p key={i} className="reveal" style={{ "--delay": `${80 + i * 70}ms` } as React.CSSProperties}>{p}</p>
            ))}
          </div>
          <figure className={`${styles.storyFigure} reveal`}>
            <Image src="/deck/p_tray.webp" alt="Nefin ürünleri altın tepside" width={1600} height={1200} sizes="(max-width: 900px) 100vw, 32rem" />
          </figure>
        </div>
      </section>

      <ClosingDark />
    </>
  );
}
