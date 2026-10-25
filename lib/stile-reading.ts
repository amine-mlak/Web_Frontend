import type { Locale } from "@/lib/i18n";

export type StileReadingCopy = {
  title: string;
  description: string;
  heading: string;
  paragraphs: string[];
};

const DE: Record<string, StileReadingCopy> = {
  modern: {
    title: "Moderne Küchen aus Wolfersdorf",
    description:
      "Moderne Küchen aus der Manufaktur in Wolfersdorf bei Freising. Ruhige Flächen, klare Fugen, Wärme aus Holz oder Stein. Aufmaß in München und im Umland.",
    heading: "Moderne Küchen, gebaut für den Alltag.",
    paragraphs: [
      "Eine moderne Küche bei BEER ist keine Jahresfarbe und kein Griff aus dem Katalog des letzten Salons. Die Fläche bleibt ruhig, die Fuge ist bewusst gesetzt, und Wärme kommt aus Holz oder Stein, damit Präzision nicht kalt wird. Was in zehn Jahren noch selbstverständlich wirken soll, entscheiden wir am Muster, nicht am Bildschirm.",
      "Griffe, Licht und Auszüge tragen die Haltung. Eine matte Front ohne Gegenlicht wird schwer. Ein Auszug, der den Tag nicht trägt, macht die ruhige Ansicht zur Pose. Deshalb zeichnen wir die Arbeitszone, bevor die Front feststeht: Kochfeld, Spüle, Wege, und das Licht aus dem Haus, nicht ein Lichtband als Dekor.",
      "Geplant wird in der Ausstellung in Wolfersdorf bei Freising. Aufgemessen wird im Haus, ob in München, in einem Neubau in Erding oder in einem Bestand in Freising. Gefertigt wird in derselben Werkstatt. Der Radius bleibt ehrlich: etwa zweihundert Kilometer um München, Montage durch uns, nicht durch ein Netz aus Gewerken.",
    ],
  },
  landhaus: {
    title: "Landhausküchen um München",
    description:
      "Landhausküchen mit Holz und Rahmen, ohne Kostüm. Manufaktur in Wolfersdorf bei Freising, Aufmaß in München, Freising und im Altbau des Umlands.",
    heading: "Landhausküchen, wenn das Haus den Ton gibt.",
    paragraphs: [
      "Landhaus heißt bei uns Holz und Rahmen, nicht eine Tracht aus dem Prospekt. Der Altbau, der Dielenboden, das Fenster und der Stein geben den Ton. Eine ruhige Platte hält die Rahmen zusammen. Zu viel Profil, zu viel Zierleiste, eine Folie, die Holz heißen soll: das bleibt im Katalog.",
      "Eiche, ein ehrlicher Schliff, ein Griff, der zur Tür gehört. Wir mustern das unter Tageslicht in Wolfersdorf, neben der Wandfarbe und dem Boden, die Sie mitbringen. Ein Foto aus einem anderen Haus ist eine Richtung, keine Bestellung. Die Rahmen kommen vom Raum, nicht von einem Landhaus-Programm.",
      "Solche Küchen stehen in alten Häusern östlich von Freising ebenso wie in neuen Häusern um München, Dachau und Pfaffenhofen. Das Aufmaß nimmt die schiefe Wand und die Fensterbrüstung mit. Die Fertigung bleibt in Wolfersdorf. Wir liefern und montieren selbst, solange der Weg zur Werkstatt Sinn hat.",
    ],
  },
  design: {
    title: "Designküchen aus der Manufaktur",
    description:
      "Designküchen ohne Showküche: Kante, Gerät und Licht, geplant in Wolfersdorf bei Freising. Aufmaß in München und im Umland.",
    heading: "Designküchen, an der Kante entschieden.",
    paragraphs: [
      "Design ist hier keine Bühne. Die Kante, die man täglich sieht, das Gerät, das zur Nische passt, das Material, das die Hand bestätigt: das ist die Küche. Eine Fläche, die nur fotografiert werden will, streichen wir. Haptik steht vor der Ansicht, Stein, Lack oder Holz, was unter Tageslicht in Wolfersdorf besteht.",
      "Dunkle Flächen brauchen Licht von zwei Seiten, sonst wird die Küche schwer statt klar. Geräte wählen wir nach der Aufgabe, nicht nach dem Logo auf der Front. Bora, Miele, Gaggenau oder Siemens sitzen dort, wo Anschluss, Nische und Blick es tragen. Der Korpus bleibt BEER.",
      "Die meisten dieser Küchen entstehen für Häuser in München und im direkten Umland, Freising, Erding, Dachau. Das Gespräch beginnt oft in der Ausstellung in Wolfersdorf. Das Aufmaß folgt im Raum. Weiter als der ehrliche Radius um München sagen wir das, bevor eine Zeichnung entsteht.",
    ],
  },
  holz: {
    title: "Holzküchen aus Wolfersdorf",
    description:
      "Holzküchen aus Eiche, Nuss oder Esche, geölt oder lackiert, aus der Manufaktur in Wolfersdorf bei Freising. Aufmaß in München und Umgebung.",
    heading: "Holzküchen als Material, nicht als Stilname.",
    paragraphs: [
      "Eiche, Nuss, Esche. Holz bei BEER ist keine Kollektion und kein Look. Furnier oder massiv wird benannt. Schliff, Öl oder Lack entscheiden, wie die Front altert und wie sie das Licht aus dem Haus nimmt. Hochglanz auf Holz ist Kostüm. Eine Folie, die Maserung behauptet, auch.",
      "Die Front soll altern dürfen. Deshalb Öl, wo das Holz atmen soll, und Lack, wo der Alltag mehr Schutz verlangt. Den Stein oder die Keramik dagegen halten wir ruhig: zwei Hölzer im selben Blick werden unruhig. Gemustert wird in Wolfersdorf, neben der Platte, die wirklich kommt, nicht neben einem Foto der Aderung.",
      "Holzküchen bauen wir für Häuser von München bis Freising, Landshut und Augsburg, wenn der Weg zur Werkstatt trägt. Das Aufmaß klärt Schrägen, Nischen und das Licht, unter dem die Maserung leben soll. Gefertigt und montiert wird in einer Hand, in Wolfersdorf bei Freising.",
    ],
  },
  purist: {
    title: "Puristische Küchen nach Maß",
    description:
      "Puristische, grifflose Küchen aus Wolfersdorf bei Freising. Mulde oder Tipp-on nur, wo der Auszug es trägt. Aufmaß in München und im Umland.",
    heading: "Puristische Küchen, an der Öffnung entschieden.",
    paragraphs: [
      "Grifflos und flächig ist schnell gezeichnet und langsam bewiesen. Purismus trägt den Tag nur, wenn schwere Auszüge eine ehrliche Öffnung haben. Eine Mulde, wo das Gewicht sie verlangt. Tipp-on, wo die Tür es erlaubt. Ein Griff, der nachträglich die Fläche bricht, ist keine Lösung, sondern ein Nachtrag.",
      "Hinter der ruhigen Front müssen Stauraum und Licht stehen. Sonst ist die Küche eine Fotografie. Wir fassen die Türen an, bevor die Front feststeht, in der Ausstellung in Wolfersdorf, unter dem Licht, das dem Haus ähnlich ist. Die Linie bleibt, wenn nichts stört und der Alltag die Ruhe hält.",
      "Solche Küchen planen wir für Wohnungen in München ebenso wie für Häuser in Freising, Erding und Pfaffenhofen. Der Grundriss entscheidet, ob die Fläche ruhig bleiben darf. Das Aufmaß kommt vor dem Angebot. Die Fertigung bleibt in der Werkstatt in Wolfersdorf, die Montage bei uns.",
    ],
  },
  luxus: {
    title: "Luxusküchen als Maß und Stein",
    description:
      "Luxusküchen als Maß und Stein, nicht als Beschlag-Theater. Manufaktur in Wolfersdorf bei Freising. Aufmaß in München und im Umkreis.",
    heading: "Luxusküchen, am Stein und am Millimeter.",
    paragraphs: [
      "Luxus ist bei BEER Passgenauigkeit und Stein, nicht ein Beschlag, der gesehen werden will. Das Teure sitzt oft in der Platte, die wirklich aus dem Block kommt, und in der Zeit, die Wand, Nische und Fuge brauchen. Was man täglich nutzt, liegt in der Arbeitszone. Flächen, die nur posieren, bleiben ungezeichnet.",
      "Stein wird gemustert, nicht vom Bild bestellt. Aderung, Kante, Becken und das Licht im Haus entscheiden gemeinsam. Das Erstgespräch in Wolfersdorf ist kostenlos. Die Küche nicht: der Preis folgt dem Aufmaß, dem Material und der Werkstattzeit. Dafür gibt es keine Prospektzahl und keine Vertragsküche.",
      "Wir bauen das für wenige Häuser im Jahr, meist im Raum München, Freising und dem näheren Umland bis Augsburg und Ingolstadt, wenn der Weg stimmt. Aufmaß vor Ort, Fertigung in Wolfersdorf, Montage durch dieselben Leute. Weiter als der Radius sagen wir, bevor Stein bestellt wird.",
    ],
  },
};

