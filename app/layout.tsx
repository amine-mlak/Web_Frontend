import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
  preload: false,
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "BEER Küchenmanufaktur | Wolfersdorf bei Freising",
  description:
    "Individuelle Manufakturküchen aus Wolfersdorf bei Freising. Beratung, Planung, Fertigung und Montage aus einer Hand.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${figtree.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="describedby" href="/llms.txt" />
      </head>
      <body
        className={`${figtree.className} antialiased`}
        suppressHydrationWarning
      >
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
