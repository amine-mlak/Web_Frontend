import type { PageCopy, PageCopySet } from "./types";

/**
 * One text per place, each built on different facts from the customer answers
 * in lib/faq-data.json. No distances or drive times beyond the 200 km fact.
 */
export const REGIONS: PageCopySet = {
  muenchen: {
    de: {
      heading: "Küchenplanung für München",
      lede: "Beratung in Wolfersdorf, Aufmaß und Montage in München.",
      paragraphs: [
        "Der Großraum München ist unser Schwerpunkt. Geplant und gefertigt werden die Küchen in Wolfersdorf bei Freising, nördlich der Stadt. Zum ersten Gespräch kommen Sie in die Ausstellung, zum Aufmaß kommen wir zu Ihnen.",
        "## Erstes Gespräch, auch online",
        "Das erste Gespräch ist kostenlos und dauert meist anderthalb bis zweieinhalb Stunden. Wenn der Weg nach Wolfersdorf gerade nicht passt, beginnen wir online über Microsoft Teams und sehen uns die Muster später gemeinsam an.",
        "## Altbau und Neubau",
        "Viele unserer Küchen entstehen im Bestand. Schiefe Wände, alte Anschlüsse und niedrige Decken sind dabei normal und werden beim Aufmaß erfasst. Beim Neubau lohnt es sich, früh zu kommen, solange Anschlüsse noch verlegt werden können. Dasselbe gilt für Dachau, Erding und Freising.",
      ],
      description:
        "Küchen nach Maß für München: Beratung in der Ausstellung in Wolfersdorf bei Freising oder online, Aufmaß und Montage bei Ihnen. Für Altbau und Neubau.",
    },
    en: {
      heading: "Kitchen planning for Munich",
      lede: "Advice in Wolfersdorf, measuring and fitting in Munich.",
      paragraphs: [
        "Greater Munich is where we work most. The kitchens are planned and made in Wolfersdorf near Freising, north of the city. You come to the showroom for the first talk, and we come to you to measure.",
        "## First talk, also online",
        "The first talk is free and usually takes one and a half to two and a half hours. If the trip to Wolfersdorf does not suit you right now, we start online on Microsoft Teams and look at the samples together later.",
        "## Old and new buildings",
        "Many of our kitchens go into existing homes. Walls out of true, old connections and low ceilings are normal there and are recorded when we measure. With a new build it pays to come early, while connections can still be moved. The same applies to Dachau, Erding and Freising.",
      ],
      description:
        "Made-to-measure kitchens for Munich: advice in the showroom in Wolfersdorf near Freising or online, measuring and fitting at your home. For old and new buildings.",
    },
  },
  freising: {
    de: {
      heading: "Die Ausstellung bei Freising",
      lede: "Die Ausstellung liegt bei Freising. Kurzer Weg, oft der erste Termin.",
      paragraphs: [
        "Unsere Ausstellung und die Werkstatt liegen in Wolfersdorf bei Freising, Badendorf 6. Auf rund 800 Quadratmetern sehen Sie Küchen, Materialien und Geräte. Für Kunden aus Freising ist das der kürzeste Weg zu uns.",
        "## Öffnungszeiten",
        "Wir sind Montag bis Freitag von 8 bis 12 Uhr und von 13 bis 18 Uhr da, andere Zeiten nach Vereinbarung. Für ein Planungsgespräch vereinbaren Sie am besten einen Termin.",
        "## Die Werkstatt ansehen",
        "Korpus, Front und Oberfläche fertigen wir selbst, mit eigener Lackiererei. Auf Wunsch zeigen wir Ihnen die Werkstatt bei einer Führung. Von hier aus liefern wir auch nach München, Erding und Pfaffenhofen.",
      ],
      description:
        "Küchen nach Maß bei Freising: Ausstellung und Werkstatt in Wolfersdorf, Badendorf 6, auf rund 800 Quadratmetern. Montag bis Freitag geöffnet, Termin nach Vereinbarung.",
    },
    en: {
      heading: "The showroom near Freising",
      lede: "The showroom is near Freising. A short trip, often the first appointment.",
      paragraphs: [
        "Our showroom and workshop are in Wolfersdorf near Freising, Badendorf 6. On around 800 square metres you see kitchens, materials and appliances. For clients from Freising it is the shortest way to us.",
        "## Opening hours",
        "We are there Monday to Friday from 8 to 12 and from 1 to 6, and at other times by arrangement. For a planning talk it is best to make an appointment.",
        "## Seeing the workshop",
        "We make carcass, front and surface ourselves, with our own paint shop. On request we show you the workshop on a tour. From here we also deliver to Munich, Erding and Pfaffenhofen.",
      ],
      description:
        "Made-to-measure kitchens near Freising: showroom and workshop in Wolfersdorf, Badendorf 6, on around 800 square metres. Open Monday to Friday, appointments by arrangement.",
    },
  },
  erding: {
    de: {
      heading: "Von Erding in die Ausstellung",
      lede: "Einzugsgebiet östlich von München. Aufmaß vor Ort.",
      paragraphs: [
        "Erding gehört zu unserem Einzugsgebiet östlich von München. Die Anfahrt aus Erding in die Ausstellung nach Wolfersdorf ist für viele unserer Kunden üblich.",
        "## Vom Gespräch zum Aufmaß",
        "Nach dem ersten Gespräch bekommen Sie beim zweiten Termin Plan und Angebot. Danach messen wir bei Ihnen in Erding auf. Erst mit dem Aufmaß wird die Planung verbindlich.",
        "## Lieferzeit und Montage",
        "Vom Auftrag bis zur Lieferung vergehen 10 bis 18 Wochen. Die Montage dauert etwa zwei Tage und wird von unseren eigenen Monteuren gemacht. Genauso arbeiten wir in Freising, Landshut und München.",
      ],
      description:
        "Küchen nach Maß für Erding: Beratung in Wolfersdorf, Aufmaß bei Ihnen, Lieferung in 10 bis 18 Wochen, Montage durch eigene Monteure in etwa zwei Tagen.",
    },
    en: {
      heading: "From Erding to the showroom",
      lede: "Our catchment area east of Munich. We measure on site.",
      paragraphs: [
        "Erding is part of our catchment area east of Munich. The trip from Erding to the showroom in Wolfersdorf is a usual one for many of our clients.",
        "## From the talk to the survey",
        "After the first talk you receive plan and offer at the second appointment. We then measure at your home in Erding. Only with the survey does the plan become binding.",
        "## Delivery time and fitting",
        "From order to delivery it takes 10 to 18 weeks. Fitting takes about two days and is done by our own fitters. We work the same way in Freising, Landshut and Munich.",
      ],
      description:
        "Made-to-measure kitchens for Erding: advice in Wolfersdorf, measuring at your home, delivery in 10 to 18 weeks, fitting by our own team in about two days.",
    },
  },
  dachau: {
    de: {
      heading: "Küchen für Bestand und Neubau in Dachau",
      lede: "Küchen im Norden Münchens, Bestand und Neubau.",
      paragraphs: [
        "In Dachau und im Norden Münchens planen wir Küchen für Häuser im Bestand und für Neubauten. Im Bestand sind schiefe Wände, alte Anschlüsse und niedrige Decken normal. Wir messen genau auf und fertigen die Möbel passend.",
        "## Die alte Küche",
        "Auf Wunsch bauen wir Ihre alte Küche aus und entsorgen sie. Das besprechen wir zusammen mit dem Montagetermin.",
        "## Elektro und Wasser",
        "Die Anschlüsse macht das Fachhandwerk. Sie bekommen von uns Elektro- und Installationspläne für Ihre Handwerker. Wenn Sie keine eigenen haben, arbeiten wir mit Partnerfirmen und stimmen die Arbeiten ab. Beraten wird in der Ausstellung in Wolfersdorf bei Freising, wie für Kunden aus Pfaffenhofen.",
      ],
      description:
        "Küchen nach Maß für Dachau: für Bestand und Neubau, mit Ausbau der alten Küche und Plänen für Elektriker und Installateur. Beratung in Wolfersdorf bei Freising.",
    },
    en: {
      heading: "Kitchens for old and new homes in Dachau",
      lede: "Kitchens north of Munich, for existing homes and new builds.",
      paragraphs: [
        "In Dachau and the north of Munich we plan kitchens for existing homes and for new builds. In existing homes, walls out of true, old connections and low ceilings are normal. We measure exactly and make the furniture to fit.",
        "## The old kitchen",
        "On request we take out your old kitchen and dispose of it. We agree this together with the fitting date.",
        "## Electrics and water",
        "Connections are made by qualified trades. You receive electrical and installation plans from us for your tradespeople. If you have none of your own, we work with partner firms and coordinate the work. Advice takes place in the showroom in Wolfersdorf near Freising, as it does for clients from Pfaffenhofen.",
      ],
      description:
        "Made-to-measure kitchens for Dachau: for existing homes and new builds, with removal of the old kitchen and plans for electrician and plumber. Advice in Wolfersdorf near Freising.",
    },
  },
  pfaffenhofen: {
    de: {
      heading: "Küchen nach Maß für Pfaffenhofen",
      lede: "Küchen aus der eigenen Werkstatt, nördlich von München bis in den Landkreis.",
      paragraphs: [
        "Pfaffenhofen liegt in unserem Einzugsgebiet nördlich von München. Wir planen Küchen für die Stadt und den Landkreis und bauen sie mit eigenen Monteuren ein.",
        "## Die Materialbibliothek",
        "In der Ausstellung in Wolfersdorf zeigen wir Ihnen Originalmuster: Hölzer, Lackfarben, Stein und Edelstahl. Sie legen Front, Arbeitsplatte und Boden nebeneinander und sehen, was zusammenpasst.",
        "## Was Sie mitbringen",
        "Hilfreich sind ein Grundriss mit Maßen, Fotos vom Raum, Ihre Ideen und ein grober Budgetrahmen. Damit kommen wir im ersten Gespräch schon weit. Kunden aus Ingolstadt, Freising und Mainburg gehen denselben Weg.",
      ],
      description:
        "Küchen nach Maß für Pfaffenhofen und den Landkreis: Originalmuster in der Ausstellung in Wolfersdorf, Montage durch eigene Monteure. Das bringen Sie zum ersten Gespräch mit.",
    },
    en: {
      heading: "Made-to-measure kitchens for Pfaffenhofen",
      lede: "Kitchens from our own workshop, from north of Munich into the district.",
      paragraphs: [
        "Pfaffenhofen lies in our catchment area north of Munich. We plan kitchens for the town and the district and fit them with our own team.",
        "## The material library",
        "In the showroom in Wolfersdorf we show you original samples: woods, lacquer colours, stone and stainless steel. You lay front, worktop and floor side by side and see what goes together.",
        "## What to bring",
        "A floor plan with measurements, photos of the room, your ideas and a rough budget all help. With those we get a long way in the first talk. Clients from Ingolstadt, Freising and Mainburg take the same route.",
      ],
      description:
        "Made-to-measure kitchens for Pfaffenhofen and the district: original samples in the showroom in Wolfersdorf, fitting by our own team. What to bring to the first talk.",
    },
  },
  augsburg: {
    de: {
      heading: "Küchen nach Maß für Augsburg",
      lede: "Küchen nach Maß für Augsburg. Ob der Weg passt, klären wir im Gespräch.",
      paragraphs: [
        "Augsburg gehört zu den Regionen, in denen wir Küchen planen und einbauen. Der Weg in die Ausstellung nach Wolfersdorf ist länger als aus München. Ob er für Ihr Projekt passt, klären wir im ersten Gespräch.",
        "## Online beginnen",
        "Das erste Gespräch kann online über Microsoft Teams stattfinden. Sie zeigen uns Grundriss und Fotos, wir sprechen über Ablauf und Rahmen. Die Muster sehen Sie danach in der Ausstellung.",
        "## Aufmaß und Montage",
        "Zum Aufmaß kommen wir zu Ihnen nach Augsburg. Gefertigt wird in unserer Werkstatt, montiert von eigenen Monteuren. So arbeiten wir auch in München, Dachau und Ingolstadt.",
      ],
      description:
        "Küchen nach Maß für Augsburg: erstes Gespräch auch online, Muster in der Ausstellung in Wolfersdorf, Aufmaß und Montage bei Ihnen durch eigene Monteure.",
    },
    en: {
      heading: "Made-to-measure kitchens for Augsburg",
      lede: "Made-to-measure kitchens for Augsburg. Whether the distance works is settled in the first talk.",
      paragraphs: [
        "Augsburg is one of the regions where we plan and fit kitchens. The trip to the showroom in Wolfersdorf is longer than from Munich. Whether it suits your project is something we settle in the first talk.",
        "## Starting online",
        "The first talk can take place online on Microsoft Teams. You show us floor plan and photos, and we talk about process and budget. You see the samples in the showroom afterwards.",
        "## Measuring and fitting",
        "We come to you in Augsburg to measure. The kitchen is made in our workshop and fitted by our own team. We work the same way in Munich, Dachau and Ingolstadt.",
      ],
      description:
        "Made-to-measure kitchens for Augsburg: first talk also online, samples in the showroom in Wolfersdorf, measuring and fitting at your home by our own team.",
    },
  },
  ingolstadt: {
    de: {
      heading: "Lieferung und Montage in Ingolstadt",
      lede: "Nördlich, im Liefergebiet um München.",
      paragraphs: [
        "Ingolstadt gehört zu den Regionen, in denen wir Küchen planen, liefern und montieren. Beraten wird in der Ausstellung in Wolfersdorf bei Freising.",
        "## Eigene Monteure",
        "Unsere Küchen bauen eigene Monteure ein. Die Montage dauert etwa zwei Tage. Auf Wunsch nehmen wir die alte Küche vorher heraus.",
        "## Arbeitsplatten",
        "Korpus und Fronten fertigen wir selbst. Arbeitsplatten aus Stein, Glas oder Metall kommen von Handwerksbetrieben, mit denen wir zusammenarbeiten. Alles wird nach dem Aufmaß bei Ihnen gefertigt. Kunden aus Pfaffenhofen und Mainburg kommen ebenfalls zu uns.",
      ],
      description:
        "Küchen nach Maß für Ingolstadt: Beratung in Wolfersdorf bei Freising, Fertigung in der eigenen Werkstatt, Montage durch eigene Monteure in etwa zwei Tagen.",
    },
    en: {
      heading: "Delivery and fitting in Ingolstadt",
      lede: "To the north, within our delivery area around Munich.",
      paragraphs: [
        "Ingolstadt is one of the regions where we plan, deliver and fit kitchens. Advice takes place in the showroom in Wolfersdorf near Freising.",
        "## Our own fitters",
        "Our kitchens are installed by our own fitters. Fitting takes about two days. On request we take out the old kitchen first.",
        "## Worktops",
        "We make carcass and fronts ourselves. Worktops in stone, glass or metal come from craft firms we work with. Everything is made after we have measured at your home. Clients from Pfaffenhofen and Mainburg come to us as well.",
      ],
      description:
        "Made-to-measure kitchens for Ingolstadt: advice in Wolfersdorf near Freising, made in our own workshop, fitted by our own team in about two days.",
    },
  },
  landshut: {
    de: {
      heading: "Küchen nach Maß für Landshut",
      lede: "Ostbayerisches Einzugsgebiet, Montage vor Ort.",
      paragraphs: [
        "Landshut gehört zu unserem Einzugsgebiet nördlich und östlich von München. Die Anfahrt aus Landshut in die Ausstellung nach Wolfersdorf ist für viele Kunden üblich.",
        "## Raumhohe Schränke",
        "Eine unserer Stärken sind raumhohe Schränke, die bis unter die Decke reichen. Möglich ist das, weil wir jeden Schrank für den Raum fertigen, in dem er steht.",
        "## Montage vor Ort",
        "Aufmaß und Montage machen wir bei Ihnen in Landshut. Vom Auftrag bis zur Lieferung vergehen 10 bis 18 Wochen. Wir sind auch in Erding, Mainburg und Regensburg unterwegs.",
      ],
      description:
        "Küchen nach Maß für Landshut: Beratung in der Ausstellung in Wolfersdorf, raumhohe Schränke aus der eigenen Werkstatt, Aufmaß und Montage bei Ihnen vor Ort.",
    },
    en: {
      heading: "Made-to-measure kitchens for Landshut",
      lede: "Our catchment area in eastern Bavaria, fitted on site.",
      paragraphs: [
        "Landshut is part of our catchment area north and east of Munich. The trip from Landshut to the showroom in Wolfersdorf is a usual one for many clients.",
        "## Full-height units",
        "One of our strengths is full-height units that reach up to the ceiling. This is possible because we make each unit for the room it stands in.",
        "## Fitting on site",
        "We measure and fit at your home in Landshut. From order to delivery it takes 10 to 18 weeks. We also work in Erding, Mainburg and Regensburg.",
      ],
      description:
        "Made-to-measure kitchens for Landshut: advice in the showroom in Wolfersdorf, full-height units from our own workshop, measuring and fitting at your home.",
    },
  },
  mainburg: {
    de: {
      heading: "Küchen nach Maß für Mainburg",
      lede: "Zwischen München und Niederbayern.",
      paragraphs: [
        "Mainburg liegt zwischen München und Niederbayern und damit in unserem Liefergebiet. Wir planen Küchen nach Maß und fertigen sie in der eigenen Werkstatt in Wolfersdorf.",
        "## Aus der eigenen Werkstatt",
        "Korpus, Front und Oberfläche entstehen bei uns im Haus, mit CNC-Technik und eigener Lackiererei. Sondermaße gehören dazu, und die Farbauswahl ist sehr groß.",
        "## So läuft es ab",
        "Erstes Gespräch in der Ausstellung, Plan und Angebot beim zweiten Termin, dann Aufmaß bei Ihnen, Fertigung und Montage. Denselben Ablauf haben unsere Kunden in Pfaffenhofen, Landshut und Ingolstadt.",
      ],
      description:
        "Küchen nach Maß für Mainburg: geplant und gefertigt in der eigenen Werkstatt in Wolfersdorf, mit eigener Lackiererei. Aufmaß und Montage bei Ihnen.",
    },
    en: {
      heading: "Made-to-measure kitchens for Mainburg",
      lede: "Between Munich and Lower Bavaria.",
      paragraphs: [
        "Mainburg lies between Munich and Lower Bavaria and so within our delivery area. We plan made-to-measure kitchens and make them in our own workshop in Wolfersdorf.",
        "## From our own workshop",
        "Carcass, front and surface are made in-house, with CNC machinery and our own paint shop. Special sizes are part of that, and the choice of colours is very wide.",
        "## How it works",
        "First talk in the showroom, plan and offer at the second appointment, then measuring at your home, production and fitting. Our clients in Pfaffenhofen, Landshut and Ingolstadt follow the same steps.",
      ],
      description:
        "Made-to-measure kitchens for Mainburg: planned and made in our own workshop in Wolfersdorf, with our own paint shop. Measuring and fitting at your home.",
    },
  },
  regensburg: {
    de: {
      heading: "Küchen nach Maß für Regensburg",
      lede: "Küchen nach Maß für Regensburg. Das erste Gespräch klärt den Weg.",
      paragraphs: [
        "Regensburg gehört zu den Regionen, in denen wir Küchen planen und einbauen. Der Weg ist weiter als aus dem Münchner Umland. Im ersten Gespräch klären wir, wie Beratung, Aufmaß und Montage für Ihr Projekt ablaufen.",
        "## Beratung mit wenigen Wegen",
        "Das erste Gespräch kann online stattfinden. Für die Materialauswahl lohnt sich ein Besuch in der Ausstellung in Wolfersdorf, weil Sie dort Originalmuster nebeneinander sehen.",
        "## Neubau",
        "Wenn Sie neu bauen, kommen Sie am besten früh. Dann lassen sich Anschlüsse und Küche noch aufeinander abstimmen. Aufmaß und Montage machen wir bei Ihnen vor Ort, wie in Landshut und Ingolstadt.",
      ],
      description:
        "Küchen nach Maß für Regensburg: erstes Gespräch auch online, Materialauswahl in der Ausstellung in Wolfersdorf, Aufmaß und Montage bei Ihnen vor Ort.",
    },
    en: {
      heading: "Made-to-measure kitchens for Regensburg",
      lede: "Made-to-measure kitchens for Regensburg. The first talk settles how we get there.",
      paragraphs: [
        "Regensburg is one of the regions where we plan and fit kitchens. It is further away than the area around Munich. In the first talk we settle how advice, measuring and fitting will run for your project.",
        "## Advice with few trips",
        "The first talk can take place online. For choosing materials, a visit to the showroom in Wolfersdorf is worth it, because you see original samples side by side there.",
        "## New builds",
        "If you are building, it is best to come early. Connections and kitchen can then still be matched to each other. We measure and fit at your home, as we do in Landshut and Ingolstadt.",
      ],
      description:
        "Made-to-measure kitchens for Regensburg: first talk also online, materials chosen in the showroom in Wolfersdorf, measuring and fitting at your home.",
    },
  },
  nuernberg: {
    de: {
      heading: "Küchen für Nürnberg: ein weiterer Weg",
      lede: "Weiter Weg, dennoch eine Anfrage wert. Wir sagen ehrlich, ob er passt.",
      paragraphs: [
        "Wir planen und montieren Küchen im Umkreis von etwa 200 Kilometern um München. Nürnberg liegt am Rand dieses Gebiets. Ob der Weg für Ihr Projekt sinnvoll ist, sagen wir Ihnen ehrlich im ersten Gespräch.",
        "## Erst sprechen, dann fahren",
        "Das erste Gespräch führen wir gern online über Microsoft Teams. Sie zeigen uns Grundriss und Fotos, wir sprechen über Ablauf, Zeitrahmen und Budget. Danach entscheiden Sie, ob sich der Weg in die Ausstellung lohnt.",
        "## Was eine Küche kostet",
        "Unsere Küchen liegen im Durchschnitt zwischen 30.000 und 40.000 Euro. Der Preis hängt von Größe, Front, Arbeitsplatte und Geräten ab. Näher an Wolfersdorf liegen Ingolstadt und Regensburg, wo wir ebenfalls arbeiten.",
      ],
      description:
        "Küchen nach Maß für Nürnberg: erstes Gespräch online, ehrliche Antwort, ob der Weg passt. Geplant und gefertigt in Wolfersdorf bei Freising.",
    },
    en: {
      heading: "Kitchens for Nuremberg: a longer way",
      lede: "A long way, but worth asking. We tell you honestly whether it works.",
      paragraphs: [
        "We plan and fit kitchens within about 200 kilometres of Munich. Nuremberg lies at the edge of that area. Whether the distance makes sense for your project is something we tell you honestly in the first talk.",
        "## Talk first, travel later",
        "We are glad to hold the first talk online on Microsoft Teams. You show us floor plan and photos, and we talk about process, timing and budget. You then decide whether the trip to the showroom is worth it.",
        "## What a kitchen costs",
        "Our kitchens average between 30,000 and 40,000 euros. The price depends on size, front, worktop and appliances. Ingolstadt and Regensburg are closer to Wolfersdorf, and we work there too.",
      ],
      description:
        "Made-to-measure kitchens for Nuremberg: first talk online, an honest answer on whether the distance works. Planned and made in Wolfersdorf near Freising.",
    },
  },
};

