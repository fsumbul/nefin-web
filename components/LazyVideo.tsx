"use client";

import { useEffect, useRef } from "react";

/**
 * Görünür olunca yüklenip oynayan, ekrandan çıkınca duran sessiz video.
 * autoPlay kullanılmaz — aksi hâlde tarayıcı videoyu ilk yükte indirir.
 * prefers-reduced-motion açıkken hiç oynatılmaz, poster kalır.
 */
export default function LazyVideo({
  src,
  poster,
  className,
  label,
}: {
  src: string;
  poster: string;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.src) v.src = src;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      className={className}
      aria-label={label}
    />
  );
}
