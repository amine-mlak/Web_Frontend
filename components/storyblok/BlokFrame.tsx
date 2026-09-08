import { storyblokEditable } from "@storyblok/react/rsc";
import type { SbBlokData } from "@storyblok/react/rsc";

type BlokFrameProps = {
  blok: SbBlokData;
  name: string;
  nested?: boolean;
  id?: string;
  className?: string;
  as?: "section" | "article" | "div" | "main";
  children: React.ReactNode;
};

export default function BlokFrame({
  blok,
  name,
  nested = false,
  id,
  className = "",
  as: Tag = "section",
  children,
}: BlokFrameProps) {
  return (
    <Tag
      {...storyblokEditable(blok)}
      id={id}
      className={`relative ${nested ? "overflow-hidden" : "overflow-hidden"} ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-20 outline outline-2 outline-dashed ${
          nested ? "outline-[#00b3b0]/55" : "outline-[#00b3b0]/80"
        }`}
        aria-hidden
      />
      <div className="absolute top-3 left-3 z-30 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#00b3b0] px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-white uppercase shadow-sm">
          <GripIcon />
          {name}
        </span>
        {nested ? null : (
          <span className="hidden rounded-full bg-paper/95 px-2.5 py-1 text-[11px] tracking-[0.04em] text-muted shadow-sm sm:inline">
            ändern · verschieben
          </span>
        )}
      </div>
      {children}
    </Tag>
  );
}

function GripIcon() {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="currentColor"
      aria-hidden
      className="opacity-90"
    >
      <circle cx="2" cy="1.5" r="1" />
      <circle cx="6" cy="1.5" r="1" />
      <circle cx="2" cy="6" r="1" />
      <circle cx="6" cy="6" r="1" />
      <circle cx="2" cy="10.5" r="1" />
      <circle cx="6" cy="10.5" r="1" />
    </svg>
  );
}

export function blokSectionName(blok: SbBlokData): string {
  const lead = String(blok.lead || "");
  if (lead.includes("Kacheln")) return "Küchenfarben";
  if (lead.includes("Weg")) return "Ablauf";
  if (lead.includes("Küchenwelten")) return "Entdecken";
  const component = String(blok.component || "");
  switch (component) {
    case "hero-section":
    case "hero":
      return "Hero";
    case "faq-section":
      return "FAQ";
    case "faq-entry":
      return "Frage";
    case "image-text-section":
      return "Bild + Text";
    case "newsletter-form-section":
    case "cta":
      return "Call-to-Action";
    case "grid-card":
      return typeof blok.bold_text === "string" && blok.bold_text
        ? "Schritt"
        : "Karte";
    case "feature_grid":
      return "Merkmale";
    case "feature":
      return "Merkmal";
    case "quote":
      return "Zitat";
    case "teaser":
      return "Teaser";
    default:
      return "Sektion";
  }
}
