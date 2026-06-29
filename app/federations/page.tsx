import FederationsClient from "@/components/FederationsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotions de Catch Francophones – France, Belgique & Suisse",
  description: "Découvre toutes les promotions et fédérations de catch indépendant en France, Belgique et Suisse. APC, KHAO, RIXE, NWC, TPW, ECC et bien d'autres promotions de wrestling francophones.",
  keywords: [
    "promotions catch france",
    "fédérations catch france",
    "catch indépendant france",
    "promotions wrestling france",
    "APC catch",
    "KHAO wrestling",
    "RIXE catch",
    "NWC catch",
    "catch francophone promotions",
    "wrestling indépendant francophone",
    "promotions catch belgique",
    "promotions catch suisse",
    "liste promotions catch",
  ],
  openGraph: {
    title: "Promotions de Catch Francophones – France, Belgique & Suisse",
    description: "Toutes les promotions et fédérations de catch indépendant en France, Belgique et Suisse.",
    type: "website",
    url: "https://ringside-agenda.vercel.app/federations",
  },
  alternates: {
    canonical: "https://ringside-agenda.vercel.app/federations",
  },
};

export default function FederationsPage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <FederationsClient />
    </main>
  );
}
