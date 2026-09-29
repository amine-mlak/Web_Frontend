export type FooterLink = {
  href: string;
  label: string;
};

export type SocialIcon = "instagram" | "youtube" | "facebook" | "pinterest" | "houzz";

export type FooterColumn = {
  title: string;
  links: FooterLink[];
  more?: {
    label: string;
    links: FooterLink[];
  };
};

export type FooterContent = {
  ariaLabel: string;
  legalAria: string;
  socialAria: string;
  copyright: string;
  contactTitle: string;
  contactLines: string[];
  columns: FooterColumn[];
  shortcuts: FooterLink[];
  legal: FooterLink[];
  social: { href: string; label: string; icon: SocialIcon }[];
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

export const socialLinks: { href: string; label: string; icon: SocialIcon }[] = [
  { href: "https://www.instagram.com/beer.kuechen/", label: "Instagram", icon: "instagram" },
  { href: "https://youtube.com", label: "YouTube", icon: "youtube" },
  { href: "https://facebook.com", label: "Facebook", icon: "facebook" },
  { href: "https://pinterest.com", label: "Pinterest", icon: "pinterest" },
  { href: "https://houzz.com", label: "Houzz", icon: "houzz" },
];

const germanFooter: FooterContent = {
  ariaLabel: "Fußzeile",
  legalAria: "Rechtliches",
  socialAria: "Social Media",
  copyright: "© {year}, BEER Küchen",
  contactTitle: footerContact.title,
  contactLines: footerContact.lines,
  columns: footerColumns,
  shortcuts: footerShortcuts,
  legal: legalLinks,
  social: socialLinks,
};

const englishFooter: FooterContent = {
  ariaLabel: "Footer",
  legalAria: "Legal",
  socialAria: "Social media",
  copyright: "© {year}, BEER Küchen",
  contactTitle: "CONTACT",
  contactLines: [
    "BEER GmbH",
    "Badendorf 6",
    "85395 Wolfersdorf",
    "Mon–Fri 9am–6pm · Sat 9am–2pm",
  ],
  columns: [
    {
      title: "KITCHENS",
      links: [
        { href: "/kuechen/formen", label: "Kitchen layouts" },
        { href: "/kuechen/stile", label: "Kitchen styles" },
        { href: "/kuechen/farben", label: "Kitchen colours" },
        { href: "/kuechen/besondere", label: "Special kitchens" },
        { href: "/material", label: "Material & showroom" },
      ],
    },
    {
      title: "FURNITURE TO MEASURE",
      links: [
        { href: "/moebel/einbauschraenke", label: "Built-in wardrobes" },
        { href: "/moebel/ankleide", label: "Wardrobes" },
        { href: "/moebel/tische-baenke", label: "Tables & benches" },
        { href: "/moebel/wohnmoebel", label: "Living furniture" },
      ],
    },
    {
      title: "PLAN A KITCHEN",
      links: [
        { href: "/ratgeber", label: "Inspiration" },
        { href: "/kueche-planen", label: "How it works" },
        { href: "/ausstellung", label: "Freising showroom" },
        { href: "/beratung", label: "Kitchen planner" },
        { href: "/katalog", label: "Order a catalogue" },
        { href: "/beratung", label: "Advice & appointment" },
      ],
    },
    {
      title: "REGIONS",
      links: [
        { href: "/regionen/muenchen", label: "Kitchens in Munich" },
        { href: "/regionen/freising", label: "Kitchens in Freising" },
        { href: "/regionen/erding", label: "Kitchens in Erding" },
        { href: "/regionen/pfaffenhofen", label: "Kitchens in Pfaffenhofen" },
        { href: "/regionen/augsburg", label: "Kitchens in Augsburg" },
      ],
      more: {
        label: "More regions",
        links: [
          { href: "/regionen/dachau", label: "Kitchens in Dachau" },
          { href: "/regionen/ingolstadt", label: "Kitchens in Ingolstadt" },
          { href: "/regionen/landshut", label: "Kitchens in Landshut" },
          { href: "/regionen/regensburg", label: "Kitchens in Regensburg" },
          { href: "/regionen/mainburg", label: "Kitchens in Mainburg" },
          { href: "/regionen/nuernberg", label: "Kitchens in Nuremberg" },
          { href: "/regionen", label: "All regions" },
        ],
      },
    },
    {
      title: "COMPANY",
      links: [
        { href: "/", label: "Home" },
        { href: "/ueber", label: "About BEER" },
        { href: "/ueber", label: "Team" },
        { href: "/projekte", label: "All projects" },
        { href: "/ueber", label: "Sustainability" },
        { href: "/kontakt", label: "Careers" },
        { href: "/ratgeber", label: "Press" },
      ],
    },
  ],
  shortcuts: [
    { href: "/faq", label: "FAQ" },
    { href: "/ratgeber", label: "GUIDES" },
  ],
  legal: [
    { href: "/impressum", label: "Imprint" },
    { href: "/datenschutz", label: "Privacy" },
    { href: "/agb", label: "Terms" },
    { href: "/datenschutz", label: "Cookie settings" },
  ],
  social: socialLinks,
};

export function footerFallback(locale: "de" | "en"): FooterContent {
  return locale === "en" ? englishFooter : germanFooter;
}
