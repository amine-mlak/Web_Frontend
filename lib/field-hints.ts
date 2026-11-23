/**
 * Example text shown inside an empty form field, by what the field is for (its autocomplete
 * name). Only where an example helps: the format of an e-mail address, a phone number, a postcode.
 * Names need none, the label says it.
 */
export function fieldHint(autoComplete: string | undefined, locale: string): string | undefined {
  const en = locale === "en";
  switch (autoComplete) {
    case "email":
      return en ? "name@example.com" : "name@beispiel.de";
    case "tel":
      return en ? "+49 170 1234567" : "0170 1234567";
    case "postal-code":
      return "85395";
    case "street-address":
      return en ? "Street and number" : "Straße und Hausnummer";
    default:
      return undefined;
  }
}
