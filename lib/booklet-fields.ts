import { trimLead } from "@/lib/lead-fields";

/**
 * The booklet request form (catalogue order): fields and checks shared by the browser and
 * /api/booklet. Print is only posted to Bavaria and Baden-Württemberg; that check needs the
 * postcode table (lib/plz-region.ts), so callers pass it in and the browser loads it lazily.
 */

export const BOOKLET_DELIVERIES = ["digital", "print", "both"] as const;
export type BookletDelivery = (typeof BOOKLET_DELIVERIES)[number];

export const BOOKLET_SALUTATIONS = ["", "frau", "herr", "divers"] as const;
export type BookletSalutation = (typeof BOOKLET_SALUTATIONS)[number];

export type BookletField = "delivery" | "firstName" | "lastName" | "email" | "phone" | "plz" | "street" | "city";

export type BookletError =
  | "invalid_delivery"
  | "invalid_name"
  | "invalid_email"
  | "invalid_phone"
  | "invalid_plz"
  | "outside_print_region"
  | "invalid_street"
  | "invalid_city";

export type BookletInput = {
  delivery?: unknown;
  salutation?: unknown;
  first_name?: unknown;
  last_name?: unknown;
  email?: unknown;
  phone?: unknown;
  plz?: unknown;
  street?: unknown;
  city?: unknown;
};

export type BookletRequest = {
  delivery: BookletDelivery;
  salutation: BookletSalutation;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plz: string;
  street: string;
  city: string;
};

export function wantsPrint(delivery: BookletDelivery) {
  return delivery !== "digital";
}

const NAME = /^[^\r\n<>{}[\]\\/@:;=|0-9]{1,60}$/u;
const LINK = /https?:\/\/|www\./i;

export function validateBooklet(
  input: BookletInput,
  inPrintRegion: (plz: string) => boolean,
): { ok: true; request: BookletRequest } | { ok: false; field: BookletField; reason: BookletError } {
  const delivery = trimLead(input.delivery, 10) as BookletDelivery;
  if (!BOOKLET_DELIVERIES.includes(delivery)) {
    return { ok: false, field: "delivery", reason: "invalid_delivery" };
  }
  const salutationRaw = trimLead(input.salutation, 10).toLowerCase();
  const salutation = (BOOKLET_SALUTATIONS as readonly string[]).includes(salutationRaw) ? (salutationRaw as BookletSalutation) : "";

  const firstName = trimLead(input.first_name, 60);
  const lastName = trimLead(input.last_name, 60);
  if (!NAME.test(firstName) || LINK.test(firstName)) {
    return { ok: false, field: "firstName", reason: "invalid_name" };
  }
  if (!NAME.test(lastName) || LINK.test(lastName)) {
    return { ok: false, field: "lastName", reason: "invalid_name" };
  }

  const email = trimLead(input.email, 120).toLowerCase();
  if (!/^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(email)) {
    return { ok: false, field: "email", reason: "invalid_email" };
  }

  // Phone is optional; when given it has to look like one.
  const phone = trimLead(input.phone, 40);
  if (phone && (!/^[+\d][\d\s/()-]{5,39}$/.test(phone) || phone.replace(/\D/g, "").length < 6)) {
    return { ok: false, field: "phone", reason: "invalid_phone" };
  }

  const plz = trimLead(input.plz, 8).replace(/\s/g, "");
  if (!/^\d{5}$/.test(plz)) {
    return { ok: false, field: "plz", reason: "invalid_plz" };
  }

  let street = "";
  let city = "";
  if (wantsPrint(delivery)) {
    if (!inPrintRegion(plz)) {
      return { ok: false, field: "plz", reason: "outside_print_region" };
    }
    street = trimLead(input.street, 100);
    city = trimLead(input.city, 60);
    if (street.length < 3 || !/\d/.test(street) || /[<>{}\\]/.test(street) || LINK.test(street)) {
      return { ok: false, field: "street", reason: "invalid_street" };
    }
    if (!NAME.test(city) || city.length < 2 || LINK.test(city)) {
      return { ok: false, field: "city", reason: "invalid_city" };
    }
  }

  return { ok: true, request: { delivery, salutation, firstName, lastName, email, phone, plz, street, city } };
}
