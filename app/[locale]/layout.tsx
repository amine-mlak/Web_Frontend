import type { Metadata } from "next";
import { Albert_Sans, Cormorant_Garamond, Figtree, Newsreader } from "next/font/google";
import { notFound } from "next/navigation";
import ClickIds from "@/components/ClickIds";
import DesignSwitcher from "@/components/DesignSwitcher";
import { LocaleProvider } from "@/components/LocaleProvider";
import SmoothScroll from "@/components/SmoothScroll";
import Umami from "@/components/Umami";
import { DESIGN_SCRIPT } from "@/lib/design-preview";
import { isLocale, LOCALES } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";
import { allowSearchIndexing } from "@/lib/umami";
import "../globals.css";

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

// Design preview: A Werkstatt (one sans) and B Editorial (upright serif). The one not chosen goes.
const albert = Albert_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-albert",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  axes: ["opsz"],
  variable: "--font-newsreader",
});

const indexingOn = allowSearchIndexing();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "BEER Küchenmanufaktur | Wolfersdorf bei Freising",
  description:
    "Individuelle Manufakturküchen aus Wolfersdorf bei Freising. Beratung, Planung, Fertigung und Montage aus einer Hand.",
  openGraph: {
    type: "website",
    siteName: "BEER Küchenmanufaktur",
    locale: "de_DE",
  },
  robots: indexingOn
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
          noarchive: true,
          nosnippet: true,
        },
      },
};

// The proxy rewrites every page request to /de/... or /en/..., so only these two exist;
// any other value is refused in the layout below. No `dynamicParams = false` here: it
// applies to every page under this layout, so CMS entries published after the build
// (a new project, article, region…) would all return 404.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${figtree.variable} ${cormorant.variable} ${albert.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="describedby" href="/llms.txt" />
        <script dangerouslySetInnerHTML={{ __html: DESIGN_SCRIPT }} />
      </head>
      <body
        className={`${figtree.className} antialiased`}
        suppressHydrationWarning
      >
        <LocaleProvider locale={locale}>
          <SmoothScroll />
          <ClickIds />
          <Umami />
          {children}
          <DesignSwitcher />
        </LocaleProvider>
      </body>
    </html>
  );
}
