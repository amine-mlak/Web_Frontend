import type { ProjectFrame } from "@/lib/catalog";

/** A photo chosen by the editor in a block. */
export type PagePhoto = ProjectFrame;

/** One kitchen of "Küchen im Porträt": the project, its large photo and its detail photo. */
export type PortraitPick = { slug: string; photo?: PagePhoto; detail?: PagePhoto };

/** "Ratgeber": the article quoted on the page and the further articles listed beside it (slugs). */
export type GuidePick = { main?: string; more: string[] };

/** "Häufige Fragen": the heading, the FAQ theme behind "Alle Fragen zum Thema" and the questions (slugs). */
export type QuestionPick = { title: string; theme?: string; slugs: string[] };

/**
 * A page as the editor builds it in the CMS, block by block from the top (components seite.* and
 * kuechen.* in beer-cms). The blocks a page type has, and their order, are set by its collection;
 * the website reads whichever are there. A page without blocks is built by its presenter as before.
 */
export type PageBlocks = {
  /** Kopf mit Titelfoto / Kopf mit Farbton / Kopf ohne Foto. */
  head?: { title: string; emphasis: string; lede: string; photo?: PagePhoto; hex?: string };
  /** Eckdaten (with a photo in "Eckdaten mit Foto"). */
  facts?: { rows: { value: string; label: string }[]; photo?: PagePhoto };
  /** Kernaussage mit Punkten. */
  statement?: { text: string; note: string; points: { title: string; text: string }[] };
  /** Zwei Fotos. */
  twoPhotos?: { left?: PagePhoto; right?: PagePhoto };
  /** Lesetext: the full text as it stands on the page (place names are linked by the website). */
  reading?: { heading: string; text: string };
  /** Küchen im Porträt. */
  portraits?: { title: string; items: PortraitPick[] };
  /** Weitere Küchen (project slugs). */
  houses?: { title: string; slugs: string[] };
  /** Colour pages: the heading over every kitchen in the colour (the kitchens come by themselves). */
  allHousesTitle?: string;
  /** Weitere Formen / Stile / Farben / Inseln / Lösungen: the other pages of the group, in order. */
  siblings?: { slug: string; photo?: PagePhoto }[];
  guide?: GuidePick;
  questions?: QuestionPick;
  /** Schluss mit Foto. */
  close?: { title: string; text: string; photo?: PagePhoto; buttonText: string; buttonHref: string };
};
