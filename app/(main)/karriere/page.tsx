import type { Metadata } from "next";
import HouseScreen from "@/components/catalog/house/HouseScreen";
import { houseMetadata } from "@/lib/house-pages";

export const revalidate = 120;

export function generateMetadata(): Promise<Metadata> {
  return houseMetadata("karriere");
}

export default function KarrierePage() {
  return <HouseScreen slug="karriere" />;
}
