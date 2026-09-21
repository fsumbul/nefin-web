"use client";

import { useState } from "react";
import type { Section } from "@/lib/products";
import styles from "./Accordion.module.css";

/**
 * Ürün akordeonu: Faydalar / Kullanım / İçindekiler.
 * İlk bölüm açık gelir (web yenileme sunumundaki karar), diğerleri kapalı.
 * İçerik <details> ile yazılır; JS kapalıyken de açılıp kapanır.
 */
export default function Accordion({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState(0);

  if (!sections.length) return null;

  return (
    <div className={styles.acc}>
      {sections.map((s, i) => {
        const isOpen = open === i;
        return (
          <details
            key={s.label}
            className={styles.item}
            open={isOpen}
            onToggle={(e) => {
              if ((e.currentTarget as HTMLDetailsElement).open) setOpen(i);
              else if (isOpen) setOpen(-1);
            }}
          >
            <summary className={styles.summary}>
              <span>{s.label}</span>
              <i aria-hidden="true" />
            </summary>
            <div className={styles.body}>
              {s.body.split("\n").map((line, j) => {
                const bullet = line.trim().startsWith("•");
                return (
                  <p key={j} className={bullet ? styles.bullet : undefined}>
                    {bullet ? line.replace(/^\s*•\s*/, "") : line}
                  </p>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
