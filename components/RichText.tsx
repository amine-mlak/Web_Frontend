import { Fragment, type ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import { cn } from "@/lib/utils";

/**
 * Renders the Markdown of a Strapi "richtext" field as React elements (no
 * raw HTML): headings (## / ###), paragraphs, bullet and numbered lists,
 * block quotes, **bold**, *italic* and [links](/pfad). Anything else stays
 * plain text, so an editor cannot break the page.
 */

type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string };

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    const quote = /^>\s?(.*)$/.exec(line);
    const last = blocks.at(-1);

    if (!line) {
      flush();
    } else if (heading) {
      flush();
      // A page has one h1 (the title); deeper levels collapse to h3.
      blocks.push({ type: "heading", level: heading[1].length <= 2 ? 2 : 3, text: heading[2] });
    } else if (bullet || numbered) {
      flush();
      const ordered = Boolean(numbered);
      const item = (bullet ?? numbered)![1];
      if (last?.type === "list" && last.ordered === ordered) {
        last.items.push(item);
      } else {
        blocks.push({ type: "list", ordered, items: [item] });
      }
    } else if (quote) {
      flush();
      if (last?.type === "quote") {
        last.text += ` ${quote[1]}`;
      } else {
        blocks.push({ type: "quote", text: quote[1] });
      }
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

const INLINE = /\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_|\[([^\]]+)\]\(([^)\s]+)\)/g;

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let index = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > index) {
      nodes.push(text.slice(index, match.index));
    }
    const key = `${match.index}`;
    if (match[1]) {
      nodes.push(<strong key={key} className="font-medium text-ink">{inline(match[1])}</strong>);
    } else if (match[2] || match[3]) {
      nodes.push(<em key={key}>{inline(match[2] || match[3])}</em>);
    } else {
      const href = match[5];
      const className = "text-ink underline decoration-line underline-offset-4 hover:decoration-ink";
      if (href.startsWith("/")) {
        nodes.push(<LocaleLink key={key} href={href} className={className}>{match[4]}</LocaleLink>);
      } else if (/^(https:|mailto:|tel:)/.test(href)) {
        const external = href.startsWith("https:");
        nodes.push(
          <a key={key} href={href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {match[4]}
          </a>,
        );
      } else {
        nodes.push(match[4]);
      }
    }
    index = match.index + match[0].length;
  }
  if (index < text.length) {
    nodes.push(text.slice(index));
  }
  return nodes;
}

export default function RichText({ source, className }: { source: string; className?: string }) {
  const blocks = parse(source);
  return (
    <div className={cn("space-y-6", className)}>
      {blocks.map((block, index) => (
        <Fragment key={index}>
          {block.type === "heading" && block.level === 2 ? (
            <h2 className="pt-6 font-serif text-[28px] leading-snug font-medium tracking-[-0.02em] text-ink md:text-[34px]">
              {inline(block.text)}
            </h2>
          ) : null}
          {block.type === "heading" && block.level === 3 ? (
            <h3 className="pt-2 font-serif text-[22px] leading-snug font-medium text-ink md:text-[26px]">{inline(block.text)}</h3>
          ) : null}
          {block.type === "paragraph" ? <p className="type-body">{inline(block.text)}</p> : null}
          {block.type === "list" ? (
            block.ordered ? (
              <ol className="type-body list-decimal space-y-2 pl-6 marker:text-gold">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{inline(item)}</li>
                ))}
              </ol>
            ) : (
              <ul className="type-body list-disc space-y-2 pl-6 marker:text-gold">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{inline(item)}</li>
                ))}
              </ul>
            )
          ) : null}
          {block.type === "quote" ? (
            <blockquote className="border-l-2 border-messing pl-6 font-serif text-[22px] leading-snug text-ink italic">
              {inline(block.text)}
            </blockquote>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
