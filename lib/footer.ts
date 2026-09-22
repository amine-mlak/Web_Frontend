export type FooterLink = {
  href: string;
  label: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
  more?: {
    label: string;
    links: FooterLink[];
  };
};

export const footerColumns: FooterColumn[] = [
  {
    title: "KÜCHEN",
    links: [
      { href: "/kuechen/formen", label: "Küchenformen" },
      { href: "/kuechen/stile", label: "Küchenstile" },
      { href: "/kuechen/farben", label: "Küchenfarbe" },
      { href: "/kuechen/besondere", label: "Besondere Küchen" },
      { href: "/material", label: "Material & Ausstellung" },
    ],
  },
  {
    title: "MÖBEL NACH MAß",
    links: [
      { href: "/moebel/einbauschraenke", label: "Einbauschränke" },
      { href: "/moebel/ankleide", label: "Kleiderschränke" },
      { href: "/moebel/tische-baenke", label: "Tische & Bänke" },
      { href: "/moebel/wohnmoebel", label: "Wohnmöbel" },
    ],
  },
  {
    title: "KÜCHE PLANEN",
    links: [
      { href: "/ratgeber", label: "Inspiration" },
      { href: "/kueche-planen", label: "So läuft es ab" },
      { href: "/ausstellung", label: "Ausstellung Freising" },
      { href: "/beratung", label: "Küchenplaner" },
      { href: "/katalog", label: "Katalog bestellen" },
      { href: "/beratung", label: "Beratung & Termin" },
    ],
  },
  {
    title: "REGIONEN",
    links: [
      { href: "/regionen/muenchen", label: "Küchen München" },
      { href: "/regionen/freising", label: "Küchen Freising" },
      { href: "/regionen/erding", label: "Küchen Erding" },
      { href: "/regionen/pfaffenhofen", label: "Küchen Pfaffenhofen" },
      { href: "/regionen/augsburg", label: "Küchen Augsburg" },
    ],
    more: {
      label: "Weitere Regionen",
      links: [
        { href: "/regionen/dachau", label: "Küchen Dachau" },
        { href: "/regionen/ingolstadt", label: "Küchen Ingolstadt" },
        { href: "/regionen/landshut", label: "Küchen Landshut" },
        { href: "/regionen/regensburg", label: "Küchen Regensburg" },
        { href: "/regionen/mainburg", label: "Küchen Mainburg" },
        { href: "/regionen/nuernberg", label: "Küchen Nürnberg" },
        { href: "/regionen", label: "Alle Regionen" },
      ],
    },
  },
  {
    title: "UNTERNEHMEN",
    links: [
      { href: "/", label: "Startseite" },
      { href: "/ueber", label: "Über BEER" },
      { href: "/ueber", label: "Team" },
      { href: "/projekte", label: "Alle Projekte" },
      { href: "/ueber", label: "Nachhaltigkeit" },
      { href: "/kontakt", label: "Karriere" },
      { href: "/ratgeber", label: "Presse" },
    ],
  },
];

export const footerContact = {
  title: "KONTAKT",
  lines: [
    "BEER GmbH",
    "Badendorf 6",
    "85395 Wolfersdorf",
    "Mo–Fr 9–18 Uhr · Sa 9–14 Uhr",
  ],
};

export const footerShortcuts: FooterLink[] = [
  { href: "/faq", label: "FAQ" },
  { href: "/ratgeber", label: "RATGEBER" },
];

export const legalLinks: FooterLink[] = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "/datenschutz", label: "Cookie-Einstellungen" },
];

export type SocialIcon = "instagram" | "youtube" | "facebook" | "pinterest" | "houzz";

export const socialLinks: { href: string; label: string; icon: SocialIcon }[] = [
  { href: "https://instagram.com", label: "Instagram", icon: "instagram" },
  { href: "https://youtube.com", label: "YouTube", icon: "youtube" },
  { href: "https://facebook.com", label: "Facebook", icon: "facebook" },
  { href: "https://pinterest.com", label: "Pinterest", icon: "pinterest" },
  { href: "https://houzz.com", label: "Houzz", icon: "houzz" },
];
