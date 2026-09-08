import type { SbBlokData, StoryblokRichTextInput } from "@storyblok/react/rsc";

export function asBloks(value: unknown): SbBlokData[] {
  return Array.isArray(value) ? (value as SbBlokData[]) : [];
}

export function headlinePlain(value: unknown): string {
  if (typeof value === "string") return value;
  return asBloks(value)
    .map((segment) => String(segment.text || ""))
    .join("");
}

export function headlineParts(
  value: unknown,
): { text: string; highlight: boolean }[] {
  if (typeof value === "string") {
    return [{ text: value, highlight: false }];
  }
  return asBloks(value).map((segment) => ({
    text: String(segment.text || ""),
    highlight: Boolean(segment.highlight) && segment.highlight !== "none",
  }));
}

export function storyblokHref(link: unknown): string {
  if (!link || typeof link !== "object") return "#";
  const data = link as {
    linktype?: string;
    url?: string;
    cached_url?: string;
    email?: string;
  };
  if (data.linktype === "email" && data.email) {
    return `mailto:${data.email}`;
  }
  const raw = data.url || data.cached_url || "";
  if (!raw || raw === "#") return "#";
  if (/^https?:\/\//.test(raw) || raw.startsWith("mailto:") || raw.startsWith("#")) {
    return raw;
  }
  return `/storyblok/${raw.replace(/^\/+/, "")}`;
}

export function isRichText(value: unknown): value is StoryblokRichTextInput {
  return Boolean(
    value &&
      typeof value === "object" &&
      "type" in value &&
      typeof (value as { type?: unknown }).type === "string",
  );
}
