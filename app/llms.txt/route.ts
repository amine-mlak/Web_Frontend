import { llmsText, LLMS_HEADERS } from "@/lib/llms";

/** Rebuilt from the CMS at most once an hour (lib/llms.ts). */
export const revalidate = 3600;

export async function GET() {
  return new Response(await llmsText(), { headers: LLMS_HEADERS });
}
