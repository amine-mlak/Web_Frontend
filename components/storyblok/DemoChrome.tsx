import Link from "next/link";
import type { StoryblokSource } from "@/lib/storyblok";

export default function DemoChrome({ source }: { source: StoryblokSource }) {
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex max-w-[min(100%-2rem,20rem)] flex-col items-end gap-2">
      <div className="pointer-events-auto rounded-full border border-line bg-paper/95 px-3 py-2 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3 text-sm">
          <span className="rounded-full bg-[#00b3b0] px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
            Storyblok
          </span>
          <nav className="flex gap-3 text-[13px]">
            <Link href="/" className="text-ink underline-offset-4 hover:underline">
              Strapi
            </Link>
            <Link
              href="/v2"
              className="text-ink underline-offset-4 hover:underline"
            >
              Statisch
            </Link>
          </nav>
        </div>
        {source === "fallback" ? (
          <p className="mt-1 pr-1 text-[11px] text-muted">
            Lokaler Fallback — Token fehlt noch
          </p>
        ) : null}
      </div>
    </div>
  );
}