/** The text on the Regionen overview. It names all eleven places once. */
export const REGION_HUB: { de: PageCopy; en: PageCopy } = {
  de: {
    heading: "Wo wir Küchen planen und einbauen",
    paragraphs: [
      "Unser Schwerpunkt ist der Großraum München. Wir planen und montieren Küchen im Umkreis von etwa 200 Kilometern um die Stadt, mit eigenen Monteuren.",
      "## Nördlich und östlich von München",
      "Die Ausstellung liegt in Wolfersdorf bei Freising. Zu unserem Einzugsgebiet gehören Erding, Dachau, Pfaffenhofen und Mainburg.",
      "## Weiter entfernt",
      "Auch in Landshut, Ingolstadt, Augsburg und Regensburg bauen wir Küchen ein. Bei längeren Wegen wie nach Nürnberg klären wir im ersten Gespräch, ob das Projekt passt. Dieses Gespräch kann online stattfinden.",
      "## Der Ablauf ist überall gleich",
      "Erstes Gespräch in der Ausstellung oder online, Plan und Angebot beim zweiten Termin, Aufmaß bei Ihnen, Fertigung in der eigenen Werkstatt, Montage vor Ort.",
    ],
    description:
      "BEER plant und montiert Küchen im Großraum München und im Umkreis von etwa 200 Kilometern: Freising, Erding, Dachau, Landshut, Ingolstadt, Augsburg, Regensburg.",
  },
  en: {
    heading: "Where we plan and fit kitchens",
    paragraphs: [
      "Greater Munich is where we work most. We plan and fit kitchens within about 200 kilometres of the city, with our own fitters.",
      "## North and east of Munich",
      "The showroom is in Wolfersdorf near Freising. Our catchment area includes Erding, Dachau, Pfaffenhofen and Mainburg.",
      "## Further away",
      "We also fit kitchens in Landshut, Ingolstadt, Augsburg and Regensburg. For longer distances such as Nuremberg, we settle in the first talk whether the project fits. That talk can take place online.",
      "## The process is the same everywhere",
      "First talk in the showroom or online, plan and offer at the second appointment, measuring at your home, production in our own workshop, fitting on site.",
    ],
    description:
      "BEER plans and fits kitchens in Greater Munich and within about 200 kilometres: Freising, Erding, Dachau, Landshut, Ingolstadt, Augsburg, Regensburg.",
  },
};
