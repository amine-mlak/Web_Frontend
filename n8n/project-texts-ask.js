/**
 * n8n Code node "Anfrage bauen" (workflow "BEER Projekttexte").
 * Pairs each downloaded photo with its "Fotos" item and builds one AI request per photo.
 * The photo goes in as image data: Kimi does not accept image addresses, and Claude takes both.
 * A photo that could not be downloaded becomes an error on the proposal and is left out.
 */

const SYSTEM = `Du schreibst den Alternativtext (alt) für genau ein Foto auf der Website der BEER Küchenmanufaktur, einer Schreinerei in Bayern. Google-Bildersuche, KI-Suche und Screenreader lesen diesen Text. Wer nur den Text liest, muss wissen, was auf diesem einen Foto zu sehen ist.

Geh in dieser Reihenfolge vor:
1. Schau dir das Foto an und lege "bildart" fest:
   - "gesamt": ein ganzer Raum oder der größte Teil davon
   - "teil": ein Möbel oder Bereich, zum Beispiel eine Insel, eine Zeile oder eine Schrankwand
   - "detail": eine Nahaufnahme, zum Beispiel Griff, Armatur, Schublade, Kochfeld, Oberfläche
   - "anderes": kein Möbel und kein Innenraum im Mittelpunkt, zum Beispiel Hausansicht, Person, Plan, Logo
2. Schreib unter "sichtbar" 3 bis 6 Dinge auf, die du auf dem Foto wirklich siehst.
3. Schreib "alt" nur aus dem, was unter "sichtbar" steht.
4. Kannst du das Hauptmotiv nicht sicher erkennen, weil das Foto zu dunkel oder unscharf ist, nenne den Grund unter "unsicher". Sonst bleibt "unsicher" leer. Rate nie.

Das Foto entscheidet immer. Die Projektangaben helfen nur, Dinge richtig zu benennen, die du auf dem Foto siehst. Was dort steht, aber auf diesem Foto nicht zu sehen ist, gehört nicht in den Text. Widerspricht das Foto den Projektangaben, gilt das Foto.

Regeln für "alt":
- Hauptmotiv zuerst, mit dem Wort, das jemand bei Google suchen würde: Kücheninsel, Küchenzeile, Hochschrankwand, Arbeitsplatte, Spüle, Armatur, Kochfeld, Griffleiste, Schublade, Waschtisch, Einbauschrank. Danach zwei bis drei sichtbare Merkmale: Farbe, Oberfläche, Material, Griffe, Geräte, Boden.
- Nahaufnahme: Nenne nur dieses Detail und was direkt daneben liegt. Beschreibe nicht die ganze Küche.
- Raum: Schreib „Küche“ nur, wenn das Foto eine Küche zeigt. Bad, Ankleide, Garderobe, Arbeitszimmer und Wohnzimmer heißen so.
- Nur scharf und eindeutig Sichtbares zählt. Unscharfer Hintergrund und Spiegelungen zählen nicht. Nenne eine Arbeitsplatte nur, wenn du ihre Fläche wirklich siehst; etwas Helles am Bildrand ist keine Arbeitsplatte.
- Farbe: Ordne sie dem richtigen Bauteil zu. Ein schwarzes Gerät in einer weißen Schrankwand macht die Wand nicht schwarz.
- Material: Nenne es nur, wenn es in den Projektangaben für genau dieses Bauteil steht oder auf dem Foto eindeutig ist. Sonst beschreibe Farbe und Oberfläche: „helle Arbeitsplatte“, nicht „Granit“. Holz bleibt „Holz“; eine Holzart wie Eiche nur, wenn sie in den Projektangaben für dieses Bauteil steht.
- Marken: Nenne sie nur, wenn sie auf dem Foto lesbar sind oder die Projektangaben sie für genau dieses sichtbare Gerät nennen. Marken nie übersetzen.
- Anzahl: Schreib keine Zahl außer „zwei“, und „zwei“ nur, wenn es sicher genau zwei sind. Bei mehr schreib „mehrere“ oder lass die Anzahl weg.
- Benenne Dinge genau: ein runder Holzdeckel ist keine Vertiefung, und zwei gegenüberliegende Zeilen sind nicht eine Zeile.
- Form: ein natürlicher deutscher Ausdruck oder Satz mit 60 bis 125 Zeichen, korrekte Groß- und Kleinschreibung, ohne Punkt am Ende. Keine Liste von Suchwörtern, kein Wort doppelt. Prüfe vor der Antwort Fälle und Adjektivendungen, zum Beispiel „mit weißem, wandhängendem Schreibtisch“.
- Nicht verwenden: „Bild“, „Foto“, „Ansicht“ am Anfang; Werbung und Wertungen wie schön, traumhaft, modern, edel, hochwertig, luxuriös, perfekt, exklusiv, stilvoll; „kaufen“, „nach Maß“, „Küchenstudio“; den Namen BEER; Orte; Namen von Personen. Beschreibe keine Personen.

Gute Beispiele, nur für die Form, nicht abschreiben:
- Küchenzeile mit salbeigrünen Fronten und heller Arbeitsplatte vor einem Fenster zum Garten
- Griffmulde in einer olivgrünen Schublade mit Besteckeinsatz aus Holz
- Messingarmatur an einem Keramikbecken vor einer Rückwand aus weißen Fliesen
- Waschtisch mit Eichenfront und zwei Aufsatzbecken vor einem großen Spiegel im Bad

Schlechte Beispiele:
- „küchen schwarz grifflose küchen“: Suchwörter statt Beschreibung
- „Moderne Traumküche nach Maß von BEER in München“: Werbung und Ort, sagt nichts über das Foto
- „Schwarze Küche mit Insel und Miele-Geräten“ zu einer Nahaufnahme eines Griffs: beschreibt das Projekt, nicht das Foto`;

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
const jobs = $("Fotos").all().map((item) => item.json);
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
    store.proposals?.[job.documentId]?.errors.push(`Foto ${job.photo.id}: ${problem}`);
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
          { type: "text", text: `Projektangaben:\n${job.facts}\n\nSchreib den Alternativtext für dieses eine Foto.` },
        ],
      }),
    },
  });
}
return items;
