export type KitchenNote = {
  label: string;
  text: string;
};

export const TOPIC_NOTES: Record<string, KitchenNote[]> = {
  zeile: [
    { label: "Raum", text: "Eine Wand, ein schmaler Grundriss, eine Galerie." },
    { label: "Arbeit", text: "Spüle, Herd und Fläche in einer Linie, ohne Kreuzung." },
    { label: "Grenze", text: "Wenig Platz zum Vorbereiten neben dem Kochfeld." },
  ],
  "l-form": [
    { label: "Raum", text: "Eine freie Ecke, oft die Wohnküche." },
    { label: "Arbeit", text: "Zwei Schenkel. Die Ecke bleibt Arbeitszone, nicht Abstellfläche." },
    { label: "Wege", text: "Offener als die U-Form, mehr Fläche als die Zeile." },
  ],
  "u-form": [
    { label: "Raum", text: "Breite und Tiefe. Drei Seiten Stauraum." },
    { label: "Arbeit", text: "Ein geschlossener Arbeitsplatz, kurze Wege zwischen Spüle und Herd." },
    { label: "Grenze", text: "In der Mitte muss ein Weg bleiben. Sonst wird die Form eng." },
  ],
  offen: [
    { label: "Raum", text: "Die Küche steht im Wohnen, nicht hinter einer Tür." },
    { label: "Planung", text: "Blick, Dunst und Stauraum gehören in dieselbe Zeichnung." },
    { label: "Haltung", text: "Möbel im Raum, nicht eine Gerätewand." },
  ],
  insel: [
    { label: "Raum", text: "Wege um die Insel herum, nicht nur davor." },
    { label: "Rolle", text: "Arbeitsfläche und Treffpunkt. Beides braucht eine Kante." },
    { label: "Grenze", text: "Nicht jeder Grundriss trägt eine Insel. Manche Zeile ist ehrlicher." },
  ],
  klein: [
    { label: "Raum", text: "Nische, Apartment, Restfläche." },
    { label: "Maß", text: "Höhe, Tiefe und Zentimeter. Rastermaße enden hier." },
    { label: "Stauraum", text: "Innenleben vor Front. Jeder Auszug muss erreichbar sein." },
  ],
  modern: [
    { label: "Fläche", text: "Ruhige Fronten, klare Fugen, wenig Dekor." },
    { label: "Ton", text: "Präzise, nicht kalt. Holz oder Stein gibt Wärme." },
    { label: "Alltag", text: "Griffe, Licht und Auszüge entscheiden, ob die Ruhe hält." },
  ],
  landhaus: [
    { label: "Material", text: "Holz und Rahmen, ohne Kostüm." },
    { label: "Haus", text: "Der Altbau oder das Haus gibt den Ton, nicht ein Katalogstil." },
    { label: "Ruhe", text: "Stein oder eine ruhige Platte hält die Rahmen zusammen." },
  ],
  design: [
    { label: "Fuge", text: "Klare Kanten, passende Geräte, wenig Zier." },
    { label: "Material", text: "Was man anfasst, zählt mehr als die Ansicht." },
    { label: "Licht", text: "Zwei Seiten Licht, sonst wird eine dunkle Fläche schwer." },
  ],
  holz: [
    { label: "Holz", text: "Eiche, Nuss, Esche. Material, kein Stilname." },
    { label: "Oberfläche", text: "Schliff, Öl oder Lack entscheiden den Alltag." },
    { label: "Platte", text: "Stein oder Keramik gegen das Holz, nicht ein zweites Holz." },
  ],
  purist: [
    { label: "Front", text: "Grifflos oder flächig. Die Linie bleibt ruhig." },
    { label: "Öffnung", text: "Tipp-on oder Mulde. Schwere Auszüge brauchen eine ehrliche Lösung." },
    { label: "Alltag", text: "Zurückhaltend nur, wenn Stauraum und Licht stimmen." },
  ],
  luxus: [
    { label: "Maß", text: "Passgenauigkeit und Stein, nicht Beschlag-Theater." },
    { label: "Gerät", text: "Was man täglich nutzt, sitzt in der Arbeitszone." },
    { label: "Ruhe", text: "Weniger Flächen, die sich zeigen wollen." },
  ],
  weiss: [
    { label: "Ton", text: "Hell und ruhig. Der Unterton entscheidet gegen Stein und Licht." },
    { label: "Oberfläche", text: "Matt, seidenmatt oder Struktur. Der Alltag sieht man dort." },
    { label: "Muster", text: "An der Wand, nicht am Bildschirm." },
  ],
  schwarz: [
    { label: "Licht", text: "Schwarz braucht Tageslicht oder gezieltes Licht." },
    { label: "Gegengewicht", text: "Holz oder Stein, sonst wird die Fläche schwer." },
    { label: "Griff", text: "Finger und Staub sieht man. Die Öffnung muss dazu passen." },
  ],
  salbei: [
    { label: "Ton", text: "Zwischen Landhaus und Moderne. Nicht jede Grün ist Salbei." },
    { label: "Träger", text: "Lack, nicht Folie. Der Stein hält die Farbe ruhig." },
    { label: "Muster", text: "Neben der Wand und dem Boden, bevor die Front feststeht." },
  ],
  grau: [
    { label: "Ton", text: "Warm oder kühl, je nach Stein und Licht." },
    { label: "Ruhe", text: "Grau als Entscheidung, nicht als Kompromiss zwischen Weiß und Schwarz." },
    { label: "Wand", text: "Gegen eine weiße Wand bleibt die Küche klar." },
  ],
  kochinsel: [
    { label: "Technik", text: "Herd und oft Abzug in der Mitte. Anschlüsse unter der Platte." },
    { label: "Wege", text: "Rundherum arbeiten, nicht nur von einer Seite." },
    { label: "Dunst", text: "Der Abzug gehört in die Zeichnung, nicht hinterher." },
  ],
  arbeitsinsel: [
    { label: "Rolle", text: "Vorbereiten und Ablegen. Kein Kochfeld." },
    { label: "Stauraum", text: "Auszüge unter der Fläche, Sitzkante nur wenn der Weg bleibt." },
    { label: "Höhe", text: "Arbeitsfläche und Sitzfläche sind nicht dieselbe Höhe." },
  ],
  essinsel: [
    { label: "Kante", text: "Kochen und sitzen an einem Möbel. Der Überstand trägt die Beine." },
    { label: "Maß", text: "Beinfreiheit, Steckdosen, Abstand zur Arbeitszone." },
    { label: "Alltag", text: "Wer sitzt, sitzt im Weg des Kochens. Das wird gezeichnet." },
  ],
  grifflos: [
    { label: "Front", text: "Ruhige Fläche. Öffnung über Mulde oder Tipp-on." },
    { label: "Gewicht", text: "Schwere Auszüge mögen eine Mulde mehr als einen Tipper." },
    { label: "Alltag", text: "Finger sieht man. Ordnung auch." },
  ],
  "nach-mass": [
    { label: "Raum", text: "Nische, Schräge, alte Wand. Nicht das Rastermaß." },
    { label: "Füllung", text: "Millimeter an der Wand, nicht eine Blende als Ausrede." },
    { label: "Aufmaß", text: "Die Zeichnung folgt dem Raum, bevor die Front feststeht." },
  ],
  raumhoch: [
    { label: "Stauraum", text: "Bis zur Decke, ohne Staubkante." },
    { label: "Erreichbarkeit", text: "Obere Fächer bleiben nutzbar, oder sie sind seltenes Gut." },
    { label: "Fuge", text: "Decke, Wand und Front müssen zusammenpassen." },
  ],
};