const EN: Record<string, StileReadingCopy> = {
  modern: {
    title: "Modern kitchens from Wolfersdorf",
    description:
      "Modern kitchens from the workshop in Wolfersdorf near Freising. Quiet faces, clear joints, warmth from wood or stone. Surveyed in Munich and nearby.",
    heading: "Modern kitchens, built for the day.",
    paragraphs: [
      "A modern kitchen at BEER is not a colour of the year and not a handle from the last trade fair. The face stays quiet, the joint is set on purpose, and warmth comes from wood or stone so precision does not turn cold. What should still feel obvious in ten years is decided on a sample, not on a screen.",
      "Handles, light and drawers carry the stance. A matt front without light from a second side becomes heavy. A drawer that does not carry the day makes the quiet view a pose. We draw the working zone before the front is fixed: hob, sink, paths, and the light the house already has.",
      "Planning starts in the showroom at Wolfersdorf near Freising. The survey happens in the house, in Munich, in a new build in Erding, or in an older house in Freising. Making stays in the same workshop. The radius stays honest: about two hundred kilometres around Munich, fitted by us.",
    ],
  },
  landhaus: {
    title: "Country kitchens around Munich",
    description:
      "Country kitchens in wood and frame, without costume. Made in Wolfersdorf near Freising, surveyed in Munich, Freising and older houses nearby.",
    heading: "Country kitchens, when the house sets the tone.",
    paragraphs: [
      "Country here means wood and a frame, not a costume from a brochure. The old house, the floorboards, the window and the stone set the tone. A quiet worktop holds the frames together. Too much moulding, a foil that claims to be timber: that stays in the catalogue.",
      "Oak, an honest finish, a handle that belongs to the door. We sample it in daylight at Wolfersdorf, next to the wall colour and the floor you bring. A photograph from another house is a direction, not an order. The frames come from the room, not from a country-kitchen programme.",
      "These kitchens stand in older houses east of Freising as well as in new houses around Munich, Dachau and Pfaffenhofen. The survey takes the uneven wall and the window sill with it. Making stays in Wolfersdorf. We deliver and fit ourselves, as long as the road back to the workshop makes sense.",
    ],
  },
  design: {
    title: "Design kitchens from the workshop",
    description:
      "Design kitchens without a show kitchen: edge, appliance and light, planned in Wolfersdorf near Freising. Surveyed in Munich and nearby.",
    heading: "Design kitchens, decided at the edge.",
    paragraphs: [
      "Design here is not a stage. The edge you see every day, the appliance that fits the niche, the material the hand confirms: that is the kitchen. A face that only wants to be photographed is struck out. Touch comes before the view. Stone, lacquer or wood, whatever holds in daylight at Wolfersdorf.",
      "Dark faces need light from two sides, or the room turns heavy instead of clear. Appliances are chosen for the task, not for a logo on the front. Bora, Miele, Gaggenau or Siemens sit where services, niche and view can carry them. The carcass stays BEER.",
      "Most of these kitchens are for houses in Munich and close by, Freising, Erding, Dachau. The conversation often starts in the Wolfersdorf showroom. The survey follows in the room. Beyond an honest radius around Munich, we say so before a drawing begins.",
    ],
  },
  holz: {
    title: "Wood kitchens from Wolfersdorf",
    description:
      "Wood kitchens in oak, walnut or ash, oiled or lacquered, from the workshop in Wolfersdorf near Freising. Surveyed in Munich and the surrounding country.",
    heading: "Wood kitchens as material, not a style name.",
    paragraphs: [
      "Oak, walnut, ash. Wood at BEER is not a collection and not a look. Veneer or solid is named. The sanding, oil or lacquer decides how the front ages and how it takes the light from the house. High gloss on wood is costume. So is a foil that pretends to be grain.",
      "The front should be allowed to age. Oil where the wood should breathe, lacquer where the day asks for more protection. Stone or ceramic against it stays quiet: two woods in the same view become restless. Sampling happens in Wolfersdorf, next to the slab that will actually arrive.",
      "We build wood kitchens for houses from Munich to Freising, Landshut and Augsburg, when the road to the workshop still carries. The survey settles slopes, niches and the light the grain should live under. Making and fitting stay in one hand, in Wolfersdorf near Freising.",
    ],
  },
  purist: {
    title: "Purist kitchens made to measure",
    description:
      "Handleless purist kitchens from Wolfersdorf near Freising. A finger pull or tip-on only where the drawer can carry it. Surveyed in Munich and nearby.",
    heading: "Purist kitchens, decided at the opening.",
    paragraphs: [
      "Handleless and flat is quick to draw and slow to prove. Purism carries the day only when heavy drawers have an honest opening. A finger pull where the weight asks for it. Tip-on where the door allows it. A handle added later, breaking the face, is not a solution. It is an afterthought.",
      "Behind the quiet front, storage and light have to stand. Otherwise the kitchen is a photograph. We handle the doors before the front is fixed, in the Wolfersdorf showroom, under light close to the house. The line holds when nothing interrupts it and the day keeps the calm.",
      "We plan these kitchens for apartments in Munich as well as houses in Freising, Erding and Pfaffenhofen. The plan decides whether the face may stay quiet. The survey comes before a price. Making stays in the workshop at Wolfersdorf, fitting with us.",
    ],
  },
  luxus: {
    title: "Luxury kitchens as measure and stone",
    description:
      "Luxury kitchens as measure and stone, not as hardware theatre. Made in Wolfersdorf near Freising. Surveyed in Munich and within reach.",
    heading: "Luxury kitchens, settled in stone and millimetres.",
    paragraphs: [
      "Luxury at BEER is fit and stone, not a fitting that wants to be seen. The costly part is often the slab that really comes from the block, and the time wall, niche and joint require. What you use every day sits in the working zone. Faces that only pose stay undrawn.",
      "Stone is sampled, not ordered from a picture. Grain, edge, sink and the light in the house decide together. The first conversation in Wolfersdorf is free. The kitchen is not: the price follows the survey, the material and the time in the workshop. There is no brochure figure and no tied kitchen.",
      "We build this for few houses a year, mostly around Munich, Freising and the nearer country out to Augsburg and Ingolstadt, when the road is right. Survey on site, making in Wolfersdorf, fitting by the same people. Beyond the radius we say so before stone is ordered.",
    ],
  },
};

