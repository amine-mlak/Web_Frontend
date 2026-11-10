import type { Locale } from "@/lib/i18n";

/**
 * Where BEER builds, said once per kitchen topic and differently on each page. The paragraph is
 * added to a topic's reading text when that text names no place, so every topic page says in
 * plain words where the showroom is and where the survey and the fitting happen. Only facts from
 * the customer answers BEER wrote (lib/faq-data.json).
 */
const DE: Record<string, string> = {
  raumhoch:
    "Das Aufmaß machen wir bei Ihnen vor Ort, im Altbau in München genauso wie im Neubau in Dachau oder Freising. Gefertigt werden die Schränke in unserem Werk in Wolfersdorf, eingebaut von unseren eigenen Monteuren.",
  klein:
    "Viele unserer Küchen entstehen im Bestand, mit vorhandenen Anschlüssen und schiefen Wänden. Zum Aufmaß kommen wir zu Ihnen, nach München ebenso wie nach Erding oder Pfaffenhofen. Bringen Sie zum ersten Gespräch in Wolfersdorf einen Grundriss mit Maßen und ein paar Fotos mit.",
  outdoor:
    "Auch eine Outdoorküche beginnt mit einem Gespräch in unserer Ausstellung in Wolfersdorf bei Freising. Das Aufmaß nehmen wir danach bei Ihnen auf der Terrasse oder im Garten. Unser Schwerpunkt liegt im Großraum München und reicht bis Landshut, Augsburg und Regensburg.",
  weiss:
    "Lackierte Fronten kommen aus unserer eigenen Lackiererei in Wolfersdorf, matt, stumpfmatt oder glänzend. Die Muster sehen Sie in der Ausstellung bei Freising. Aufmaß und Montage übernehmen wir bei Ihnen, in München, Ingolstadt oder Landshut.",
  salbei:
    "Die Ausstellung mit den Farbmustern liegt in Wolfersdorf, die Anfahrt aus München, Erding und Landshut ist üblich. Lackiert wird in der eigenen Lackiererei, deshalb ist die Farbauswahl sehr groß. Zum Aufmaß kommen wir zu Ihnen.",
  grau:
    "Wir planen und bauen Küchen im Großraum München und in Regionen wie Freising, Augsburg und Regensburg. Für das erste Gespräch im Werkstudio in Wolfersdorf sollten Sie anderthalb bis zweieinhalb Stunden einplanen. Es ist kostenlos.",
  schwarz:
    "Die Originalmuster liegen in der Materialbibliothek unseres Werkstudios in Wolfersdorf bei Freising. Wer aus Augsburg oder Ingolstadt nicht gleich anreisen möchte, kann das erste Gespräch auch online über Microsoft Teams führen. Aufmaß und Montage finden in jedem Fall bei Ihnen statt.",
  "l-form":
    "Wie die Ecke genutzt wird, hängt von Fenstern, Nischen und Anschlüssen ab. Die nehmen wir beim Aufmaß bei Ihnen auf, in München, Erding oder Mainburg. Danach wird im eigenen Werk in Wolfersdorf gefertigt. Die Montage dauert in der Regel etwa zwei Tage.",
  "u-form":
    "Ob die Durchgänge reichen, zeigt das Aufmaß bei Ihnen, in Pfaffenhofen, Freising oder Regensburg. Erst danach ist die Planung verbindlich. Von der Bestellung bis zur Lieferung vergehen in der Regel 10 bis 18 Wochen.",
  zeile:
    "Zum Aufmaß kommen wir nach München, Dachau oder Landshut, montiert wird von unseren eigenen Monteuren. Auf Wunsch bauen wir die alte Küche aus und entsorgen sie. Elektro- und Installationspläne für Ihre Handwerker bekommen Sie von uns.",
  insel:
    "Den Grundriss besprechen wir im ersten Gespräch in Wolfersdorf. Bringen Sie ihn am besten mit Maßen mit. Zum Aufmaß kommen wir zu Ihnen, nach Erding, Ingolstadt oder Augsburg. Für die Anschlüsse im Boden erstellen wir Elektro- und Installationspläne.",
  offen:
    "Bei einem Neubau lohnt sich eine frühe Beratung, solange Anschlüsse und Abluft noch frei geplant werden können. Das erste Gespräch findet in der Ausstellung in Wolfersdorf statt, das Aufmaß später bei Ihnen in München, Freising oder Erding.",
  landhaus:
    "Die Ausstellung liegt in Wolfersdorf bei Freising, in Badendorf 6. Von dort kommen wir zum Aufmaß zu Ihnen, ob nach Landshut, Pfaffenhofen oder Mainburg. Gefertigt und lackiert wird im eigenen Werk.",
  holz:
    "Furnier und Massivholz sehen Sie in der Materialbibliothek in Wolfersdorf im Original. Wir verarbeiten europäische und amerikanische Hölzer und verzichten auf Tropenholz. Aufmaß und Montage machen wir bei Ihnen, in München, Freising oder Regensburg.",
  luxus:
    "Arbeitsplatten aus Naturstein beziehen wir von Steinmetzbetrieben, die Möbel fertigen wir selbst in Wolfersdorf. Das Aufmaß nehmen wir bei Ihnen, in München, Augsburg oder Regensburg. Eingebaut wird die Küche von unseren eigenen Monteuren.",
  modern:
    "Unser Werkstudio in Wolfersdorf ist montags bis freitags geöffnet, andere Zeiten nach Absprache. Die Anfahrt aus München, Erding und Landshut ist üblich. Nach dem Gespräch folgt das Aufmaß bei Ihnen, dann die Fertigung im eigenen Werk.",
  design:
    "Unser Werkstudio in Wolfersdorf bei Freising hat rund 800 Quadratmeter. Dort beginnt die Planung. Das Aufmaß machen wir bei Ihnen, in München, Ingolstadt oder Augsburg. Den fertigen Plan geben Sie frei, bevor gefertigt wird.",
  purist:
    "Durchgehende Flächen verlangen genaue Maße. Wir messen deshalb Wände, Nischen, Fenster und Anschlüsse bei Ihnen aus, in München, Dachau oder Pfaffenhofen. Gefertigt wird in Wolfersdorf. Auf Wunsch zeigen wir Ihnen dort die Fertigung.",
  kochinsel:
    "Elektrik und Installation führen Fachbetriebe aus. Wir liefern die Pläne dazu und stimmen uns auf Wunsch mit unseren Partnerfirmen ab. Das gilt bei einem Umbau in München genauso wie bei einem Neubau in Freising, Erding oder Ingolstadt.",
  essinsel:
    "Wie viel Platz für die Hocker bleibt, sehen wir am Grundriss. Bringen Sie ihn zum ersten Gespräch nach Wolfersdorf mit, zusammen mit Fotos des Raums. Zum Aufmaß kommen wir danach zu Ihnen, nach Dachau, Erding oder Landshut.",
  arbeitsinsel:
    "Korpus und Fronten der Insel fertigen wir im eigenen Werk in Wolfersdorf. Geliefert und montiert wird durch unsere Monteure, im Großraum München und in der Region von Freising bis Regensburg und Augsburg.",
  grifflos:
    "Welche Öffnung Ihnen besser liegt, besprechen wir im ersten Gespräch in Wolfersdorf. Es dauert meist anderthalb bis zweieinhalb Stunden und ist kostenlos. Danach kommen wir zum Aufmaß zu Ihnen, nach München, Mainburg oder auch nach Nürnberg.",
  "nach-mass":
    "Zum Aufmaß kommen wir in den Großraum München und in Orte wie Freising, Erding, Landshut, Ingolstadt und Augsburg, insgesamt im Umkreis von etwa 200 Kilometern um München. Ob der Weg zu Ihnen passt, klären wir im ersten Gespräch.",
};

