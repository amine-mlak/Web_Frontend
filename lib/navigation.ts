import { beerNamed } from "@/lib/beer-photos";
import { HOUSE_MEDIA, houseSrc } from "@/lib/house-photos";

export type MenuLink = {
  href: string;
  label: string;
  highlight?: boolean;
};

export type MenuGroup = {
  title?: string;
  links: MenuLink[];
};

export type MenuTeaser = {
  href: string;
  image: string;
  srcSet?: string;
  caption: string;
  alt: string;
  objectPosition?: string;
};

export type MenuPanelId = string;

export type MenuPanel = {
  id: MenuPanelId;
  label: string;
  title: string;
  href: string;
  variant: "rich" | "slim" | "guide" | "about";
  intro: string;
  groups: MenuGroup[];
  teasers?: MenuTeaser[];
};

export const menuPanels: MenuPanel[] = [
  {
    id: "kuechen",
    label: "Küchen",
    title: "Küchen",
    href: "/kuechen",
    variant: "rich",
    intro: "Formen, Stile und Materialien – der Überblick vor dem Detail.",
    groups: [
      {
        links: [
          { href: "/kuechen/formen", label: "Küchenformen" },
          { href: "/kuechen/stile", label: "Küchenstile" },
          { href: "/kuechen/farben", label: "Küchenfarben" },
          { href: "/kuechen/besondere", label: "Besondere Küchen" },
          { href: "/kuechen/inseln", label: "Kücheninseln" },
          { href: "/material", label: "Material & Ausstattung" },
          { href: "/geraete", label: "Geräte" },
          { href: "/marken", label: "Marken" },
          { href: "/projekte", label: "Alle Projekte" },
        ],
      },
    ],
    teasers: [
      {
        href: "/kuechen/stile/design",
        image: beerNamed("stile-design.jpg"),
        caption: "Designküche",
        alt: "Schwarze Designküche mit Eiche und Fischgrätparkett",
        objectPosition: "center 42%",
      },
      {
        href: "/kuechen/farben/salbei",
        image: beerNamed("stile-landhaus.jpg"),
        caption: "Salbeigrüne Küche",
        alt: "Salbeigrüne Landhausküche mit Marmor und schwarzen Beschlägen",
        objectPosition: "center 40%",
      },
      {
        href: "/kuechen/stile/modern",
        image: beerNamed("stile-modern.jpg"),
        caption: "Moderne Küche",
        alt: "Graue moderne Küche mit weißer Rückwand",
        objectPosition: "center 38%",
      },
    ],
  },
  {
    id: "moebel",
    label: "Möbel nach Maß",
    title: "Möbel nach Maß",
    href: "/moebel",
    variant: "slim",
    intro: "Einbauten und Wohnmöbel – präzise gefertigt, zurückhaltend im Angebot.",
    groups: [
      {
        links: [
          { href: "/moebel/einbauschraenke", label: "Einbauschränke" },
          { href: "/moebel/ankleide", label: "Begehbare Kleiderschränke" },
          { href: "/moebel/tische-baenke", label: "Tische & Bänke" },
          { href: "/moebel/wohnmoebel", label: "Wohnmöbel" },
        ],
      },
    ],
    teasers: [
      {
        href: "/moebel",
        image: beerNamed("stile-holz.jpg"),
        caption: "Möbel nach Maß",
        alt: "Eingebaute Möbel aus Holz, präzise nach Maß gefertigt",
        objectPosition: "center 40%",
      },
    ],
  },
  {
    id: "planen",
    label: "Küche planen",
    title: "Küche planen",
    href: "/kueche-planen",
    variant: "guide",
    intro: "Vom ersten Gespräch bis zur Ausstellung – der Weg zu Ihrer Küche.",
    groups: [
      {
        links: [
          { href: "/kueche-planen", label: "So entsteht Ihre Küche" },
          { href: "/ausstellung", label: "Ausstellung Freising" },
          {
            href: "/beratung",
            label: "Küchenplaner – Welche Küche passt zu Ihnen?",
            highlight: true,
          },
          { href: "/beratung", label: "Beratung & Termin" },
        ],
      },
      {
        title: "Wissen & Ratgeber",
        links: [
          { href: "/faq", label: "FAQ" },
          { href: "/ratgeber", label: "Ratgeber" },
          { href: "/katalog", label: "Katalog bestellen" },
        ],
      },
    ],
    teasers: [
      {
        href: "/kueche-planen",
        image: houseSrc(HOUSE_MEDIA["kueche-planen"].hero, 1400),
        caption: "Küche planen",
        alt: "Erstes Gespräch in der Ausstellung Wolfersdorf",
        objectPosition: "center 38%",
      },
    ],
  },
  {
    id: "ueber",
    label: "Über BEER",
    title: "Über BEER",
    href: "/ueber",
    variant: "about",
    intro: "Manufaktur, Haltung und die Menschen dahinter.",
    groups: [
      {
        links: [
          { href: "/ueber", label: "Über uns – Werte & Philosophie" },
          { href: "/team", label: "Team" },
          { href: "/presse", label: "Aktuelles & Presse" },
          { href: "/nachhaltigkeit", label: "Nachhaltigkeit" },
          { href: "/projekte", label: "Empfehlungen" },
          { href: "/karriere", label: "Karriere" },
        ],
      },
    ],
    teasers: [
      {
        href: "/ueber",
        image: houseSrc(HOUSE_MEDIA.ueber.hero, 1400),
        caption: "Über BEER",
        alt: "Manufaktur in Wolfersdorf",
        objectPosition: "center 42%",
      },
    ],
  },
];
