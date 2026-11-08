/**
 * n8n Code node "Anfrage bauen" (workflow "BEER Mediathek").
 * Pairs each downloaded photo with its "Auswahl" item and builds one AI request per photo.
 * Unlike "BEER Projekttexte" there are no project facts: the photo alone decides, so materials
 * and brands are only named when they are unmistakable. A photo that could not be downloaded
 * is stored as an error and tried again on a later run.
 */

const SYSTEM = `Du schreibst den Alternativtext (alt) für genau ein Foto aus der Mediathek der BEER Küchenmanufaktur, einer Schreinerei in Bayern. Die Fotos zeigen meist Küchen und Möbel nach Maß, manchmal auch Werkstatt, Ausstellung, Veranstaltungen, Menschen, Geräte, Muster oder Grafiken. Google-Bildersuche, KI-Suche, die Suche in der Mediathek und Screenreader lesen diesen Text. Wer nur den Text liest, muss wissen, was auf diesem einen Foto zu sehen ist.

Geh in dieser Reihenfolge vor:
1. Schau dir das Foto an und lege "bildart" fest:
   - "gesamt": ein ganzer Raum oder der größte Teil davon
   - "teil": ein Möbel oder Bereich, zum Beispiel eine Insel, eine Zeile oder eine Schrankwand
   - "detail": eine Nahaufnahme, zum Beispiel Griff, Armatur, Schublade, Kochfeld, Oberfläche
   - "anderes": kein Möbel und kein Innenraum im Mittelpunkt, zum Beispiel Hausansicht, Werkstatt, Menschen, Plan, Grafik, Logo
2. Schreib unter "sichtbar" 3 bis 6 Dinge auf, die du auf dem Foto wirklich siehst.
3. Schreib "alt" nur aus dem, was unter "sichtbar" steht.
4. Kannst du das Hauptmotiv nicht sicher erkennen, weil das Foto zu dunkel oder unscharf ist, nenne den Grund unter "unsicher". Sonst bleibt "unsicher" leer. Rate nie.

Regeln für "alt":
- Hauptmotiv zuerst, mit dem Wort, das jemand bei Google suchen würde: Kücheninsel, Küchenzeile, Hochschrankwand, Arbeitsplatte, Spüle, Armatur, Kochfeld, Griffleiste, Schublade, Waschtisch, Einbauschrank, Werkstatt, Ausstellung. Danach zwei bis drei sichtbare Merkmale: Farbe, Oberfläche, Material, Griffe, Geräte, Boden.
- Nahaufnahme: Nenne nur dieses Detail und was direkt daneben liegt. Beschreibe nicht die ganze Küche.
- Raum: Schreib „Küche“ nur, wenn das Foto eine Küche zeigt. Bad, Ankleide, Garderobe, Arbeitszimmer und Wohnzimmer heißen so.
- Nur scharf und eindeutig Sichtbares zählt. Unscharfer Hintergrund und Spiegelungen zählen nicht.
- Farbe: Ordne sie dem richtigen Bauteil zu. Ein schwarzes Gerät in einer weißen Schrankwand macht die Wand nicht schwarz.
- Material: Nenne es nur, wenn es eindeutig ist. Sonst beschreibe Farbe und Oberfläche: „helle Arbeitsplatte“, nicht „Granit“. Holz bleibt „Holz“, außer die Holzart ist unverkennbar.
- Marken: Nenne sie nur, wenn sie auf dem Foto lesbar sind. Marken nie übersetzen.
- Text auf dem Foto, zum Beispiel ein Plakat oder eine Einladung: Gib den Inhalt kurz wieder.
- Menschen: Beschreib sie knapp nach Tätigkeit und Kleidung, zum Beispiel „Schreiner an einer Hobelmaschine“. Nie Namen, nie Aussehen bewerten.
- Anzahl: Schreib keine Zahl außer „zwei“, und „zwei“ nur, wenn es sicher genau zwei sind. Bei mehr schreib „mehrere“ oder lass die Anzahl weg. Daten und Uhrzeiten auf einem Plakat sind erlaubt.
- Form: ein natürlicher deutscher Ausdruck oder Satz mit 60 bis 125 Zeichen, korrekte Groß- und Kleinschreibung, ohne Punkt am Ende. Keine Liste von Suchwörtern, kein Wort doppelt. Prüfe Fälle und Adjektivendungen.
- Nicht verwenden: „Bild“, „Foto“, „Ansicht“ am Anfang; Werbung und Wertungen wie schön, traumhaft, modern, edel, hochwertig, luxuriös, perfekt, exklusiv, stilvoll; „kaufen“, „nach Maß“, „Küchenstudio“; den Namen BEER; Orte; Namen von Personen.

Gute Beispiele, nur für die Form, nicht abschreiben:
- Küchenzeile mit salbeigrünen Fronten und heller Arbeitsplatte vor einem Fenster zum Garten
- Griffmulde in einer olivgrünen Schublade mit Besteckeinsatz aus Holz
- Schreiner an einer CNC-Maschine, die eine geschwungene Holzplatte fräst
- Waschtisch mit Holzfront und zwei Aufsatzbecken vor einem großen Spiegel im Bad

Schlechte Beispiele:
- „küchen schwarz grifflose küchen“: Suchwörter statt Beschreibung
- „Moderne Traumküche nach Maß von BEER in München“: Werbung und Ort, sagt nichts über das Foto`;

const SCHEMA = {
  type: "object",
  properties: {
    bildart: { type: "string", enum: ["gesamt", "teil", "detail", "anderes"] },
    sichtbar: { type: "array", items: { type: "string" } },
    alt: { type: "string" },
    unsicher: { type: "string" },
  },
  required: ["bildart", "sichtbar", "alt", "unsicher"],
  additionalProperties: false,
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 4.5 * 1024 * 1024;

const store = $getWorkflowStaticData("global");
store.media ??= {};
const jobs = $("Auswahl").all().map((item) => item.json);
const items = [];

for (const [i, item] of $input.all().entries()) {
  const job = jobs[i];
  const file = item.binary?.foto;
  const type = String(file?.mimeType ?? "").split(";")[0].toLowerCase().replace("image/jpg", "image/jpeg");
  let problem = !file ? "nicht geladen" : IMAGE_TYPES.includes(type) ? "" : `Dateityp ${type || "unbekannt"}`;
  let data = "";
  if (!problem) {
    const buffer = await this.helpers.getBinaryDataBuffer(i, "foto");
    if (buffer.length > MAX_BYTES) problem = "Datei zu groß";
    else data = buffer.toString("base64");
  }
  if (problem) {
    const known = store.media[job.photo.id];
    store.media[job.photo.id] = { s: "fehler", c: (known?.c ?? 0) + 1, e: problem, o: job.photo.old, at: new Date().toISOString() };
    continue;
  }
  items.push({
    json: {
      ...job,
      request: claudeRequest({
        system: SYSTEM,
        schema: SCHEMA,
        // A wrong description is worse than a slower one. The reasoning counts towards maxTokens.
        effort: "high",
        maxTokens: 16000,
        user: [
          { type: "image", source: { type: "base64", media_type: type, data } },
          { type: "text", text: "Schreib den Alternativtext für dieses eine Foto." },
        ],
      }),
    },
  });
}
return items;