const EN: Record<string, string> = {
  raumhoch:
    "We take the survey in your home, in a period building in Munich just as in a new build in Dachau or Freising. The cabinets are made in our works in Wolfersdorf and fitted by our own fitters.",
  klein:
    "Many of our kitchens go into existing buildings, with the connections already there and walls that are not straight. For the survey we come to you, to Munich as well as to Erding or Pfaffenhofen. For the first talk in Wolfersdorf, bring a floor plan with measurements and a few photos.",
  outdoor:
    "An outdoor kitchen also starts with a talk in our showroom in Wolfersdorf near Freising. After that we take the survey on your terrace or in your garden. Most of our work is in the Munich area and reaches as far as Landshut, Augsburg and Regensburg.",
  weiss:
    "Lacquered fronts come from our own paint shop in Wolfersdorf, in matt, dead matt or gloss. You see the samples in the showroom near Freising. We survey and fit in your home, in Munich, Ingolstadt or Landshut.",
  salbei:
    "The showroom with the colour samples is in Wolfersdorf. Clients regularly drive there from Munich, Erding and Landshut. We lacquer in our own paint shop, so the choice of colours is very wide. For the survey we come to you.",
  grau:
    "We plan and build kitchens in the Munich area and in regions such as Freising, Augsburg and Regensburg. Allow one and a half to two and a half hours for the first talk in the studio in Wolfersdorf. It is free.",
  schwarz:
    "The original samples are in the materials library of our studio in Wolfersdorf near Freising. If you would rather not travel from Augsburg or Ingolstadt straight away, the first talk can also be held online on Microsoft Teams. The survey and the fitting always happen in your home.",
  "l-form":
    "How the corner is used depends on windows, niches and connections. We record them at the survey in your home, in Munich, Erding or Mainburg. Then the kitchen is made in our own works in Wolfersdorf. Fitting usually takes about two days.",
  "u-form":
    "Whether the passages are wide enough shows at the survey in your home, in Pfaffenhofen, Freising or Regensburg. Only then is the plan binding. Delivery is usually 10 to 18 weeks after the order.",
  zeile:
    "For the survey we come to Munich, Dachau or Landshut, and our own fitters do the fitting. If you wish, we take out the old kitchen and dispose of it. We give you the electrical and plumbing plans for your trades.",
  insel:
    "We go through the floor plan in the first talk in Wolfersdorf. Bring it with measurements if you can. For the survey we come to you, to Erding, Ingolstadt or Augsburg. For the connections in the floor we draw the electrical and plumbing plans.",
  offen:
    "In a new build, early advice pays off while connections and extraction can still be planned freely. The first talk is in the showroom in Wolfersdorf, the survey later in your home in Munich, Freising or Erding.",
  landhaus:
    "The showroom is in Wolfersdorf near Freising, at Badendorf 6. From there we come to you for the survey, to Landshut, Pfaffenhofen or Mainburg. The kitchen is made and lacquered in our own works.",
  holz:
    "You see veneer and solid wood as real samples in the materials library in Wolfersdorf. We work with European and American woods and do not use tropical wood. We survey and fit in your home, in Munich, Freising or Regensburg.",
  luxus:
    "We buy natural stone worktops from stonemasons and make the furniture ourselves in Wolfersdorf. We take the survey in your home, in Munich, Augsburg or Regensburg. Our own fitters install the kitchen.",
  modern:
    "Our studio in Wolfersdorf is open Monday to Friday, other times by arrangement. Clients regularly drive there from Munich, Erding and Landshut. After the talk comes the survey in your home, then production in our own works.",
  design:
    "Our studio in Wolfersdorf near Freising has about 800 square metres. Planning starts there. We take the survey in your home, in Munich, Ingolstadt or Augsburg. You approve the finished plan before production starts.",
  purist:
    "Continuous surfaces need exact measurements. So we measure walls, niches, windows and connections in your home, in Munich, Dachau or Pfaffenhofen. The kitchen is made in Wolfersdorf. If you like, we show you the production there.",
  kochinsel:
    "Electrical and plumbing work is done by qualified trades. We supply the plans and, if you wish, coordinate with our partner firms. That applies to a conversion in Munich just as to a new build in Freising, Erding or Ingolstadt.",
  essinsel:
    "The floor plan shows how much room is left for the stools. Bring it to the first talk in Wolfersdorf, together with photos of the room. For the survey we then come to you, to Dachau, Erding or Landshut.",
  arbeitsinsel:
    "We make the carcass and fronts of the island in our own works in Wolfersdorf. Our fitters deliver and install it, in the Munich area and in the region from Freising to Regensburg and Augsburg.",
  grifflos:
    "Which way of opening suits you better is something we go through in the first talk in Wolfersdorf. It usually takes one and a half to two and a half hours and is free. After that we come to you for the survey, to Munich, Mainburg or as far as Nuremberg.",
  "nach-mass":
    "For the survey we come to the Munich area and to places such as Freising, Erding, Landshut, Ingolstadt and Augsburg, within about 200 kilometres of Munich in all. Whether the distance to you works is settled in the first talk.",
};

/** The paragraph on where BEER builds for one kitchen topic, or null when the topic has none. */
export function topicPlaces(slug: string, locale: Locale): string | null {
  return (locale === "en" ? EN : DE)[slug] ?? null;
}
