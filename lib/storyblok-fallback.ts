import type { ISbStoryData, SbBlokData } from "@storyblok/react/rsc";

const uid = (id: string): SbBlokData => ({
  _uid: id,
  component: "placeholder",
});

const hero: SbBlokData = {
  ...uid("hero"),
  component: "hero",
  eyebrow: "Storyblok Demo",
  headline: "Inhalt, den der Kunde selbst ändern kann",
  text: "Diese Landingpage kommt aus Storyblok — nicht aus Strapi. Headline, Text und Bild lassen sich im Visual Editor klicken und live anpassen.",
  cta_label: "Beratung anfragen",
  cta_href: "#kontakt",
  image: {
    filename:
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1800&q=80",
    alt: "Helle Manufakturküche mit Insel",
  },
};

const features: SbBlokData = {
  ...uid("features"),
  component: "feature_grid",
  eyebrow: "Warum Storyblok",
  title: "Drei Punkte, die Sie dem Kunden zeigen",
  items: [
    {
      ...uid("f1"),
      component: "feature",
      title: "Klick zum Bearbeiten",
      text: "Im Visual Editor markiert Storyblok jede Sektion. Der Kunde ändert Copy, ohne ins Repo zu gehen.",
    },
    {
      ...uid("f2"),
      component: "feature",
      title: "Blöcke statt starrer Seiten",
      text: "Hero, Kacheln, Zitat und CTA sind einzelne Bloks. Reihenfolge und Inhalte steuert das CMS.",
    },
    {
      ...uid("f3"),
      component: "feature",
      title: "Neben Strapi betreibbar",
      text: "Die BEER-Seite bleibt auf Strapi. Diese Route ist nur die Storyblok-Variante für den Pitch.",
    },
  ],
};

const quote: SbBlokData = {
  ...uid("quote"),
  component: "quote",
  quote:
    "Wir zeigen dem Kunden dieselbe Küchenwelt — einmal mit Strapi, einmal mit Storyblok. So wird der CMS-Unterschied konkret.",
  author: "webentwicklung.tech",
  role: "Demo für den Kundenpitch",
};

const cta: SbBlokData = {
  ...uid("cta"),
  component: "cta",
  title: "Nächster Schritt",
  text: "Space anlegen, Preview-Token setzen, Visual Editor auf /storyblok zeigen. Ab dann gehört die Copy dem Kunden.",
  cta_label: "Zurück zur Strapi-Demo",
  cta_href: "/",
};

export const fallbackStoryblokStory = {
  id: 0,
  uuid: "local-fallback",
  name: "Storyblok Demo",
  slug: "storyblok",
  full_slug: "storyblok",
  created_at: "",
  published_at: "",
  first_published_at: "",
  release_id: null,
  lang: "de",
  position: 0,
  is_startpage: false,
  parent_id: 0,
  group_id: "",
  translated_slugs: [],
  alternates: [],
  default_full_slug: "storyblok",
  content: {
    ...uid("page"),
    component: "page",
    body: [hero, features, quote, cta],
  },
} as unknown as ISbStoryData;
