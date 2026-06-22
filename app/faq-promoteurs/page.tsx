import FaqPromoteurs from "@/components/FaqPromoteurs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ Promoteurs - Toutes les réponses pour les fédérations",
  description: "Foire aux questions pour les promoteurs et fédérations de catch. Découvre comment référencer tes shows, gérer ton compte et utiliser les outils Premium sur Ringside Agenda.",
  openGraph: {
    title: "FAQ Promoteurs - Ringside Agenda",
    description: "Toutes les réponses pour les promoteurs de catch sur Ringside Agenda.",
    type: "website",
  },
};

export default function FaqPromoteursPage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <FaqPromoteurs />
    </main>
  );
}
