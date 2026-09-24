"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const NAV = [
  { href: "/urunler", label: "Ürünler" },
  { href: "/#rutin", label: "Rutin" },
  { href: "/#kanit", label: "İçindekiler" },
  { href: "/#hikaye", label: "Hikaye" },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${styles.header} ${solid ? styles.solid : ""}`}>
      <div className={`${styles.bar} wrap`}>
        <Link href="/" className={styles.logo} aria-label="Nefin Beauty ana sayfa">
          {/* Geçici wordmark — müşteriden orijinal logo SVG'si beklenirken kullanılıyor. */}
          <span className={styles.mark}>NEFIN</span>
          <span className={styles.sub}>cosmetics</span>
        </Link>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`} aria-label="Ana menü">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <a className={styles.shop} href="https://nefinbeauty.com" rel="noreferrer">
            Mağaza
          </a>
        </nav>

        <button
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        >
          <span /><span />
        </button>
      </div>
    </header>
  );
}
