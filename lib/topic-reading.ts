import type { Locale } from "@/lib/i18n";
import { stileReading, type StileReadingCopy } from "@/lib/stile-reading";

export type TopicReadingCopy = StileReadingCopy;

const DE: Record<string, TopicReadingCopy> = {
  zeile: {
    title: "Küchenzeilen aus Wolfersdorf",
    description:
      "Küchenzeilen nach Maß aus der Manufaktur in Wolfersdorf bei Freising. Für schmale Räume in München und im Umland, Aufmaß vor dem Angebot.",
    heading: "Küchenzeilen, wenn der Raum schmal ist.",
    paragraphs: [
      "Eine Zeile ist oft die ehrlichere Küche. Sie braucht weniger Laufwege als eine gedrängte U-Form und nutzt die Wand, die wirklich da ist. In Wohnungen in München, in Reihenhäusern in Freising und in schmalen Neubauten entscheidet die Länge der Wand, nicht der Wunsch nach einer Insel.",
      "Wir zeichnen Geräte, Spüle und Stauraum in einer Flucht. Die Höhe nimmt mit, was der Standardschrank liegen lässt: über dem Kühlschrank, neben dem Fenster, in der Nische. Das Aufmaß kommt vor dem Angebot, in Wolfersdorf besprechen wir die Front erst, wenn die Zeile steht.",
      "Gefertigt wird in der Werkstatt in Wolfersdorf bei Freising. Montiert wird von uns, in München, Erding, Dachau und Pfaffenhofen, solange der Weg zur Manufaktur ehrlich bleibt. Etwa zweihundert Kilometer um München.",
    ],
  },
  "l-form": {
    title: "Küchen in L-Form um München",
    description:
      "L-förmige Küchen nach Maß aus Wolfersdorf bei Freising. Zwei Schenkel, offene Wege. Aufmaß in München, Freising und im Umland.",
    heading: "L-Form, wenn zwei Wände den Raum tragen.",
    paragraphs: [
      "Die L-Form nutzt zwei Wände und lässt den Raum offen. In Wohnküchen um München ist sie oft ruhiger als eine U-Form, die den Tisch verdrängt. Die Ecke ist die Aufgabe: ein Auszug, den man erreicht, keine tote Drehfläche.",
      "Wege, Licht und die Höhe der Platte stehen vor der Front. Wir mustern das in Wolfersdorf und messen im Haus, ob die zweite Wand ein Fenster hat, eine Tür oder eine Schräge. Der Neubau in Erding und der Altbau in Freising brauchen dieselbe Ehrlichkeit.",
      "Die Fertigung bleibt in einer Werkstatt. Montage durch uns, von München bis Augsburg, wenn der Radius trägt. Eine Insel kommt nur dazu, wenn um die L-Form noch Wege frei sind.",
    ],
  },
  "u-form": {
    title: "Küchen in U-Form nach Maß",
    description:
      "U-förmige Küchen aus der Manufaktur in Wolfersdorf bei Freising. Drei Seiten, echte Laufwege. Aufmaß in München und Umgebung.",
    heading: "U-Form, nur wenn der Raum die Breite hat.",
    paragraphs: [
      "Drei Seiten geben Stauraum und eine geschlossene Arbeitsfläche. Sie brauchen Breite. Eine U-Form in einem schmalen Raum in München wird ein Engpass, keine Küche. Wir zeichnen sie, wenn zwei Personen aneinander vorbeikommen und die Türen offen stehen dürfen.",
      "Die beiden Ecken entscheiden über den Alltag. Was man nicht erreicht, ist toter Stauraum. Deshalb liegt das Aufmaß vor der Front, im Haus in Freising, Dachau oder Erding, nicht auf einem Idealgrundriss.",
      "Gebaut wird in Wolfersdorf bei Freising. Die Ausstellung zeigt Kanten und Auszüge unter Tageslicht. Montiert wird von uns, im Umkreis von etwa zweihundert Kilometern um München.",
    ],
  },
  offen: {
    title: "Offene Küchen im Raum München",
    description:
      "Offene Küchen als Möbel im Wohnraum. Geplant in Wolfersdorf bei Freising, Aufmaß in München und im Umland. Dunst, Blick und Stauraum zusammen.",
    heading: "Offene Küchen, wenn der Wohnraum mitkocht.",
    paragraphs: [
      "Eine offene Küche ist ein Möbel im Wohnraum, keine zweite Bühne. Blickachsen, Dunst und der Lärm des Geschirrspülers gehören in dieselbe Zeichnung. In Münchner Wohnungen und in Häusern um Freising entscheidet, was man vom Tisch aus sehen will und was die Wand verbergen soll.",
      "Der Abzug sitzt dort, wo der Blick frei bleiben darf, oft in der Platte, manchmal als Esse, wenn der Raum sie trägt. Wir sagen das im Aufmaß, nicht nach der Montage. Die Front bleibt ruhig, damit die Küche zum Boden und zum Licht des Hauses passt.",
      "Das Gespräch beginnt meist in der Ausstellung in Wolfersdorf. Gemessen wird im Haus, in München, Dachau, Erding und Pfaffenhofen. Gefertigt und montiert wird in einer Hand.",
    ],
  },
  insel: {
    title: "Küchen mit Insel aus Wolfersdorf",
    description:
      "Küchen mit Insel nur mit Wegen darum. Manufaktur in Wolfersdorf bei Freising, Aufmaß in München und im Umland. Technik unter der Platte mitgedacht.",
    heading: "Küchen mit Insel, wenn der Raum Wege lässt.",
    paragraphs: [
      "Eine Insel ist Arbeitsfläche und manchmal Treffpunkt. Sie ist kein Möbel, das man in die Mitte stellt, weil ein Bild so aussah. In Häusern um München zeichnen wir sie nur, wenn rundherum Wege bleiben und Türen aufgehen können.",
      "Herd, Abzug, Wasser und Strom liegen unter der Platte, bevor die Front feststeht. Fehlt ein Anschluss, bleibt die Insel ungezeichnet. Manche Zeile mit Höhe ist die ehrlichere Mitte des Hauses, in einem Neubau in Erding ebenso wie in einer Wohnung in München.",
      "Gemustert wird der Stein in Wolfersdorf bei Freising. Aufgemessen wird vor Ort. Die Montage machen wir selbst, etwa zweihundert Kilometer um München.",
    ],
  },
  klein: {
    title: "Kleine Küchen nach Maß",
    description:
      "Kleine Küchen nach Maß aus Wolfersdorf bei Freising. Nischen, Höhe, Zentimeter. Für Wohnungen in München und Häuser im Umland.",
    heading: "Kleine Küchen, wo das Raster endet.",
    paragraphs: [
      "Vier Meter, eine Nische, ein Fenster. In kleinen Wohnungen in München verliert eine Standardzeile die Ecken. Die Höhe ist der Stauraum, den die Tiefe nicht hergibt. Jeder Auszug ist eine Entscheidung, kein Füllstück.",
      "Wir messen, bevor wir anbieten. Die Fensterbrüstung, die schiefe Wand, der Anschluss, der nicht dort sitzt, wo der Katalog ihn will. Das gilt in Freising wie in Dachau und in der Innenstadt.",
      "Gebaut wird in der Werkstatt in Wolfersdorf. Dieselbe Manufaktur, die eine große Wohnküche fertigt, fertigt die kleine Zeile. Montage durch uns, im Radius um München.",
    ],
  },
  weiss: {
    title: "Weiße Küchen aus Wolfersdorf",
    description:
      "Weiße Küchen, matt und unter Tageslicht gemustert. Manufaktur in Wolfersdorf bei Freising. Aufmaß in München und im Umland.",
    heading: "Weiße Küchen, nie nur weiß.",
    paragraphs: [
      "Weiß ist Alltag, nicht Unschuld. Der Unterton entscheidet gegen Stein, Wand und das Licht aus dem Haus. Am Bildschirm kauft man Weiß zweimal. In Wolfersdorf legen wir das Muster neben die Platte und neben ein Stück der Wand.",
      "Matt, seidenmatt oder eine leichte Struktur. Der Finger und das Tageslicht zeigen den Unterschied. Eine weiße Zeile in einer Münchner Wohnung und eine weiße Küche in einem hellen Haus in Freising sind nicht dasselbe Weiß.",
      "Aufmaß im Haus, Fertigung in Wolfersdorf bei Freising, Montage durch uns. München, Erding, Dachau, Pfaffenhofen und Augsburg, solange der Weg zur Werkstatt trägt.",
    ],
  },
  schwarz: {
    title: "Schwarze Küchen im Raum München",
    description:
      "Schwarze Küchen mit Gegengewicht aus Holz oder Stein. Geplant in Wolfersdorf bei Freising, Aufmaß in München und Umgebung.",
    heading: "Schwarze Küchen, mit Licht und einem Gegengewicht.",
    paragraphs: [
      "Schwarz braucht Licht von zwei Seiten und ein Gegengewicht, sonst wird die Küche schwer. Holz, ein heller Stein oder eine ruhige Fuge halten die Fläche. In Häusern in München ist das oft der Unterschied zwischen einer dunklen Küche, die trägt, und einer, die nur auf dem Foto funktioniert.",
      "Wir mustern den Ton in Wolfersdorf, unter Tageslicht, neben dem Boden, der wirklich im Haus liegt. Griff oder Mulde entscheidet sich an der Gewichtsklasse der Auszüge, nicht an der Silhouette.",
      "Gefertigt in der Manufaktur bei Freising. Aufgemessen in München, Freising, Erding und im weiteren Umland, etwa zweihundert Kilometer, Montage durch uns.",
    ],
  },
  salbei: {
    title: "Salbeigrüne Küchen nach Maß",
    description:
      "Salbeigrüne Küchen auf Lack, nicht auf Folie. Gemustert in Wolfersdorf bei Freising. Für Altbauten und Häuser um München.",
    heading: "Salbei, zwischen Landhaus und Moderne.",
    paragraphs: [
      "Nicht jedes Grün ist Salbei. Der Ton liegt zwischen Landhaus und Moderne und kippt mit Putz, Boden und Licht. Wir mustern ihn an der Wand, in der Ausstellung in Wolfersdorf, bevor die Front feststeht. Lack trägt die Farbe. Folie macht sie billig.",
      "Der Stein daneben hält den Ton ruhig. In Altbauten in Freising mit hohen Fenstern ist das eine andere Aufgabe als in einem Neubau in Erding. Das Aufmaß nimmt die schiefe Wand und die alten Anschlüsse mit.",
      "Gebaut wird in Wolfersdorf. Montiert in München, Freising, Dachau und Pfaffenhofen, von uns, im ehrlichen Radius um München.",
    ],
  },
  grau: {
    title: "Graue Küchen aus der Manufaktur",
    description:
      "Graue Küchen, warm oder kühl je nach Stein. Manufaktur in Wolfersdorf bei Freising. Aufmaß in München, Erding und im Umland.",
    heading: "Graue Küchen, als Ruhe und nicht als Kompromiss.",
    paragraphs: [
      "Grau ist eine Entscheidung, kein Mittelweg. Warm oder kühl entscheidet der Stein daneben und das Licht aus dem Haus. Eine graue Zeile gegen eine weiße Wand, wie in manchem Neubau in Erding, bleibt ruhig, wenn die Fuge stimmt.",
      "Wir legen das Muster in Wolfersdorf neben Holz und Stein. Der Bildschirm verschiebt Grau. Deshalb der Termin unter Tageslicht, bevor bestellt wird.",
      "Aufmaß in München, Freising, Dachau und Erding. Fertigung in der Werkstatt bei Freising. Montage durch uns, etwa zweihundert Kilometer um München.",
    ],
  },
  kochinsel: {
    title: "Kochinseln nach Maß",
    description:
      "Kochinseln mit Herd und Abzug in der Platte. Geplant in Wolfersdorf bei Freising. Aufmaß in München und im Umland, nur mit Wegen rundherum.",
    heading: "Kochinseln, wenn Technik und Wege stimmen.",
    paragraphs: [
      "Eine Kochinsel trägt Herd und oft den Abzug in der Mitte des Raums. Sie braucht Wege rundherum und die Technik unter der Platte: Kabel, Kanal, Wasser, wenn die Spüle mit auf der Insel sitzt. In offenen Wohnküchen in München ist das die Zeichnung, nicht ein Möbelstück aus dem Katalog.",
      "Fehlt der Weg oder der Anschluss, bleibt die Insel ungezeichnet. Wir sagen das im Aufmaß, im Haus in Freising oder Erding, bevor Stein bestellt wird. Der Abzug in der Platte ändert den Unterschrank. Das planen wir mit, nicht nachträglich.",
      "Gemustert wird in Wolfersdorf bei Freising. Gefertigt dort, montiert von uns im Radius um München.",
    ],
  },
  arbeitsinsel: {
    title: "Arbeitsinseln aus Wolfersdorf",
    description:
      "Arbeitsinseln ohne Kochfeld, als Fläche zum Vorbereiten. Manufaktur in Wolfersdorf bei Freising. Für Häuser in München und im Umland.",
    heading: "Arbeitsinseln, als Fläche und nicht als Bühne.",
    paragraphs: [
      "Eine Arbeitsinsel ist reine Fläche. Kein Kochfeld, dafür Stauraum und manchmal eine Sitzkante. Sie lohnt sich, wenn der Herd an der Wand besser sitzt und die Mitte des Raums zum Vorbereiten frei bleiben soll. In vielen Häusern um München ist das die ruhigere Lösung.",
      "Beinfreiheit, Steckdosen und die Tiefe der Auszüge zeichnen wir mit der Platte. Die Insel darf den Weg zur Spüle nicht verstellen. Das misst man im Haus, nicht am Foto.",
      "Die Ausstellung in Wolfersdorf zeigt die Kante unter Tageslicht. Aufmaß in München, Freising, Dachau und Erding. Fertigung und Montage in einer Hand.",
    ],
  },
  essinsel: {
    title: "Inseln mit Sitzplatz",
    description:
      "Kücheninseln mit Sitzplatz: Überstand, Beinfreiheit, Anschlüsse. Aus der Manufaktur in Wolfersdorf bei Freising, für Häuser um München.",
    heading: "Inseln mit Sitzplatz, an einer Kante.",
    paragraphs: [
      "Kochen und sitzen an einer Kante braucht Überstand und Beinfreiheit, nicht nur eine Platte, die lang aussieht. Steckdosen, die Knie und der Abstand zur Arbeitszone gehören in die Zeichnung. In Wohnküchen in München ist der Sitzplatz oft der Grund für die Insel, nicht der Herd.",
      "Wir prüfen, ob der Raum die Tiefe hergibt. Ein Sitzplatz, der die Schranktür blockiert, ist keiner. Das sieht man beim Aufmaß in Freising, Erding oder Dachau, mit der Tür in der Hand.",
      "Gebaut in Wolfersdorf bei Freising. Stein und Kante werden dort gemustert. Montage durch uns, im Umkreis von etwa zweihundert Kilometern um München.",
    ],
  },
  grifflos: {
    title: "Grifflose Küchen nach Maß",
    description:
      "Grifflose Küchen mit Mulde oder Tipp-on, je nach Auszug. Manufaktur in Wolfersdorf bei Freising. Aufmaß in München und im Umland.",
    heading: "Grifflose Küchen, an der Öffnung entschieden.",
    paragraphs: [
      "Eine grifflose Front ist ruhig, solange die Öffnung ehrlich ist. Schwere Auszüge wollen oft eine Mulde. Tipp-on trägt, wo das Gewicht es erlaubt. Ein Griff, der später dazukommt, bricht die Fläche. Das fassen wir in Wolfersdorf an, bevor die Front bestellt wird.",
      "Fingerabdrücke zeigen sich auf dunklen und auf glänzenden Flächen schneller. Matt und eine durchdachte Öffnung halten den Alltag. In Wohnungen in München ist das so wahr wie in einem Haus in Pfaffenhofen.",
      "Aufmaß vor Ort, Fertigung in der Werkstatt bei Freising, Montage durch uns. Der Radius bleibt etwa zweihundert Kilometer um München.",
    ],
  },
  "nach-mass": {
    title: "Küchen nach Maß aus Wolfersdorf",
    description:
      "Küchen nach Maß statt Raster. Nischen, Schrägen, Millimeter. Manufaktur in Wolfersdorf bei Freising, Aufmaß in München und im Umland.",
    heading: "Küchen nach Maß, am Raum und nicht am Raster.",
    paragraphs: [
      "Nach Maß heißt: die Nische, die Schräge, die Fensterbrüstung und der Anschluss, der nicht im Raster liegt. Eine Standardzeile verliert dort zwei Ecken. Wir zeichnen die Füllung an der alten Wand, bevor die Front schön wird. Das ist die Arbeit in Altbauten in Freising und in vielen Häusern in München.",
      "Das Aufmaß ist die Grundlage des Angebots, nicht ein Nachtrag. In Wolfersdorf liegen die Muster. Im Haus liegt die Wahrheit. Beides gehört zusammen, sonst wird aus dem Maß ein ungefähr.",
      "Gefertigt in einer Werkstatt, montiert von denselben Leuten. München, Erding, Dachau, Augsburg, Ingolstadt, wenn der Weg zur Manufaktur in Wolfersdorf noch Sinn hat.",
    ],
  },
  raumhoch: {
    title: "Raumhohe Küchen nach Maß",
    description:
      "Raumhohe Küchen ohne Staubkante, mit erreichbaren oberen Fächern. Aus Wolfersdorf bei Freising, für Häuser in München und im Umland.",
    heading: "Raumhohe Küchen, bis zur Decke und noch erreichbar.",
    paragraphs: [
      "Raumhoch nimmt die Decke mit und lässt keine Staubkante. Die oberen Fächer müssen erreichbar bleiben, sonst ist es eine Blende. In Altbauten mit hoher Decke in München und Freising zeichnen wir, was man täglich öffnet und was nur Vorrat ist.",
      "Die Fuge zur Decke, die Schräge, der Balken: das Raster endet dort. Wir messen die echte Höhe, nicht die Kataloghöhe. Die Front kommt nach der Füllung.",
      "Besprochen in der Ausstellung in Wolfersdorf bei Freising. Gebaut in der Werkstatt dort. Montiert von uns im Radius um München, einschließlich Erding, Dachau und Pfaffenhofen.",
    ],
  },
};

