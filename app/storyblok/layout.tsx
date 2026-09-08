import type { Metadata } from "next";
import StoryblokProvider from "@/components/storyblok/StoryblokProvider";

export const metadata: Metadata = {
  title: "Storyblok Demo | Küchen-Landing",
  description:
    "Zweite CMS-Demo: dieselbe Art Landingpage, Inhalt aus Storyblok statt Strapi.",
  robots: { index: false, follow: false },
};

export default function StoryblokLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoryblokProvider>{children}</StoryblokProvider>;
}
