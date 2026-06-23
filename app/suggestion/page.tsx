import Suggestion from "@/components/Suggestion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposer une idée - Aide-nous à améliorer Ringside Agenda",
  description: "Tu as une idée pour améliorer Ringside Agenda ? Un bug à signaler ? Partage tes suggestions, on lit tout !",
};

export default function SuggestionPage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <Suggestion />
    </main>
  );
}
