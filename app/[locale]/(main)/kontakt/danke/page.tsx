import type { Metadata } from "next";
import ThankYou from "@/components/ThankYou";
import { getRequestLocale } from "@/lib/locale";
import { brandedTitle } from "@/lib/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const en = (await getRequestLocale()) === "en";
  return { title: brandedTitle(en ? "Thank you" : "Danke"), robots: { index: false, follow: false } };
}

/** Thank-you page after a booking on /kontakt (/kontakt/danke); the booked service and time come from the form. */
export default async function BookingThanksPage() {
  const en = (await getRequestLocale()) === "en";
  return (
    <ThankYou
      kind="booking"
      eyebrow={en ? "Appointment" : "Termin"}
      title={en ? "Thank you, {name}. Your appointment is booked." : "Danke, {name}. Ihr Termin ist gebucht."}
      text={
        en
          ? "The confirmation comes by email. If something comes up, please call us: +49 8168 909910."
          : "Die Bestätigung kommt per E-Mail. Wenn etwas dazwischenkommt, rufen Sie uns bitte an: 08168 909910."
      }
      nextTitle={en ? "Until then" : "Bis dahin"}
      next={[
        { href: "/beratung", label: en ? "Collect your ideas in the kitchen planner" : "Ideen im Küchenplaner sammeln" },
        { href: "/ausstellung", label: en ? "How to find the showroom" : "So finden Sie die Ausstellung" },
        { href: "/projekte", label: en ? "See real kitchens" : "Echte Küchen ansehen" },
      ]}
    />
  );
}
