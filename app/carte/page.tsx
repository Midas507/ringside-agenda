import CarteClient from "@/components/CarteClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carte interactive - Shows de catch près de chez toi",
  description: "Visualise sur une carte interactive tous les shows de catch en France, Belgique et Suisse. Trouve les événements près de chez toi.",
  openGraph: {
    title: "Carte interactive - Shows de catch près de chez toi",
    description: "Visualise sur une carte interactive tous les shows de catch francophones.",
    type: "website",
  },
};

export default function CartePage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <CarteClient />
    </main>
  );
}
