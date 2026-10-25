import type { Metadata } from "next";
import HouseScreen from "@/components/catalog/house/HouseScreen";
import { houseMetadata } from "@/lib/house-pages";

export const revalidate = 120;

export function generateMetadata(): Promise<Metadata> {
  return houseMetadata("nachhaltigkeit");
}

export default function NachhaltigkeitPage() {
  return <HouseScreen slug="nachhaltigkeit" />;
}
