import type { Locale } from "@/lib/i18n";
import type { OpeningHours } from "@/lib/site-settings";

const ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHORT: Record<Locale, Record<string, string>> = {
  de: { Monday: "Mo", Tuesday: "Di", Wednesday: "Mi", Thursday: "Do", Friday: "Fr", Saturday: "Sa", Sunday: "So" },
  en: { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun" },
};

function dayRange(days: string[], locale: Locale) {
  const sorted = [...days].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  const first = sorted[0];
  const last = sorted.at(-1)!;
  const consecutive = sorted.every((day, index) => index === 0 || ORDER.indexOf(day) === ORDER.indexOf(sorted[index - 1]) + 1);
  if (sorted.length > 2 && consecutive) return `${SHORT[locale][first]}–${SHORT[locale][last]}`;
  return sorted.map((day) => SHORT[locale][day]).join(", ");
}

function clock(value: string, locale: Locale) {
  const [hours, minutes] = value.split(":");
  const h = Number(hours);
  if (locale === "en") {
    const suffix = h >= 12 ? "pm" : "am";
    const twelve = h % 12 === 0 ? 12 : h % 12;
    return minutes === "00" ? `${twelve} ${suffix}` : `${twelve}:${minutes} ${suffix}`;
  }
  return minutes === "00" ? String(h) : `${h}:${minutes}`;
}

/** "Mo–Fr 9–18 Uhr" / "Mon–Fri 9 am–6 pm", one line per entry. */
export function formatOpeningHours(hours: OpeningHours[], locale: Locale) {
  return hours.map((row) => {
    const time = `${clock(row.opens, locale)}–${clock(row.closes, locale)}`;
    return `${dayRange(row.days, locale)} ${time}${locale === "de" ? " Uhr" : ""}`;
  });
}
