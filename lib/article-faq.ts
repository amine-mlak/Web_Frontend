/**
 * The questions an editor writes at the end of an article body:
 *
 *   ## Häufige Fragen zum Kochfeld
 *
 *   ### Was ist ein autarkes Kochfeld?
 *
 *   Ein autarkes Kochfeld hat ...
 *
 * The section is taken out of the body so the article keeps its own heading levels, is shown
 * after the text, and its questions go to search engines as FAQ data.
 */
export type ArticleFaq = {
  heading: string;
  /** The section as written, for the page. */
  source: string;
  /** Question and answer as plain text, for the FAQ data. */
  items: { question: string; answer: string }[];
};

const START = /^##\s+(Häufige Fragen|Frequent questions|FAQ)\b/i;

function plain(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitArticleFaq(body: string): { main: string; faq?: ArticleFaq } {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => START.test(line));
  if (start < 0) {
    return { main: body };
  }
  // The section ends at the next heading of the same level, or with the body.
  const next = lines.findIndex((line, index) => index > start && /^##\s/.test(line));
  const end = next < 0 ? lines.length : next;
  const section = lines.slice(start, end);

  const items: ArticleFaq["items"] = [];
  let question = "";
  let answer: string[] = [];
  const push = () => {
    if (question && plain(answer.join(" "))) {
      items.push({ question: plain(question), answer: plain(answer.join(" ")) });
    }
  };
  for (const line of section.slice(1)) {
    if (/^###\s/.test(line)) {
      push();
      question = line.replace(/^###\s+/, "");
      answer = [];
    } else {
      answer.push(line);
    }
  }
  push();

  if (items.length === 0) {
    return { main: body };
  }
  return {
    main: [...lines.slice(0, start), ...lines.slice(end)].join("\n").trim(),
    faq: { heading: plain(section[0].replace(/^##\s+/, "")), source: section.join("\n").trim(), items },
  };
}
