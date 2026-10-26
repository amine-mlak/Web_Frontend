/* eslint-disable @typescript-eslint/no-unused-vars -- shared helpers, pasted in front of the Code nodes that use them */
/**
 * Shared by the Code nodes of "BEER Ratgeber" (pasted in after lib-common.js): turns the
 * answers of "Bestand lesen" into one object with articles, FAQ, topics, categories and
 * projects, and lists the internal pages an article may link to.
 */

function ratgeberBestand() {
  const requests = $("Bestand lesen: Auftrag").all().map((item) => item.json);
  const answers = $("Bestand lesen").all().map((item) => item.json);
  const out = { articles: [], faq: [], topics: [], categories: [], projects: [], trigger: requests[0]?.trigger ?? {} };
  answers.forEach((answer, i) => {
    const kind = requests[i]?.kind;
    if (kind && Array.isArray(answer?.data)) out[kind].push(...answer.data);
  });
  return out;
}

/** Internal pages Claude may link to, as "path – title" lines. */
function ratgeberLinks(bestand) {
  const fixed = [
    ["/kueche-planen", "Küche planen"],
    ["/beratung", "Beratung"],
    ["/ausstellung", "Ausstellung in Wolfersdorf"],
    ["/projekte", "Alle Projekte"],
    ["/kontakt", "Kontakt"],
  ];
  return [
    ...fixed,
    ...bestand.topics.map((t) => [`/kuechen/${t.cluster}/${t.slug}`, t.name]),
    ...bestand.articles.map((a) => [`/${a.category?.slug === "presse" ? "presse" : "ratgeber"}/${a.slug}`, a.title]),
  ].map(([path, title]) => `${path} – ${title}`);
}

const RATGEBER_CATEGORIES = ["kosten", "planung", "geraete", "material"];
