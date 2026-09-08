import type { ISbStoryData, SbBlokData } from "@storyblok/react/rsc";

const uid = (id: string, component: string): SbBlokData => ({
  _uid: id,
  component,
});

const asset = (filename: string, alt: string) => ({
  filename,
  alt,
  fieldtype: "asset" as const,
});

const hero: SbBlokData = {
  ...uid("hero", "hero"),
  slides: [
    {
      ...uid("slide-1", "hero_slide"),
      alt: "Graue moderne Küche mit weißer Rückwand",
      image: asset(
        "https://a.storyblok.com/f/295092261868907/2fdc60f174/beer-hero-modern.jpg",
        "Graue moderne Küche mit weißer Rückwand",
      ),
    },
    {
      ...uid("slide-2", "hero_slide"),
      alt: "Helle Küche mit Insel",
      image: asset(
        "https://a.storyblok.com/f/295092261868907/1090b66eaa/beer-kueche-insel.jpg",
        "Helle Küche mit Insel",
      ),
    },
  ],
};

const kacheln: SbBlokData = {
  ...uid("kacheln", "kacheln"),
  eyebrow: "Die Kacheln · Geteilte Bildtafeln",
  intro:
    "Keine Liste – Tafeln. Zur Hälfte das Projekt, zur Hälfte Material und Farbe. So wird die Wahl der Küchenfarbe zum Erlebnis.",
  colors: [
    {
      ...uid("kachel-1", "kachel"),
      title: "Salbeigrüne Küchen",
      href: "#kacheln",
      alt: "Salbeigrüne Landhausküche mit Marmor und schwarzen Beschlägen",
      color: "#9eae92",
      image: asset(
        "https://a.storyblok.com/f/295092261868907/f0bdb7bd8b/beer-kachel-0.jpg",
        "Salbeigrüne Landhausküche mit Marmor und schwarzen Beschlägen",
      ),
    },
    {
      ...uid("kachel-2", "kachel"),
      title: "Weiße Küchen",
      href: "#kacheln",
      alt: "Weiße grifflose Küche mit Holz und Naturstein",
      color: "#f7f5f1",
      image: asset(
        "https://a.storyblok.com/f/295092261868907/5fdbc4cc7f/beer-kachel-1.jpg",
        "Weiße grifflose Küche mit Holz und Naturstein",
      ),
    },
    {
      ...uid("kachel-3", "kachel"),
      title: "Schwarze Küchen",
      href: "#kacheln",
      alt: "Schwarze Küche mit Eiche und Fischgrätparkett",
      color: "#131311",
      image: asset(
        "https://a.storyblok.com/f/295092261868907/749269bffe/beer-kachel-2.jpg",
        "Schwarze Küche mit Eiche und Fischgrätparkett",
      ),
    },
  ],
};

const ablauf: SbBlokData = {
  ...uid("ablauf", "ablauf"),
  eyebrow: "Der Weg zur Küche",
  title: "Von der ersten Idee bis zur Übergabe",
  button_label: "Entdecken",
  button_href: "#ablauf",
  steps: [
    {
      ...uid("step-1", "ablauf_step"),
      step: "01",
      title: "Beratung",
      description:
        "Wir hören zu, verstehen Ihren Alltag und definieren den Rahmen für Ihre Küche.",
      icon: "consult",
    },
    {
      ...uid("step-2", "ablauf_step"),
      step: "02",
      title: "Planung & Design",
      description:
        "Raum, Material und Funktion werden zu einem präzisen Entwurf zusammengeführt.",
      icon: "plan",
    },
    {
      ...uid("step-3", "ablauf_step"),
      step: "03",
      title: "Manufaktur-Fertigung",
      description:
        "In der Werkstatt entsteht jedes Element als Einzelstück – maßgenau und langlebig.",
      icon: "factory",
    },
    {
      ...uid("step-4", "ablauf_step"),
      step: "04",
      title: "Montage & Übergabe",
      description:
        "Vor Ort montiert, justiert und übergeben – bis alles sitzt, wie geplant.",
      icon: "handover",
    },
  ],
};

