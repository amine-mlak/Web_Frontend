import BlokFrame from "@/components/storyblok/BlokFrame";
import type { SbBlokData } from "@storyblok/react/rsc";

export default function Cta({ blok }: { blok: SbBlokData }) {
  return (
    <BlokFrame
      blok={blok}
      name="Call-to-Action"
      id="kontakt"
      className="bg-gold-soft px-6 pt-20 pb-16"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="type-h2 text-ink">{String(blok.title || "")}</h2>
        {typeof blok.text === "string" && blok.text ? (
          <p className="type-body mt-4">{blok.text}</p>
        ) : null}
        {typeof blok.cta_label === "string" && blok.cta_label ? (
          <a
            href={String(blok.cta_href || "/")}
            className="pill pill-primary mt-8 inline-flex"
          >
            {blok.cta_label}
          </a>
        ) : null}
      </div>
    </BlokFrame>
  );
}
