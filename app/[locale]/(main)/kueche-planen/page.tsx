import type { Metadata } from "next";
import HouseScreen from "@/components/catalog/house/HouseScreen";
import { houseMetadata } from "@/lib/house-pages";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return houseMetadata("kueche-planen");
}

export default function KuechePlanenPage() {
  return <HouseScreen slug="kueche-planen" />;
}
