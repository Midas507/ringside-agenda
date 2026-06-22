import APropos from "@/components/APropos";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos - Notre mission pour le catch francophone",
  description: "Ringside Agenda est la première plateforme dédiée au catch indépendant francophone. Notre mission : connecter les fans aux fédérations en France, Belgique et Suisse.",
  openGraph: {
    title: "À propos de Ringside Agenda",
    description: "Notre mission pour le catch indépendant francophone.",
    type: "website",
  },
};

export default function AProposPage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <APropos />
    </main>
  );
}
