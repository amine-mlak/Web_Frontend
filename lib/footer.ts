export type FooterLink = {
  href: string;
  label: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
  extraTitle?: string;
  extraLinks?: FooterLink[];
  note?: string;
};

export const kitchenWorlds: FooterLink[] = [
  { href: "/kuechen/stile/modern", label: "Moderne Küchen" },
  { href: "/kuechen/stile/landhaus", label: "Landhausküchen" },
  { href: "/kuechen/stile/design", label: "Designküchen" },
  { href: "/kuechen/stile/holz", label: "Holzküchen" },
  { href: "/kuechen/formen/insel", label: "Küche mit Insel" },
  { href: "/kuechen/formen/offen", label: "Offene Küche" },
  { href: "/kuechen/formen/l-form", label: "L-Form" },
  { href: "/kuechen/formen/u-form", label: "U-Form" },
  { href: "/kuechen/formen/zeile", label: "Küchenzeile" },
  { href: "/kuechen/formen/klein", label: "Kleine Küchen" },
  { href: "/kuechen/farben/schwarz", label: "Schwarze Küchen" },
  { href: "/kuechen/farben/weiss", label: "Weiße Küchen" },
  { href: "/kuechen/farben/salbei", label: "Salbeigrüne Küchen" },
  { href: "/kuechen", label: "Einbauküche" },
  { href: "/kuechen/stile/luxus", label: "Luxusküche" },
  { href: "/kuechen/besondere/raumhoch", label: "Raumhohe Küchen" },
  { href: "/kuechen/besondere/grifflos", label: "Grifflose Küchen" },
  { href: "/kuechen/besondere/nach-mass", label: "Küche nach Maß" },
  { href: "/material", label: "Material & Ausstattung" },
];

export const footerColumns: FooterSection[] = [
  {
    title: "Marken & Möbel",
    links: [
      { href: "/marken/bora", label: "Bora" },
      { href: "/marken/miele", label: "Miele" },
      { href: "/marken/gaggenau", label: "Gaggenau" },
      { href: "/marken/quooker", label: "Quooker" },
    ],
    extraTitle: "Möbel nach Maß",
    extraLinks: [
      { href: "/moebel/einbauschraenke", label: "Einbauschränke" },
      { href: "/moebel/ankleide", label: "Begehbare Kleiderschränke" },
      { href: "/moebel/tische-baenke", label: "Tische & Bänke" },
      { href: "/moebel/wohnmoebel", label: "Wohnmöbel" },
    ],
  },
  {
    title: "Regionen",
    links: [
      { href: "/regionen/muenchen", label: "München" },
      { href: "/regionen/freising", label: "Freising" },
      { href: "/regionen/erding", label: "Erding" },
      { href: "/regionen/dachau", label: "Dachau" },
      { href: "/regionen/pfaffenhofen", label: "Pfaffenhofen" },
      { href: "/regionen/augsburg", label: "Augsburg" },
      { href: "/regionen/ingolstadt", label: "Ingolstadt" },
      { href: "/regionen/landshut", label: "Landshut" },
      { href: "/regionen/regensburg", label: "Regensburg" },
      { href: "/regionen/mainburg", label: "Mainburg" },
      { href: "/regionen/nuernberg", label: "Nürnberg" },
    ],
  },
  {
    title: "Küche planen",
    links: [
      { href: "/kueche-planen", label: "So entsteht Ihre Küche" },
      { href: "/ausstellung", label: "Ausstellung Freising" },
      { href: "/beratung", label: "Küchenplaner" },
      { href: "/katalog", label: "Katalog bestellen" },
      { href: "/beratung", label: "Beratung & Termin" },
    ],
  },
  {
    title: "Ratgeber",
    links: [
      { href: "/ratgeber/was-kostet-eine-kueche", label: "Was kostet eine Küche?" },
      { href: "/ratgeber", label: "Top-Artikel" },
      { href: "/ratgeber", label: "Alle Artikel" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { href: "/ueber", label: "Über BEER" },
      { href: "/ueber", label: "Team" },
      { href: "/projekte", label: "Alle Projekte" },
      { href: "/ueber", label: "Nachhaltigkeit" },
      { href: "/kontakt", label: "Karriere" },
      { href: "/ratgeber", label: "Presse" },
    ],
  },
  {
    title: "Kontakt",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/kontakt", label: "BEER GmbH" },
      { href: "/kontakt", label: "Badendorf 6" },
      { href: "/kontakt", label: "85395 Wolfersdorf" },
      { href: "/ausstellung", label: "Öffnungszeiten" },
    ],
  },
];

export const legalLinks: FooterLink[] = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "/datenschutz", label: "Cookie-Einstellungen" },
];

export const socialLinks: FooterLink[] = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://pinterest.com", label: "Pinterest" },
  { href: "https://youtube.com", label: "YouTube" },
  { href: "https://houzz.com", label: "Houzz" },
];
