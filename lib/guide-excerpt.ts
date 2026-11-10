/**
 * Takes the opening of a guide or magazine article and the list of what it covers, so a
 * collection page can quote the article BEER wrote about its subject and link to the rest.
 * The text is the article's own; only Markdown marks and stray spaces are removed.
 */

export type GuideExcerpt = {
  /** The article's opening paragraphs, about 110 to 190 words. */
  paragraphs: string[];
  /** Section headings of the article, for the "in this article" list. */
  headings: string[];
};

const MIN_WORDS = 110;
const MAX_WORDS = 190;
const MAX_HEADINGS = 5;

/** Words that stay lower-case when a heading written in capitals is set in normal case. */
const SMALL = new Set(
  "mit und oder im in an am auf aus bei der die das den dem des ein eine einer einem einen für von vom zu zum zur nach ist sind so wie als auch nicht gleich über unter vor ohne um durch gegen bis".split(
    " ",
  ),
);

/**
 * Headings in capitals whose normal spelling cannot be worked out by rule.
 * An empty value leaves the heading out of the list.
 */
const HEADING_FIX: Record<string, string> = {
  "WEISS IST NICHT GLEICH WEIß": "Weiß ist nicht gleich Weiß",
  "WARUM IST DIE WEISSE KÜCHE SO ERFOLGREICH": "Warum ist die weiße Küche so erfolgreich",
  "KAFFEEBENUTZERPROFILE ANLEGEN": "Kaffeebenutzerprofile anlegen",
  "VOLLAUTOMATISCHE REINIGUNG": "Vollautomatische Reinigung",
  "DAMPFGAREN HAT TRADITION": "Dampfgaren hat Tradition",
  "XXL DAMPFGARER": "XXL-Dampfgarer",
  "SPÜLMASCHINE IN VIELEN GRÖSSE": "",
  "EINBAU SPÜLMASCHINE VOLLINTEGRIERT": "",
  "EINBAU SPÜLMASCHINE TEILINTEGRIERT": "",
  "TISCHLÜFTER / KOCHFELDABZUG NACH UNTEN": "Tischlüfter und Kochfeldabzug nach unten",
  "KÜHLSCHRANK IN VERSCHIEDENEN GRÖSSEN": "Kühlschrank in verschiedenen Größen",
  "IDEALE BEDINGUNGEN IM KÜHLSCHRANK": "Ideale Bedingungen im Kühlschrank",
  "PRÄDIKAT KÜCHENSCHREINER MÜNCHEN ZU ERFÜLLEN": "",
};

const SKIP_HEADING = /^(einleitung|fazit|zusammenfassung|schlusswort|faq|häufige fragen|kontakt)\b/i;

/** The article for a key: the exact slug, or the one slug that starts with it. */
export function findArticle<T extends { slug: string }>(articles: T[], key?: string): T | undefined {
  if (!key) {
    return undefined;
  }
  return articles.find((item) => item.slug === key) ?? articles.find((item) => item.slug.startsWith(key));
}

function plain(text: string) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\*+/g, "")
    .replace(/(^|\s)_+|_+(?=\s|$)/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

function words(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

function isHeading(line: string) {
  return /^#{1,6}\s/.test(line);
}

function isProse(block: string) {
  if (/^([-*+]\s|\d+[.)]\s|>|\||!\[)/.test(block)) {
    return false;
  }
  const text = plain(block);
  // A paragraph is a few full sentences; a line in capitals or one that breaks off is not.
  return words(text) >= 14 && /[.!?…"“”)]$/.test(text) && /[a-zäöü]/.test(text);
}

/** Cuts a long paragraph at the last sentence end before the word limit. */
function trimToSentences(text: string, limit: number) {
  const sentences = text.match(/[^.!?…]+[.!?…]+["“”)]*\s*/g) ?? [text];
  let out = "";
  for (const sentence of sentences) {
    if (out && words(out + sentence) > limit) {
      break;
    }
    out += sentence;
  }
  return out.trim();
}

function blocks(body: string) {
  return body
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .flatMap((block) => {
      const lines = block.split("\n").map((line) => line.trim());
      const out: string[] = [];
      let open = "";
      for (const line of lines) {
        if (!line) continue;
        if (isHeading(line) || /^([-*+]\s|\d+[.)]\s|>|\||!\[)/.test(line)) {
          if (open) out.push(open);
          open = "";
          out.push(line);
        } else {
          open = open ? `${open} ${line}` : line;
        }
      }
      if (open) out.push(open);
      return out;
    });
}

function normalCase(heading: string) {
  if (heading in HEADING_FIX) {
    return HEADING_FIX[heading];
  }
  // Only short headings in capitals are set in normal case; a long one is a sentence, and its nouns cannot be told apart.
  if (words(heading) > 5) {
    return "";
  }
  return heading
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index > 0 && SMALL.has(word)) {
        return word;
      }
      return word
        .split("-")
        .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
        .join("-");
    })
    .join(" ");
}

function cleanHeading(line: string) {
  let text = plain(line.replace(/^#{1,6}\s+/, ""))
    .replace(/^\d+[.)]\s*/, "")
    .replace(/[:.]+$/, "")
    .trim();
  if (!text || SKIP_HEADING.test(text) || (!text.endsWith("?") && words(text) > 9)) {
    return "";
  }
  // No lower-case letter apart from ß, which has no capital in older texts.
  if (!/[a-zäöü]/.test(text) && /[A-ZÄÖÜ]{3}/.test(text)) {
    text = normalCase(text);
  }
  return text;
}

function headingList(all: string[]) {
  const level = (depth: number) =>
    all
      .filter((line) => new RegExp(`^#{${depth}}\\s`).test(line))
      .map(cleanHeading)
      .filter(Boolean);
  const second = level(2);
  const list = second.length >= 2 ? second : level(3);
  return [...new Set(list)].slice(0, MAX_HEADINGS);
}

export function guideExcerpt(body?: string): GuideExcerpt | null {
  if (!body) {
    return null;
  }
  const all = blocks(body);
  const paragraphs: string[] = [];
  let count = 0;

  for (const block of all) {
    if (isHeading(block)) {
      // The opening ends where the article's second part begins.
      if (count >= MIN_WORDS * 0.6) break;
      continue;
    }
    if (!isProse(block)) {
      continue;
    }
    let text = plain(block);
    const size = words(text);
    if (count + size > MAX_WORDS) {
      if (count >= MIN_WORDS * 0.6) break;
      text = trimToSentences(text, MAX_WORDS - count);
      if (!text) break;
    }
    paragraphs.push(text);
    count += words(text);
    if (count >= MIN_WORDS) break;
  }

  if (count < 40) {
    return null;
  }
  return { paragraphs, headings: headingList(all) };
}
