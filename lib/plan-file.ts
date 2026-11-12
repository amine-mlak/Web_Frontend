import { extensionOf, type FileExtension } from "@/lib/application-files";

/**
 * The floor plan a visitor may add in the kitchen planner: one PDF or picture. The same limits
 * are checked in the planner and in /api/lead. The file travels to n8n inside the lead as
 * base64, which adds a third to its size; n8n takes 16 MB per request.
 */
export const PLAN_MAX_BYTES = 8 * 1024 * 1024;
export const PLAN_ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

export type PlanExtension = Exclude<FileExtension, "docx">;

export function planExtension(name: string): PlanExtension | null {
  const ext = extensionOf(name);
  return ext && ext !== "docx" ? ext : null;
}
