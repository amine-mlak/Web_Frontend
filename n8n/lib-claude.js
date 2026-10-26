/* eslint-disable @typescript-eslint/no-unused-vars -- shared helpers, pasted in front of the Code nodes that use them */
/**
 * Shared by the n8n Code nodes that talk to Claude (pasted in by pack-workflows.mjs).
 * claudeRequest() builds a Messages API body; the HTTP node "… Claude" sends it with the
 * credential "Claude API (BEER)". claudeAnswer() reads the JSON answer back.
 */

const MODEL = "claude-opus-5-5";

/**
 * schema: JSON schema for structured output (strict JSON back).
 * webSearch: number of searches allowed; then the answer is asked for as a JSON block in the
 * text instead, since search results come back with citations.
 */
function claudeRequest({ system, user, schema, effort = "medium", maxTokens = 16000, webSearch = 0 }) {
  const request = {
    model: MODEL,
    max_tokens: maxTokens,
    system,
    output_config: { effort },
    // Lets the API answer with a fallback model when a request is declined.
    fallbacks: "default",
    messages: [{ role: "user", content: user }],
  };
  if (webSearch) {
    request.tools = [
      {
        type: "web_search_20260209",
        name: "web_search",
        max_uses: webSearch,
        user_location: { type: "approximate", city: "Freising", region: "Bayern", country: "DE", timezone: "Europe/Berlin" },
      },
    ];
    if (schema) {
      request.system += `\n\nAntworte am Ende ausschließlich mit einem JSON-Objekt nach diesem Schema, ohne weiteren Text:\n${JSON.stringify(schema)}`;
    }
  } else if (schema) {
    request.output_config.format = { type: "json_schema", schema };
  }
  return request;
}

/** { value } with the parsed JSON answer, or { error } when the call produced none. */
function claudeAnswer(response) {
  if (!response || response.type === "error" || response.error) {
    // After retries the HTTP node passes the failure on as { error: "…" } or { error: { message } }.
    const error = response?.error;
    const message = typeof error === "string" ? error : error?.message ?? response?.message ?? "keine Antwort";
    return { error: `Claude: ${message}` };
  }
  if (response.stop_reason === "refusal") return { error: "Claude hat abgelehnt." };
  if (response.stop_reason === "max_tokens") return { error: "Antwort abgeschnitten (max_tokens)." };
  if (response.stop_reason === "pause_turn") return { error: "Suche nicht fertig geworden – bitte erneut starten." };
  const text = (response.content ?? []).filter((block) => block.type === "text").map((block) => block.text).join("");
  for (const candidate of [text, text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1], text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)]) {
    if (!candidate) continue;
    try {
      return { value: JSON.parse(candidate), sources: webSources(response) };
    } catch {
      // try the next form
    }
  }
  return { error: "Antwort war kein gültiges JSON." };
}

/** The pages Claude's web searches returned (title and address), for reports. */
function webSources(response) {
  const seen = new Map();
  for (const block of response.content ?? []) {
    if (block.type !== "web_search_tool_result" || !Array.isArray(block.content)) continue;
    for (const hit of block.content) if (hit.url && !seen.has(hit.url)) seen.set(hit.url, hit.title ?? hit.url);
  }
  return [...seen].map(([url, title]) => ({ url, title }));
}

/** Short company facts every prompt may use; nothing beyond these may be invented. */
const BEER_FACTS = `BEER Küchenmanufaktur: Schreinerei und Küchenmanufaktur mit eigener Fertigung und Ausstellung in Wolfersdorf bei Freising (Bayern). Plant und baut Küchen und Möbel nach Maß für Kundinnen und Kunden im Raum München, Freising, Landshut und Umgebung. Arbeitet mit Geräten und Materialien unter anderem von Bora, Miele, Gaggenau, Siemens, Quooker und Fenix.`;
