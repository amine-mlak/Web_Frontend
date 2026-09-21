import MegaMenu from "@/components/MegaMenu";
import { fetchHeader } from "@/lib/strapi";
import { menuPanels } from "@/lib/navigation";

export default async function Header() {
  const header = await fetchHeader();

  return (
    <header>
      <MegaMenu
        panels={header?.panels?.length ? header.panels : menuPanels}
        ctaLabel={header?.ctaLabel ?? "Beratung anfragen"}
        ctaUrl={header?.ctaUrl?.startsWith("/") ? header.ctaUrl : "/beratung"}
        logoSrc={header?.logo || "/logo.png"}
        logoAlt={header?.logoAlt ?? "BEER Küchenmanufaktur"}
      />
    </header>
  );
}