const PLACES = {
  de: {
    eyebrow: "Im Radius",
    title: "Wolfersdorf bei Freising.",
    text: "Die Ausstellung steht in Badendorf 6. Das Aufmaß machen wir im Haus, die Fertigung bleibt in der Werkstatt. Etwa zweihundert Kilometer um München, Montage durch uns.",
    linksLabel: "Küchen in der Nähe",
    places: [
      ["München", "/regionen/muenchen"],
      ["Freising", "/regionen/freising"],
      ["Erding", "/regionen/erding"],
      ["Dachau", "/regionen/dachau"],
      ["Pfaffenhofen", "/regionen/pfaffenhofen"],
      ["Augsburg", "/regionen/augsburg"],
    ],
  },
  en: {
    eyebrow: "Within reach",
    title: "Wolfersdorf near Freising.",
    text: "The showroom is at Badendorf 6. The survey happens in the house, making stays in the workshop. About two hundred kilometres around Munich, fitted by us.",
    linksLabel: "Kitchens nearby",
    places: [
      ["Munich", "/regionen/muenchen"],
      ["Freising", "/regionen/freising"],
      ["Erding", "/regionen/erding"],
      ["Dachau", "/regionen/dachau"],
      ["Pfaffenhofen", "/regionen/pfaffenhofen"],
      ["Augsburg", "/regionen/augsburg"],
    ],
  },
} as const;

export function stileReading(slug: string, locale: Locale): StileReadingCopy | null {
  const book = locale === "en" ? EN : DE;
  return book[slug] ?? null;
}

export function stilePlaces(locale: Locale) {
  return locale === "en" ? PLACES.en : PLACES.de;
}
