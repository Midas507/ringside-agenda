import CalendrierClient from "@/components/CalendrierClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendrier - Tous les shows de catch francophone",
  description: "Calendrier complet des shows de catch en France, Belgique et Suisse. Découvre les prochains événements de toutes les promotions indépendantes francophones.",
  openGraph: {
    title: "Calendrier - Tous les shows de catch francophone",
    description: "Calendrier complet des shows de catch en France, Belgique et Suisse.",
    type: "website",
  },
};

export default function CalendrierPage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <CalendrierClient />
    </main>
  );
}