const EN: Record<string, TopicReadingCopy> = {
  zeile: {
    title: "Galley kitchens from Wolfersdorf",
    description:
      "Galley kitchens made to measure in Wolfersdorf near Freising. For narrow rooms in Munich and nearby, survey before a price.",
    heading: "Galley kitchens, when the room is narrow.",
    paragraphs: [
      "A single run is often the more honest kitchen. It needs fewer paths than a cramped U and uses the wall that is actually there. In apartments in Munich and terraces in Freising, the length of the wall decides, not the wish for an island.",
      "We draw appliances, sink and storage in one line. Height takes what a standard cabinet leaves out. The survey comes before the offer. In Wolfersdorf we talk about the front only once the run is clear.",
      "Making stays in the workshop at Wolfersdorf near Freising. We fit it ourselves, in Munich, Erding, Dachau and Pfaffenhofen, as long as the road back to the workshop is honest. About two hundred kilometres around Munich.",
    ],
  },
  "l-form": {
    title: "L-shaped kitchens around Munich",
    description:
      "L-shaped kitchens made to measure in Wolfersdorf near Freising. Two runs, open paths. Surveyed in Munich, Freising and nearby.",
    heading: "An L, when two walls carry the room.",
    paragraphs: [
      "The L uses two walls and leaves the room open. In living kitchens around Munich it is often calmer than a U that pushes out the table. The corner is the task: a drawer you can reach, not a dead carousel.",
      "Paths, light and the height of the top come before the front. We sample in Wolfersdorf and measure in the house, whether the second wall has a window, a door or a slope.",
      "Making stays in one workshop. Fitting by us, from Munich to Augsburg, when the radius carries. An island is added only if paths around the L are still free.",
    ],
  },
  "u-form": {
    title: "U-shaped kitchens made to measure",
    description:
      "U-shaped kitchens from the workshop in Wolfersdorf near Freising. Three sides, real paths. Surveyed in Munich and nearby.",
    heading: "A U, only when the room has the width.",
    paragraphs: [
      "Three sides give storage and a closed worktop. They need width. A U in a narrow Munich room becomes a bottleneck, not a kitchen. We draw it when two people can pass and doors can stand open.",
      "The two corners decide the day. What you cannot reach is dead storage. The survey comes before the front, in the house in Freising, Dachau or Erding.",
      "Built in Wolfersdorf near Freising. The showroom holds edges and drawers in daylight. Fitted by us, within about two hundred kilometres of Munich.",
    ],
  },
  offen: {
    title: "Open kitchens around Munich",
    description:
      "Open kitchens as furniture in the living room. Planned in Wolfersdorf near Freising, surveyed in Munich and nearby.",
    heading: "Open kitchens, when the living room cooks too.",
    paragraphs: [
      "An open kitchen is a piece of furniture in the living room, not a second stage. Sightlines, vapour and the noise of a dishwasher belong in the same drawing. In Munich apartments, what you want to see from the table decides.",
      "Extraction sits where the view may stay clear. We say so at the survey, not after fitting. The front stays quiet so the kitchen belongs to the floor and the light of the house.",
      "The conversation often starts in the Wolfersdorf showroom. Measuring happens in the house. Making and fitting stay in one hand.",
    ],
  },
  insel: {
    title: "Kitchens with an island from Wolfersdorf",
    description:
      "Kitchens with an island only when paths remain around it. Made in Wolfersdorf near Freising, surveyed in Munich and nearby.",
    heading: "Kitchens with an island, when the room leaves paths.",
    paragraphs: [
      "An island is a worktop and sometimes a meeting place. It is not a piece of furniture dropped in the middle because a picture looked that way. Around Munich we draw it only when paths remain and doors can open.",
      "Hob, extraction, water and power sit under the top before the front is fixed. If a service is missing, the island stays undrawn. A tall galley is sometimes the more honest centre of the house.",
      "Stone is sampled in Wolfersdorf near Freising. The survey is on site. We fit it ourselves, about two hundred kilometres around Munich.",
    ],
  },
  klein: {
    title: "Small kitchens made to measure",
    description:
      "Small kitchens made to measure in Wolfersdorf near Freising. Niches, height, centimetres. For apartments in Munich and houses nearby.",
    heading: "Small kitchens, where the grid ends.",
    paragraphs: [
      "Four metres, a niche, a window. In small Munich apartments a standard run loses the corners. Height is the storage depth will not give. Every drawer is a decision, not a filler.",
      "We measure before we offer. The window sill, the uneven wall, the service that is not where a catalogue wants it. That is true in Freising, Dachau and the city.",
      "Built in the workshop at Wolfersdorf. The same workshop that makes a large living kitchen makes the small run. Fitted by us, in the radius around Munich.",
    ],
  },
  weiss: {
    title: "White kitchens from Wolfersdorf",
    description:
      "White kitchens, matt, sampled in daylight. Made in Wolfersdorf near Freising. Surveyed in Munich and nearby.",
    heading: "White kitchens, never only white.",
    paragraphs: [
      "White is everyday, not innocence. The undertone decides against stone, wall and the light from the house. On a screen you buy white twice. In Wolfersdorf we lay the sample next to the top and a piece of the wall.",
      "Matt, silk matt or a light texture. Finger and daylight show the difference. A white run in a Munich apartment and a white kitchen in a bright house in Freising are not the same white.",
      "Survey in the house, making in Wolfersdorf near Freising, fitting by us, as long as the road to the workshop carries.",
    ],
  },
  schwarz: {
    title: "Black kitchens around Munich",
    description:
      "Black kitchens with a counterweight of wood or stone. Planned in Wolfersdorf near Freising, surveyed in Munich and nearby.",
    heading: "Black kitchens, with light and a counterweight.",
    paragraphs: [
      "Black needs light from two sides and a counterweight, or the kitchen turns heavy. Wood, a pale stone or a quiet joint hold the face. In houses in Munich that is often the difference between a dark kitchen that carries and one that only works in a photograph.",
      "We sample the tone in Wolfersdorf, in daylight, next to the floor that is really in the house. Handle or finger pull is decided by the weight of the drawers.",
      "Made in the workshop near Freising. Surveyed in Munich, Freising, Erding and further, about two hundred kilometres, fitted by us.",
    ],
  },
  salbei: {
    title: "Sage kitchens made to measure",
    description:
      "Sage kitchens in lacquer, not foil. Sampled in Wolfersdorf near Freising. For older houses and homes around Munich.",
    heading: "Sage, between country and modern.",
    paragraphs: [
      "Not every green is sage. The tone sits between country and modern and shifts with plaster, floor and light. We sample it on the wall, in the Wolfersdorf showroom, before the front is fixed. Lacquer carries the colour. Foil makes it cheap.",
      "The stone beside it keeps the tone quiet. In older houses in Freising with tall windows that is a different task from a new build in Erding. The survey takes the uneven wall and the old services with it.",
      "Built in Wolfersdorf. Fitted in Munich, Freising, Dachau and Pfaffenhofen, by us, in an honest radius around Munich.",
    ],
  },
  grau: {
    title: "Grey kitchens from the workshop",
    description:
      "Grey kitchens, warm or cool depending on the stone. Made in Wolfersdorf near Freising. Surveyed in Munich, Erding and nearby.",
    heading: "Grey kitchens, as calm and not as a compromise.",
    paragraphs: [
      "Grey is a decision, not a middle way. Warm or cool is decided by the stone beside it and the light from the house. A grey run against a white wall stays calm when the joint is right.",
      "We lay the sample in Wolfersdorf next to wood and stone. A screen shifts grey. That is why the appointment is in daylight, before anything is ordered.",
      "Survey in Munich, Freising, Dachau and Erding. Making in the workshop near Freising. Fitting by us, about two hundred kilometres around Munich.",
    ],
  },
  kochinsel: {
    title: "Cooking islands made to measure",
    description:
      "Cooking islands with hob and extraction in the top. Planned in Wolfersdorf near Freising. Surveyed in Munich and nearby, only with paths around them.",
    heading: "Cooking islands, when services and paths agree.",
    paragraphs: [
      "A cooking island carries the hob and often the extraction in the middle of the room. It needs paths around it and the services under the top. In open living kitchens in Munich that is the drawing, not a catalogue piece.",
      "If the path or the service is missing, the island stays undrawn. We say so at the survey, in the house in Freising or Erding, before stone is ordered. Extraction in the top changes the cupboard. We plan that in, not afterwards.",
      "Sampled in Wolfersdorf near Freising. Made there, fitted by us in the radius around Munich.",
    ],
  },
  arbeitsinsel: {
    title: "Work islands from Wolfersdorf",
    description:
      "Work islands without a hob, a surface for preparation. Made in Wolfersdorf near Freising. For houses in Munich and nearby.",
    heading: "Work islands, as a surface and not a stage.",
    paragraphs: [
      "A work island is pure surface. No hob, storage instead, and sometimes a seating edge. It earns its place when the hob is better on the wall and the middle of the room should stay free for preparation.",
      "Knee room, sockets and the depth of the drawers are drawn with the top. The island must not block the way to the sink. You see that in the house, not in a photograph.",
      "The Wolfersdorf showroom holds the edge in daylight. Survey in Munich, Freising, Dachau and Erding. Making and fitting in one hand.",
    ],
  },
  essinsel: {
    title: "Islands with a seat",
    description:
      "Kitchen islands with seating: overhang, knee room, services. From the workshop in Wolfersdorf near Freising, for houses around Munich.",
    heading: "Islands with a seat, along one edge.",
    paragraphs: [
      "Cooking and sitting on one edge needs overhang and knee room, not only a top that looks long. Sockets, knees and the distance to the working zone belong in the drawing. In living kitchens in Munich the seat is often the reason for the island, not the hob.",
      "We check whether the room has the depth. A seat that blocks a cupboard door is not a seat. You see that at the survey, with the door in your hand.",
      "Built in Wolfersdorf near Freising. Stone and edge are sampled there. Fitted by us, within about two hundred kilometres of Munich.",
    ],
  },
  grifflos: {
    title: "Handleless kitchens made to measure",
    description:
      "Handleless kitchens with a finger pull or tip-on, depending on the drawer. Made in Wolfersdorf near Freising. Surveyed in Munich and nearby.",
    heading: "Handleless kitchens, decided at the opening.",
    paragraphs: [
      "A handleless front stays calm as long as the opening is honest. Heavy drawers often want a finger pull. Tip-on carries where the weight allows it. A handle added later breaks the face. We try that in Wolfersdorf before the front is ordered.",
      "Fingerprints show sooner on dark and glossy faces. Matt and a considered opening hold the day. That is as true in a Munich apartment as in a house in Pfaffenhofen.",
      "Survey on site, making in the workshop near Freising, fitting by us. The radius stays about two hundred kilometres around Munich.",
    ],
  },
  "nach-mass": {
    title: "Kitchens made to measure in Wolfersdorf",
    description:
      "Kitchens made to measure, not to a grid. Niches, slopes, millimetres. Workshop in Wolfersdorf near Freising, survey in Munich and nearby.",
    heading: "Kitchens to measure, from the room and not the grid.",
    paragraphs: [
      "Made to measure means the niche, the slope, the window sill and the service that does not sit on the grid. A standard run loses two corners there. We draw the fill against the old wall before the front becomes pretty. That is the work in older houses in Freising and in many houses in Munich.",
      "The survey is the basis of the offer, not an afterthought. The samples are in Wolfersdorf. The truth is in the house. Both belong together.",
      "Made in one workshop, fitted by the same people. Munich, Erding, Dachau, Augsburg, Ingolstadt, when the road to the workshop in Wolfersdorf still makes sense.",
    ],
  },
  raumhoch: {
    title: "Full-height kitchens made to measure",
    description:
      "Full-height kitchens without a dust shelf, with upper cabinets you can still reach. From Wolfersdorf near Freising, for houses in Munich and nearby.",
    heading: "Full-height kitchens, to the ceiling and still in reach.",
    paragraphs: [
      "Full height takes the ceiling with it and leaves no dust shelf. The upper cabinets have to stay reachable, or it is only a panel. In older houses with a tall ceiling in Munich and Freising we draw what you open every day and what is only store.",
      "The joint to the ceiling, the slope, the beam: the grid ends there. We measure the real height, not the catalogue height. The front comes after the fill.",
      "Discussed in the showroom at Wolfersdorf near Freising. Built in the workshop there. Fitted by us in the radius around Munich, including Erding, Dachau and Pfaffenhofen.",
    ],
  },
  outdoor: {
    title: "Outdoor kitchens made to measure",
    description:
      "Outdoor kitchens for terrace and garden: stainless steel, natural stone and oak, with grill and sink. Miele Dreams too. From Wolfersdorf near Freising.",
    heading: "Cooking outside",
    paragraphs: [
      "An outdoor kitchen stays outside all year. Worktop, fronts and appliances have to take rain, sun and frost. That is why we plan them with materials such as stainless steel, natural stone and oak, which may age outdoors without coming to harm.",
      "As with a kitchen in the house, planning starts with the place: where does the grill stand, where does the smoke go, where are water, power and gas? Size and shape follow from that, from a compact grill station on a roof terrace to a long kitchen for parties in the garden.",
      "As a sales partner we also plan Miele Dreams, the modular outdoor system by Miele with the Fire Pro IQ gas grill. The modules for grill, sink, cooling and storage can be combined freely and fitted to terrace and garden.",
    ],
  },
};

export function topicReading(slug: string, locale: Locale): TopicReadingCopy | null {
  return stileReading(slug, locale) ?? (locale === "en" ? EN[slug] : DE[slug]) ?? null;
}
