import type { Metadata } from "next";
import HouseScreen from "@/components/catalog/house/HouseScreen";
import { houseMetadata } from "@/lib/house-pages";

export const revalidate = 120;

export function generateMetadata(): Promise<Metadata> {
  return houseMetadata("team");
}

export default function TeamPage() {
  return <HouseScreen slug="team" />;
}
