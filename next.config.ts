import type { NextConfig } from "next";
import products from "./content/products.json";

/**
 * Eski mağaza URL'leri (/product-73) yeni slug'lara kalıcı yönlendirilir —
 * göç planındaki 301 haritasının kod tarafındaki karşılığı.
 */
const legacyRedirects = (products as { id: number; slug: string }[]).map((p) => ({
  source: `/product-${p.id}`,
  destination: `/urun/${p.slug}`,
  permanent: true,
}));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      ...legacyRedirects,
      { source: "/urunler/:slug", destination: "/urun/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
