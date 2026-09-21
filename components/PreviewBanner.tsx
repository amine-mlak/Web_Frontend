import { draftMode } from "next/headers";

export async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) {
    return null;
  }

  return (
    <div className="bg-[#141414] px-4 py-2 text-center text-[13px] font-light tracking-wide text-[#F6F3EC]">
      Vorschau — so sieht der Entwurf auf der Website aus
    </div>
  );
}
