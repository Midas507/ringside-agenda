import CarteClient from "@/components/CarteClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carte des Shows de Catch – France, Belgique & Suisse",
  description: "Trouve les shows de catch près de chez toi grâce à notre carte interactive. Visualise tous les événements catch et wrestling en France, Belgique et Suisse sur une carte.",
  keywords: [
    "carte catch france",
    "catch près de chez moi",
    "show catch proche",
    "carte wrestling france",
    "événements catch carte",
    "catch région",
    "catch paris",
    "catch lyon",
    "catch marseille",
    "catch belgique carte",
    "catch suisse carte",
  ],
  openGraph: {
    title: "Carte des Shows de Catch – France, Belgique & Suisse",
    description: "Trouve les shows de catch près de chez toi grâce à notre carte interactive.",
    type: "website",
    url: "https://ringside-agenda.vercel.app/carte",
  },
  alternates: {
    canonical: "https://ringside-agenda.vercel.app/carte",
  },
};

export default function CartePage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <CarteClient />
    </main>
  );
}
