/**
 * Documents with an application (CV, references, certificates). The same limits are checked
 * in the form and in /api/bewerbung; n8n takes up to 16 MB per request, so 10 MB leaves room.
 */
export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 10 * 1024 * 1024;

export const FILE_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
} as const;

export type FileExtension = keyof typeof FILE_TYPES;

/** For the file picker. */
export const FILE_ACCEPT = [...Object.keys(FILE_TYPES).map((ext) => `.${ext}`), ...new Set(Object.values(FILE_TYPES))].join(",");

export function extensionOf(name: string): FileExtension | null {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return ext in FILE_TYPES ? (ext as FileExtension) : null;
}

/** The first bytes of the file have to match its ending, so a renamed program is refused. */
export function contentMatches(ext: FileExtension, head: Uint8Array) {
  const starts = (...bytes: number[]) => bytes.every((byte, index) => head[index] === byte);
  switch (ext) {
    case "pdf":
      return starts(0x25, 0x50, 0x44, 0x46); // %PDF
    case "docx":
      return starts(0x50, 0x4b, 0x03, 0x04); // zip container
    case "jpg":
    case "jpeg":
      return starts(0xff, 0xd8, 0xff);
    case "png":
      return starts(0x89, 0x50, 0x4e, 0x47);
  }
}

/** A plain file name for the team: no paths, no odd characters, ending kept. */
export function safeFileName(name: string, index: number) {
  const ext = extensionOf(name) ?? "bin";
  const base = name
    .replace(/\.[^.]*$/, "")
    .normalize("NFKD")
    .replace(/[^\w\s.-]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/^[-.]+|[-.]+$/g, "");
  return `${base || `dokument-${index + 1}`}.${ext}`;
}

export function formatSize(bytes: number, locale: "de" | "en") {
  const mb = bytes / (1024 * 1024);
  const value = mb >= 1 ? mb.toFixed(1) : String(Math.max(1, Math.round(bytes / 1024)));
  const unit = mb >= 1 ? "MB" : "KB";
  return `${locale === "de" ? value.replace(".", ",") : value} ${unit}`;
}
