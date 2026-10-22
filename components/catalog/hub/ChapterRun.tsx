import ChapterIndex from "@/components/catalog/hub/ChapterIndex";
import ChapterSpread from "@/components/catalog/hub/ChapterSpread";
import Interlude from "@/components/catalog/hub/Interlude";
import type { PresentedHub } from "@/lib/collection-present";

type ChapterHub = Pick<
  PresentedHub,
  | "branches"
  | "locale"
  | "indexEyebrow"
  | "heroImage"
  | "filmstrip"
  | "quote"
  | "quoteSource"
>;

export default function ChapterRun({ hub }: { hub: ChapterHub }) {
  if (hub.branches.length === 0) {
    return null;
  }

  const continueLabel = hub.locale === "en" ? "Open this" : "Öffnen";
  const hint = hub.locale === "en" ? "To the overview" : "Zur Übersicht";

  return (
    <>
      <ChapterIndex
        branches={hub.branches}
        eyebrow={hub.indexEyebrow}
        hint={hint}
        image={hub.filmstrip[0]?.src ?? hub.heroImage}
      />
      {hub.branches.map((branch, index) => (
        <div key={`${branch.title}-${branch.href ?? index}`}>
          <ChapterSpread
            branch={branch}
            index={index}
            locale={hub.locale}
            continueLabel={continueLabel}
          />
          {index === 1 ? (
            <Interlude quote={hub.quote} source={hub.quoteSource} />
          ) : null}
        </div>
      ))}
    </>
  );
}
