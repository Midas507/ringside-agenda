import CalendrierClient from "@/components/CalendrierClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendrier Catch – Tous les shows France, Belgique & Suisse",
  description: "Calendrier et agenda complet des shows de catch en France, Belgique et Suisse. Retrouve tous les prochains événements de catch et wrestling indépendant francophones, classés par mois.",
  keywords: [
    "calendrier catch",
    "agenda catch",
    "calendrier catch france",
    "calendrier catch belgique",
    "calendrier catch suisse",
    "agenda catch france",
    "prochains shows catch",
    "événements catch france",
    "shows wrestling france",
    "catch indépendant calendrier",
  ],
  openGraph: {
    title: "Calendrier Catch – Tous les shows France, Belgique & Suisse",
    description: "Calendrier et agenda complet des shows de catch en France, Belgique et Suisse. Tous les événements wrestling francophones.",
    type: "website",
    url: "https://ringside-agenda.vercel.app/calendrier",
  },
  alternates: {
    canonical: "https://ringside-agenda.vercel.app/calendrier",
  },
};

export default function CalendrierPage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <CalendrierClient />
    </main>
  );
}
