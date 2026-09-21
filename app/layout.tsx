import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nefinbeauty.com"),
  title: {
    default: "Nefin Beauty — Kanıtlı cilt bakımı",
    template: "%s · Nefin Beauty",
  },
  description:
    "Serum, tonik, güneş koruyucu ve krem. Her üründe açık INCI listesi, net fayda, sade rutin.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Nefin Beauty",
    images: ["/media/hero.webp"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6efe4",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable}`}>
      <body>
        <SmoothScroll />
        <a href="#icerik" className="visually-hidden">İçeriğe geç</a>
        <Header />
        <main id="icerik">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
