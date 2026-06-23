import FederationsClient from "@/components/FederationsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toutes les promotions de catch francophones",
  description: "Découvre toutes les promotions de catch indépendant en France, Belgique et Suisse. APC, KHAO, RIXE, NWC et bien d'autres.",
  openGraph: {
    title: "Toutes les promotions de catch francophones",
    description: "Découvre toutes les promotions de catch indépendant francophones.",
    type: "website",
  },
};

export default function FederationsPage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <FederationsClient />
    </main>
  );
}
