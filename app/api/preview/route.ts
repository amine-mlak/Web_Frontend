import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

function previewPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }

  if (!/^\/[A-Za-z0-9/_-]*$/.test(value)) {
    return null;
  }

  return value;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const path = previewPath(searchParams.get("url"));
  const status = searchParams.get("status");

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET || !path) {
    return new Response("Invalid token", { status: 401 });
  }

  const draft = await draftMode();
  if (status === "published") {
    await draft.disable();
  } else {
    await draft.enable();
  }

  redirect(path);
}