const entdecken: SbBlokData = {
  ...uid("entdecken", "entdecken"),
  panels: [
    {
      ...uid("panel-1", "entdecken_panel"),
      title: "BEER Küchen-Designs",
      subtitle: "Design, das Persönlichkeit zum Leben bringt.",
      button_label: "Küchen entdecken",
      href: "#kacheln",
      alt: "BEER Küchen-Designs",
      image: asset(
        "https://a.storyblok.com/f/295092261868907/d8f6d27525/beer-entdecken-0-skizze.webp",
        "BEER Küchen-Designs",
      ),
    },
    {
      ...uid("panel-2", "entdecken_panel"),
      title: "Materialien & Farben",
      subtitle: "Die Kunst des Kombinierens.",
      button_label: "Farben entdecken",
      href: "#kacheln",
      alt: "Materialien und Farben",
      image: asset(
        "https://a.storyblok.com/f/295092261868907/2f8099b03a/beer-entdecken-1-landhauskuechen_kuechenideen.webp",
        "Materialien und Farben",
      ),
    },
    {
      ...uid("panel-3", "entdecken_panel"),
      title: "Arbeitsplatten",
      subtitle: "Präzision, die man sieht und fühlt.",
      button_label: "Arbeitsplatten entdecken",
      href: "#ablauf",
      alt: "Arbeitsplatten",
      image: asset(
        "https://a.storyblok.com/f/295092261868907/6cdf7f2c8a/beer-entdecken-2-kuechentheke_arbeitsplatte.webp",
        "Arbeitsplatten",
      ),
    },
    {
      ...uid("panel-4", "entdecken_panel"),
      title: "Innenleben",
      subtitle: "Organisation, die Freiheit gibt.",
      button_label: "Innenleben entdecken",
      href: "#ablauf",
      alt: "Innenleben der Küche",
      image: asset(
        "https://a.storyblok.com/f/295092261868907/8ed4f9d70f/beer-entdecken-3-gemini_generated_image_9iv12l9iv12l9iv1.jpg",
        "Innenleben der Küche",
      ),
    },
  ],
};

const faq: SbBlokData = {
  ...uid("faq", "faq"),
  eyebrow: "Fragen",
  title: "Bevor wir uns sehen",
  items: [
    {
      ...uid("faq-1", "faq_item"),
      question: "Was kostet eine Küche nach Maß?",
      answer:
        "Jede Küche wird einzeln geplant. Der Preis hängt von Größe, Material und Ausstattung ab. Im Beratungsgespräch nennen wir Ihnen einen ehrlichen Rahmen – bevor die Planung vertieft wird.",
    },
    {
      ...uid("faq-2", "faq_item"),
      question: "Wie lange dauert Planung und Fertigung?",
      answer:
        "Von der ersten Beratung bis zur Montage rechnen wir in der Regel mit einigen Monaten. Den konkreten Zeitplan stimmen wir nach der Aufmaßnahme mit Ihnen ab.",
    },
    {
      ...uid("faq-3", "faq_item"),
      question: "Kann ich die Ausstellung ohne Termin besuchen?",
      answer:
        "Ja. Für ein ruhiges Gespräch empfehlen wir dennoch einen Termin – so ist Ihr Berater vorbereitet und die Zeit gehört Ihnen.",
    },
    {
      ...uid("faq-4", "faq_item"),
      question: "Fertigen Sie auch Möbel außerhalb der Küche?",
      answer:
        "Ja, in kleinerem Umfang: Einbauschränke, Ankleiden, Tische und Wohnmöbel – immer dann, wenn sie zur Küche und zum Haus gehören.",
    },
  ],
};

const beratung: SbBlokData = {
  ...uid("beratung", "beratung"),
  eyebrow: "Persönliche Beratung",
  title: "Vereinbare deine persönliche Beratung",
  intro:
    "Erzählen Sie uns von Ihrem Raum, Ihrem Alltag und Ihren Wünschen. Wir vereinbaren einen Termin in der Ausstellung oder bei Ihnen vor Ort.",
  company: "BEER GmbH",
  street: "Badendorf 6",
  city: "85395 Wolfersdorf",
  phone_label: "T 08168 909910",
  phone_href: "tel:+498168909910",
  email: "beratung@beer-kuechenmanufaktur.de",
};

export const fallbackStoryblokStory = {
  id: 0,
  uuid: "local-fallback",
  name: "Startseite",
  slug: "home",
  full_slug: "home",
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
  default_full_slug: "home",
  content: {
    ...uid("landing", "landing"),
    title: "Startseite",
    hero: [hero],
    kacheln: [kacheln],
    ablauf: [ablauf],
    entdecken: [entdecken],
    faq: [faq],
    beratung: [beratung],
  },
} as unknown as ISbStoryData;
