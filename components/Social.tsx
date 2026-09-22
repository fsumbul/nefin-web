import Image from "next/image";
import ig from "@/content/instagram.json";
import Reveal from "@/components/motion/Reveal";
import styles from "./Social.module.css";

/** nefin + you — vault'taki instagram-feed.md'den derleme zamanı senkron (scripts/sync-instagram.mjs). */
export default function Social() {
  const posts = (ig.posts as { img: string; video: boolean }[]).slice(0, 9);
  if (!posts.length) return null;
  return (
    <section className={styles.section} aria-labelledby="sosyal-baslik">
      <div className={`${styles.head} wrap`}>
        <div>
          <p className="eyebrow reveal">nefin + you</p>
          <Reveal as="h2" id="sosyal-baslik" className={styles.h2} lines={[`@${ig.username}`]} />
        </div>
        <a className="btn btn--ghost" href={`https://instagram.com/${ig.username}`} rel="noreferrer" target="_blank">Instagram&apos;da takip et</a>
      </div>
      <ul className={`${styles.mosaic} wrap`}>
        {posts.map((p, i) => (
          <li key={p.img} className="reveal" style={{ "--delay": `${i * 50}ms` } as React.CSSProperties}>
            <Image src={p.img} alt="" width={720} height={900} sizes="(max-width: 700px) 33vw, 20rem" />
            {p.video && <span className={styles.play} aria-hidden="true">▶</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
