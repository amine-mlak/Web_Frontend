import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SiteHeader from "@/components/SiteHeader";
import StoryblokProvider from "@/components/storyblok/StoryblokProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storyblok Demo | Küchen-Landing",
  description:
    "Zweite CMS-Demo: dieselbe Landingpage wie Strapi, Inhalt aus Storyblok.",
  robots: { index: false, follow: false },
};

export default function StoryblokLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoryblokProvider>
      <SiteHeader>
        <Header />
      </SiteHeader>
      {children}
      <Footer />
    </StoryblokProvider>
  );
}
