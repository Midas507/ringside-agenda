import ProposerShow from "@/components/ProposerShow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposer un show - Aide-nous à compléter le calendrier",
  description: "Tu connais un show de catch qui n'est pas listé sur Ringside Agenda ? Aide-nous à le référencer en quelques secondes.",
};

export default function ProposerShowPage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <ProposerShow />
    </main>
  );
}
